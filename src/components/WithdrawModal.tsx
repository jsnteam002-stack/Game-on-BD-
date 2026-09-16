import React, { useState } from 'react';
import { store } from '../store/state';
import { EWalletProvider } from '../types';
import { soundManager } from '../utils/sound';
import { toast } from './ToastContainer';
import {
  Wallet,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Zap,
  PlusCircle,
} from 'lucide-react';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_WITHDRAW_AMOUNTS = [200, 500, 1000, 2000, 5000, 10000];

export const WithdrawModal: React.FC<WithdrawModalProps> = ({ isOpen, onClose }) => {
  const user = store.getUser();
  const boundWallets = store.getBoundWallets();

  const [provider, setProvider] = useState<EWalletProvider>('bKash');
  const [amount, setAmount] = useState<number>(500);
  const [customAmountStr, setCustomAmountStr] = useState<string>('500');
  const [accountNumber, setAccountNumber] = useState<string>(
    boundWallets.find((w) => w.provider === 'bKash')?.accountNumber || '01798123456'
  );
  const [accountType, setAccountType] = useState<'Personal' | 'Agent'>('Personal');
  const [showBindNew, setShowBindNew] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSelectProvider = (prov: EWalletProvider) => {
    soundManager.playClick();
    setProvider(prov);
    const existing = boundWallets.find((w) => w.provider === prov);
    if (existing) {
      setAccountNumber(existing.accountNumber);
      setAccountType(existing.accountType);
    }
    setErrorMsg(null);
  };

  const handleSelectPreset = (val: number) => {
    soundManager.playClick();
    const clamped = Math.min(val, user.virtualCoins);
    setAmount(clamped);
    setCustomAmountStr(clamped.toString());
    setErrorMsg(null);
  };

  const handleSelectAll = () => {
    soundManager.playClick();
    setAmount(user.virtualCoins);
    setCustomAmountStr(user.virtualCoins.toString());
    setErrorMsg(null);
  };

  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmountStr(val);
    const num = parseInt(val, 10) || 0;
    setAmount(num);
    setErrorMsg(null);
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // 1. Min/Max Validation
    if (amount < 200) {
      setErrorMsg('Minimum withdrawal amount is ৳200.');
      return;
    }
    if (amount > user.virtualCoins) {
      setErrorMsg('Insufficient account balance.');
      return;
    }

    // 2. Phone format validation
    const cleanPhone = accountNumber.trim().replace(/\D/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setErrorMsg('Please enter a valid 11-digit Bangladeshi mobile number (013 - 019).');
      return;
    }

    setIsProcessing(true);
    soundManager.playClick();

    setTimeout(() => {
      setIsProcessing(false);
      const res = store.submitWithdraw(provider, amount, cleanPhone, accountType);
      if (res.success) {
        soundManager.playCash();
        toast.show('Withdrawal Submitted!', `৳${amount.toLocaleString()} dispatched to ${provider} (${cleanPhone}).`, 'success');
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }, 850);
  };

  const remainingBalance = Math.max(0, user.virtualCoins - amount);

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
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981] to-[#047857] flex items-center justify-center text-white font-black shadow-lg">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-wider">
                WITHDRAW CASH OUT
              </h3>
              <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 text-[9px] font-black px-2 py-0.5 rounded-full">
                FAST CASHOUT
              </span>
            </div>
            <p className="text-xs text-[#E5B94F]">
              Available Balance: <span className="font-black text-white">৳ {user.virtualCoins.toLocaleString()}</span>
            </p>
          </div>
        </div>

        {/* E-Wallet Channel Selector */}
        <div className="space-y-1.5 pt-1">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>SELECT WITHDRAWAL WALLET:</span>
            <span className="text-[10px] text-[#10B981]">0% CASHOUT FEE</span>
          </label>
          <div className="grid grid-cols-2 gap-3">
            
            {/* bKash */}
            <button
              type="button"
              onClick={() => handleSelectProvider('bKash')}
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
                INSTANT
              </span>
            </button>

            {/* Nagad */}
            <button
              type="button"
              onClick={() => handleSelectProvider('Nagad')}
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
                INSTANT
              </span>
            </button>

          </div>
        </div>

        {/* Preset Amount Selector Chips */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>QUICK CASHOUT PRESETS:</span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-[10px] text-[#FFD700] hover:underline font-bold"
            >
              MAX (৳ {user.virtualCoins.toLocaleString()})
            </button>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {PRESET_WITHDRAW_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleSelectPreset(amt)}
                className={`py-2 px-1 rounded-xl text-xs font-black transition active:scale-95 border ${
                  amount === amt
                    ? 'btn-emerald-glossy-3d border-[#10B981]'
                    : 'bg-[#041714] text-slate-200 border-slate-700 hover:border-[#10B981]'
                }`}
              >
                ৳ {amt.toLocaleString()}
              </button>
            ))}
            <button
              type="button"
              onClick={handleSelectAll}
              className={`py-2 px-1 rounded-xl text-xs font-black transition active:scale-95 border ${
                amount === user.virtualCoins && user.virtualCoins > 0
                  ? 'btn-emerald-glossy-3d border-[#10B981]'
                  : 'bg-[#041714] text-[#FFD700] border-slate-700 hover:border-[#E5B94F]'
              }`}
            >
              ALL IN
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <form onSubmit={handleWithdrawSubmit} className="space-y-3">
          
          {/* Custom Amount Input */}
          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-300">
              WITHDRAWAL AMOUNT (MIN ৳200):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base font-black text-[#10B981]">
                ৳
              </span>
              <input
                type="text"
                value={customAmountStr}
                onChange={handleAmountInputChange}
                className="w-full bg-[#041714] border border-[#10B981]/50 focus:border-[#10B981] rounded-xl py-2.5 pl-9 pr-3 text-white font-black text-sm focus:outline-none"
                placeholder="Enter withdrawal amount"
              />
            </div>
          </div>

          {/* E-Wallet Number & Account Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                {provider.toUpperCase()} ACCOUNT NUMBER:
              </label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                maxLength={11}
                className="w-full bg-[#041714] border border-slate-700 focus:border-[#E5B94F] rounded-xl py-2.5 px-3 text-white font-mono text-xs focus:outline-none"
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-300">
                ACCOUNT TYPE:
              </label>
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <button
                  type="button"
                  onClick={() => setAccountType('Personal')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    accountType === 'Personal'
                      ? 'bg-[#10B981]/20 border-[#10B981] text-white'
                      : 'bg-[#041714] border-slate-700 text-slate-400'
                  }`}
                >
                  Personal
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('Agent')}
                  className={`py-2 rounded-xl text-xs font-bold border transition ${
                    accountType === 'Agent'
                      ? 'bg-[#10B981]/20 border-[#10B981] text-white'
                      : 'bg-[#041714] border-slate-700 text-slate-400'
                  }`}
                >
                  Agent
                </button>
              </div>
            </div>
          </div>

          {/* Calculation Summary */}
          <div className="bg-[#041714] p-3 rounded-2xl border border-slate-700 space-y-1 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Withdrawal Amount:</span>
              <span className="text-white font-bold">৳ {amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Handling & Gateway Fee:</span>
              <span className="text-[#10B981] font-bold">৳ 0.00 (FREE)</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-white font-black text-sm">
              <span className="text-slate-300">REMAINING BALANCE:</span>
              <span className="text-[#FFD700]">৳ {remainingBalance.toLocaleString()}</span>
            </div>
          </div>

          {/* Error Message */}
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
            className="w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition active:scale-95 shadow-xl btn-emerald-glossy-3d"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                COMMUNICATING WITH {provider.toUpperCase()} GATEWAY...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                REQUEST CASHOUT (৳ {amount.toLocaleString()})
              </span>
            )}
          </button>

        </form>

      </div>
    </div>
  );
};
