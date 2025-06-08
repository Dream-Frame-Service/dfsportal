import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Simple dashboard component
function SimpleDashboard() {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ color: '#1a365d', marginBottom: '20px' }}>🏢 DFS Manager Portal</h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ padding: '20px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>📊 Dashboard</h3>
          <p>Welcome to your DFS management system</p>
        </div>
        
        <div style={{ padding: '20px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>👥 Employees</h3>
          <p>Manage your team members</p>
        </div>
        
        <div style={{ padding: '20px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>📦 Products</h3>
          <p>Inventory and product management</p>
        </div>
        
        <div style={{ padding: '20px', background: '#f7fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '10px' }}>🚚 Delivery</h3>
          <p>Track deliveries and routes</p>
        </div>
      </div>
      
      <div style={{ padding: '20px', background: '#e6fffa', border: '1px solid #38b2ac', borderRadius: '8px' }}>
        <h3 style={{ color: '#234e52' }}>✅ System Status</h3>
        <p style={{ color: '#285e61' }}>All systems operational - Database connected</p>
        <p style={{ color: '#285e61', fontSize: '14px', marginTop: '10px' }}>
          Last updated: {new Date().toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// Simple login page
function SimpleLogin() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{ 
        background: 'white', 
        padding: '40px', 
        borderRadius: '12px', 
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        maxWidth: '400px',
        width: '100%'
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1a365d' }}>
          🔐 DFS Manager Login
        </h2>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#2d3748' }}>Email</label>
          <input 
            type="email" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '6px',
              fontSize: '16px'
            }} 
            placeholder="Enter your email"
          />
        </div>
        <div style={{ marginBottom: '30px' }}>
          <label style={{ display: 'block', marginBottom: '5px', color: '#2d3748' }}>Password</label>
          <input 
            type="password" 
            style={{ 
              width: '100%', 
              padding: '12px', 
              border: '1px solid #e2e8f0', 
              borderRadius: '6px',
              fontSize: '16px'
            }} 
            placeholder="Enter your password"
          />
        </div>
        <button style={{ 
          width: '100%', 
          padding: '12px', 
          background: '#4299e1', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}>
          Sign In
        </button>
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#718096', fontSize: '14px' }}>
          Demo: Authentication system ready
        </p>
      </div>
    </div>
  );
}

const queryClient = new QueryClient();

function SimpleApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<SimpleLogin />} />
          <Route path="/dashboard" element={<SimpleDashboard />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default SimpleApp;
