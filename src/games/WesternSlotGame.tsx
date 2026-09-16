import React, { useState } from 'react';
import { store, WESTERN_SYMBOLS, WESTERN_SYMBOL_KEYS } from '../store/state';
import { WesternSymbolId } from '../types';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import {
  Sparkles,
  ShieldAlert,
  Crown,
  Briefcase,
  Zap,
  Flame,
  Skull,
  Truck,
  HelpCircle,
  History,
  Volume2,
  VolumeX,
  ArrowLeft,
  RotateCw,
  Info
} from 'lucide-react';

// Render Lucide Vector Icon for symbols (NO EMOJIS)
const renderWesternIcon = (id: WesternSymbolId, className: string = 'w-10 h-10') => {
  switch (id) {
    case 'WILD':
      return <Sparkles className={`${className} text-amber-300 animate-pulse`} />;
    case 'SHERIFF_BADGE':
      return <ShieldAlert className={`${className} text-[#FFD77A]`} />;
    case 'COWBOY_HAT':
      return <Crown className={`${className} text-yellow-500`} />;
    case 'MONEY_BAG':
      return <Briefcase className={`${className} text-emerald-400`} />;
    case 'HORSESHOE':
      return <Zap className={`${className} text-cyan-400`} />;
    case 'DYNAMITE':
      return <Flame className={`${className} text-rose-500`} />;
    case 'BULL_SKULL':
      return <Skull className={`${className} text-orange-400`} />;
    case 'WAGON':
      return <Truck className={`${className} text-slate-300`} />;
    default:
      return <Sparkles className={`${className} text-amber-400`} />;
  }
};

export interface SlotHistoryRecord {
  id: string;
  bet: number;
  win: number;
  isWin: boolean;
  multiplier: number;
  timestamp: string;
}

