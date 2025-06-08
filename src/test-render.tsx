import { createRoot } from 'react-dom/client';

// Simple test to check if React can render
function TestApp() {
  return (
    <div style={{ padding: '20px', fontSize: '18px', color: 'blue' }}>
      <h1>React Test - If you see this, React is working!</h1>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<TestApp />);
  console.log('Test render attempted');
} else {
  console.error('Root element not found!');
}
