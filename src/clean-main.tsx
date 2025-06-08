import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Simple version without memory leak detection and error monitoring
console.log('Starting app render...');

createRoot(document.getElementById("root")!).render(<App data-id="pjf367331" data-path="src/main.tsx" />);

console.log('App render completed');
