// Check table structure for both tables to understand available fields
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

// Mock the global window.ezsite object for testing
global.window = {
  ezsite: {
    apis: {
      tablePage: async (tableId, params) => {
        try {
          const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/ez_table_page`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
              'Prefer': 'return=representation'
            },
            body: JSON.stringify({
              table_id: parseInt(tableId),
              page_no: params.PageNo || 1,
              page_size: params.PageSize || 10,
              filters: params.Filters || [],
              order_by_field: params.OrderByField || '',
              is_asc: params.IsAsc !== false
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error('API Error Response:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`);
          }

          const data = await response.json();
          return { data, error: null };
        } catch (error) {
          return { data: null, error: error.message };
        }
      }
    }
  }
};

async function checkTableStructure() {
  console.log('🔍 Checking table structures...\n');

  // Check table 11728 (used by SalesChart)
  console.log('📊 Table 11728 (daily_sales) - used by SalesChart:');
  try {
    const { data: data11728, error: error11728 } = await window.ezsite.apis.tablePage('11728', {
      PageNo: 1,
      PageSize: 3
    });

    if (error11728) {
      console.error('❌ Error:', error11728);
    } else if (data11728?.List && data11728.List.length > 0) {
      console.log('✅ Sample record fields:');
      const record = data11728.List[0];
      Object.keys(record).forEach(key => {
        console.log(`  - ${key}: ${typeof record[key]} (${record[key]})`);
      });
    } else {
      console.log('⚠️  No data found in table 11728');
    }
  } catch (err) {
    console.error('❌ Error checking table 11728:', err.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Check table 12356 (used by StationSalesBoxes)
  console.log('📊 Table 12356 (daily_sales_reports_enhanced) - used by StationSalesBoxes:');
  try {
    const { data: data12356, error: error12356 } = await window.ezsite.apis.tablePage('12356', {
      PageNo: 1,
      PageSize: 3
    });

    if (error12356) {
      console.error('❌ Error:', error12356);
    } else if (data12356?.List && data12356.List.length > 0) {
      console.log('✅ Sample record fields:');
      const record = data12356.List[0];
      Object.keys(record).forEach(key => {
        console.log(`  - ${key}: ${typeof record[key]} (${record[key]})`);
      });
    } else {
      console.log('⚠️  No data found in table 12356');
    }
  } catch (err) {
    console.error('❌ Error checking table 12356:', err.message);
  }

  console.log('\n' + '='.repeat(60) + '\n');

  // Compare calculation for MOBIL station
  console.log('🔄 Comparing MOBIL station calculations...\n');

  try {
    // Get recent MOBIL data from table 11728
    const { data: chart11728, error: chartError } = await window.ezsite.apis.tablePage('11728', {
      PageNo: 1,
      PageSize: 5,
      Filters: [
        { name: 'station', op: 'Equal', value: 'MOBIL' }
      ],
      OrderByField: 'report_date',
      IsAsc: false
    });

    // Get recent MOBIL data from table 12356
    const { data: boxes12356, error: boxesError } = await window.ezsite.apis.tablePage('12356', {
      PageNo: 1,
      PageSize: 5,
      Filters: [
        { name: 'station', op: 'Equal', value: 'MOBIL' }
      ],
      OrderByField: 'report_date',
      IsAsc: false
    });

    if (chartError || boxesError) {
      console.error('❌ Error fetching comparison data:', chartError || boxesError);
      return;
    }

    if (chart11728?.List?.length > 0 && boxes12356?.List?.length > 0) {
      console.log('📊 Table 11728 (SalesChart) MOBIL data:');
      chart11728.List.slice(0, 2).forEach((record, i) => {
        console.log(`  Record ${i + 1}:`);
        console.log(`    Date: ${record.report_date}`);
        console.log(`    Total Sales: $${record.total_sales || 0}`);
        console.log(`    Fuel Sales: $${record.fuel_sales || 0}`);
        console.log(`    Convenience Sales: $${record.convenience_sales || 0}`);
        console.log(`    Lottery Sales: $${record.lottery_sales || 0}`);
        console.log(`    Grocery Sales: $${record.grocery_sales || 0}`);
      });

      console.log('\n📊 Table 12356 (StationSalesBoxes) MOBIL data:');
      boxes12356.List.slice(0, 2).forEach((record, i) => {
        console.log(`  Record ${i + 1}:`);
        console.log(`    Date: ${record.report_date}`);
        console.log(`    Total Sales: $${record.total_sales || 0}`);
        console.log(`    Fuel Sales: $${record.fuel_sales || 0}`);
        console.log(`    Grocery Sales: $${record.grocery_sales || 0}`);
        console.log(`    Lottery Sales: $${record.lottery_sales || 0}`);
        
        // Calculate new MOBIL logic
        const totalSales = parseFloat(record.total_sales || 0);
        const lotterySales = parseFloat(record.lottery_sales || 0);
        const newFuelSales = totalSales - lotterySales;
        console.log(`    NEW Calculated Fuel Sales (total - lottery): $${newFuelSales}`);
      });

      // Show calculation difference
      console.log('\n🔍 MOBIL Calculation Comparison:');
      const chart11728Record = chart11728.List[0];
      const boxes12356Record = boxes12356.List[0];
      
      if (chart11728Record && boxes12356Record) {
        const oldFuelSales = parseFloat(chart11728Record.fuel_sales || 0);
        const totalSales = parseFloat(boxes12356Record.total_sales || 0);
        const lotterySales = parseFloat(boxes12356Record.lottery_sales || 0);
        const newFuelSales = totalSales - lotterySales;
        
        console.log(`  Old logic (table 11728): $${oldFuelSales}`);
        console.log(`  New logic (total - lottery): $${newFuelSales}`);
        console.log(`  Difference: $${newFuelSales - oldFuelSales}`);
      }
    } else {
      console.log('⚠️  No MOBIL data found for comparison');
    }

  } catch (err) {
    console.error('❌ Error during comparison:', err.message);
  }
}

checkTableStructure().catch(console.error);
