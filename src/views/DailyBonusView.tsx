import React, { useState } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { Gift, CheckCircle } from 'lucide-react';

const STREAK_DAYS = [
  { day: 1, coins: 500, label: 'Day 1' },
  { day: 2, coins: 800, label: 'Day 2' },
  { day: 3, coins: 1200, label: 'Day 3' },
  { day: 4, coins: 1800, label: 'Day 4' },
  { day: 5, coins: 2500, label: 'Day 5' },
  { day: 6, coins: 3500, label: 'Day 6' },
  { day: 7, coins: 5000, label: 'Day 7 Jackpot' },
];

export const DailyBonusView: React.FC = () => {
  const user = store.getUser();
  const [claimed, setClaimed] = useState(false);

  const handleClaimDaily = () => {
    if (claimed) {
      toast.show('Already Claimed', 'Come back tomorrow for your next streak bonus!', 'info');
      return;
    }

    soundManager.playWinChime();
    const dayReward = STREAK_DAYS[Math.min(user.dailyStreak, 6)];
    store.adminAdjustUserCoins(user.id, dayReward.coins, `Day ${user.dailyStreak + 1} Login Bonus`);
    setClaimed(true);
    toast.show('STREAK CLAIMED!', `+${dayReward.coins.toLocaleString()} Virtual Coins added!`, 'success');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in select-none font-mono text-left pb-16">
      <div className="saloon-wood-panel p-6 rounded-3xl border border-[#C58A20] shadow-2xl space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#8B1717] border border-[#FFD77A] flex items-center justify-center text-[#FFD77A]">
          <Gift className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-gold-metallic uppercase">
          DAILY STREAK & REWARDS
        </h1>
        <p className="text-xs text-[#D8C59A]">
          Log in daily to claim free virtual coin rewards and level up your VIP rank!
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {STREAK_DAYS.map((d, idx) => {
          const isPast = idx < user.dailyStreak;
          const isCurrent = idx === user.dailyStreak;
          return (
            <div
              key={d.day}
              className={`saloon-wood-panel p-3.5 rounded-2xl border text-center flex flex-col justify-between h-36 ${
                isCurrent
                  ? 'border-[#FFD77A] shadow-lg scale-105'
                  : 'border-[#C58A20]/40'
              }`}
            >
              <span className="text-[10px] font-black text-[#D8C59A] uppercase">{d.label}</span>
              <div className="my-1">
                <span className="text-base font-black text-[#FFD77A] block">+{d.coins}</span>
                <span className="text-[9px] text-[#D8C59A] block">COINS</span>
              </div>
              {isPast ? (
                <span className="text-[10px] font-bold text-emerald-400 flex items-center justify-center gap-1">
                  <CheckCircle className="w-3 h-3" /> CLAIMED
                </span>
              ) : isCurrent ? (
                <button
                  onClick={handleClaimDaily}
                  disabled={claimed}
                  className={`w-full py-1.5 rounded-xl text-[10px] font-black uppercase transition ${
                    claimed ? 'btn-brass-sm text-[#D8C59A]' : 'btn-gold-3d text-[#120B07]'
                  }`}
                >
                  {claimed ? 'CLAIMED' : 'CLAIM'}
                </button>
              ) : (
                <span className="text-[10px] text-[#D8C59A]/40">LOCKED</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
