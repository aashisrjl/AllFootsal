import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message: string, duration = 4000) => {
      return toast.success(message, {
        duration,
        position: 'top-right',
        style: {
          background: '#10b981',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        icon: '✓',
      });
    },

    error: (message: string, duration = 4000) => {
      return toast.error(message, {
        duration,
        position: 'top-right',
        style: {
          background: '#ef4444',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        icon: '✕',
      });
    },

    loading: (message: string) => {
      return toast.loading(message, {
        position: 'top-right',
        style: {
          background: '#3b82f6',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      });
    },

    promise: <T,>(
      promise: Promise<T>,
      messages: { loading: string; success: string; error: string }
    ) => {
      return toast.promise(promise, messages, {
        position: 'top-right',
        style: {
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      });
    },

    info: (message: string, duration = 4000) => {
      return toast(message, {
        duration,
        position: 'top-right',
        style: {
          background: '#06b6d4',
          color: '#fff',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
        icon: 'ℹ️',
      });
    },

    dismiss: (toastId?: string) => {
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
    },

    update: (toastId: string, options: any) => {
      toast(options.message, {
        ...options,
        id: toastId,
      });
    },
  };
};