export const WesternSlotGame: React.FC = () => {
  const user = store.getUser();
  const adminConfig = store.getAdminConfig();

  // Initial 5x3 Grid
  const [grid, setGrid] = useState<WesternSymbolId[][]>([
    ['COWBOY_HAT', 'SHERIFF_BADGE', 'HORSESHOE', 'DYNAMITE', 'WAGON'],
    ['SHERIFF_BADGE', 'WILD', 'MONEY_BAG', 'BULL_SKULL', 'COWBOY_HAT'],
    ['HORSESHOE', 'DYNAMITE', 'WAGON', 'SHERIFF_BADGE', 'MONEY_BAG'],
  ]);

  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedBet, setSelectedBet] = useState(100);
  const [lastWin, setLastWin] = useState(0);
  const [winningPayline, setWinningPayline] = useState<boolean>(false);
  const [isTurbo, setIsTurbo] = useState(false);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [soundMuted, setSoundMuted] = useState(soundManager.getMuted());
  const [isPaytableOpen, setIsPaytableOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const winProb = adminConfig.winProbabilityOverride || 0.15;
  const history = store.getBetHistory().filter((b) => b.gameId === 'slot');

  const handleSpin = () => {
    if (isSpinning || user.virtualCoins < selectedBet) {
      if (user.virtualCoins < selectedBet) {
        toast.show('Insufficient Coins', 'Claim your daily streak bonus from the top bar!', 'error');
      }
      return;
    }

    setIsSpinning(true);
    setLastWin(0);
    setWinningPayline(false);
    soundManager.playClick();

    const deducted = store.deductBetCoins(selectedBet);
    if (!deducted) {
      toast.show('Insufficient Coins', 'Could not deduct bet coins.', 'error');
      setIsSpinning(false);
      return;
    }

    const spinSpeed = isTurbo ? 500 : 1200;

    const tickInterval = setInterval(() => {
      soundManager.playReelTick();
    }, 100);

    setTimeout(() => {
      clearInterval(tickInterval);
      soundManager.playReelStop();

      // Run Western Slot 5x3 Outcome Engine
      const outcome = store.calculateWesternSlot(selectedBet);

      if (outcome.slotGrid) {
        setGrid(outcome.slotGrid as WesternSymbolId[][]);
      }

      if (outcome.isWin && outcome.multiplier) {
        const winCoins = selectedBet * outcome.multiplier;
        setLastWin(winCoins);
        setWinningPayline(true);
        soundManager.playWinChime();
        toast.show('SLOT WIN!', `+${winCoins.toLocaleString()} Virtual Coins! (${outcome.multiplier}x)`, 'success');
        store.recordGameResult('slot', 'Western 5x3 Slot', true, selectedBet, winCoins, outcome.multiplier);
      } else {
        setLastWin(0);
        setWinningPayline(false);
        store.recordGameResult('slot', 'Western 5x3 Slot', false, selectedBet, 0, 0);
      }

      setIsSpinning(false);

      if (isAutoSpin && store.getUser().virtualCoins >= selectedBet) {
        setTimeout(() => {
          handleSpin();
        }, 600);
      }
    }, spinSpeed);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4 animate-fade-in text-center select-none relative px-2 py-2">
      
      {/* Top Controls Header */}
      <div className="saloon-wood-panel rounded-2xl p-3 flex items-center justify-between gap-2 border border-[#C58A20] shadow-2xl">
        <div className="flex items-center gap-2">
          <button
            onClick={() => store.setView('home')}
            className="btn-brass-sm px-3 py-1.5 rounded-xl text-xs font-bold uppercase flex items-center gap-1 active:scale-95 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#FFD77A]" />
            <span>Lobby</span>
          </button>
          <div className="text-left hidden sm:block">
            <h1 className="font-mono font-black text-base sm:text-lg text-gold-metallic tracking-wider">
              WESTERN 5x3 SLOT
            </h1>
            <span className="text-[9px] font-black text-[#FFD77A] uppercase tracking-widest block font-mono">
              FLAGSHIP GAME ENGINE
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPaytableOpen(true)}
            className="btn-brass-sm px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase font-mono flex items-center gap-1 text-[#FFF2CC]"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#FFD77A]" />
            <span>Paytable</span>
          </button>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="btn-brass-sm px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold uppercase font-mono flex items-center gap-1 text-[#FFF2CC]"
          >
            <History className="w-3.5 h-3.5 text-[#FFD77A]" />
            <span>History</span>
          </button>
          <button
            onClick={() => setSoundMuted(soundManager.toggleMute())}
            className="btn-brass-sm px-2.5 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold font-mono"
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
          </button>
        </div>
      </div>

      {/* SLOT HUD TOP DISPLAY PANELS */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        <div className="display-panel-inset rounded-2xl p-2.5 sm:p-3 text-center border border-[#C58A20]/40 shadow-inner">
          <span className="text-[9px] sm:text-[10px] font-black text-[#D8C59A] uppercase tracking-widest block font-mono">
            BALANCE
          </span>
          <span className="text-sm sm:text-xl font-black text-[#FFD77A] tracking-wider block font-mono">
            {user.virtualCoins.toLocaleString()}
          </span>
        </div>

        <div className="display-panel-inset rounded-2xl p-2.5 sm:p-3 text-center border border-[#C58A20]/40 shadow-inner">
          <span className="text-[9px] sm:text-[10px] font-black text-[#D8C59A] uppercase tracking-widest block font-mono">
            LAST WIN
          </span>
          <span className={`text-sm sm:text-xl font-black tracking-wider block font-mono ${lastWin > 0 ? 'text-emerald-400 animate-pulse' : 'text-[#D8C59A]/60'}`}>
            {lastWin > 0 ? `+${lastWin.toLocaleString()}` : '0'}
          </span>
        </div>

        <div className="display-panel-inset rounded-2xl p-2.5 sm:p-3 text-center border border-[#C58A20]/40 shadow-inner">
          <span className="text-[9px] sm:text-[10px] font-black text-[#D8C59A] uppercase tracking-widest block font-mono">
            PROBABILITY ODDS
          </span>
          <span className="text-xs sm:text-sm font-black text-cyan-300 tracking-wider block font-mono mt-0.5">
            {(winProb * 100).toFixed(0)}% WIN / {((1 - winProb) * 100).toFixed(0)}% HOUSE
          </span>
        </div>
      </div>

      {/* REALISTIC 5x3 REEL SLOT FRAME */}
      <div className="brass-frame relative shadow-[0_0_35px_rgba(0,0,0,0.95)]">
        <div className="saloon-wood-panel rounded-[1.25rem] p-3 sm:p-5 relative overflow-hidden">
          
          <div className="brass-rivet absolute top-2.5 left-2.5"></div>
          <div className="brass-rivet absolute top-2.5 right-2.5"></div>
          <div className="brass-rivet absolute bottom-2.5 left-2.5"></div>
          <div className="brass-rivet absolute bottom-2.5 right-2.5"></div>

          {/* Center Payline Highlight */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FFD77A]/60 to-transparent pointer-events-none z-10"></div>

          <div className="bg-[#050505] p-2 sm:p-3 rounded-2xl border-2 border-[#C58A20]/60 shadow-[inset_0_5px_15px_rgba(0,0,0,0.98)] overflow-hidden">
            {/* 5 Columns x 3 Rows */}
            <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
              {[0, 1, 2, 3, 4].map((colIdx) => (
                <div
                  key={colIdx}
                  className={`flex flex-col gap-1.5 sm:gap-2 bg-[#120B07] p-1 rounded-xl border-r border-[#21140C] last:border-r-0 relative ${
                    isSpinning ? 'animate-spin-reel filter blur-[0.5px]' : 'animate-reel-stop-bounce'
                  }`}
                >
                  {[0, 1, 2].map((rowIdx) => {
                    const symbolKey = grid[rowIdx]?.[colIdx] || 'COWBOY_HAT';
                    const symbolDef = WESTERN_SYMBOLS[symbolKey];
                    const isWinningCenterCell = winningPayline && rowIdx === 0; // Row 0 is win payline

                    return (
                      <div
                        key={rowIdx}
                        className={`h-20 sm:h-28 bg-gradient-to-b from-[#21140C] via-[#18100B] to-[#0B0806] border ${
                          isWinningCenterCell
                            ? 'border-[#FFD77A] shadow-[0_0_20px_rgba(255,215,122,0.8)] scale-105 z-10 bg-[#8B1717]/40'
                            : 'border-[#C58A20]/30'
                        } rounded-xl flex flex-col items-center justify-center p-1 shadow-inner transition-all duration-300`}
                      >
                        {renderWesternIcon(symbolKey, 'w-8 h-8 sm:w-12 sm:h-12')}
                        <span className="text-[8px] sm:text-[10px] font-black text-[#FFF2CC] truncate max-w-full tracking-wider mt-1 font-mono uppercase">
                          {symbolDef?.name || symbolKey}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* BET CONTROLS & SPIN ACTION BUTTON */}
      <div className="saloon-wood-panel rounded-3xl p-4 sm:p-6 border border-[#C58A20]/60 space-y-4 shadow-2xl">
        <div className="space-y-2">
          <span className="text-[10px] sm:text-xs font-black text-[#FFD77A] uppercase tracking-widest block font-mono">
            SELECT BET AMOUNT (VIRTUAL COINS)
          </span>
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {[50, 100, 250, 500, 1000, 2500].map((bet) => (
              <button
                key={bet}
                onClick={() => setSelectedBet(bet)}
                disabled={isSpinning}
                className={`px-3.5 py-2 rounded-xl text-xs font-black tracking-wider font-mono transition ${
                  selectedBet === bet
                    ? 'btn-gold-3d scale-105 border-2 border-[#FFD77A] shadow-[0_0_15px_rgba(229,185,79,0.4)]'
                    : 'btn-brass-sm text-[#D8C59A]'
                }`}
              >
                {bet} COINS
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 sm:gap-6 py-2">
          <button
            onClick={() => setIsAutoSpin(!isAutoSpin)}
            disabled={isSpinning}
            className={`btn-brass-sm px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-mono ${
              isAutoSpin ? 'border-[#FFD77A] text-[#FFD77A] bg-[#8B1717]/40' : ''
            }`}
          >
            {isAutoSpin ? 'AUTO: ON' : 'AUTO SPIN'}
          </button>

          <button
            onClick={handleSpin}
            disabled={isSpinning || user.virtualCoins < selectedBet}
            className={`btn-spin-3d w-24 h-24 sm:w-28 sm:h-28 rounded-full flex flex-col items-center justify-center border-4 border-[#FFD77A] text-[#120B07] font-black shadow-2xl active:scale-95 transition ${
              isSpinning || user.virtualCoins < selectedBet ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <span className="text-base sm:text-lg font-mono font-black tracking-widest text-[#FFF2CC] drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] uppercase">
              {isSpinning ? 'SPINNING' : 'SPIN'}
            </span>
            <span className="text-[9px] font-black text-[#120B07] tracking-wider uppercase -mt-0.5 font-mono">
              {isSpinning ? 'WAIT...' : `${selectedBet} COINS`}
            </span>
          </button>

          <button
            onClick={() => setIsTurbo(!isTurbo)}
            disabled={isSpinning}
            className={`btn-brass-sm px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider font-mono flex items-center gap-1 ${
              isTurbo ? 'border-cyan-400 text-cyan-300 bg-cyan-950/40' : ''
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>TURBO</span>
          </button>
        </div>
      </div>

      {/* PAYTABLE MODAL */}
      {isPaytableOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="saloon-wood-panel border border-[#C58A20] rounded-3xl w-full max-w-xl p-6 shadow-2xl space-y-4 relative text-left">
            <button
              onClick={() => setIsPaytableOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl btn-brass-sm text-[#FFD77A]"
            >
              ✕
            </button>
            <h3 className="text-lg font-black font-mono text-gold-metallic">WESTERN SLOT PAYTABLE</h3>
            <p className="text-xs text-[#D8C59A] font-mono">
              Winning paylines pay out proportional to bet multipliers when 5 matching symbols align.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto pr-1">
              {WESTERN_SYMBOL_KEYS.map((key) => {
                const sym = WESTERN_SYMBOLS[key];
                return (
                  <div key={key} className="display-panel-inset p-3 rounded-2xl border border-[#C58A20]/40 flex flex-col items-center text-center space-y-1">
                    <div className="w-12 h-12 rounded-xl bg-[#050505] p-1 flex items-center justify-center border border-[#C58A20]/60">
                      {renderWesternIcon(key, 'w-8 h-8')}
                    </div>
                    <span className="text-xs font-black text-[#FFF2CC] font-mono">{sym.name}</span>
                    <span className="text-xs font-black text-[#FFD77A] font-mono">{sym.multiplier}x Bet</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* HISTORY MODAL */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none">
          <div className="saloon-wood-panel border border-[#C58A20] rounded-3xl w-full max-w-lg p-6 shadow-2xl space-y-4 relative text-left">
            <button
              onClick={() => setIsHistoryOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl btn-brass-sm text-[#FFD77A]"
            >
              ✕
            </button>
            <h3 className="text-lg font-black font-mono text-gold-metallic">SLOT GAME HISTORY</h3>
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {history.length === 0 ? (
                <p className="text-xs text-[#D8C59A] font-mono py-4 text-center">No slot spins recorded yet.</p>
              ) : (
                history.map((item) => (
                  <div key={item.id} className="display-panel-inset p-3 rounded-2xl border border-[#C58A20]/40 flex items-center justify-between text-xs font-mono">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-black ${item.isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {item.isWin ? 'WIN' : 'LOSS'}
                        </span>
                        <span className="text-[#D8C59A]">Bet: {item.betAmount.toLocaleString()} Coins</span>
                      </div>
                      <span className="text-[10px] text-[#D8C59A]/60">{item.timestamp}</span>
                    </div>

                    <span className={`font-black ${item.isWin ? 'text-[#FFD77A]' : 'text-[#D8C59A]/50'}`}>
                      {item.isWin ? `+${item.winAmount.toLocaleString()} Coins (${item.multiplier}x)` : '0 Coins'}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
