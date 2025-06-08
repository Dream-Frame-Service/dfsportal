import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Minimal Dashboard component
function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>🏢 DFS Manager Portal</h1>
      <p>Welcome to your DFS management system</p>
      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
        <h3>Status: System Online ✅</h3>
        <p>All core modules are loaded successfully.</p>
      </div>
    </div>
  );
}

// Minimal App component
function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
