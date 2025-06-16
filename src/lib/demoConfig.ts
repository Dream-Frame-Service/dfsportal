/**
 * Demo configuration for DFS Portal
 * This allows the app to run in demo mode without real Supabase backend
 */

export const demoConfig = {
  enabled: import.meta.env.VITE_DEMO_MODE === 'true',
  skipAuth: import.meta.env.VITE_SKIP_AUTH === 'true',
  useMockData: import.meta.env.VITE_MOCK_DATA === 'true',
};

// Mock user data for demo
export const demoUser = {
  id: 'demo-user-123',
  email: 'admin@demo.com',
  user_metadata: {
    full_name: 'Demo Admin',
    role: 'admin'
  },
  app_metadata: {
    role: 'admin',
    permissions: ['read', 'write', 'admin']
  }
};

// Mock data for demo
export const mockData = {
  products: [
    { id: 1, name: 'Premium Coffee Blend', price: 12.99, stock: 150, category: 'Beverages' },
    { id: 2, name: 'Organic Tea Selection', price: 8.99, stock: 200, category: 'Beverages' },
    { id: 3, name: 'Artisan Pastries', price: 4.99, stock: 50, category: 'Food' },
  ],
  employees: [
    { id: 1, name: 'John Doe', position: 'Manager', email: 'john@demo.com', phone: '555-0123' },
    { id: 2, name: 'Jane Smith', position: 'Cashier', email: 'jane@demo.com', phone: '555-0124' },
  ],
  sales: [
    { id: 1, date: '2024-12-01', amount: 1250.00, items: 45, employee: 'John Doe' },
    { id: 2, date: '2024-12-02', amount: 980.50, items: 32, employee: 'Jane Smith' },
  ]
};

export default demoConfig;
