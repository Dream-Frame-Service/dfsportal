import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Simple version without memory leak detection and error monitoring
console.warn('Starting app render...');

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App data-id="pjf367331" data-path="src/main.tsx" />);
}

console.warn('App render completed');
