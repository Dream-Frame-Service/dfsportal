import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Simplified main.tsx without complex error monitoring that might block initialization
console.log('🚀 Starting DFS Manager Portal...');

try {
  const container = document.getElementById("root");
  if (container) {
    const root = createRoot(container);
    root.render(<App data-id="pjf367331" data-path="src/main.tsx" />);
    console.log('✅ App rendered successfully');
  } else {
    console.error('❌ Root element not found');
  }
} catch (error) {
  console.error('❌ App initialization failed:', error);
}