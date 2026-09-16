import React, { useState } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { Users, Copy, Check, Gift, Share2, Sparkles } from 'lucide-react';

export const ReferView: React.FC = () => {
  const user = store.getUser();
  const [copied, setCopied] = useState(false);

  const referralCode = user.id;
  const refLink = `https://gameonbd.com/join?ref=${referralCode}`;

  const handleCopyLink = () => {
    soundManager.playClick();
    navigator.clipboard.writeText(refLink);
    setCopied(true);
    toast.show('LINK COPIED!', 'Referral link copied to clipboard.', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClaimBonus = () => {
    soundManager.playWinChime();
    store.adminAdjustUserCoins(user.id, 5000, 'Referral Reward Bonus');
    toast.show('BONUS CLAIMED!', '+5,000 Free Virtual Bonus Coins credited!', 'success');
  };

  return (
    <div className="space-y-6 px-3 sm:px-6 py-6 pb-16 animate-fade-in select-none text-left font-mono">
      <div className="saloon-wood-panel p-6 rounded-3xl border border-[#C58A20] shadow-2xl space-y-4">
        <div className="inline-flex items-center gap-2 bg-[#8B1717] border border-[#FFD77A] px-3 py-1 rounded-full text-[#FFF2CC] text-xs font-bold uppercase">
          <Gift className="w-3.5 h-3.5" />
          <span>EARN 5,000 VIRTUAL COINS PER FRIEND</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-gold-metallic uppercase tracking-wider">
          REFER FRIENDS & EARN FREE COINS
        </h1>

        <p className="text-xs text-[#D8C59A]">
          Invite friends to play Western Slots and Casino games on GAME ON BD. Both you and your friend receive 5,000 Free Virtual Coins upon joining!
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="w-full flex-1 bg-[#050505] border border-[#C58A20]/40 rounded-2xl px-4 py-3 text-xs text-[#FFD77A] font-bold tracking-wide">
            {refLink}
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full sm:w-auto btn-gold-3d px-6 py-3 rounded-2xl text-xs font-black text-[#120B07] uppercase flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'COPIED!' : 'COPY LINK'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
