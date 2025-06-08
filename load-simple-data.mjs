// Simplified sample data loader matching actual database schema
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vetufvhzmawjbsumtplq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZldHVmdmh6bWF3amJzdW10cGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4NjU2NDgsImV4cCI6MjA2NDQ0MTY0OH0.QZGDjZYO4P9e7ogbORlWCVHhQ92j6enBUEo_KIHb4Wk'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🗂️  Loading sample data for DFS Manager Portal...')

// Sample employees data matching actual schema
const employees = [
  {
    employee_id: 'EMP001',
    first_name: 'Alex',
    last_name: 'Rodriguez',
    email: 'alex.rodriguez@dfsportal.com',
    phone: '+1-555-0101',
    position: 'Senior Full Stack Developer',
    station: 'Engineering',
    hire_date: '2023-01-15T00:00:00Z',
    salary: 95000.00,
    is_active: true,
    current_address: '123 Tech Street, Silicon Valley, CA 94000',
    mailing_address: '123 Tech Street, Silicon Valley, CA 94000',
    reference_name: 'Maria Rodriguez'
  },
  {
    employee_id: 'EMP002',
    first_name: 'Sarah',
    last_name: 'Chen',
    email: 'sarah.chen@dfsportal.com',
    phone: '+1-555-0103',
    position: 'Frontend Developer',
    station: 'Engineering',
    hire_date: '2023-03-22T00:00:00Z',
    salary: 78000.00,
    is_active: true,
    current_address: '456 React Lane, Frontend City, CA 94001',
    mailing_address: '456 React Lane, Frontend City, CA 94001',
    reference_name: 'David Chen'
  },
  {
    employee_id: 'EMP003',
    first_name: 'Marcus',
    last_name: 'Johnson',
    email: 'marcus.johnson@dfsportal.com',
    phone: '+1-555-0105',
    position: 'Backend Developer',
    station: 'Engineering',
    hire_date: '2023-02-10T00:00:00Z',
    salary: 82000.00,
    is_active: true,
    current_address: '789 API Boulevard, Backend Hills, CA 94002',
    mailing_address: '789 API Boulevard, Backend Hills, CA 94002',
    reference_name: 'Lisa Johnson'
  },
  {
    employee_id: 'EMP004',
    first_name: 'Emily',
    last_name: 'Davis',
    email: 'emily.davis@dfsportal.com',
    phone: '+1-555-0107',
    position: 'Product Manager',
    station: 'Product',
    hire_date: '2022-11-05T00:00:00Z',
    salary: 105000.00,
    is_active: true,
    current_address: '321 Strategy Road, Product Valley, CA 94003',
    mailing_address: '321 Strategy Road, Product Valley, CA 94003',
    reference_name: 'Michael Davis'
  },
  {
    employee_id: 'EMP005',
    first_name: 'Jordan',
    last_name: 'Kim',
    email: 'jordan.kim@dfsportal.com',
    phone: '+1-555-0109',
    position: 'UX/UI Designer',
    station: 'Design',
    hire_date: '2023-04-18T00:00:00Z',
    salary: 72000.00,
    is_active: true,
    current_address: '654 Design Avenue, Creative City, CA 94004',
    mailing_address: '654 Design Avenue, Creative City, CA 94004',
    reference_name: 'Alex Kim'
  },
  {
    employee_id: 'EMP006',
    first_name: 'Ryan',
    last_name: 'Thompson',
    email: 'ryan.thompson@dfsportal.com',
    phone: '+1-555-0111',
    position: 'DevOps Engineer',
    station: 'DevOps',
    hire_date: '2023-01-30T00:00:00Z',
    salary: 88000.00,
    is_active: true,
    current_address: '987 Cloud Street, Infrastructure Town, CA 94005',
    mailing_address: '987 Cloud Street, Infrastructure Town, CA 94005',
    reference_name: 'Kate Thompson'
  }
]

// Sample products data
const products = [
  {
    product_name: 'DFS Premium Coffee Blend',
    product_code: 'DFS-COFFEE-001',
    category: 'Beverages',
    price: 12.99,
    quantity_in_stock: 150,
    minimum_stock: 25,
    supplier: 'Premium Coffee Co.',
    description: 'High-quality coffee blend for office consumption',
    department: 'Office Supplies',
    weight: 1.5,
    weight_unit: 'lb',
    bar_code_unit: '123456789012',
    case_price: 155.88,
    unit_per_case: 12,
    unit_price: 12.99,
    retail_price: 15.99
  },
  {
    product_name: 'Ergonomic Office Chair',
    product_code: 'DFS-CHAIR-001',
    category: 'Furniture',
    price: 299.99,
    quantity_in_stock: 25,
    minimum_stock: 5,
    supplier: 'Office Furniture Plus',
    description: 'Comfortable ergonomic chair for developer workstations',
    department: 'Office Equipment',
    weight: 45.0,
    weight_unit: 'lb',
    bar_code_unit: '234567890123',
    case_price: 299.99,
    unit_per_case: 1,
    unit_price: 299.99,
    retail_price: 399.99
  },
  {
    product_name: 'Standing Desk Converter',
    product_code: 'DFS-DESK-001',
    category: 'Furniture',
    price: 199.99,
    quantity_in_stock: 15,
    minimum_stock: 3,
    supplier: 'Workspace Solutions',
    description: 'Adjustable standing desk converter for health-conscious employees',
    department: 'Office Equipment',
    weight: 25.0,
    weight_unit: 'lb',
    bar_code_unit: '345678901234',
    case_price: 199.99,
    unit_per_case: 1,
    unit_price: 199.99,
    retail_price: 249.99
  }
]

