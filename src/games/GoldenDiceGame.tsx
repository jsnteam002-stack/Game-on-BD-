import React, { useState } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { Dices, ArrowLeft } from 'lucide-react';

export const GoldenDiceGame: React.FC = () => {
  const user = store.getUser();
  const adminConfig = store.getAdminConfig();
  const [betType, setBetType] = useState<'OVER' | 'UNDER' | 'EXACT'>('OVER');
  const [betAmount, setBetAmount] = useState<number>(50);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [dice1, setDice1] = useState<number>(3);
  const [dice2, setDice2] = useState<number>(4);

  const handleRoll = () => {
    if (isRolling || user.virtualCoins < betAmount) {
      if (user.virtualCoins < betAmount) {
        toast.show('Insufficient Coins', 'Claim your free refill from the top bar!', 'error');
      }
      return;
    }

    const deducted = store.deductBetCoins(betAmount);
    if (!deducted) {
      toast.show('Insufficient Coins', 'Could not deduct bet coins.', 'error');
      return;
    }

    setIsRolling(true);
    soundManager.playClick();

    const interval = setInterval(() => {
      setDice1(Math.floor(Math.random() * 6) + 1);
      setDice2(Math.floor(Math.random() * 6) + 1);
      soundManager.playReelTick();
    }, 100);

    const isWin = Math.random() < adminConfig.winProbabilityOverride;

    setTimeout(() => {
      clearInterval(interval);
      soundManager.playReelStop();
      setIsRolling(false);

      let d1 = 3;
      let d2 = 4;
      if (isWin) {
        if (betType === 'OVER') {
          d1 = 4; d2 = 5;
        } else if (betType === 'UNDER') {
          d1 = 1; d2 = 3;
        } else {
          d1 = 3; d2 = 4;
        }
      } else {
        if (betType === 'OVER') {
          d1 = 1; d2 = 2;
        } else if (betType === 'UNDER') {
          d1 = 5; d2 = 4;
        } else {
          d1 = 2; d2 = 2;
        }
      }

      setDice1(d1);
      setDice2(d2);
      const total = d1 + d2;
      const multiplier = betType === 'EXACT' ? 5.8 : 2.3;

      if (isWin) {
        const winVal = Math.floor(betAmount * multiplier);
        soundManager.playWinChime();
        store.recordGameResult(true, betAmount, winVal, 'Golden Dice', multiplier);
        toast.show('DICE WIN!', `Total = ${total}! +${winVal.toLocaleString()} Virtual Coins`, 'success');
      } else {
        store.recordGameResult(false, betAmount, 0, 'Golden Dice', 0);
        toast.show('No Win', `Dice total = ${total}. Better luck next roll!`, 'info');
      }
    }, 1500);
  };

  const total = dice1 + dice2;

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-4 animate-fade-in text-center select-none font-mono">
      
      {/* Header */}
      <div className="saloon-wood-panel p-3.5 rounded-2xl border border-[#C58A20] flex items-center justify-between">
        <button
          onClick={() => store.setView('home')}
          className="btn-brass-sm px-3 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1 active:scale-95 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <Dices className="w-5 h-5 text-[#FFD77A]" />
          <h2 className="text-base font-black text-gold-metallic tracking-wider">
            GOLDEN DICE ROLL
          </h2>
        </div>

        <span className="text-xs font-black text-[#FFD77A]">
          BAL: {user.virtualCoins.toLocaleString()}
        </span>
      </div>

      {/* 3D Dice Display Box */}
      <div className="saloon-wood-panel p-8 rounded-3xl border border-[#C58A20] shadow-2xl flex flex-col items-center justify-center space-y-4">
        <div className="flex items-center justify-center gap-6">
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#8B1717] border-2 border-[#FFD77A] flex items-center justify-center text-3xl font-black text-[#FFF2CC] shadow-2xl ${
              isRolling ? 'animate-bounce' : ''
            }`}
          >
            {dice1}
          </div>
          <span className="text-2xl font-black text-[#FFD77A]">+</span>
          <div
            className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#8B1717] border-2 border-[#FFD77A] flex items-center justify-center text-3xl font-black text-[#FFF2CC] shadow-2xl ${
              isRolling ? 'animate-bounce' : ''
            }`}
          >
            {dice2}
          </div>
        </div>

        <div className="text-center">
          <span className="text-xs font-bold text-[#D8C59A] block">DICE TOTAL</span>
          <span className="text-3xl font-black text-[#FFD77A]">{total}</span>
        </div>
      </div>

      {/* Bet Options */}
      <div className="saloon-wood-panel p-5 rounded-3xl border border-[#C58A20]/60 space-y-4 text-left">
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'UNDER', label: 'UNDER 7 (2.3x)' },
            { id: 'EXACT', label: 'EXACT 7 (5.8x)' },
            { id: 'OVER', label: 'OVER 7 (2.3x)' },
          ].map((opt) => (
            <button
              key={opt.id}
              onClick={() => setBetType(opt.id as any)}
              disabled={isRolling}
              className={`p-3 rounded-2xl border text-xs font-black transition text-center ${
                betType === opt.id
                  ? 'btn-gold-3d text-[#120B07] border-[#FFD77A] shadow-md scale-105'
                  : 'btn-brass-sm text-[#D8C59A]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-wrap pt-2">
          {[20, 50, 100, 200, 500, 1000].map((amt) => (
            <button
              key={amt}
              onClick={() => setBetAmount(amt)}
              disabled={isRolling}
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
          onClick={handleRoll}
          disabled={isRolling || user.virtualCoins < betAmount}
          className={`w-full py-4 rounded-2xl text-base font-black uppercase tracking-wider transition shadow-xl ${
            isRolling || user.virtualCoins < betAmount ? 'opacity-50 cursor-not-allowed bg-[#18100B]' : 'btn-gold-3d text-[#120B07]'
          }`}
        >
          {isRolling ? 'ROLLING GOLDEN DICE...' : `ROLL DICE (${betAmount} COINS)`}
        </button>
      </div>

    </div>
  );
};
