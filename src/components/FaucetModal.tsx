import React from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { Coins, Sparkles } from 'lucide-react';

interface FaucetModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FaucetModal: React.FC<FaucetModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleClaim = (amount: number) => {
    soundManager.playWinChime();
    store.adminAdjustUserCoins(store.getUser().id, amount, 'Daily Free Faucet Claim');
    toast.show('Free Coins Claimed!', `+${amount.toLocaleString()} Virtual Coins credited to your wallet!`, 'success');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in select-none font-mono">
      <div className="saloon-wood-panel border border-[#C58A20] rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 relative text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl btn-brass-sm text-[#FFD77A]"
        >
          ✕
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#8B1717] border border-[#FFD77A] flex items-center justify-center text-[#FFD77A]">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gold-metallic uppercase">FREE SALOON COIN FAUCET</h3>
            <p className="text-[10px] text-[#D8C59A]">100% Free Virtual Coin Top-Up</p>
          </div>
        </div>

        <div className="space-y-2 pt-2">
          {[2500, 5000, 10000].map((amt) => (
            <button
              key={amt}
              onClick={() => handleClaim(amt)}
              className="w-full btn-gold-3d py-3 rounded-2xl font-black text-xs text-[#120B07] flex items-center justify-between px-4 uppercase"
            >
              <span>CLAIM +{amt.toLocaleString()} COINS</span>
              <Sparkles className="w-4 h-4 text-[#120B07]" />
            </button>
          ))}
        </div>

        <p className="text-[10px] text-[#D8C59A]/60 text-center pt-2">
          Virtual Coins are free entertainment tokens with no cash value.
        </p>
      </div>
    </div>
  );
};
