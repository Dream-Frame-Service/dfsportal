import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ezsiteApisReplacement } from './services/supabaseService';
import './types/global'; // Import global type declarations

// Initialize legacy ezsite.apis compatibility layer
if (!window.ezsite) {
  window.ezsite = { apis: ezsiteApisReplacement };
}

// Simplified main.tsx without complex error monitoring that might block initialization
console.log('🚀 Starting DFS Manager Portal...');
console.log('✅ Legacy ezsite.apis initialized');

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