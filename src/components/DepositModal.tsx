import React, { useState } from 'react';
import { store } from '../store/state';
import { EWalletProvider } from '../types';
import { soundManager } from '../utils/sound';
import { toast } from './ToastContainer';
import {
  Coins,
  Copy,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AMOUNTS = [100, 200, 500, 1000, 2000, 5000, 10000];

export const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose }) => {
  const user = store.getUser();
  const [provider, setProvider] = useState<EWalletProvider>('bKash');
  const [amount, setAmount] = useState<number>(500);
  const [customAmountStr, setCustomAmountStr] = useState<string>('500');
  const [senderPhone, setSenderPhone] = useState<string>('01712345678');
  const [trxId, setTrxId] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Merchant/Agent deposit accounts
  const merchantNumbers: Record<EWalletProvider, string> = {
    bKash: '01712-345678 (Merchant)',
    Nagad: '01855-654321 (Merchant)',
    Rocket: '01911-888999-0',
    Upay: '01600-112233',
  };

  const handleCopyMerchant = () => {
    soundManager.playClick();
    const cleanNum = merchantNumbers[provider].split(' ')[0];
    navigator.clipboard.writeText(cleanNum);
    setCopied(true);
    toast.show('Number Copied!', `${provider} number copied to clipboard.`, 'info');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSelectPreset = (val: number) => {
    soundManager.playClick();
    setAmount(val);
    setCustomAmountStr(val.toString());
    setErrorMsg(null);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmountStr(val);
    const num = parseInt(val, 10) || 0;
    setAmount(num);
    setErrorMsg(null);
  };

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Amount validation
    if (!amount || amount < 100) {
      setErrorMsg('Minimum deposit amount is ৳100.');
      soundManager.playCash();
      return;
    }

    // 2. Phone validation (Bangladeshi 11 digits)
    const cleanPhone = senderPhone.trim().replace(/\D/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number (013 - 019).');
      return;
    }

    // 3. TrxID validation
    const cleanTrx = trxId.trim().toUpperCase();
    if (!cleanTrx || cleanTrx.length < 6) {
      setErrorMsg('Please enter the valid Transaction ID (TrxID) received from SMS.');
      return;
    }

    setIsProcessing(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsProcessing(false);
      const res = store.submitDeposit(provider, amount, cleanPhone, cleanTrx);
      if (res.success) {
        soundManager.playWinChime();
        toast.show('Deposit Approved!', `৳${amount.toLocaleString()} + 10% bonus credited to your balance!`, 'success');
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }, 800);
  };

  const bonusAmount = Math.round(amount * 0.1);
  const projectedBalance = user.virtualCoins + amount + bonusAmount;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-fade-in select-none font-mono">
      <div className="emerald-panel border-2 border-[#E5B94F] rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl space-y-4 relative text-left max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#041714] text-[#E5B94F] hover:text-white border border-[#E5B94F]/40 transition active:scale-95"
          title="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 pr-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#C58A20] flex items-center justify-center text-[#0B3C35] font-black shadow-lg">
            <Coins className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                DEPOSIT & ADD BALANCE
              </h3>
              <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 text-[9px] font-black px-2 py-0.5 rounded-full">
                INSTANT
              </span>
            </div>
            <p className="text-xs text-[#E5B94F]">
              Current Balance: <span className="font-black text-white">৳ {user.virtualCoins.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* E-Wallet Channel Selector */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>SELECT PAYMENT GATEWAY:</span>
            <span className="text-[10px] text-[#FFD700]">0% FEES</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            
            {/* bKash */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setProvider('bKash');
              }}
              className={`p-3 rounded-2xl border-2 transition flex items-center justify-between ${
                provider === 'bKash'
                  ? 'bg-[#E2136E]/20 border-[#E2136E] text-white shadow-[0_0_15px_rgba(226,19,110,0.3)]'
                  : 'bg-[#041714] border-slate-700/60 text-slate-400 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#E2136E] flex items-center justify-center text-white text-[10px] font-bold">
                  ৳
                </span>
                <span className="font-black text-sm tracking-wide">bKash</span>
              </div>
              <span className="text-[9px] bg-[#E2136E] text-white px-2 py-0.5 rounded font-bold">
                AUTO
              </span>
            </button>

            {/* Nagad */}
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setProvider('Nagad');
              }}
              className={`p-3 rounded-2xl border-2 transition flex items-center justify-between ${
                provider === 'Nagad'
                  ? 'bg-[#F7941D]/20 border-[#F7941D] text-white shadow-[0_0_15px_rgba(247,148,29,0.3)]'
                  : 'bg-[#041714] border-slate-700/60 text-slate-400 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-[#F7941D] flex items-center justify-center text-white text-[10px] font-bold">
                  ন
                </span>
                <span className="font-black text-sm tracking-wide">Nagad</span>
              </div>
              <span className="text-[9px] bg-[#F7941D] text-white px-2 py-0.5 rounded font-bold">
                AUTO
              </span>
            </button>

          </div>
        </div>

        {/* Official Merchant Number Copy Box */}
        <div className="emerald-inset p-3.5 rounded-2xl border border-[#E5B94F]/30 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1 text-[#FFD700] font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              OFFICIAL {provider.toUpperCase()} RECEIVER NUMBER:
            </span>
            <span className="text-[10px] text-slate-400">Cash In / Send Money</span>
          </div>

          <div className="flex items-center justify-between bg-[#041714] px-3 py-2 rounded-xl border border-slate-700">
            <span className="text-sm sm:text-base font-black text-white tracking-wider">
              {merchantNumbers[provider]}
            </span>
            <button
              type="button"
              onClick={handleCopyMerchant}
              className="flex items-center gap-1 bg-[#E5B94F] hover:bg-yellow-400 text-[#0B3C35] font-black text-xs px-3 py-1.5 rounded-lg transition active:scale-95"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copied ? 'COPIED!' : 'COPY'}</span>
            </button>
          </div>
        </div>

        {/* Preset Amount Selector Chips (100, 200, 500, 1000, 2000, 5000, 10000) */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>PRESET AMOUNTS (BDT ৳):</span>
            <span className="text-[10px] text-[#10B981] font-bold">+10% BONUS APPLIED</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleSelectPreset(amt)}
                className={`py-2 px-1 rounded-xl text-xs font-black transition active:scale-95 border ${
                  amount === amt
                    ? 'btn-gold-glossy-3d border-[#FFF5C0]'
                    : 'bg-[#041714] text-slate-200 border-slate-700 hover:border-[#E5B94F]'
                }`}
              >
                ৳ {amt.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={() => handleSelectPreset(25000)}
              className={`py-2 px-1 rounded-xl text-xs font-black transition active:scale-95 border ${
                amount === 25000
                  ? 'btn-gold-glossy-3d border-[#FFF5C0]'
                  : 'bg-[#041714] text-slate-200 border-slate-700 hover:border-[#E5B94F]'
              }`}
            >
              ৳ 25K
            </button>
          </div>
        </div>

        {/* Deposit Form */}
        <form onSubmit={handleDepositSubmit} className="space-y-3">
          
          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">
              CUSTOM DEPOSIT AMOUNT (MIN ৳100):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-[#FFD700]">
                ৳
              </span>
              <input
                type="text"
                value={customAmountStr}
                onChange={handleAmountInputChange}
                className="w-full bg-[#041714] border border-[#E5B94F]/50 focus:border-[#FFD700] rounded-xl py-2.5 pl-9 pr-3 text-white font-black text-sm focus:outline-none"
                placeholder="Enter deposit amount"
              />
            </div>
          </div>

          {/* Sender Phone & Transaction ID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                YOUR {provider.toUpperCase()} NUMBER:
              </label>
              <input
                type="text"
                value={senderPhone}
                onChange={(e) => setSenderPhone(e.target.value)}
                maxLength={11}
                className="w-full bg-[#041714] border border-slate-700 focus:border-[#E5B94F] rounded-xl py-2.5 px-3 text-white font-mono text-xs focus:outline-none"
                placeholder="017XXXXXXXX"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                TRANSACTION ID (TrxID):
              </label>
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                className="w-full bg-[#041714] border border-slate-700 focus:border-[#E5B94F] rounded-xl py-2.5 px-3 text-white font-mono text-xs focus:outline-none uppercase"
                placeholder="e.g. 9K7M2X1"
              />
            </div>

          </div>

          {/* Real-time Calculation Summary Box */}
          <div className="bg-[#041714] p-3 rounded-2xl border border-[#10B981]/40 space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Deposit Amount:</span>
              <span className="text-white font-bold">৳ {amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-[#10B981]">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Deposit Bonus (+10%):
              </span>
              <span className="font-black">+ ৳ {bonusAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-white font-black text-sm">
              <span className="text-[#FFD700]">PROJECTED NEW BALANCE:</span>
              <span className="text-[#10B981]">৳ {projectedBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Error display */}
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-950/80 border border-red-500/80 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-xl ${
              provider === 'bKash' ? 'btn-bkash-3d' : 'btn-nagad-3d'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                VERIFYING WITH {provider.toUpperCase()}...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                CONFIRM DEPOSIT OF ৳ {amount.toLocaleString()}
              </span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
