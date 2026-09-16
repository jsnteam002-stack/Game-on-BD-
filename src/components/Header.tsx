import React from 'react';
import { store } from '../store/state';
import { ViewType } from '../types';
import { soundManager } from '../utils/sound';
import {
  Bell,
  Menu,
  ShieldCheck,
  Coins,
  Crown,
  Plus,
  ArrowUpRight,
  Wallet,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenSidebar: () => void;
  onOpenNotifications: () => void;
  onOpenDeposit: () => void;
  onOpenWithdraw: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSidebar,
  onOpenNotifications,
  onOpenDeposit,
  onOpenWithdraw,
}) => {
  const user = store.getUser();
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
      {/* Top Ticker Bar: Emerald Green & Gold */}
      <div className="bg-[#041714] border-b border-[#E5B94F]/25 py-1 px-3 sm:px-6 text-[10px] font-mono text-[#E5B94F] flex items-center justify-between gap-2 select-none">
        <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
          <span className="bg-[#10B981] text-white font-black text-[9px] px-2 py-0.2 rounded uppercase tracking-wider shadow-sm">
            PROMO
          </span>
          <span className="text-slate-200 truncate">
            🔥 100% FIRST DEPOSIT BONUS • bKash & Nagad INSTANT CASHOUT • 24/7 LIVE SUPPORT
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-[10px] text-[#FFD700] font-bold shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span>SERVER SECURE: SSL 256-BIT</span>
        </div>
      </div>

      {/* Fixed Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full bg-[#072B26]/95 backdrop-blur-md border-b border-[#E5B94F]/40 shadow-2xl select-none">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Left: Sidebar Toggle, Logo & User Info + VIP Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenSidebar();
              }}
              className="p-2 rounded-xl bg-[#041714] hover:bg-[#0B3C35] text-[#E5B94F] border border-[#E5B94F]/30 transition active:scale-95"
              title="Menu Navigation"
            >
              <Menu className="w-5 h-5 text-[#FFD700]" />
            </button>

            {/* Brand Logo */}
            <button
              onClick={() => handleNav('home')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-[#FFD700] via-[#E5B94F] to-[#047857] p-0.5 group-hover:scale-105 transition shadow-lg">
                <div className="w-full h-full bg-[#072622] rounded-[14px] flex items-center justify-center border border-[#FFD700]/50">
                  <Coins className="w-5 h-5 text-[#FFD700]" />
                </div>
              </div>

              <div className="hidden min-[380px]:block">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-sm sm:text-base tracking-wider text-gold-metallic font-mono uppercase">
                    GAME ON BD
                  </span>
                </div>
                <span className="text-[9px] font-bold text-[#10B981] tracking-wider block font-mono -mt-0.5">
                  CASINO & SLOTS
                </span>
              </div>
            </button>

            {/* User Profile & VIP Badge */}
            <div className="hidden lg:flex items-center gap-2 pl-2 border-l border-emerald-800/60">
              <button
                onClick={() => handleNav('profile')}
                className="flex items-center gap-2 hover:opacity-90 transition"
              >
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  className="w-8 h-8 rounded-full border border-[#FFD700] object-cover"
                />
                <div className="text-left">
                  <div className="text-xs font-black text-white leading-none">
                    {user.username}
                  </div>
                  <div className="text-[9px] text-[#E5B94F] font-mono mt-0.5">
                    ID: {user.id}
                  </div>
                </div>
              </button>

              {/* VIP Badge */}
              <div className="vip-badge px-2 py-0.5 rounded-full flex items-center gap-1 font-black text-[10px] tracking-wider uppercase font-mono shadow-md">
                <Crown className="w-3 h-3 text-[#B45309]" />
                <span>VIP 3</span>
              </div>
            </div>

          </div>

          {/* Right: Balance Widget, Deposit Button & Withdraw Button */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* VIP Badge on mobile */}
            <div className="lg:hidden vip-badge px-1.5 py-0.5 rounded-lg flex items-center gap-1 font-black text-[9px] font-mono shadow-sm">
              <Crown className="w-2.5 h-2.5 text-[#B45309]" />
              <span>VIP 3</span>
            </div>

            {/* Real-time Balance Box */}
            <div
              onClick={() => handleNav('profile')}
              className="cursor-pointer flex items-center bg-[#041714] rounded-xl sm:rounded-2xl p-1 sm:p-1.5 border border-[#E5B94F]/40 shadow-[0_0_15px_rgba(229,185,79,0.15)] hover:border-[#FFD700] transition active:scale-95"
              title="Click to view full wallet details"
            >
              <div className="flex items-center gap-1.5 px-1.5 sm:px-2 py-0.5">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-[#FFD700] to-[#E5B94F] flex items-center justify-center text-[#0B3C35] font-black text-xs shadow-md">
                  ৳
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-1">
                    <span className="text-xs sm:text-sm font-black text-[#FFD700] font-mono tracking-tight leading-none">
                      {user.virtualCoins.toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[8px] text-slate-400 font-mono block leading-none mt-0.5">
                    BALANCE
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Action: DEPOSIT BUTTON */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenDeposit();
              }}
              className="btn-gold-glossy-3d text-[11px] font-black px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-lg active:scale-95 transition font-mono uppercase"
              title="Deposit via bKash / Nagad"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>DEPOSIT</span>
            </button>

            {/* Quick Action: WITHDRAW BUTTON */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenWithdraw();
              }}
              className="btn-emerald-glossy-3d text-[11px] font-black px-2.5 sm:px-3.5 py-2 rounded-xl flex items-center gap-1 shadow-lg active:scale-95 transition font-mono uppercase"
              title="Withdraw Funds"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WITHDRAW</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => {
                soundManager.playClick();
                onOpenNotifications();
              }}
              className="p-2 rounded-xl bg-[#041714] hover:bg-[#0B3C35] text-[#E5B94F] border border-[#E5B94F]/30 transition relative active:scale-95"
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-[#FFD700]" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white font-mono text-[9px] font-black rounded-full flex items-center justify-center border border-[#FFD700]">
                  {unreadNotifs}
                </span>
              )}
            </button>

          </div>

        </div>
      </header>
    </>
  );
};
