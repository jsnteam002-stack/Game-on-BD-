import React, { useState, useEffect } from 'react';
import { store } from '../store/state';
import { ViewType } from '../types';
import { soundManager } from '../utils/sound';
import {
  Sparkles,
  Flame,
  Rocket,
  CircleDot,
  Dices,
  Crown,
  Play,
  TrendingUp,
  Zap,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Users,
  Award,
  Coins,
  Trophy,
  PlusCircle,
  Tv,
  Gamepad2,
  Fish,
} from 'lucide-react';

interface GameItem {
  id: ViewType;
  title: string;
  category: 'SLOTS' | 'CRASH' | 'ROULETTE' | 'TABLE' | 'FISHING';
  isHot: boolean;
  provider: string;
  jackpotAmount: number;
  multiplier: string;
  rating: string;
  gradient: string;
  badgeBg: string;
  icon: any;
  thumbnailUrl: string;
}

const ALL_GAMES: GameItem[] = [
  {
    id: 'slot',
    title: 'WESTERN 5x3 SLOT',
    category: 'SLOTS',
    isHot: true,
    provider: 'JILI SLOTS',
    jackpotAmount: 842500,
    multiplier: 'UP TO 5000X',
    rating: '98.8%',
    gradient: 'from-amber-500/30 via-emerald-900/40 to-[#041714]',
    badgeBg: 'bg-rose-600',
    icon: Sparkles,
    thumbnailUrl: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'crash',
    title: 'AVIATOR CRASH',
    category: 'CRASH',
    isHot: true,
    provider: 'SPRIBE GAMING',
    jackpotAmount: 495200,
    multiplier: '100X MULTIPLIER',
    rating: '99.1%',
    gradient: 'from-rose-500/30 via-red-950/40 to-[#041714]',
    badgeBg: 'bg-red-600',
    icon: Rocket,
    thumbnailUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'roulette',
    title: 'EUROPEAN ROULETTE',
    category: 'TABLE',
    isHot: true,
    provider: 'EVOLUTION LIVE',
    jackpotAmount: 620000,
    multiplier: '36X STRAIGHT UP',
    rating: '97.3%',
    gradient: 'from-emerald-500/30 via-teal-950/40 to-[#041714]',
    badgeBg: 'bg-emerald-600',
    icon: CircleDot,
    thumbnailUrl: 'https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dice',
    title: 'GOLDEN DICE 3D',
    category: 'TABLE',
    isHot: false,
    provider: 'PRAGMATIC PLAY',
    jackpotAmount: 310500,
    multiplier: 'OVER / UNDER 6X',
    rating: '98.0%',
    gradient: 'from-cyan-500/30 via-blue-950/40 to-[#041714]',
    badgeBg: 'bg-blue-600',
    icon: Dices,
    thumbnailUrl: 'https://images.unsplash.com/photo-1522069213448-443a6ec4bb4c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'cards',
    title: 'ROYAL HI-LO CARDS',
    category: 'TABLE',
    isHot: false,
    provider: 'PG SOFT',
    jackpotAmount: 285400,
    multiplier: 'STREAK 12X',
    rating: '97.8%',
    gradient: 'from-purple-500/30 via-purple-950/40 to-[#041714]',
    badgeBg: 'bg-purple-600',
    icon: Crown,
    thumbnailUrl: 'https://images.unsplash.com/photo-1541278107931-e006523892df?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'wheel',
    title: 'MEGA FORTUNE WHEEL',
    category: 'SLOTS',
    isHot: true,
    provider: 'HABANERO',
    jackpotAmount: 750000,
    multiplier: '50X BIG WHEEL',
    rating: '98.5%',
    gradient: 'from-amber-400/30 via-yellow-950/40 to-[#041714]',
    badgeBg: 'bg-amber-600',
    icon: Coins,
    thumbnailUrl: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?w=400&auto=format&fit=crop&q=80',
  },
];

