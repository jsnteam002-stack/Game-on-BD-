import React, { useState } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { Sparkles, ArrowLeft } from 'lucide-react';

const SLICES = [
  { mult: 2, label: '2X' },
  { mult: 5, label: '5X' },
  { mult: 10, label: '10X' },
  { mult: 20, label: '20X' },
  { mult: 50, label: '50X' },
  { mult: 1.5, label: '1.5X' },
  { mult: 0, label: '0X' },
  { mult: 3, label: '3X' },
];

export const LuckyWheelGame: React.FC = () => {
  const user = store.getUser();
  const adminConfig = store.getAdminConfig();
  const [rotation, setRotation] = useState<number>(0);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [betAmount, setBetAmount] = useState<number>(50);

  const handleSpin = () => {
    if (isSpinning || user.virtualCoins < betAmount) {
      if (user.virtualCoins < betAmount) {
        toast.show('Insufficient Balance', 'Refill free virtual coins from top bar!', 'error');
      }
      return;
    }

    const deducted = store.deductBetCoins(betAmount);
    if (!deducted) return;

    setIsSpinning(true);
    soundManager.playClick();

    const isWin = Math.random() < adminConfig.winProbabilityOverride;
    const winningSliceIndex = isWin ? 0 : 6;
    const sliceAngle = 360 / SLICES.length;
    const targetAngle = 360 * 6 + (360 - winningSliceIndex * sliceAngle - sliceAngle / 2);

    setRotation(rotation + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      const winner = SLICES[winningSliceIndex];

      if (winner.mult > 0) {
        const winVal = Math.floor(betAmount * winner.mult);
        soundManager.playWinChime();
        store.recordGameResult(true, betAmount, winVal, 'Fortune Wheel', winner.mult);
        toast.show('WHEEL WIN!', `Landed on ${winner.label}! +${winVal.toLocaleString()} Virtual Coins`, 'success');
      } else {
        store.recordGameResult(false, betAmount, 0, 'Fortune Wheel', 0);
        toast.show('No Win', 'Landed on 0X. Spin again!', 'info');
      }
    }, 4000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-4 animate-fade-in text-center select-none font-mono">
      <div className="saloon-wood-panel p-3.5 rounded-2xl border border-[#C58A20] flex items-center justify-between">
        <button
          onClick={() => store.setView('home')}
          className="btn-brass-sm px-3 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#FFD77A]" />
          <h2 className="text-base font-black text-gold-metallic tracking-wider">
            FORTUNE WHEEL
          </h2>
        </div>

        <span className="text-xs font-black text-[#FFD77A]">
          BAL: {user.virtualCoins.toLocaleString()}
        </span>
      </div>

      <div className="saloon-wood-panel p-6 rounded-3xl border border-[#C58A20] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 text-3xl text-[#FFD77A]">▼</div>

          <div
            className="w-full h-full rounded-full border-4 border-[#FFD77A] overflow-hidden shadow-2xl transition-transform duration-[4000ms] cubic-bezier(0.1, 0.8, 0.2, 1) bg-[#050505]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {SLICES.map((_, idx) => {
                const angle = 360 / SLICES.length;
                const startA = (idx * angle * Math.PI) / 180;
                const endA = ((idx + 1) * angle * Math.PI) / 180;
                const x1 = 50 + 50 * Math.cos(startA);
                const y1 = 50 + 50 * Math.sin(startA);
                const x2 = 50 + 50 * Math.cos(endA);
                const y2 = 50 + 50 * Math.sin(endA);
                return (
                  <path
                    key={idx}
                    d={`M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`}
                    fill={idx % 2 === 0 ? '#8B1717' : '#18100B'}
                    stroke="#C58A20"
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>
          </div>
        </div>

        <button
          onClick={handleSpin}
          disabled={isSpinning || user.virtualCoins < betAmount}
          className="btn-gold-3d px-8 py-4 rounded-2xl text-base font-black tracking-wider uppercase shadow-2xl text-[#120B07]"
        >
          {isSpinning ? 'SPINNING WHEEL...' : `SPIN WHEEL (${betAmount} COINS)`}
        </button>
      </div>
    </div>
  );
};
