import React, { useState } from 'react';
import { store } from '../store/state';
import { Trophy, Crown, Medal, Award, Zap, Shield, Sparkles } from 'lucide-react';

export const LeaderboardView: React.FC = () => {
  const user = store.getUser();
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'allTime'>('daily');

  const leaders = [
    { rank: 1, username: 'Dhaka_Gunslinger', coinsWon: 284500, vip: 'Gold Marshal', level: 32 },
    { rank: 2, username: 'Sylhet_Outlaw', coinsWon: 192000, vip: 'Gold Marshal', level: 29 },
    { rank: 3, username: 'Chittagong_Rider', coinsWon: 148400, vip: 'Silver Sheriff', level: 25 },
    { rank: 4, username: user.username, coinsWon: user.biggestWinCoins || 8400, vip: user.vipTier, level: user.level, isUser: true },
    { rank: 5, username: 'Rajshahi_Sheriff', coinsWon: 74200, vip: 'Silver Sheriff', level: 21 },
    { rank: 6, username: 'Khulna_Titan', coinsWon: 62100, vip: 'Bronze Cowboy', level: 18 },
    { rank: 7, username: 'Barishal_Ranger', coinsWon: 51800, vip: 'Bronze Cowboy', level: 14 },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in text-left select-none font-mono">
      
      {/* Leaderboard Header */}
      <div className="saloon-wood-panel p-6 rounded-3xl border border-[#C58A20] shadow-2xl text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-[#8B1717] border border-[#FFD77A] flex items-center justify-center mx-auto text-[#FFD77A] shadow-lg">
          <Trophy className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-black text-gold-metallic uppercase tracking-wider">
          HIGH ROLLERS LEADERBOARD
        </h1>
        <p className="text-xs text-[#D8C59A]">
          Top virtual coin winners competing in the Free-to-Play Saloon Casino!
        </p>

        {/* Filter Buttons */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {(['daily', 'weekly', 'allTime'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                filter === t
                  ? 'btn-gold-3d text-[#120B07]'
                  : 'btn-brass-sm text-[#D8C59A]'
              }`}
            >
              {t === 'allTime' ? 'ALL TIME' : t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* TOP 3 PODIUM DISPLAY */}
      <div className="grid grid-cols-3 gap-3">
        {/* Rank 2 */}
        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 text-center flex flex-col items-center justify-center space-y-1 relative">
          <div className="w-8 h-8 rounded-full bg-slate-300 text-slate-950 font-black text-xs flex items-center justify-center border border-[#FFF2CC]">
            #2
          </div>
          <span className="text-xs font-black text-[#FFF2CC] truncate max-w-full">{leaders[1].username}</span>
          <span className="text-xs font-black text-[#FFD77A]">+{leaders[1].coinsWon.toLocaleString()}</span>
          <span className="text-[8px] text-[#D8C59A]">COINS</span>
        </div>

        {/* Rank 1 */}
        <div className="saloon-wood-panel p-4 rounded-2xl border-2 border-[#FFD77A] text-center flex flex-col items-center justify-center space-y-1 relative shadow-[0_0_20px_rgba(255,215,122,0.3)] scale-105 z-10">
          <Crown className="w-5 h-5 text-[#FFD77A] absolute -top-3" />
          <div className="w-10 h-10 rounded-full bg-[#FFD77A] text-[#120B07] font-black text-sm flex items-center justify-center border border-[#FFF2CC]">
            #1
          </div>
          <span className="text-xs font-black text-[#FFF2CC] truncate max-w-full">{leaders[0].username}</span>
          <span className="text-xs font-black text-[#FFD77A]">+{leaders[0].coinsWon.toLocaleString()}</span>
          <span className="text-[8px] text-[#D8C59A]">COINS</span>
        </div>

        {/* Rank 3 */}
        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 text-center flex flex-col items-center justify-center space-y-1 relative">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center border border-[#FFD77A]">
            #3
          </div>
          <span className="text-xs font-black text-[#FFF2CC] truncate max-w-full">{leaders[2].username}</span>
          <span className="text-xs font-black text-[#FFD77A]">+{leaders[2].coinsWon.toLocaleString()}</span>
          <span className="text-[8px] text-[#D8C59A]">COINS</span>
        </div>
      </div>

      {/* LEADERBOARD TABLE */}
      <div className="saloon-wood-panel rounded-3xl p-4 border border-[#C58A20]/60 space-y-2 shadow-xl">
        {leaders.map((l) => (
          <div
            key={l.rank}
            className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-mono transition ${
              l.isUser
                ? 'bg-[#21140C] border-[#FFD77A] text-[#FFF2CC] shadow-[0_0_15px_rgba(255,215,122,0.2)]'
                : 'bg-[#0B0806] border-[#C58A20]/30 text-[#D8C59A]'
            }`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs ${
                  l.rank === 1
                    ? 'bg-[#FFD77A] text-[#120B07]'
                    : l.rank === 2
                    ? 'bg-slate-300 text-slate-950'
                    : l.rank === 3
                    ? 'bg-amber-700 text-white'
                    : 'bg-[#18100B] text-[#D8C59A]'
                }`}
              >
                #{l.rank}
              </span>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#FFF2CC] text-xs">{l.username}</span>
                  {l.isUser && (
                    <span className="text-[8px] bg-[#8B1717] text-[#FFF2CC] px-1.5 py-0.2 rounded font-black border border-[#FFD77A]">
                      YOU
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-[#D8C59A]/80 block">Level {l.level} • {l.vip}</span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-black text-[#FFD77A] text-sm block">+{l.coinsWon.toLocaleString()}</span>
              <span className="text-[9px] text-[#D8C59A] block">VIRTUAL COINS</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
