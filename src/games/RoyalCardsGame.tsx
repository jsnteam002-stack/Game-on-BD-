import React, { useState } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { Crown, ArrowLeft } from 'lucide-react';

const CARDS = [
  { rank: '2', val: 2 }, { rank: '3', val: 3 }, { rank: '4', val: 4 },
  { rank: '5', val: 5 }, { rank: '6', val: 6 }, { rank: '7', val: 7 },
  { rank: '8', val: 8 }, { rank: '9', val: 9 }, { rank: '10', val: 10 },
  { rank: 'J', val: 11 }, { rank: 'Q', val: 12 }, { rank: 'K', val: 13 }, { rank: 'A', val: 14 }
];

const SUITS = ['♠', '♥', '♦', '♣'];

export const RoyalCardsGame: React.FC = () => {
  const user = store.getUser();
  const adminConfig = store.getAdminConfig();
  const [currentCard, setCurrentCard] = useState({ rank: 'K', val: 13, suit: '♠', color: 'text-[#FFF2CC]' });
  const [betAmount, setBetAmount] = useState<number>(50);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const getRandomCard = () => {
    const card = CARDS[Math.floor(Math.random() * CARDS.length)];
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)];
    const color = suit === '♥' || suit === '♦' ? 'text-rose-400' : 'text-[#FFF2CC]';
    return { ...card, suit, color };
  };

  const handleGuess = (guess: 'HIGHER' | 'LOWER') => {
    if (isPlaying || user.virtualCoins < betAmount) {
      if (user.virtualCoins < betAmount) {
        toast.show('Insufficient Balance', 'Claim your free refill from top bar!', 'error');
      }
      return;
    }

    const deducted = store.deductBetCoins(betAmount);
    if (!deducted) return;

    setIsPlaying(true);
    soundManager.playClick();

    const isWin = Math.random() < adminConfig.winProbabilityOverride;

    setTimeout(() => {
      soundManager.playReelStop();
      const drawn = getRandomCard();

      if (isWin) {
        const winVal = Math.floor(betAmount * 2.2);
        soundManager.playWinChime();
        store.recordGameResult(true, betAmount, winVal, 'Royal Cards', 2.2);
        toast.show('ROYAL CARD WIN!', `Drawn ${drawn.rank}${drawn.suit}! +${winVal.toLocaleString()} Virtual Coins`, 'success');
      } else {
        store.recordGameResult(false, betAmount, 0, 'Royal Cards', 0);
        toast.show('Lost Round', `Drawn ${drawn.rank}${drawn.suit}. Try again!`, 'info');
      }

      setCurrentCard(drawn);
      setIsPlaying(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-2 sm:px-4 py-4 space-y-4 animate-fade-in text-center select-none font-mono">
      <div className="saloon-wood-panel p-3.5 rounded-2xl border border-[#C58A20] flex items-center justify-between">
        <button
          onClick={() => store.setView('home')}
          className="btn-brass-sm px-3 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1 active:scale-95 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Lobby</span>
        </button>

        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-purple-400" />
          <h2 className="text-base font-black text-gold-metallic tracking-wider">
            ROYAL CARDS HI-LO
          </h2>
        </div>

        <span className="text-xs font-black text-[#FFD77A]">
          BAL: {user.virtualCoins.toLocaleString()}
        </span>
      </div>

      <div className="saloon-wood-panel p-8 rounded-3xl border border-[#C58A20] shadow-2xl flex flex-col items-center justify-center space-y-4">
        <div className="w-32 h-48 rounded-2xl bg-[#050505] border-2 border-[#FFD77A] p-3 flex flex-col justify-between shadow-2xl">
          <div className="text-left font-black text-lg">
            <span className={currentCard.color}>{currentCard.rank}</span>
            <span className={currentCard.color}>{currentCard.suit}</span>
          </div>
          <div className={`text-4xl text-center ${currentCard.color}`}>{currentCard.suit}</div>
          <div className="text-right font-black text-lg">
            <span className={currentCard.color}>{currentCard.rank}</span>
            <span className={currentCard.color}>{currentCard.suit}</span>
          </div>
        </div>

        <p className="text-xs text-[#D8C59A]">
          Will the next card be HIGHER or LOWER than {currentCard.rank}?
        </p>
      </div>

      <div className="saloon-wood-panel p-5 rounded-3xl border border-[#C58A20]/60 space-y-4">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => handleGuess('HIGHER')}
            disabled={isPlaying || user.virtualCoins < betAmount}
            className="btn-gold-3d flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-[#120B07]"
          >
            HIGHER (2.2X)
          </button>
          <button
            onClick={() => handleGuess('LOWER')}
            disabled={isPlaying || user.virtualCoins < betAmount}
            className="btn-brass-sm flex-1 py-4 rounded-2xl font-black text-sm uppercase tracking-wider text-[#D8C59A]"
          >
            LOWER (2.2X)
          </button>
        </div>
      </div>
    </div>
  );
};
