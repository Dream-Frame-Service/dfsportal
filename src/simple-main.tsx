import { createRoot } from 'react-dom/client';

// Simplified version without complex contexts to test basic rendering
function SimpleApp() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>DFS Manager Portal</h1>
      <p>Loading application...</p>
      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#f0f0f0' }}>
        <h3>Debug Info:</h3>
        <p>Environment: {import.meta.env.MODE}</p>
        <p>Supabase URL: {import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'Missing'}</p>
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}

console.log('Starting simplified app render...');
createRoot(document.getElementById("root")!).render(<SimpleApp />);
console.log('Simplified app render completed');
