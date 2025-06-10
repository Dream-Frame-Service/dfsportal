import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.VITE_SUPABASE_ANON_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a cron request
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    console.warn('📊 Generating daily sales report...');
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // Get all active stations
    const { data: stations, error: stationsError } = await supabase
      .from('stations')
      .select('*')
      .eq('status', 'Active');

    if (stationsError) throw stationsError;

    const report = {
      date: todayStr,
      generated_at: new Date().toISOString(),
      stations: [] as Array<Record<string, unknown>>,
      summary: {
        total_sales: 0,
        total_fuel_gallons: 0,
        total_convenience_sales: 0,
        stations_reporting: 0,
        stations_missing: 0
      }
    };

    // Check each station for yesterday's sales data
    for (const station of stations || []) {
      try {
        // Try to get yesterday's sales report for this station
        const { data: salesData, error: salesError } = await supabase
          .from('daily_sales_reports_enhanced')
          .select('*')
          .eq('station', station.station_name)
          .eq('report_date', yesterdayStr)
          .single();

        const stationReport = {
          station: station.station_name,
          manager: station.manager_name,
          has_report: !salesError && salesData !== null,
          data: salesData || null
        };

        if (stationReport.has_report && salesData) {
          report.summary.total_sales += parseFloat(salesData.total_sales || '0');
          report.summary.total_fuel_gallons += parseFloat(salesData.fuel_gallons_sold || '0');
          report.summary.total_convenience_sales += parseFloat(salesData.convenience_store_sales || '0');
          report.summary.stations_reporting += 1;
        } else {
          report.summary.stations_missing += 1;
        }

        report.stations.push(stationReport);

      } catch (error) {
        console.warn(`Warning: Could not process station ${station.station_name}:`, error);
        report.stations.push({
          station: station.station_name,
          manager: station.manager_name,
          has_report: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        report.summary.stations_missing += 1;
      }
    }

    // Calculate performance metrics
    const reportingRate = stations?.length ? 
      Math.round((report.summary.stations_reporting / stations.length) * 100) : 0;

    report.summary = {
      ...report.summary,
      reporting_rate: reportingRate,
      average_sales_per_station: report.summary.stations_reporting > 0 ? 
        Math.round(report.summary.total_sales / report.summary.stations_reporting) : 0
    };    // Identify missing reports
    const missingReports = report.stations.filter(s => !s.has_report);
    
    console.warn(`📈 Daily report summary:
      - Total Sales: $${report.summary.total_sales.toLocaleString()}
      - Stations Reporting: ${report.summary.stations_reporting}/${stations?.length || 0}
      - Reporting Rate: ${reportingRate}%
      - Missing Reports: ${missingReports.length}`);

    if (missingReports.length > 0) {
      console.warn('⚠️ Missing reports from:', missingReports.map(s => s.station));
    }

    // TODO: In production, send this report via email to management
    // For now, we'll just log the summary

    return res.status(200).json({
      success: true,
      message: 'Daily sales report generated successfully',
      report_date: yesterdayStr,
      summary: report.summary,
      missing_reports: missingReports.map(s => s.station),
      full_report: report
    });

  } catch (error) {
    console.error('❌ Daily report generation failed:', error);
    return res.status(500).json({
      success: false,
      error: 'Daily report generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
