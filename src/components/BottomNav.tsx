import React from 'react';
import { store } from '../store/state';
import { ViewType } from '../types';
import { soundManager } from '../utils/sound';
import { Home, Gamepad2, Gift, Trophy, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const currentView = store.getCurrentView();

  const handleNav = (view: ViewType) => {
    soundManager.playClick();
    store.setView(view);
  };

  const navs: { id: ViewType; label: string; icon: any; badge?: string }[] = [
    { id: 'home', label: 'HOME', icon: Home },
    { id: 'games', label: 'GAMES', icon: Gamepad2, badge: 'HOT' },
    { id: 'bonus', label: 'BONUS', icon: Gift, badge: 'FREE' },
    { id: 'leaderboard', label: 'RANKS', icon: Trophy },
    { id: 'profile', label: 'PROFILE', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#18100B]/95 backdrop-blur-xl border-t border-[#D8C59A]/40 shadow-[0_-5px_30px_rgba(0,0,0,0.95)] px-2 py-1.5 flex items-center justify-around select-none">
      {navs.map((n) => {
        const Icon = n.icon;
        const isActive =
          currentView === n.id ||
          (n.id === 'games' && ['slot', 'crash', 'roulette', 'dice', 'cards', 'wheel'].includes(currentView));

        return (
          <button
            key={n.id}
            onClick={() => handleNav(n.id)}
            className={`flex-1 flex flex-col items-center justify-center py-1 relative transition-all duration-200 ${
              isActive ? 'text-[#FFD77A] scale-105' : 'text-[#D8C59A]/60 hover:text-[#FFF2CC]'
            }`}
          >
            <div
              className={`relative p-1.5 rounded-xl transition-all ${
                isActive
                  ? 'bg-[#E5B94F]/20 border border-[#E5B94F]/60 shadow-[0_0_15px_rgba(229,185,79,0.3)]'
                  : ''
              }`}
            >
              <Icon className="w-5 h-5" />
              {n.badge && (
                <span className="absolute -top-1 -right-2 bg-gradient-to-r from-[#8B1717] to-red-700 text-[#FFF2CC] font-black text-[8px] font-mono px-1 rounded-full border border-[#E5B94F]">
                  {n.badge}
                </span>
              )}
            </div>
            <span
              className={`text-[10px] font-black font-mono tracking-wider mt-0.5 ${
                isActive ? 'text-[#FFD77A]' : 'text-[#D8C59A]/70'
              }`}
            >
              {n.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
