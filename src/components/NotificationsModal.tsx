import React from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { Bell, X, Check } from 'lucide-react';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notifs = store.getNotifications();

  const handleMarkRead = () => {
    soundManager.playClick();
    store.markNotificationsRead();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="casino-panel border border-slate-800 rounded-3xl w-full max-w-md p-5 shadow-2xl space-y-4 relative text-left">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-black text-white font-mono uppercase">NOTIFICATIONS</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
          {notifs.map((n) => (
            <div
              key={n.id}
              className={`p-3 rounded-2xl border text-xs font-mono transition ${
                !n.read ? 'bg-[#0B1A28] border-cyan-500/50' : 'bg-[#060B12] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-cyan-300">{n.title}</span>
                <span className="text-[10px] text-slate-500">{n.timestamp}</span>
              </div>
              <p className="text-slate-300 text-[11px] font-sans">{n.message}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleMarkRead}
          className="w-full btn-brass-sm py-2 rounded-xl text-xs font-black font-mono uppercase flex items-center justify-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          <span>MARK ALL AS READ</span>
        </button>
      </div>
    </div>
  );
};
