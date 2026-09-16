import React, { useState } from 'react';
import { store } from '../store/state';
import { GameCategory, ViewType } from '../types';
import { soundManager } from '../utils/sound';
import {
  Sparkles,
  Rocket,
  CircleDot,
  Dices,
  Crown,
  Search,
  Play,
  TrendingUp,
  ShieldCheck,
  Star
} from 'lucide-react';

interface GameItem {
  id: ViewType;
  title: string;
  category: GameCategory;
  multiplier: string;
  tag: string;
  tagColor: string;
  icon: any;
  description: string;
  playersCount: number;
}

const ALL_GAMES: GameItem[] = [
  {
    id: 'slot',
    title: 'Western 5x3 Slot',
    category: 'SLOTS',
    multiplier: 'Up to 25x Multipliers',
    tag: 'FLAGSHIP',
    tagColor: 'bg-[#8B1717] text-[#FFF2CC] border border-[#FFD77A]',
    icon: Sparkles,
    description: '5 Columns × 3 Rows Western Reel machine with Wilds, TNTs & Badges.',
    playersCount: 4892,
  },
  {
    id: 'crash',
    title: 'Aviator Crash',
    category: 'CRASH',
    multiplier: 'Up to 100x Multipliers',
    tag: 'HOT #1',
    tagColor: 'bg-rose-700 text-white border border-rose-400',
    icon: Rocket,
    description: 'Multiplier graph scales upward. Cash out before the crash!',
    playersCount: 3210,
  },
  {
    id: 'roulette',
    title: 'European Roulette',
    category: 'ROULETTE',
    multiplier: '36x Straight Up',
    tag: 'LIVE',
    tagColor: 'bg-emerald-700 text-white border border-emerald-400',
    icon: CircleDot,
    description: '37 Pockets (0-36) with Red/Black, Even/Odd & Dozens.',
    playersCount: 1980,
  },
  {
    id: 'dice',
    title: 'Golden Dice 3D',
    category: 'DICE',
    multiplier: '2x Over/Under',
    tag: 'FAST',
    tagColor: 'bg-cyan-700 text-white border border-cyan-400',
    icon: Dices,
    description: 'Predict High (Over 7) or Low (Under 7) 2D6 dice rolls.',
    playersCount: 1450,
  },
  {
    id: 'cards',
    title: 'Royal Hi-Lo Cards',
    category: 'CARDS',
    multiplier: 'Streak Multiplier',
    tag: 'TABLE',
    tagColor: 'bg-purple-700 text-white border border-purple-400',
    icon: Crown,
    description: 'Guess if the next drawn playing card is Higher or Lower.',
    playersCount: 1120,
  },
  {
    id: 'wheel',
    title: 'Lucky Fortune Wheel',
    category: 'SLOTS',
    multiplier: '50x Max Wheel',
    tag: 'BONUS',
    tagColor: 'bg-amber-600 text-slate-950 border border-amber-300',
    icon: Sparkles,
    description: 'Spin the fortune wheel to hit multipliers up to 50x.',
    playersCount: 2310,
  },
];

export const GamesView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleLaunchGame = (gameId: ViewType) => {
    soundManager.playClick();
    store.setView(gameId);
  };

  const categories: { id: GameCategory; label: string }[] = [
    { id: 'ALL', label: 'All Games' },
    { id: 'SLOTS', label: 'Western Slots' },
    { id: 'CRASH', label: 'Crash / Instant' },
    { id: 'ROULETTE', label: 'Roulette' },
    { id: 'DICE', label: 'Dice' },
    { id: 'CARDS', label: 'Cards' },
  ];

  const filteredGames = ALL_GAMES.filter((g) => {
    const matchesCategory = selectedCategory === 'ALL' || g.category === selectedCategory;
    const matchesSearch =
      g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 px-3 sm:px-6 py-6 pb-16 animate-fade-in select-none text-left font-mono">
      
      {/* Title & Search Bar */}
      <div className="saloon-wood-panel p-5 sm:p-6 rounded-3xl border border-[#C58A20] shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD77A] animate-pulse" />
            <h1 className="text-xl font-black text-gold-metallic uppercase tracking-wider">
              SALOON CASINO GAME LOBBY
            </h1>
          </div>
          <p className="text-xs text-[#D8C59A] mt-1">
            Explore 100% Free-to-Play Western Slots, Aviator Crash, and Table Games.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#D8C59A]/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search games..."
            className="w-full bg-[#050505] border border-[#C58A20]/40 rounded-2xl pl-10 pr-4 py-2 text-xs text-[#FFF2CC] focus:border-[#FFD77A] focus:outline-none transition placeholder-[#D8C59A]/40"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              soundManager.playClick();
              setSelectedCategory(c.id);
            }}
            className={`px-4 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all border ${
              selectedCategory === c.id
                ? 'btn-gold-3d text-[#120B07] border-[#FFD77A] shadow-[0_0_15px_rgba(229,185,79,0.3)] scale-105'
                : 'btn-brass-sm text-[#D8C59A]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Games Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredGames.map((game) => {
          const Icon = game.icon;
          return (
            <div
              key={game.id}
              onClick={() => handleLaunchGame(game.id)}
              className="group cursor-pointer saloon-wood-panel border border-[#C58A20]/60 hover:border-[#FFD77A] rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 shadow-xl flex flex-col justify-between"
            >
              {/* Card Banner */}
              <div className="p-5 flex flex-col justify-between space-y-4 relative overflow-hidden bg-[#120B07]">
                <div className="flex items-center justify-between z-10">
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-xl shadow uppercase ${game.tagColor}`}>
                    {game.tag}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-[#D8C59A] bg-[#050505]/80 px-2.5 py-1 rounded-xl border border-[#C58A20]/30">
                    <TrendingUp className="w-3 h-3 text-emerald-400" />
                    <span>{game.playersCount.toLocaleString()} PLAYING</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-[#C58A20] flex items-center justify-center text-[#FFD77A] shadow-lg group-hover:scale-110 transition">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-black text-base text-[#FFF2CC] uppercase tracking-wider group-hover:text-[#FFD77A] transition">
                      {game.title}
                    </h3>
                    <span className="text-[11px] text-[#FFD77A] font-bold block">
                      {game.multiplier}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="p-4 bg-[#0B0806] border-t border-[#C58A20]/30 flex items-center justify-between">
                <p className="text-xs text-[#D8C59A] line-clamp-1">
                  {game.description}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLaunchGame(game.id);
                  }}
                  className="ml-3 btn-gold-3d text-[#120B07] font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1 shrink-0 transition active:scale-95 shadow uppercase"
                >
                  <Play className="w-3.5 h-3.5 fill-[#120B07]" />
                  <span>PLAY</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
