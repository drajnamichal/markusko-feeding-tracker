import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onUndo?: () => void;
  undoLabel?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  showUndoToast: (message: string, onUndo: () => void, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 3000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showUndoToast = useCallback((message: string, onUndo: () => void, duration: number = 5000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { 
      id, 
      message, 
      type: 'info', 
      duration,
      onUndo,
      undoLabel: 'Späť'
    };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((message: string, duration?: number) => {
    showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message: string, duration?: number) => {
    showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message: string, duration?: number) => {
    showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message: string, duration?: number) => {
    showToast(message, 'warning', duration);
  }, [showToast]);

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-500 text-white';
      case 'error':
        return 'bg-red-500 text-white';
      case 'warning':
        return 'bg-amber-500 text-white';
      case 'info':
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'fa-circle-check';
      case 'error':
        return 'fa-circle-xmark';
      case 'warning':
        return 'fa-triangle-exclamation';
      case 'info':
      default:
        return 'fa-circle-info';
    }
  };

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, warning, showUndoToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((toast, index) => (
          <div
            key={toast.id}
            className={`
              ${getToastStyles(toast.type)}
              px-6 py-4 rounded-lg shadow-2xl
              flex items-center gap-3
              pointer-events-auto
              animate-slide-in-right
              max-w-sm
              transition-all duration-300
            `}
            style={{
              animation: 'slideInRight 0.3s ease-out forwards',
            }}
          >
            <i className={`fas ${getToastIcon(toast.type)} text-xl flex-shrink-0`}></i>
            <p className="font-medium text-sm flex-1">{toast.message}</p>
            
            {/* Undo Button */}
            {toast.onUndo && (
              <button
                onClick={() => {
                  toast.onUndo!();
                  removeToast(toast.id);
                }}
                className="bg-white/20 hover:bg-white/30 text-white font-semibold px-3 py-1 rounded transition-colors flex-shrink-0"
              >
                <i className="fas fa-rotate-left mr-1"></i>
                {toast.undoLabel || 'Späť'}
              </button>
            )}
            
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/80 hover:text-white transition-colors flex-shrink-0"
              aria-label="Zavrieť"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out forwards;
        }
      `}</style>
    </ToastContext.Provider>
  );
};

export default ToastProvider;

