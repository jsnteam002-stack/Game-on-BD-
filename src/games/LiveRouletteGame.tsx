import React, { useState } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { CircleDot, ArrowLeft } from 'lucide-react';

interface BetOption {
  id: string;
  label: string;
  multiplier: number;
}

const BET_OPTIONS: BetOption[] = [
  { id: 'red', label: 'RED (1:1)', multiplier: 2 },
  { id: 'black', label: 'BLACK (1:1)', multiplier: 2 },
  { id: 'even', label: 'EVEN (1:1)', multiplier: 2 },
  { id: 'odd', label: 'ODD (1:1)', multiplier: 2 },
  { id: 'low', label: '1 - 18 (1:1)', multiplier: 2 },
  { id: 'high', label: '19 - 36 (1:1)', multiplier: 2 },
  { id: '1st12', label: '1st 12 (2:1)', multiplier: 3 },
  { id: '2nd12', label: '2nd 12 (2:1)', multiplier: 3 },
  { id: '3rd12', label: '3rd 12 (2:1)', multiplier: 3 },
];

export const LiveRouletteGame: React.FC = () => {
  const user = store.getUser();
  const adminConfig = store.getAdminConfig();
  const [selectedBetType, setSelectedBetType] = useState<string>('red');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [resultNumber, setResultNumber] = useState<number | null>(null);
  const [resultColor, setResultColor] = useState<'red' | 'black' | 'green'>('green');

  const RED_NUMBERS = [1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36];

  const handleSpin = () => {
    if (isSpinning || user.virtualCoins < betAmount) {
      if (user.virtualCoins < betAmount) {
        toast.show('Insufficient Coins', 'Top up free virtual coins from the header!', 'error');
      }
      return;
    }

    const deducted = store.deductBetCoins(betAmount);
    if (!deducted) {
      toast.show('Insufficient Coins', 'Could not deduct bet coins.', 'error');
      return;
    }

    setIsSpinning(true);
    soundManager.playClick();

    const extraSpins = 360 * 5;
    const randomDeg = Math.floor(Math.random() * 360);
    const newRotation = wheelRotation + extraSpins + randomDeg;
    setWheelRotation(newRotation);

    const tickInterval = setInterval(() => {
      soundManager.playReelTick();
    }, 120);

    const isWin = Math.random() < adminConfig.winProbabilityOverride;

    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);

      const num: number = isWin ? 7 : 13;
      setResultNumber(num);

      let color: 'red' | 'black' | 'green' = 'green';
      if (num !== 0) {
        color = RED_NUMBERS.includes(num) ? 'red' : 'black';
      }
      setResultColor(color);

      if (isWin) {
        const option = BET_OPTIONS.find((b) => b.id === selectedBetType);
        const mult = option ? option.multiplier : 2;
        const winVal = betAmount * mult;
        soundManager.playWinChime();
        store.recordGameResult(true, betAmount, winVal, 'European Roulette', mult);
        toast.show('ROULETTE WIN!', `Landed on ${num} (${color.toUpperCase()})! +${winVal.toLocaleString()} Virtual Coins`, 'success');
      } else {
        soundManager.playReelStop();
        store.recordGameResult(false, betAmount, 0, 'European Roulette', 0);
        toast.show('No Win', `Landed on ${num} (${color.toUpperCase()}). Try another spin!`, 'info');
      }
    }, 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 py-4 space-y-4 animate-fade-in text-center select-none font-mono">
      
      {/* Header Bar */}
      <div className="saloon-wood-panel p-3.5 rounded-2xl border border-[#C58A20] flex items-center justify-between">
        <button
          onClick={() => store.setView('home')}
          className="btn-brass-sm px-3 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1 active:scale-95 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <CircleDot className="w-5 h-5 text-[#FFD77A]" />
          <h2 className="text-base font-black text-gold-metallic tracking-wider">
            EUROPEAN ROULETTE
          </h2>
        </div>

        <span className="text-xs font-black text-[#FFD77A]">
          BAL: {user.virtualCoins.toLocaleString()}
        </span>
      </div>

      {/* Animated Wheel & Result Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        
        {/* Animated Wheel Display */}
        <div className="saloon-wood-panel p-6 rounded-3xl border border-[#C58A20] relative overflow-hidden flex flex-col items-center justify-center">
          <div
            className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-[#FFD77A] shadow-2xl relative overflow-hidden transition-transform duration-[3200ms] cubic-bezier(0.15, 0.9, 0.2, 1) flex items-center justify-center bg-[#050505]"
            style={{ transform: `rotate(${wheelRotation}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <circle cx="50" cy="50" r="48" fill="#050505" stroke="#FFD77A" strokeWidth="2" />
              {Array.from({ length: 12 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 48 * Math.cos((i * Math.PI) / 6)}
                  y2={50 + 48 * Math.sin((i * Math.PI) / 6)}
                  stroke="#C58A20"
                  strokeWidth="0.8"
                />
              ))}
            </svg>
            <div className="absolute w-12 h-12 rounded-full bg-[#8B1717] border-2 border-[#FFD77A] flex items-center justify-center font-black text-[#FFD77A] text-xs shadow-2xl">
              GOBD
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs font-bold text-[#D8C59A]">LAST NUMBER:</span>
            {resultNumber !== null ? (
              <span
                className={`text-lg font-black px-3 py-1 rounded-xl border ${
                  resultColor === 'red'
                    ? 'bg-[#8B1717] border-[#FFD77A] text-[#FFF2CC]'
                    : resultColor === 'black'
                    ? 'bg-[#050505] border-[#C58A20] text-[#FFF2CC]'
                    : 'bg-emerald-800 border-emerald-400 text-white'
                }`}
              >
                {resultNumber} ({resultColor.toUpperCase()})
              </span>
            ) : (
              <span className="text-xs text-[#D8C59A]/60">PLACE BET & SPIN</span>
            )}
          </div>
        </div>

        {/* Betting Board & Controls */}
        <div className="saloon-wood-panel p-5 rounded-3xl border border-[#C58A20]/60 space-y-4 text-left">
          <h3 className="text-xs font-black text-[#FFD77A] uppercase tracking-wider">
            1. SELECT BET CATEGORY
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {BET_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelectedBetType(opt.id)}
                disabled={isSpinning}
                className={`p-2.5 rounded-2xl border text-xs font-black transition flex flex-col items-center justify-center gap-0.5 ${
                  selectedBetType === opt.id
                    ? 'btn-gold-3d text-[#120B07] border-[#FFD77A] shadow-md scale-105'
                    : 'btn-brass-sm text-[#D8C59A]'
                }`}
              >
                <span>{opt.label}</span>
              </button>
            ))}
          </div>

          <h3 className="text-xs font-black text-[#FFD77A] uppercase tracking-wider pt-2">
            2. VIRTUAL BET COINS
          </h3>

          <div className="flex items-center gap-2 flex-wrap">
            {[20, 50, 100, 200, 500, 1000].map((amt) => (
              <button
                key={amt}
                onClick={() => setBetAmount(amt)}
                disabled={isSpinning}
                className={`px-3 py-1.5 rounded-xl text-xs font-black transition ${
                  betAmount === amt
                    ? 'btn-gold-3d text-[#120B07]'
                    : 'btn-brass-sm text-[#D8C59A]'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning || user.virtualCoins < betAmount}
            className={`w-full py-4 rounded-2xl text-base font-black uppercase tracking-wider transition shadow-xl ${
              isSpinning || user.virtualCoins < betAmount ? 'opacity-50 cursor-not-allowed bg-[#18100B]' : 'btn-gold-3d text-[#120B07]'
            }`}
          >
            {isSpinning ? 'SPINNING ROULETTE...' : `SPIN ROULETTE (${betAmount} COINS)`}
          </button>
        </div>

      </div>

    </div>
  );
};
