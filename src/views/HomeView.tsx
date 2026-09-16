import React, { useState, useEffect } from 'react';
import { store } from '../store/state';
import { ViewType } from '../types';
import { soundManager } from '../utils/sound';
import {
  Sparkles,
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
  Coins
} from 'lucide-react';

interface GameBanner {
  id: ViewType;
  title: string;
  badge: string;
  subtitle: string;
  multiplier: string;
  icon: any;
}

const HERO_BANNERS: GameBanner[] = [
  {
    id: 'slot',
    title: 'WESTERN 5x3 REEL SLOT',
    badge: 'FLAGSHIP GAME ENGINE',
    subtitle: '5 Columns × 3 Rows Western Reel with Wilds, Sheriff Badges & TNT Dynamite!',
    multiplier: 'UP TO 25X MULTIPLIERS',
    icon: Sparkles,
  },
  {
    id: 'crash',
    title: 'AVIATOR CRASH ENGINE',
    badge: 'INSTANT MULTIPLIERS',
    subtitle: 'Watch the multiplier plane fly high • Cash out before the crash!',
    multiplier: '100X MAX MULTIPLIER',
    icon: Rocket,
  },
  {
    id: 'roulette',
    title: 'EUROPEAN SALOON ROULETTE',
    badge: '37 POCKET WHEEL',
    subtitle: 'Single Zero wheel spin with Red/Black, Even/Odd & Straight Up payouts.',
    multiplier: '36X STRAIGHT UP',
    icon: CircleDot,
  },
];

interface LiveTickerBet {
  id: string;
  user: string;
  game: string;
  wagerCoins: number;
  multiplier: number;
  payoutCoins: number;
  time: string;
}

