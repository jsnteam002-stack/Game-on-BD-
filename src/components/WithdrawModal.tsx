import React from 'react';
import { store } from '../store/state';
import { ShieldCheck, Info } from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const user = store.getUser();

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
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gold-metallic uppercase">VIRTUAL CURRENCY NOTICE</h3>
            <p className="text-[10px] text-[#D8C59A]">Free-to-Play Platform Disclaimer</p>
          </div>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 space-y-2 text-xs text-[#D8C59A]">
          <div className="flex items-center justify-between text-[#FFF2CC] font-bold pb-2 border-b border-[#C58A20]/30">
            <span>YOUR BALANCE:</span>
            <span className="text-[#FFD77A] font-black">{user.virtualCoins.toLocaleString()} COINS</span>
          </div>
          <p className="text-[11px] leading-relaxed pt-1">
            GAME ON BD operates strictly as a Free-to-Play social casino. Virtual Coins are entertainment tokens with zero real-world monetary value and cannot be redeemed for real currency, cashouts, or physical prizes.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full btn-gold-3d py-3 rounded-2xl font-black text-xs text-[#120B07] uppercase"
        >
          UNDERSTOOD & CONTINUE
        </button>
      </div>
    </div>
  );
};
