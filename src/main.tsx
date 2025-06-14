import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import "@/lib/ezsitePolyfill"; // ← add this line early

// Enhanced error handling for production
console.log('🚀 Starting DFS Manager Portal...');
console.log('Environment:', import.meta.env.MODE);
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured ✅' : 'Missing ❌');
console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Configured ✅' : 'Missing ❌');

// Global error handlers
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Initialize app
try {
  const container = document.getElementById("root");
  
  if (!container) {
    throw new Error('Root element not found');
  }

  const root = createRoot(container);
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  
  console.log('✅ App rendered successfully');
  
} catch (error) {
  console.error('❌ App initialization failed:', error);
  
  // Show fallback UI
  const container = document.getElementById("root") || document.body;
  container.innerHTML = `
    <div style="
      display: flex; 
      flex-direction: column; 
      align-items: center; 
      justify-content: center; 
      min-height: 100vh; 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      color: white;
      text-align: center;
      padding: 20px;
    ">
      <h1 style="font-size: 2rem; margin-bottom: 1rem;">DFS Manager Portal</h1>
      <p style="font-size: 1.1rem; margin-bottom: 1rem;">Initialization Error</p>
      <p style="font-size: 0.9rem; margin-bottom: 2rem; opacity: 0.9;">
        ${error instanceof Error ? error.message : 'Unknown error occurred'}
      </p>
      <button onclick="window.location.reload()" style="
        background: rgba(255,255,255,0.2); 
        border: 2px solid white; 
        color: white; 
        padding: 12px 24px; 
        border-radius: 8px; 
        font-size: 1rem; 
        cursor: pointer;
        transition: all 0.3s ease;
      " onmouseover="this.style.background='rgba(255,255,255,0.3)'" 
         onmouseout="this.style.background='rgba(255,255,255,0.2)'">
        Reload Application
      </button>
    </div>
  `;
}