export const HomeView: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [liveBets, setLiveBets] = useState<LiveTickerBet[]>([
    { id: '1', user: 'Outlaw_Pete', game: 'Western 5x3 Slot', wagerCoins: 500, multiplier: 15.0, payoutCoins: 7500, time: '2s ago' },
    { id: '2', user: 'Sheriff_Jane', game: 'Aviator Crash', wagerCoins: 1000, multiplier: 3.45, payoutCoins: 3450, time: '5s ago' },
    { id: '3', user: 'Ranger_Kabir', game: 'European Roulette', wagerCoins: 200, multiplier: 36.0, payoutCoins: 7200, time: '8s ago' },
    { id: '4', user: 'Gunslinger_Sabbir', game: 'Golden Dice 3D', wagerCoins: 1500, multiplier: 2.0, payoutCoins: 3000, time: '12s ago' },
  ]);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  // Simulate real-time live bets feed
  useEffect(() => {
    const names = ['Desperado_Kazi', 'Rider_Joy', 'Marshal_Fahim', 'Bounty_Imran', 'Bandit_Tanvir'];
    const games = ['Western 5x3 Slot', 'Aviator Crash', 'European Roulette', 'Golden Dice 3D', 'Royal Hi-Lo Cards'];

    const tickerInterval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomGame = games[Math.floor(Math.random() * games.length)];
      const wagerCoins = Math.floor(Math.random() * 20 + 2) * 50;
      const multiplier = parseFloat((Math.random() * 4 + 1.2).toFixed(2));
      const payoutCoins = Math.round(wagerCoins * multiplier);

      const newBet: LiveTickerBet = {
        id: Date.now().toString(),
        user: randomName,
        game: randomGame,
        wagerCoins,
        multiplier,
        payoutCoins,
        time: 'Just now',
      };

      setLiveBets((prev) => [newBet, ...prev.slice(0, 5)]);
    }, 4000);

    return () => clearInterval(tickerInterval);
  }, []);

  const handleLaunchGame = (gameId: ViewType) => {
    soundManager.playClick();
    store.setView(gameId);
  };

  const activeBanner = HERO_BANNERS[currentSlide];
  const BannerIcon = activeBanner.icon;

  return (
    <div className="space-y-6 px-3 sm:px-6 py-6 pb-16 animate-fade-in select-none text-left font-mono">
      
      {/* 1. Hero Promotional Slider Banner */}
      <div className="saloon-wood-panel border border-[#C58A20] rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden min-h-[220px] flex flex-col justify-between">
        
        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-[#8B1717] text-[#FFF2CC] font-black text-[9px] px-2.5 py-0.5 rounded border border-[#FFD77A] uppercase tracking-wider">
              {activeBanner.badge}
            </span>
            <span className="text-[10px] text-[#FFD77A] font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#FFD77A] animate-ping" /> FREE-TO-PLAY
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-gold-metallic uppercase tracking-wider leading-tight">
            {activeBanner.title}
          </h1>

          <p className="text-xs sm:text-sm text-[#D8C59A] max-w-xl">
            {activeBanner.subtitle}
          </p>

          <div className="pt-2">
            <button
              onClick={() => handleLaunchGame(activeBanner.id)}
              className="btn-gold-3d text-[#120B07] font-black text-xs px-6 py-3 rounded-2xl flex items-center gap-2 shadow-xl active:scale-95 transition uppercase"
            >
              <Play className="w-4 h-4 fill-[#120B07]" />
              <span>PLAY NOW ({activeBanner.multiplier})</span>
            </button>
          </div>
        </div>

        {/* Carousel Indicators & Controls */}
        <div className="flex items-center justify-between pt-4 relative z-10 border-t border-[#C58A20]/30 mt-4">
          <div className="flex items-center gap-1.5">
            {HERO_BANNERS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all ${
                  currentSlide === idx ? 'w-6 bg-[#FFD77A]' : 'w-2 bg-[#18100B]'
                }`}
              />
            ))}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_BANNERS.length - 1 : prev - 1))}
              className="p-1.5 rounded-lg btn-brass-sm text-[#D8C59A] transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_BANNERS.length)}
              className="p-1.5 rounded-lg btn-brass-sm text-[#D8C59A] transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* 2. Hot Games Lobby Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#FFD77A]" />
            <h2 className="text-sm sm:text-base font-black text-[#FFF2CC] uppercase tracking-wider">
              HOT CASINO GAMES
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              store.setView('games');
            }}
            className="text-xs font-bold text-[#FFD77A] hover:text-[#FFF2CC] flex items-center gap-1 transition"
          >
            <span>VIEW ALL</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* Slot */}
          <div
            onClick={() => handleLaunchGame('slot')}
            className="group cursor-pointer saloon-wood-panel border border-[#C58A20]/60 hover:border-[#FFD77A] p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-lg text-center space-y-2 relative overflow-hidden"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#050505] border border-[#C58A20] flex items-center justify-center text-[#FFD77A] group-hover:scale-110 transition">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#FFF2CC] uppercase group-hover:text-[#FFD77A] transition">
                WESTERN SLOT
              </h3>
              <span className="text-[10px] text-[#FFD77A] font-bold">5x3 REELS</span>
            </div>
          </div>

          {/* Aviator */}
          <div
            onClick={() => handleLaunchGame('crash')}
            className="group cursor-pointer saloon-wood-panel border border-[#C58A20]/60 hover:border-rose-500/80 p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-lg text-center space-y-2 relative overflow-hidden"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#050505] border border-[#C58A20] flex items-center justify-center text-rose-400 group-hover:scale-110 transition">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#FFF2CC] uppercase group-hover:text-rose-400 transition">
                AVIATOR
              </h3>
              <span className="text-[10px] text-[#FFD77A] font-bold">100X CRASH</span>
            </div>
          </div>

          {/* Roulette */}
          <div
            onClick={() => handleLaunchGame('roulette')}
            className="group cursor-pointer saloon-wood-panel border border-[#C58A20]/60 hover:border-emerald-500/80 p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-lg text-center space-y-2 relative overflow-hidden"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#050505] border border-[#C58A20] flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
              <CircleDot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#FFF2CC] uppercase group-hover:text-emerald-400 transition">
                ROULETTE
              </h3>
              <span className="text-[10px] text-[#FFD77A] font-bold">36X PAYOUT</span>
            </div>
          </div>

          {/* Dice */}
          <div
            onClick={() => handleLaunchGame('dice')}
            className="group cursor-pointer saloon-wood-panel border border-[#C58A20]/60 hover:border-cyan-500/80 p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-lg text-center space-y-2 relative overflow-hidden"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#050505] border border-[#C58A20] flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
              <Dices className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#FFF2CC] uppercase group-hover:text-cyan-400 transition">
                GOLDEN DICE
              </h3>
              <span className="text-[10px] text-[#FFD77A] font-bold">OVER/UNDER</span>
            </div>
          </div>

          {/* Cards */}
          <div
            onClick={() => handleLaunchGame('cards')}
            className="group cursor-pointer saloon-wood-panel border border-[#C58A20]/60 hover:border-purple-500/80 p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-lg text-center space-y-2 relative overflow-hidden"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#050505] border border-[#C58A20] flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#FFF2CC] uppercase group-hover:text-purple-400 transition">
                HI-LO CARDS
              </h3>
              <span className="text-[10px] text-[#FFD77A] font-bold">STREAK ODDS</span>
            </div>
          </div>

          {/* Wheel */}
          <div
            onClick={() => handleLaunchGame('wheel')}
            className="group cursor-pointer saloon-wood-panel border border-[#C58A20]/60 hover:border-amber-500/80 p-4 rounded-3xl transition-all duration-300 hover:-translate-y-1 shadow-lg text-center space-y-2 relative overflow-hidden"
          >
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#050505] border border-[#C58A20] flex items-center justify-center text-amber-300 group-hover:scale-110 transition">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xs text-[#FFF2CC] uppercase group-hover:text-amber-300 transition">
                FORTUNE WHEEL
              </h3>
              <span className="text-[10px] text-[#FFD77A] font-bold">50X SPIN</span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Real-Time Live Bet Ticker Feed */}
      <div className="saloon-wood-panel border border-[#C58A20]/60 rounded-3xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#C58A20]/30">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h3 className="text-xs sm:text-sm font-black text-[#FFF2CC] uppercase tracking-wider">
              REAL-TIME LIVE BET TICKER
            </h3>
          </div>
          <span className="text-[10px] text-[#D8C59A]">VIRTUAL COIN PAYOUTS</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-[#D8C59A] font-bold uppercase text-[10px] border-b border-[#C58A20]/20">
                <th className="py-2 px-3">PLAYER</th>
                <th className="py-2 px-3">GAME</th>
                <th className="py-2 px-3">WAGER</th>
                <th className="py-2 px-3">ODDS</th>
                <th className="py-2 px-3 text-right">PAYOUT COINS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#C58A20]/20">
              {liveBets.map((b) => (
                <tr key={b.id} className="hover:bg-[#21140C]/40 transition">
                  <td className="py-2.5 px-3 font-bold text-[#FFF2CC]">{b.user}</td>
                  <td className="py-2.5 px-3 text-[#FFD77A] font-bold">{b.game}</td>
                  <td className="py-2.5 px-3 text-[#D8C59A]">{b.wagerCoins.toLocaleString()}</td>
                  <td className="py-2.5 px-3 font-bold text-cyan-300">{b.multiplier}x</td>
                  <td className="py-2.5 px-3 text-right font-black text-emerald-400">
                    +{b.payoutCoins.toLocaleString()} COINS
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Live Platform Statistics Counter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 space-y-1">
          <Users className="w-5 h-5 text-[#FFD77A] mx-auto" />
          <div className="text-lg font-black text-[#FFF2CC]">18,492</div>
          <div className="text-[10px] text-[#D8C59A] uppercase">ACTIVE SALOON PLAYERS</div>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 space-y-1">
          <Coins className="w-[#FFD77A] w-5 h-5 text-[#FFD77A] mx-auto" />
          <div className="text-lg font-black text-emerald-400">4.85M</div>
          <div className="text-[10px] text-[#D8C59A] uppercase">FREE COINS DISTRIBUTED</div>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 space-y-1">
          <Zap className="w-5 h-5 text-cyan-400 mx-auto" />
          <div className="text-lg font-black text-cyan-300">1.2s</div>
          <div className="text-[10px] text-[#D8C59A] uppercase">AVG SPIN TIME</div>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 space-y-1">
          <Award className="w-5 h-5 text-purple-400 mx-auto" />
          <div className="text-lg font-black text-[#FFD77A]">15.0%</div>
          <div className="text-[10px] text-[#D8C59A] uppercase">PROVABLY FAIR WIN RATE</div>
        </div>
      </div>

    </div>
  );
};
