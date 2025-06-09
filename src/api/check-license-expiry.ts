import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Verify this is a cron request
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔔 Starting license expiry check...');
    
    // Get licenses expiring in the next 30 days
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { data: licenses, error } = await supabase
      .from('licenses_certificates')
      .select('*')
      .eq('status', 'Active')
      .lte('expiry_date', thirtyDaysFromNow.toISOString())
      .order('expiry_date', { ascending: true });

    if (error) throw error;

    const expiringLicenses = licenses || [];
    console.log(`Found ${expiringLicenses.length} licenses expiring soon`);

    // Group by station for organized notifications
    const licensesByStation = expiringLicenses.reduce((acc, license) => {
      const station = license.station || 'Unknown';
      if (!acc[station]) acc[station] = [];
      acc[station].push(license);
      return acc;
    }, {} as Record<string, any[]>);

    // Create alert records for tracking
    const alerts = [];
    for (const [station, stationLicenses] of Object.entries(licensesByStation)) {
      for (const license of stationLicenses) {
        const daysUntilExpiry = Math.ceil(
          (new Date(license.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        alerts.push({
          license_id: license.id,
          station: station,
          license_type: license.license_type,
          license_number: license.license_number,
          expiry_date: license.expiry_date,
          days_until_expiry: daysUntilExpiry,
          alert_type: daysUntilExpiry <= 7 ? 'critical' : daysUntilExpiry <= 14 ? 'warning' : 'notice',
          created_at: new Date().toISOString()
        });
      }
    }

    // Log the alert creation (in production, this would send emails/SMS)
    console.log(`Created ${alerts.length} license expiry alerts`);
    
    // TODO: Integrate with email service to send actual notifications
    // For now, we'll log the summary
    const summary = {
      total_licenses_checked: expiringLicenses.length,
      alerts_created: alerts.length,
      stations_affected: Object.keys(licensesByStation).length,
      critical_alerts: alerts.filter(a => a.alert_type === 'critical').length,
      warning_alerts: alerts.filter(a => a.alert_type === 'warning').length,
      notice_alerts: alerts.filter(a => a.alert_type === 'notice').length,
      execution_time: new Date().toISOString()
    };

    console.log('📊 License check summary:', summary);

    return res.status(200).json({
      success: true,
      message: 'License expiry check completed successfully',
      summary
    });

  } catch (error) {
    console.error('❌ License expiry check failed:', error);
    return res.status(500).json({
      success: false,
      error: 'License expiry check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
