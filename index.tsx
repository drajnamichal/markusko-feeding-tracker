
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerServiceWorker, setupInstallPrompt, checkStandaloneMode } from './register-sw';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register PWA service worker
registerServiceWorker();
setupInstallPrompt();
checkStandaloneMode();
