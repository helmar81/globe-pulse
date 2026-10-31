// @ts-ignore -- React type declarations are missing from this project.
import React from 'react';
// @ts-ignore -- react-dom/client types are missing from this project.
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; 
// Ensure the path matches where your index.css file is located relative to index.tsx
// If index.css is in the root and index.tsx is in src, use '../index.css'


// Service Worker Registration for PWA
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      // FIX: Manually construct the absolute path to sw.js.
      // This solves two issues:
      // 1. "Origin Mismatch": Forces the browser to fetch sw.js from the document origin (usercontent.goog), not the script CDN (ai.studio).
      // 2. "Invalid URL": Avoids using `new URL()` which can throw errors in specific iframe/preview contexts if base is non-standard.
      
      // Get the base path of the current page (e.g., "https://site.com/app/")
      const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
      
      // Append sw.js to the base path
      const swUrl = `${basePath}sw.js`;

      const registration = await navigator.serviceWorker.register(swUrl);
      console.log('Service Worker registered with scope:', registration.scope);
    } catch (error) {
      // Log the error gracefully without breaking the app
      console.warn('Service Worker registration skipped:', error);
    }
  }
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Render app
root.render(
  React.createElement(React.StrictMode, null, React.createElement(App))
);

// Initialize PWA features
registerServiceWorker();