// Sample vendors data
const vendors = [
  {
    vendor_name: 'Tech Supplies Inc.',
    contact_person: 'John Smith',
    email: 'john@techsupplies.com',
    phone: '+1-555-1001',
    address: '1000 Technology Drive, Tech City, CA 90000',
    category: 'Technology Equipment',
    payment_terms: 'Net 30',
    is_active: true,
    station: 'Main Office'
  },
  {
    vendor_name: 'Office Furniture Plus',
    contact_person: 'Jane Wilson',
    email: 'jane@officefurniture.com',
    phone: '+1-555-1002',
    address: '2000 Furniture Avenue, Office Town, CA 90001',
    category: 'Office Furniture',
    payment_terms: 'Net 45',
    is_active: true,
    station: 'Main Office'
  },
  {
    vendor_name: 'Premium Coffee Co.',
    contact_person: 'Mike Brown',
    email: 'mike@premiumcoffee.com',
    phone: '+1-555-1003',
    address: '3000 Bean Street, Coffee City, CA 90002',
    category: 'Food & Beverages',
    payment_terms: 'Net 15',
    is_active: true,
    station: 'Kitchen'
  }
]

async function loadSampleData() {
  try {
    console.log('🧹 Clearing existing data...')
    
    // Clear existing data
    await supabase.from('orders').delete().neq('id', 0)
    await supabase.from('products').delete().neq('id', 0)
    await supabase.from('vendors').delete().neq('id', 0)
    await supabase.from('employees').delete().neq('id', 0)
    
    console.log('👥 Inserting employees...')
    const { data: employeesResult, error: employeesError } = await supabase
      .from('employees')
      .insert(employees)
    
    if (employeesError) {
      console.error('❌ Error inserting employees:', employeesError)
      return
    }
    console.log(`✅ Inserted ${employees.length} employees`)
    
    console.log('🏪 Inserting vendors...')
    const { data: vendorsResult, error: vendorsError } = await supabase
      .from('vendors')
      .insert(vendors)
    
    if (vendorsError) {
      console.error('❌ Error inserting vendors:', vendorsError)
      return
    }
    console.log(`✅ Inserted ${vendors.length} vendors`)
    
    console.log('📦 Inserting products...')
    const { data: productsResult, error: productsError } = await supabase
      .from('products')
      .insert(products)
    
    if (productsError) {
      console.error('❌ Error inserting products:', productsError)
      return
    }
    console.log(`✅ Inserted ${products.length} products`)
    
    // Create sample orders
    const orders = [
      {
        order_number: 'ORD-2024-001',
        vendor_id: 1,
        order_date: '2024-06-01T10:00:00Z',
        expected_delivery: '2024-06-08T15:00:00Z',
        station: 'Main Office',
        total_amount: 1200.50,
        status: 'Pending',
        notes: 'Monthly office supply order',
        created_by: 1
      },
      {
        order_number: 'ORD-2024-002',
        vendor_id: 2,
        order_date: '2024-06-03T14:30:00Z',
        expected_delivery: '2024-06-10T12:00:00Z',
        station: 'Main Office',
        total_amount: 2999.90,
        status: 'Confirmed',
        notes: 'New employee desk setup',
        created_by: 4
      }
    ]
    
    console.log('📋 Inserting orders...')
    const { data: ordersResult, error: ordersError } = await supabase
      .from('orders')
      .insert(orders)
    
    if (ordersError) {
      console.error('❌ Error inserting orders:', ordersError)
      return
    }
    console.log(`✅ Inserted ${orders.length} orders`)
    
    console.log('\n🎉 Sample data loaded successfully!')
    console.log('\n📊 Summary:')
    console.log(`   • ${employees.length} employees`)
    console.log(`   • ${vendors.length} vendors`)
    console.log(`   • ${products.length} products`)
    console.log(`   • ${orders.length} orders`)
    
    // Verification queries
    console.log('\n🔍 Verifying data...')
    
    const { data: employeeData } = await supabase
      .from('employees')
      .select('first_name, last_name, position, station')
      .limit(3)
    
    const { data: productData } = await supabase
      .from('products')
      .select('product_name, category, price')
      .limit(3)
    
    console.log('\n📋 Sample employees:')
    employeeData?.forEach(emp => {
      console.log(`   • ${emp.first_name} ${emp.last_name} - ${emp.position} (${emp.station})`)
    })
    
    console.log('\n📦 Sample products:')
    productData?.forEach(prod => {
      console.log(`   • ${prod.product_name} - ${prod.category} - $${prod.price}`)
    })
    
    console.log('\n✅ Database is now populated with comprehensive test data!')
    console.log('🚀 Your DFS Manager Portal is ready for full functionality testing!')
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the data loader
loadSampleData()
