import { toast } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-right' | 'top-center' | 'top-left' | 'bottom-right' | 'bottom-center' | 'bottom-left';
}

export const showToast = (
  message: string,
  type: ToastType = 'info',
  options?: ToastOptions
) => {
  const toast = document.createElement('div');
  toast.className = `fixed ${getPositionClass(options?.position)} z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ${
    type === 'success' ? 'bg-green-500' :
    type === 'error' ? 'bg-red-500' :
    type === 'warning' ? 'bg-yellow-500' :
    'bg-blue-500'
  }`;

  toast.textContent = message;
  document.body.appendChild(toast);

  const duration = options?.duration ?? 3000;

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, duration);
};

// Helper to convert position to Tailwind classes
const getPositionClass = (position?: ToastOptions['position']) => {
  switch (position) {
    case 'top-center':
      return 'top-4 left-1/2 -translate-x-1/2';
    case 'top-left':
      return 'top-4 left-4';
    case 'bottom-right':
      return 'bottom-4 right-4';
    case 'bottom-center':
      return 'bottom-4 left-1/2 -translate-x-1/2';
    case 'bottom-left':
      return 'bottom-4 left-4';
    default:
      return 'top-4 right-4'; // default: top-right
  }
};

// Convenience methods
export const showSuccessToast = (message: string) => showToast(message, 'success');
export const showErrorToast = (message: string) => showToast(message, 'error');
export const showWarningToast = (message: string) => showToast(message, 'warning');
export const showInfoToast = (message: string) => showToast(message, 'info');

export const dismissToast = (toastId: string) => {
  toast.dismiss(toastId);
}; 