import { createRoot } from 'react-dom/client';
import SimpleApp from './SimpleApp.tsx';
import './index.css';

console.log('🚀 Starting DFS Manager Portal...');

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<SimpleApp />);
  console.log('✅ App rendered successfully');
} else {
  console.error('❌ Root element not found');
}
