import React from 'react';
import { store } from '../store/state';
import { ViewType } from '../types';
import { soundManager } from '../utils/sound';
import {
  Home,
  Gamepad2,
  User,
  Sparkles,
  Rocket,
  Dices,
  CircleDot,
  Gift,
  Trophy,
  ShieldCheck,
  X,
  Crown,
  Coins
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const currentView = store.getCurrentView();

  const navItems: { id: ViewType; label: string; icon: any; badge?: string; badgeColor?: string }[] = [
    { id: 'home', label: 'Saloon Lobby', icon: Home },
    { id: 'games', label: 'All Casino Games', icon: Gamepad2, badge: 'HOT', badgeColor: 'bg-[#8B1717] text-[#FFF2CC] border border-[#FFD77A]' },
    { id: 'slot', label: 'Western 5x3 Slot', icon: Sparkles, badge: 'FLAGSHIP', badgeColor: 'bg-[#C58A20] text-[#120B07]' },
    { id: 'crash', label: 'Aviator Crash', icon: Rocket, badge: '100X', badgeColor: 'bg-rose-700 text-white' },
    { id: 'roulette', label: 'European Roulette', icon: CircleDot, badge: '36X', badgeColor: 'bg-emerald-700 text-white' },
    { id: 'dice', label: 'Golden Dice 3D', icon: Dices },
    { id: 'cards', label: 'Royal Hi-Lo Cards', icon: Crown },
    { id: 'wheel', label: 'Lucky Fortune Wheel', icon: Coins },
    { id: 'bonus', label: 'Daily Streak & VIP', icon: Gift, badge: 'BONUS', badgeColor: 'bg-purple-700 text-white' },
    { id: 'leaderboard', label: 'Leaderboard Rankings', icon: Trophy },
    { id: 'profile', label: 'Player Account', icon: User },
    { id: 'admin', label: 'Admin Audit & Control', icon: ShieldCheck },
  ];

  const handleSelect = (view: ViewType) => {
    soundManager.playClick();
    store.setView(view);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in text-left select-none font-mono">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      {/* Sidebar Panel */}
      <div className="relative w-72 max-w-[80vw] bg-[#0B0806] border-r border-[#C58A20] h-full flex flex-col p-4 z-10 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#C58A20]/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#8B1717] border border-[#FFD77A] flex items-center justify-center font-black text-[#FFD77A] text-xs">
              GOBD
            </div>
            <div>
              <h3 className="font-black text-sm text-gold-metallic tracking-wider">GAME ON BD</h3>
              <span className="text-[9px] text-[#D8C59A]">FREE-TO-PLAY SALOON</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl btn-brass-sm text-[#FFD77A] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-1 pr-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition text-left uppercase ${
                  isActive
                    ? 'btn-gold-3d text-[#120B07] shadow-md'
                    : 'btn-brass-sm text-[#D8C59A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      item.badgeColor || 'bg-[#18100B] text-[#FFF2CC]'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#C58A20]/30 text-center text-[10px] text-[#D8C59A] space-y-0.5">
          <p className="font-bold text-[#FFD77A]">GAME ON BD SALOON</p>
          <p>100% Free Virtual Currency</p>
        </div>

      </div>
    </div>
  );
};
