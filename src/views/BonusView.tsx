import React from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { Gift, Calendar, Award, Sparkles, CheckCircle2, Star, Zap } from 'lucide-react';

export const BonusView: React.FC = () => {
  const user = store.getUser();
  const todayStr = new Date().toISOString().split('T')[0];
  const isClaimedToday = user.lastDailyClaim === todayStr;

  const handleClaim = () => {
    soundManager.playWinChime();
    const result = store.claimDailyBonus();
    if (!result) {
      toast.show('Already Claimed', 'You have already claimed today\'s daily streak bonus! Check back tomorrow.', 'info');
    }
  };

  const streakDays = [
    { day: 1, reward: 1250 },
    { day: 2, reward: 1500 },
    { day: 3, reward: 1750 },
    { day: 4, reward: 2000 },
    { day: 5, reward: 2250 },
    { day: 6, reward: 2500 },
    { day: 7, reward: 5000, isGrand: true },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in text-left select-none font-mono">
      
      {/* Header Banner */}
      <div className="saloon-wood-panel p-6 rounded-3xl border border-[#C58A20] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD77A] to-[#C58A20] flex items-center justify-center text-[#120B07] shadow-lg">
            <Gift className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gold-metallic uppercase tracking-wider">
              DAILY STREAK & BONUSES
            </h1>
            <p className="text-xs text-[#D8C59A] mt-0.5">
              100% Free Virtual Coins • Log in daily to build your streak multiplier!
            </p>
          </div>
        </div>

        <button
          onClick={handleClaim}
          disabled={isClaimedToday}
          className={`btn-gold-3d px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-wider text-[#120B07] flex items-center gap-2 ${
            isClaimedToday ? 'opacity-50 cursor-not-allowed' : 'animate-pulse'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{isClaimedToday ? 'CLAIMED TODAY' : 'CLAIM TODAY\'S BONUS'}</span>
        </button>
      </div>

      {/* 7-DAY STREAK CALENDAR GRID */}
      <div className="saloon-wood-panel p-5 rounded-3xl border border-[#C58A20]/60 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#C58A20]/30 pb-2">
          <h3 className="text-xs font-black text-[#FFD77A] uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#FFD77A]" />
            <span>7-DAY STREAK MULTIPLIER CALENDAR</span>
          </h3>
          <span className="text-[10px] text-[#D8C59A]">CURRENT STREAK: DAY {user.dailyStreak}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {streakDays.map((s) => {
            const isCurrent = user.dailyStreak === s.day;
            const isCompleted = user.dailyStreak > s.day || (user.dailyStreak === s.day && isClaimedToday);

            return (
              <div
                key={s.day}
                className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-between space-y-2 relative transition ${
                  isCurrent
                    ? 'bg-[#21140C] border-[#FFD77A] shadow-[0_0_15px_rgba(255,215,122,0.3)] scale-105'
                    : isCompleted
                    ? 'bg-[#0B0806] border-[#C58A20]/40 opacity-75'
                    : 'bg-[#050505] border-[#C58A20]/20'
                }`}
              >
                {s.isGrand && (
                  <span className="absolute -top-2 bg-[#8B1717] text-[#FFF2CC] text-[8px] font-black px-1.5 py-0.2 rounded border border-[#FFD77A]">
                    GRAND
                  </span>
                )}

                <span className="text-[10px] font-black text-[#D8C59A]">DAY {s.day}</span>

                <div className="w-10 h-10 rounded-xl bg-[#120B07] border border-[#C58A20]/40 flex items-center justify-center">
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  ) : (
                    <Award className={`w-5 h-5 ${s.isGrand ? 'text-[#FFD77A]' : 'text-[#D8C59A]'}`} />
                  )}
                </div>

                <span className="text-xs font-black text-[#FFD77A]">+{s.reward.toLocaleString()}</span>
                <span className="text-[8px] text-[#D8C59A]">COINS</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* VIP TIER PROGRESSION */}
      <div className="saloon-wood-panel p-5 rounded-3xl border border-[#C58A20]/60 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#C58A20]/30 pb-2">
          <h3 className="text-xs font-black text-[#FFD77A] uppercase tracking-wider flex items-center gap-1.5">
            <Star className="w-4 h-4 text-[#FFD77A]" />
            <span>VIP SALOON STATUS & LEVEL REWARDS</span>
          </h3>
          <span className="text-xs font-black text-[#FFD77A]">{user.vipTier}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-[#D8C59A]">LEVEL {user.level} PROGRESS</span>
              <span className="text-[#FFD77A] font-bold">{user.xp} / {user.level * 300} XP</span>
            </div>
            
            <div className="w-full bg-[#050505] h-3 rounded-full overflow-hidden border border-[#C58A20]/40 p-0.5">
              <div
                className="bg-gradient-to-r from-[#C58A20] to-[#FFD77A] h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (user.xp / (user.level * 300)) * 100)}%` }}
              />
            </div>

            <p className="text-[10px] text-[#D8C59A]/80">
              Spin games to earn XP! Every level up awards +500 Virtual Coins directly to your wallet.
            </p>
          </div>

          <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 space-y-2">
            <span className="text-[10px] font-black text-[#FFD77A] uppercase tracking-wider block">
              VIP SALOON PERKS
            </span>
            <ul className="text-xs space-y-1.5 text-[#D8C59A]">
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#FFD77A]" />
                <span>Bronze Cowboy: +250 Daily Bonus Multiplier</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#FFD77A]" />
                <span>Silver Sheriff: +500 Daily Bonus Multiplier</span>
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-[#FFD77A]" />
                <span>Gold Marshal: +1,000 Daily Bonus Multiplier</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  );
};
