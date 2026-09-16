import React, { useState, useEffect } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'bonus' | 'error';
}

class ToastManager {
  private toasts: ToastMessage[] = [];
  private listeners: ((toasts: ToastMessage[]) => void)[] = [];

  public show(title: string, message: string, type: ToastMessage['type'] = 'info', duration = 3500) {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, title, message, type };
    this.toasts = [newToast, ...this.toasts].slice(0, 5);
    this.notify();

    if (duration > 0) {
      setTimeout(() => this.dismiss(id), duration);
    }
  }

  public dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public subscribe(fn: (toasts: ToastMessage[]) => void) {
    this.listeners.push(fn);
    fn(this.toasts);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn(this.toasts));
  }
}

export const toast = new ToastManager();

export const ToastContainer: React.FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    return toast.subscribe((items) => setToasts([...items]));
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto casino-panel p-3.5 rounded-2xl border ${
            t.type === 'bonus' || t.type === 'success'
              ? 'border-emerald-500/80 bg-[#0A1A14]/95 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
              : t.type === 'error'
              ? 'border-rose-500/80 bg-[#1F0A0A]/95 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
              : 'border-cyan-500/80 bg-[#0B1A2A]/95 text-cyan-100 shadow-[0_0_20px_rgba(0,240,255,0.2)]'
          } animate-fade-in flex items-start justify-between gap-3`}
        >
          <div className="flex items-start gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl ${
                t.type === 'bonus' || t.type === 'success'
                  ? 'bg-gradient-to-br from-emerald-400 to-teal-600 text-slate-950 font-black'
                  : t.type === 'error'
                  ? 'bg-rose-600 text-white font-black'
                  : 'bg-cyan-600 text-cyan-100 font-black'
              } flex items-center justify-center shrink-0 shadow text-xs`}
            >
              {t.type === 'bonus' ? '🎁' : t.type === 'success' ? '🪙' : t.type === 'error' ? '⚠️' : '🚀'}
            </div>
            <div>
              <h4 className="text-xs font-black tracking-wide">{t.title}</h4>
              <p className="text-[11px] font-sans text-slate-300 leading-tight mt-0.5">{t.message}</p>
            </div>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-slate-400 hover:text-white p-1 text-xs font-bold shrink-0"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};
