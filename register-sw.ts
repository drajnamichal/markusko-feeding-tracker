// Register Service Worker for PWA
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('✅ Service Worker registered successfully:', registration.scope);
          
          // Check for updates periodically
          setInterval(() => {
            registration.update();
          }, 60000); // Check every minute
        })
        .catch((error) => {
          console.log('❌ Service Worker registration failed:', error);
        });
    });
  }
}

// Show install prompt
let deferredPrompt: any;

export function setupInstallPrompt() {
  // For iOS Safari - show manual instructions
  if (isIOS() && !isStandalone()) {
    setTimeout(() => {
      showIOSInstallPrompt();
    }, 3000); // Show after 3 seconds
  }

  // For Android/Desktop - use beforeinstallprompt
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    console.log('💡 PWA install prompt ready');
    
    // You can show your own install button here
    showInstallPrompt();
  });

  window.addEventListener('appinstalled', () => {
    console.log('✅ PWA was installed');
    deferredPrompt = null;
  });
}

// Detect iOS
function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function showInstallPrompt() {
  // Create install banner
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(to right, #14b8a6, #0d9488);
    color: white;
    padding: 16px 24px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 16px;
    max-width: 90vw;
    animation: slideUp 0.3s ease-out;
  `;
  
  banner.innerHTML = `
    <span style="font-size: 24px;">📱</span>
    <span style="flex: 1;">Nainštalovať ako aplikáciu?</span>
    <button id="pwa-install-btn" style="
      background: white;
      color: #14b8a6;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
    ">Inštalovať</button>
    <button id="pwa-dismiss-btn" style="
      background: transparent;
      color: white;
      border: none;
      padding: 8px 16px;
      cursor: pointer;
    ">✕</button>
  `;

  document.body.appendChild(banner);

  // Install button handler
  document.getElementById('pwa-install-btn')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`User response to install prompt: ${outcome}`);
    deferredPrompt = null;
    banner.remove();
  });

  // Dismiss button handler
  document.getElementById('pwa-dismiss-btn')?.addEventListener('click', () => {
    banner.remove();
  });

  // Add animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translateX(-50%) translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}

// iOS-specific install prompt
function showIOSInstallPrompt() {
  // Check if already dismissed
  if (localStorage.getItem('ios-install-dismissed') === 'true') {
    return;
  }

  const banner = document.createElement('div');
  banner.id = 'ios-install-banner';
  banner.style.cssText = `
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to right, #14b8a6, #0d9488);
    color: white;
    padding: 20px;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideUp 0.3s ease-out;
  `;
  
  banner.innerHTML = `
    <div style="max-width: 600px; margin: 0 auto;">
      <div style="display: flex; align-items: flex-start; gap: 16px;">
        <div style="font-size: 32px;">📱</div>
        <div style="flex: 1;">
          <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">
            Nainštalovať ako aplikáciu?
          </div>
          <div style="font-size: 14px; line-height: 1.5; opacity: 0.95;">
            1. Kliknite na tlačidlo <strong>Share</strong> 📤 (dole v Safari)<br>
            2. Scrollujte nadol<br>
            3. Vyberte <strong>"Add to Home Screen"</strong> ➕
          </div>
        </div>
        <button id="ios-install-dismiss" style="
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: none;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          font-size: 18px;
        ">✕</button>
      </div>
    </div>
  `;

  document.body.appendChild(banner);

  // Dismiss button handler
  document.getElementById('ios-install-dismiss')?.addEventListener('click', () => {
    banner.style.animation = 'slideDown 0.3s ease-out';
    setTimeout(() => {
      banner.remove();
    }, 300);
    localStorage.setItem('ios-install-dismissed', 'true');
  });

  // Add animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideUp {
      from {
        transform: translateY(100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
    @keyframes slideDown {
      from {
        transform: translateY(0);
        opacity: 1;
      }
      to {
        transform: translateY(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
}

// Detect if app is running in standalone mode
export function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    (window.navigator as any).standalone === true
  );
}

// Show a message if running in standalone mode
export function checkStandaloneMode() {
  if (isStandalone()) {
    console.log('✅ Running in standalone PWA mode');
  }
}

