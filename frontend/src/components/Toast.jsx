import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

const TOAST_DURATION = 3000;

const Toast = () => {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const showToast = (event) => {
      setToast({
        id: Date.now(),
        message: event.detail?.message || 'Download complete',
      });
    };

    window.addEventListener('app:toast', showToast);
    return () => window.removeEventListener('app:toast', showToast);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = setTimeout(() => setToast(null), TOAST_DURATION);
    return () => clearTimeout(timer);
  }, [toast]);

  if (!toast) return null;

  return (
    <div className="fixed right-5 top-5 z-[60] w-[min(22rem,calc(100vw-2rem))] animate-fade-in">
      <div className="glass-panel flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-[var(--color-surface)]/95 px-4 py-3 shadow-2xl">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
          <CheckCircle size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Success</p>
          <p className="truncate text-sm text-[var(--color-text-muted)]">{toast.message}</p>
        </div>
        <button
          onClick={() => setToast(null)}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
