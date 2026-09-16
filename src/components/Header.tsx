import React, { useState } from 'react';
import { store } from '../store/state';
import { ViewType } from '../types';
import { soundManager } from '../utils/sound';
import { Bell, Menu, User, ShieldCheck, Gift, Coins, LogOut, CheckCircle2 } from 'lucide-react';
import { FaucetModal } from './FaucetModal';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenFaucetModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  onOpenNotifications,
  onOpenFaucetModal,
}) => {
  const user = store.getUser();
  const currentView = store.getCurrentView();
  const unreadNotifs = store.getUnreadNotificationCount();

  const handleNav = (view: ViewType) => {
    soundManager.playClick();
    store.setView(view);
  };

  const handleToggleAdminMode = () => {
    soundManager.playClick();
    if (user.role === 'admin') {
      store.loginAsDemoUser();
    } else {
      store.loginAsDemoAdmin();
    }
  };

  return (
    <>
      {/* Top Legal Compliance Announcement Bar */}
      <div className="bg-gradient-to-r from-[#120B07] via-[#21140C] to-[#120B07] border-b border-[#D8C59A]/30 py-1 px-4 text-center text-[10px] font-mono text-[#FFF2CC] flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="bg-[#8B1717] text-[#FFF2CC] border border-[#E5B94F] px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
            FREE-TO-PLAY
          </span>
          <span className="text-[#D8C59A]">
            WESTERN SALOON CASINO • VIRTUAL COINS ONLY • NO REAL MONEY DEPOSITS OR WAGERING
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[10px] text-[#FFD77A] font-bold">
          <span className="w-2 h-2 rounded-full bg-[#E5B94F] animate-pulse" />
          <span>USER ID: {user.id}</span>
        </div>
      </div>

      <header className="sticky top-0 z-40 w-full bg-[#18100B]/95 backdrop-blur-md border-b border-[#D8C59A]/30 shadow-2xl select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Menu & Saloon Logo */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSidebar();
              }}
              className="p-2 rounded-xl bg-[#0B0806] hover:bg-[#21140C] text-[#D8C59A] border border-[#C58A20]/40 transition active:scale-95"
              title="Open Navigation"
            >
              <Menu className="w-5 h-5 text-[#FFD77A]" />
            </button>

            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2.5 group text-left"
            >
              <div className="w-10 h-10 rounded-2xl brass-frame p-0.5 group-hover:scale-105 transition">
                <div className="w-full h-full bg-[#050505] rounded-[14px] flex items-center justify-center border border-[#E5B94F]/40">
                  <Coins className="w-5 h-5 text-[#FFD77A]" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base sm:text-lg tracking-wider text-gold-metallic font-mono uppercase">
                    GAME ON BD
                  </span>
                  <span className={`text-[8px] font-black px-1.5 py-0.2 rounded font-mono border ${
                    user.role === 'admin' 
                      ? 'bg-[#8B1717] text-[#FFF2CC] border-[#FFD77A]' 
                      : 'bg-[#21140C] text-[#FFD77A] border-[#C58A20]'
                  }`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
                <span className="text-[9px] font-bold text-[#D8C59A]/80 tracking-wider block font-mono -mt-0.5">
                  FREE VIRTUAL SALOON
                </span>
              </div>
            </button>
          </div>

          {/* Right: Coins Balance Widget & Quick Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Virtual Coins Balance Widget */}
            <div
              onClick={() => handleNav('profile')}
              className="cursor-pointer flex items-center bg-[#0B0806] rounded-2xl p-1.5 border border-[#E5B94F]/40 shadow-[0_0_15px_rgba(229,185,79,0.2)] hover:border-[#FFD77A] transition"
            >
              <div className="flex items-center gap-2 px-2 py-0.5">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#FFD77A] to-[#C58A20] flex items-center justify-center text-[#120B07] font-black text-xs shadow-md">
                  C
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm font-black text-[#FFD77A] font-mono tracking-tight leading-none">
                      {user.virtualCoins.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-[#D8C59A] font-mono font-bold">COINS</span>
                  </div>
                  <span className="text-[8px] text-[#D8C59A]/70 font-mono block leading-none mt-0.5">
                    ID: {user.id}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Claim Free Bonus Button */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenFaucetModal();
              }}
              className="btn-gold-3d text-[#120B07] text-[10px] font-black px-3 py-2 rounded-xl flex items-center gap-1 transition shadow-lg active:scale-95 font-mono uppercase"
              title="Claim Daily Free Coins"
            >
              <Gift className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CLAIM COINS</span>
            </button>

            {/* Demo Admin Switch Button */}
            <button
              onClick={handleToggleAdminMode}
              className={`text-[10px] font-black px-2.5 py-2 rounded-xl border flex items-center gap-1 font-mono transition active:scale-95 ${
                user.role === 'admin'
                  ? 'bg-[#8B1717] text-[#FFF2CC] border-[#FFD77A] shadow-[0_0_10px_rgba(139,23,23,0.5)]'
                  : 'bg-[#21140C] text-[#D8C59A] border-[#C58A20]/60 hover:text-[#FFF2CC]'
              }`}
              title={user.role === 'admin' ? 'Switch to Normal User Mode' : 'Switch to Verified Admin Mode'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FFD77A]" />
              <span className="hidden md:inline">{user.role === 'admin' ? 'ADMIN MODE' : 'DEMO ADMIN'}</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenNotifications();
              }}
              className="p-2 rounded-xl bg-[#0B0806] hover:bg-[#21140C] text-[#D8C59A] hover:text-[#FFF2CC] transition relative active:scale-95 border border-[#C58A20]/40"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#FFD77A]" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B1717] text-[#FFF2CC] font-mono text-[9px] font-black rounded-full flex items-center justify-center border border-[#FFD77A]">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* User Avatar */}
            <button
              onClick={() => handleNav('profile')}
              className="flex items-center p-0.5 rounded-xl bg-[#0B0806] hover:bg-[#21140C] transition border border-[#C58A20]/50"
              title="User Profile & History"
            >
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-7 h-7 rounded-lg object-cover border border-[#E5B94F]"
              />
            </button>

          </div>

        </div>
      </header>
    </>
  );
};
