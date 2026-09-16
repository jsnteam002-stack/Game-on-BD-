import React from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { Coins, PlusCircle, History, ShieldAlert } from 'lucide-react';

export const WalletView: React.FC = () => {
  const user = store.getUser();
  const txs = store.getCoinHistory();

  const handleFreeRefill = () => {
    soundManager.playWinChime();
    store.adminAdjustUserCoins(user.id, 1000, 'Free Virtual Faucet Refill');
    toast.show('FREE REFILL!', '+1,000 Virtual Coins added to your account!', 'success');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in select-none font-mono text-left pb-16">
      
      {/* Balance Card */}
      <div className="saloon-wood-panel p-6 sm:p-8 rounded-3xl border border-[#C58A20] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-black text-[#FFD77A] uppercase tracking-widest block">
            VIRTUAL COIN WALLET
          </span>
          <span className="text-3xl sm:text-5xl font-black text-gold-metallic tracking-wider block mt-1">
            {user.virtualCoins.toLocaleString()} COINS
          </span>
          <span className="text-xs text-[#D8C59A] block mt-1">
            100% Free-to-play entertainment currency
          </span>
        </div>

        <button
          onClick={handleFreeRefill}
          className="btn-gold-3d px-6 py-4 rounded-2xl text-xs font-black text-[#120B07] tracking-wider uppercase flex items-center gap-2 shrink-0"
        >
          <PlusCircle className="w-5 h-5" />
          <span>FREE REFILL (+1,000)</span>
        </button>
      </div>

      {/* Transaction History Log */}
      <div className="saloon-wood-panel p-5 rounded-3xl border border-[#C58A20]/60 space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-[#C58A20]/30">
          <History className="w-4 h-4 text-[#FFD77A]" />
          <h3 className="text-xs font-black text-[#FFF2CC] uppercase">
            VIRTUAL COIN TRANSACTIONS
          </h3>
        </div>

        <div className="space-y-2 max-h-80 overflow-y-auto pr-1 text-xs">
          {txs.map((tx) => (
            <div
              key={tx.id}
              className="bg-[#050505] p-3 rounded-2xl border border-[#C58A20]/20 flex items-center justify-between"
            >
              <div>
                <span className="font-bold text-[#FFF2CC] block">{tx.description}</span>
                <span className="text-[10px] text-[#D8C59A]/60 block">{tx.timestamp}</span>
              </div>
              <span
                className={`font-black text-sm ${
                  tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {tx.amount > 0 ? `+${tx.amount.toLocaleString()}` : tx.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Disclaimer */}
      <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 text-center text-xs text-[#D8C59A] space-y-1">
        <div className="flex items-center justify-center gap-1.5 text-[#FFD77A] font-bold">
          <ShieldAlert className="w-4 h-4" />
          <span>NO REAL MONEY DISCLAIMER</span>
        </div>
        <p>
          Virtual coins are strictly digital game points with zero real-world monetary value.
        </p>
      </div>

    </div>
  );
};