interface LiveWinner {
  id: string;
  user: string;
  game: string;
  amount: number;
  channel: 'bKash' | 'Nagad';
  time: string;
}

export const HomeView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [grandJackpot, setGrandJackpot] = useState<number>(1847920.45);
  const [liveWinners, setLiveWinners] = useState<LiveWinner[]>([
    { id: '1', user: '0171***892', game: 'Western 5x3 Slot', amount: 45000, channel: 'bKash', time: '2s ago' },
    { id: '2', user: '0185***140', game: 'Aviator Crash', amount: 18500, channel: 'Nagad', time: '4s ago' },
    { id: '3', user: '0191***442', game: 'European Roulette', amount: 72000, channel: 'bKash', time: '8s ago' },
    { id: '4', user: '0162***789', game: 'Golden Dice 3D', amount: 12000, channel: 'Nagad', time: '12s ago' },
  ]);

  // Real-time ticking Progressive Grand Jackpot
  useEffect(() => {
    const timer = setInterval(() => {
      setGrandJackpot((prev) => prev + parseFloat((Math.random() * 0.75 + 0.1).toFixed(2)));
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  // Live winners feed simulation
  useEffect(() => {
    const prefixes = ['0171', '0185', '0191', '0162', '0130', '0140'];
    const games = ['Western 5x3 Slot', 'Aviator Crash', 'European Roulette', 'Mega Fortune Wheel', 'Golden Dice 3D'];
    const channels: ('bKash' | 'Nagad')[] = ['bKash', 'Nagad'];

    const interval = setInterval(() => {
      const p = prefixes[Math.floor(Math.random() * prefixes.length)];
      const s = Math.floor(Math.random() * 900 + 100);
      const randomUser = `${p}***${s}`;
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const randomAmount = Math.floor(Math.random() * 50 + 5) * 1000;
      const randomChannel = channels[Math.floor(Math.random() * channels.length)];

      const item: LiveWinner = {
        id: Date.now().toString(),
        user: randomUser,
        game: randomGame,
        amount: randomAmount,
        channel: randomChannel,
        time: 'Just now',
      };

      setLiveWinners((prev) => [item, ...prev.slice(0, 5)]);
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleLaunchGame = (gameId: ViewType) => {
    soundManager.playClick();
    store.setView(gameId);
  };

  const filteredGames = ALL_GAMES.filter((g) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'SLOTS') return g.category === 'SLOTS';
    if (selectedCategory === 'CRASH') return g.category === 'CRASH';
    if (selectedCategory === 'TABLE') return g.category === 'TABLE' || g.category === 'ROULETTE';
    return true;
  });

  return (
    <div className="space-y-5 px-2 sm:px-4 py-4 pb-20 animate-fade-in select-none text-left font-mono">
      
      {/* 1. Progressive Grand Jackpot Hero Ticker Banner */}
      <div className="emerald-panel rounded-3xl p-4 sm:p-6 border-2 border-[#E5B94F] shadow-2xl relative overflow-hidden text-center">
        {/* Subtle Background Glows */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-72 h-40 bg-[#10B981]/25 blur-3xl rounded-full pointer-events-none" />
        <div className="absolute top-2 right-4 text-[#FFD700] opacity-20 pointer-events-none">
          <Trophy className="w-24 h-24" />
        </div>

        <div className="relative z-10 space-y-2 max-w-2xl mx-auto">
          
          <div className="flex items-center justify-center gap-2">
            <span className="bg-gradient-to-r from-red-600 to-amber-600 text-white font-black text-[10px] px-3 py-0.5 rounded-full border border-yellow-300 uppercase tracking-widest shadow-md flex items-center gap-1">
              <Flame className="w-3 h-3 animate-bounce" />
              MEGA PROGRESSIVE
            </span>
            <span className="text-xs text-[#FFD700] font-bold tracking-wider">
              GRAND JACKPOT
            </span>
          </div>

          {/* Animated Jackpot Amount Display */}
          <div className="emerald-inset py-3 px-4 sm:px-6 rounded-2xl border border-[#E5B94F]/60 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8)] inline-block">
            <div className="text-2xl sm:text-4xl md:text-5xl font-black text-gold-metallic tracking-wider drop-shadow-[0_2px_10px_rgba(255,215,0,0.5)]">
              ৳ {grandJackpot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          {/* Sub-Jackpot Breakdown Pills */}
          <div className="grid grid-cols-3 gap-2 pt-1 max-w-md mx-auto text-[10px] sm:text-xs font-black">
            <div className="bg-[#041714] border border-amber-500/40 rounded-xl py-1 px-2 text-center">
              <span className="text-slate-400 block text-[9px]">MAJOR</span>
              <span className="text-amber-400">৳ 185,200</span>
            </div>
            <div className="bg-[#041714] border border-cyan-500/40 rounded-xl py-1 px-2 text-center">
              <span className="text-slate-400 block text-[9px]">MINOR</span>
              <span className="text-cyan-400">৳ 24,500</span>
            </div>
            <div className="bg-[#041714] border border-emerald-500/40 rounded-xl py-1 px-2 text-center">
              <span className="text-slate-400 block text-[9px]">MINI</span>
              <span className="text-emerald-400">৳ 5,200</span>
            </div>
          </div>

        </div>
      </div>

      {/* 2. E-Wallet Promotion Banner (bKash & Nagad 100% Match) */}
      <div className="bg-gradient-to-r from-[#072B26] via-[#0E4B43] to-[#072B26] border border-[#E5B94F]/40 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex items-center -space-x-2">
            <div className="w-9 h-9 rounded-full bg-[#E2136E] border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
              ৳
            </div>
            <div className="w-9 h-9 rounded-full bg-[#F7941D] border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">
              ন
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                bKash & Nagad Auto Deposit Active
              </span>
              <span className="bg-[#10B981] text-white text-[9px] font-black px-1.5 py-0.2 rounded">
                +10% BONUS
              </span>
            </div>
            <p className="text-[11px] text-slate-300">
              Instant 60-second processing • Minimum deposit ৳100 • Zero fees
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            store.setView('profile');
          }}
          className="btn-gold-glossy-3d text-xs font-black px-4 py-2 rounded-xl text-[#0B3C35] flex items-center gap-1 shadow-md active:scale-95 transition shrink-0"
        >
          <span>CLAIM BONUS</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 3. Slot Game Category Tab Filter Bar */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {[
            { key: 'ALL', label: 'ALL GAMES', icon: Flame },
            { key: 'SLOTS', label: 'SLOT MACHINES', icon: Sparkles },
            { key: 'CRASH', label: 'CRASH & AVIATOR', icon: Rocket },
            { key: 'TABLE', label: 'TABLE & ROULETTE', icon: CircleDot },
          ].map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat.key);
                }}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-black whitespace-nowrap transition active:scale-95 border ${
                  isSelected
                    ? 'btn-emerald-glossy-3d border-[#10B981] text-white shadow-lg'
                    : 'bg-[#041714] text-slate-300 border-slate-800 hover:border-[#E5B94F]/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FFD700]' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. Slot Game Category Grid with Thumbnail Cards, "HOT" Badges, Jackpot Counters & Play Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {filteredGames.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                onClick={() => handleLaunchGame(game.id)}
                className="group relative cursor-pointer emerald-card rounded-2xl sm:rounded-3xl border border-[#E5B94F]/35 hover:border-[#FFD700] p-3 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xl overflow-hidden text-left"
              >
                {/* Fiery HOT Overlay Badge */}
                {game.isHot && (
                  <div className="absolute top-2 left-2 z-20 flex items-center gap-0.5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-black text-[9px] px-2 py-0.5 rounded-md shadow-lg border border-yellow-300 animate-pulse">
                    <Flame className="w-2.5 h-2.5 fill-yellow-300 text-yellow-300" />
                    <span>HOT</span>
                  </div>
                )}

                {/* Provider Badge */}
                <div className="absolute top-2 right-2 z-20 bg-[#041714]/90 backdrop-blur-sm text-[#FFD700] text-[8px] font-black px-1.5 py-0.5 rounded border border-[#E5B94F]/30">
                  {game.provider}
                </div>

                {/* Thumbnail Art Container */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-2.5 border border-[#E5B94F]/20 group-hover:border-[#FFD700]/70 transition">
                  <img
                    src={game.thumbnailUrl}
                    alt={game.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500 brightness-90 group-hover:brightness-105"
                  />
                  
                  {/* Subtle Gradient Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#041714] via-transparent to-black/30" />

                  {/* Centered Floating Icon */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 bg-black/40 backdrop-blur-[2px]">
                    <div className="w-11 h-11 rounded-full bg-[#FFD700] text-[#0B3C35] flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition">
                      <Play className="w-5 h-5 fill-[#0B3C35]" />
                    </div>
                  </div>
                </div>

                {/* Title & Game Info */}
                <div className="space-y-1">
                  <h3 className="font-black text-xs sm:text-sm text-white group-hover:text-[#FFD700] transition line-clamp-1">
                    {game.title}
                  </h3>

                  {/* Individual Game Jackpot Counter */}
                  <div className="bg-[#041714] px-2 py-0.5 rounded-lg border border-[#E5B94F]/30 flex items-center justify-between">
                    <span className="text-[8px] text-slate-400 font-bold">JACKPOT</span>
                    <span className="text-[10px] font-black text-[#FFD700]">
                      ৳ {game.jackpotAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[9px] text-slate-300 pt-0.5">
                    <span className="text-[#10B981] font-bold">{game.multiplier}</span>
                    <span className="text-slate-400">RTP: {game.rating}</span>
                  </div>
                </div>

                {/* Glossy 3D Play Now Action Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    className="w-full btn-gold-glossy-3d py-2 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 text-[#0B3C35] shadow-md uppercase active:scale-95 transition"
                  >
                    <Play className="w-3 h-3 fill-[#0B3C35]" />
                    <span>PLAY NOW</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Real-Time Live Payout Feed (bKash & Nagad Player Wins) */}
      <div className="emerald-panel rounded-3xl p-4 sm:p-5 border border-[#E5B94F]/40 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-emerald-800/60">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
              REAL-TIME CASHOUT FEED (bKash & Nagad)
            </h3>
          </div>
          <span className="text-[10px] text-[#FFD700]">LIVE SETTLEMENTS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 font-bold uppercase text-[9px] sm:text-[10px] border-b border-emerald-900/50">
                <th className="py-1.5 px-2.5">PLAYER</th>
                <th className="py-1.5 px-2.5">GAME</th>
                <th className="py-1.5 px-2.5">E-WALLET</th>
                <th className="py-1.5 px-2.5 text-right">CASHOUT AMOUNT</th>
                <th className="py-1.5 px-2.5 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-900/30 font-mono">
              {liveWinners.map((w) => (
                <tr key={w.id} className="hover:bg-[#072622]/50 transition">
                  <td className="py-2 px-2.5 font-bold text-white">{w.user}</td>
                  <td className="py-2 px-2.5 text-slate-200">{w.game}</td>
                  <td className="py-2 px-2.5">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black text-white ${
                      w.channel === 'bKash' ? 'bg-[#E2136E]' : 'bg-[#F7941D]'
                    }`}>
                      {w.channel}
                    </span>
                  </td>
                  <td className="py-2 px-2.5 text-right font-black text-[#10B981]">
                    + ৳ {w.amount.toLocaleString()}
                  </td>
                  <td className="py-2 px-2.5 text-right">
                    <span className="text-[9px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-500/40 font-bold">
                      SETTLED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
