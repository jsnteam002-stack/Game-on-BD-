import React, { useState } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { EWalletProvider } from '../types';
import {
  User,
  History,
  Coins,
  ShieldCheck,
  Award,
  Edit3,
  Gift,
  AlertCircle,
  LogOut,
  Sparkles,
  Wallet,
  PlusCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { FaucetModal } from '../components/FaucetModal';
import { DepositModal } from '../components/DepositModal';
import { WithdrawModal } from '../components/WithdrawModal';

type ProfileTab = 'wallets' | 'betting' | 'coins' | 'settings';

export const ProfileView: React.FC = () => {
  const user = store.getUser();
  const betHistory = store.getBetHistory();
  const coinHistory = store.getCoinHistory();
  const boundWallets = store.getBoundWallets();

  const [activeTab, setActiveTab] = useState<ProfileTab>('wallets');
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [faucetOpen, setFaucetOpen] = useState(false);
  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);

  // New Wallet Form State
  const [newProvider, setNewProvider] = useState<EWalletProvider>('bKash');
  const [newPhone, setNewPhone] = useState('');
  const [newAccountType, setNewAccountType] = useState<'Personal' | 'Agent'>('Personal');
  const [bindError, setBindError] = useState<string | null>(null);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    user.username = usernameInput;
    toast.show('Profile Saved', `Username set to ${usernameInput}!`, 'success');
  };

  const handleBindWalletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBindError(null);

    const cleanPhone = newPhone.trim().replace(/\D/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      setBindError('Please enter a valid 11-digit Bangladeshi mobile number (013 - 019).');
      return;
    }

    const res = store.bindWallet(newProvider, cleanPhone, newAccountType);
    if (res.success) {
      soundManager.playWinChime();
      toast.show('Wallet Bound!', `${newProvider} wallet ${cleanPhone} connected.`, 'success');
      setNewPhone('');
    } else {
      setBindError(res.message);
    }
  };

  const handleLogout = () => {
    soundManager.playClick();
    store.logout();
    toast.show('Logged Out', 'Successfully logged out of your session.', 'info');
  };

  const totalRounds = user.totalGamesPlayed;
  const winRate = totalRounds > 0 ? ((user.totalWins / totalRounds) * 100).toFixed(1) : '0.0';

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in text-left select-none font-mono pb-20">
      
      <FaucetModal isOpen={faucetOpen} onClose={() => setFaucetOpen(false)} />
      <DepositModal isOpen={depositOpen} onClose={() => setDepositOpen(false)} />
      <WithdrawModal isOpen={withdrawOpen} onClose={() => setWithdrawOpen(false)} />

      {/* User Profile Header Card */}
      <div className="emerald-panel border-2 border-[#E5B94F] p-5 sm:p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 px-4 py-1 bg-[#10B981] text-white text-[9px] font-mono font-black border-b border-l border-[#E5B94F] rounded-bl-xl uppercase tracking-wider">
          AUTHENTICATED PLAYER ID: {user.id}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#E5B94F] shadow-[0_0_20px_rgba(229,185,79,0.35)]"
            />
            <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-[#0B3C35] font-black text-[9px] font-mono px-2.5 py-0.5 rounded-full border border-yellow-200 shadow-md">
              VIP 3
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
                {user.username}
              </h2>
              <span className="bg-[#041714] text-[#FFD700] text-[10px] font-black px-2 py-0.5 rounded-md border border-[#E5B94F]/40">
                LEVEL {user.level}
              </span>
            </div>
            <p className="text-xs text-[#E5B94F]">
              Account Status: <span className="text-[#10B981] font-bold">Active & Verified (bKash/Nagad)</span>
            </p>
            <p className="text-[10px] text-slate-400">
              Joined Game On BD • Secured by SSL 256-Bit Encryption
            </p>
          </div>
        </div>

        {/* Action Buttons: DEPOSIT & WITHDRAW */}
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2.5 w-full md:w-auto">
          <button
            onClick={() => {
              soundManager.playClick();
              setDepositOpen(true);
            }}
            className="btn-gold-glossy-3d px-4 py-2.5 rounded-xl font-black text-xs text-[#0B3C35] uppercase flex items-center gap-1.5 shadow-lg active:scale-95 transition"
          >
            <Coins className="w-4 h-4" />
            <span>DEPOSIT FUNDS</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setWithdrawOpen(true);
            }}
            className="btn-emerald-glossy-3d px-4 py-2.5 rounded-xl font-black text-xs text-white uppercase flex items-center gap-1.5 shadow-lg active:scale-95 transition"
          >
            <Wallet className="w-4 h-4" />
            <span>WITHDRAW CASH</span>
          </button>
        </div>
      </div>

      {/* Stats Summary Bento Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
        <div className="emerald-inset p-4 rounded-2xl border border-[#E5B94F]/40">
          <span className="text-[10px] font-bold text-slate-300 uppercase block">ACTIVE BALANCE</span>
          <span className="text-lg sm:text-xl font-black text-[#FFD700] block mt-1">
            ৳ {user.virtualCoins.toLocaleString()}
          </span>
        </div>

        <div className="emerald-inset p-4 rounded-2xl border border-[#E5B94F]/40">
          <span className="text-[10px] font-bold text-slate-300 uppercase block">TOTAL WINNINGS</span>
          <span className="text-lg sm:text-xl font-black text-[#10B981] block mt-1">
            ৳ {user.totalWonCoins.toLocaleString()}
          </span>
        </div>

        <div className="emerald-inset p-4 rounded-2xl border border-[#E5B94F]/40">
          <span className="text-[10px] font-bold text-slate-300 uppercase block">ROUNDS PLAYED</span>
          <span className="text-lg sm:text-xl font-black text-white block mt-1">
            {user.totalGamesPlayed} <span className="text-xs text-slate-400">GAMES</span>
          </span>
        </div>

        <div className="emerald-inset p-4 rounded-2xl border border-[#E5B94F]/40">
          <span className="text-[10px] font-bold text-slate-300 uppercase block">WIN RATE</span>
          <span className="text-lg sm:text-xl font-black text-cyan-300 block mt-1">
            {winRate}%
          </span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="emerald-panel border border-[#E5B94F]/50 rounded-3xl p-4 sm:p-6 shadow-xl space-y-5">
        
        {/* Navigation Tab Pills */}
        <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-2 overflow-x-auto">
          
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('wallets');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'wallets'
                ? 'btn-emerald-glossy-3d border-[#10B981] text-white shadow-md'
                : 'bg-[#041714] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>BOUND E-WALLETS ({boundWallets.length})</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('betting');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              activeTab === 'betting'
                ? 'btn-gold-glossy-3d text-[#0B3C35] shadow-md'
                : 'bg-[#041714] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            BETTING HISTORY ({betHistory.length})
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('coins');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              activeTab === 'coins'
                ? 'btn-gold-glossy-3d text-[#0B3C35] shadow-md'
                : 'bg-[#041714] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            TRANSACTIONS ({coinHistory.length})
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('settings');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'btn-gold-glossy-3d text-[#0B3C35] shadow-md'
                : 'bg-[#041714] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            ACCOUNT SETTINGS
          </button>
        </div>

        {/* TAB: BOUND E-WALLETS */}
        {activeTab === 'wallets' && (
          <div className="space-y-6">
            
            {/* Bound Wallets Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">
                  CURRENTLY BOUND PAYMENT METHODS
                </h3>
                <span className="text-[10px] text-[#10B981] font-bold">
                  VERIFIED FOR 1-CLICK CASHOUT
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {boundWallets.map((wallet) => (
                  <div
                    key={wallet.id}
                    className="bg-[#041714] border border-slate-700/80 rounded-2xl p-4 flex items-center justify-between relative overflow-hidden shadow-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-white text-lg shadow-md ${
                          wallet.provider === 'bKash' ? 'bg-[#E2136E]' : 'bg-[#F7941D]'
                        }`}
                      >
                        {wallet.provider === 'bKash' ? '৳' : 'ন'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white text-sm">
                            {wallet.provider} ({wallet.accountType})
                          </span>
                          {wallet.isDefault && (
                            <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 text-[9px] font-black px-1.5 py-0.2 rounded">
                              DEFAULT
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-mono text-[#FFD700] tracking-wider block mt-0.5">
                          {wallet.accountNumber}
                        </span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">
                          Bound on {new Date(wallet.boundAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <button
                        onClick={() => {
                          soundManager.playClick();
                          setWithdrawOpen(true);
                        }}
                        className="btn-emerald-glossy-3d text-[10px] font-black px-3 py-1.5 rounded-lg text-white"
                      >
                        WITHDRAW
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bind New Wallet Form */}
            <div className="emerald-inset p-4 sm:p-5 rounded-2xl border border-[#E5B94F]/30 space-y-3">
              <div className="flex items-center gap-2 text-white font-black text-xs sm:text-sm">
                <PlusCircle className="w-4 h-4 text-[#FFD700]" />
                <span>BIND NEW LOCAL E-WALLET (bKash / Nagad)</span>
              </div>

              <form onSubmit={handleBindWalletSubmit} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  
                  {/* Provider */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      GATEWAY PROVIDER:
                    </label>
                    <select
                      value={newProvider}
                      onChange={(e) => setNewProvider(e.target.value as EWalletProvider)}
                      className="w-full bg-[#041714] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs font-mono focus:outline-none focus:border-[#FFD700]"
                    >
                      <option value="bKash">bKash (বাংলাদেশ)</option>
                      <option value="Nagad">Nagad (নগদ)</option>
                      <option value="Rocket">DBBL Rocket</option>
                    </select>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      ACCOUNT MOBILE (11 DIGITS):
                    </label>
                    <input
                      type="text"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      maxLength={11}
                      className="w-full bg-[#041714] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs font-mono focus:outline-none focus:border-[#FFD700]"
                      placeholder="017XXXXXXXX"
                    />
                  </div>

                  {/* Account Type */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-300 block mb-1">
                      ACCOUNT TYPE:
                    </label>
                    <select
                      value={newAccountType}
                      onChange={(e) => setNewAccountType(e.target.value as any)}
                      className="w-full bg-[#041714] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs font-mono focus:outline-none focus:border-[#FFD700]"
                    >
                      <option value="Personal">Personal Account</option>
                      <option value="Agent">Agent Account</option>
                    </select>
                  </div>

                </div>

                {bindError && (
                  <div className="text-red-400 text-xs flex items-center gap-1.5 pt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{bindError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn-gold-glossy-3d text-xs font-black px-4 py-2.5 rounded-xl text-[#0B3C35] flex items-center gap-1.5 shadow-md active:scale-95 transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>VERIFY & BIND WALLET</span>
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 1: BETTING HISTORY TABLE */}
        {activeTab === 'betting' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-900/60 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">GAME NAME</th>
                  <th className="py-2.5 px-3">BET COINS</th>
                  <th className="py-2.5 px-3">MULTIPLIER</th>
                  <th className="py-2.5 px-3">RESULT</th>
                  <th className="py-2.5 px-3 text-right">WIN COINS</th>
                  <th className="py-2.5 px-3 text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30">
                {betHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-[#041714]/60 transition">
                    <td className="py-3 px-3 font-bold text-white">{row.gameName}</td>
                    <td className="py-3 px-3 text-slate-300">৳ {row.betAmount.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-cyan-300">{row.multiplier > 0 ? `${row.multiplier.toFixed(2)}x` : '-'}</td>
                    <td className="py-3 px-3">
                      {row.isWin ? (
                        <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/50 px-2 py-0.5 rounded text-[10px] font-bold">
                          WIN
                        </span>
                      ) : (
                        <span className="bg-red-950/40 text-red-400 border border-red-800/40 px-2 py-0.5 rounded text-[10px] font-bold">
                          LOSS
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-black text-[#FFD700]">
                      {row.winAmount > 0 ? `+ ৳ ${row.winAmount.toLocaleString()}` : '0'}
                    </td>
                    <td className="py-3 px-3 text-right text-[10px] text-slate-400">
                      {row.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: COIN TRANSACTION HISTORY */}
        {activeTab === 'coins' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-emerald-900/60 text-slate-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">TRANSACTION TYPE</th>
                  <th className="py-2.5 px-3">DESCRIPTION</th>
                  <th className="py-2.5 px-3 text-right">AMOUNT</th>
                  <th className="py-2.5 px-3 text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/30">
                {coinHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-[#041714]/60 transition">
                    <td className="py-3 px-3 font-bold text-white">{row.type}</td>
                    <td className="py-3 px-3 text-slate-300">{row.description}</td>
                    <td
                      className={`py-3 px-3 text-right font-black ${
                        row.amount > 0 ? 'text-[#10B981]' : 'text-red-400'
                      }`}
                    >
                      {row.amount > 0 ? `+ ৳ ${row.amount.toLocaleString()}` : `৳ ${row.amount.toLocaleString()}`}
                    </td>
                    <td className="py-3 px-3 text-right text-[10px] text-slate-400">
                      {row.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: ACCOUNT SETTINGS */}
        {activeTab === 'settings' && (
          <div className="space-y-4 max-w-md">
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  UPDATE SCREEN NAME:
                </label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#041714] border border-slate-700 rounded-xl py-2 px-3 text-white text-xs font-mono focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <button
                type="submit"
                className="btn-gold-glossy-3d text-xs font-black px-4 py-2 rounded-xl text-[#0B3C35]"
              >
                SAVE CHANGES
              </button>
            </form>

            <div className="pt-4 border-t border-emerald-900/50">
              <button
                onClick={handleLogout}
                className="bg-red-950/60 hover:bg-red-900/80 text-red-200 border border-red-500/50 px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>RESET SESSION & LOGOUT</span>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
