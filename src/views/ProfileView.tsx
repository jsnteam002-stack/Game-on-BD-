import React, { useState } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
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
  Sparkles
} from 'lucide-react';
import { FaucetModal } from '../components/FaucetModal';

type ProfileTab = 'betting' | 'coins' | 'settings';

export const ProfileView: React.FC = () => {
  const user = store.getUser();
  const betHistory = store.getBetHistory();
  const coinHistory = store.getCoinHistory();

  const [activeTab, setActiveTab] = useState<ProfileTab>('betting');
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [faucetOpen, setFaucetOpen] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    user.username = usernameInput;
    toast.show('Profile Saved', `Username set to ${usernameInput}!`, 'success');
  };

  const handleLogout = () => {
    soundManager.playClick();
    store.logout();
    toast.show('Logged Out', 'Successfully logged out of your session.', 'info');
  };

  const totalRounds = user.totalGamesPlayed;
  const winRate = totalRounds > 0 ? ((user.totalWins / totalRounds) * 100).toFixed(1) : '0.0';

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in text-left select-none font-mono pb-16">
      
      <FaucetModal isOpen={faucetOpen} onClose={() => setFaucetOpen(false)} />

      {/* User Profile Header Card */}
      <div className="saloon-wood-panel border border-[#C58A20] p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 px-4 py-1 bg-[#8B1717] text-[#FFF2CC] text-[9px] font-mono font-black border-b border-l border-[#FFD77A] rounded-bl-xl uppercase tracking-wider">
          VERIFIED PLAYER SESSION
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative">
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#FFD77A] shadow-[0_0_20px_rgba(255,215,122,0.35)]"
            />
            <span className="absolute -bottom-2 -right-2 bg-[#8B1717] text-[#FFF2CC] font-black text-[9px] font-mono px-2 py-0.5 rounded-full border border-[#FFD77A]">
              VIP
            </span>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-[#FFF2CC] uppercase">{user.username}</h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded bg-[#8B1717] text-[#FFF2CC] border border-[#FFD77A]">
                {user.role.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-[#D8C59A]">
              Level {user.level} • {user.email} • ID: <span className="text-[#FFD77A] font-bold">{user.id}</span>
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-3 pt-1 text-xs">
              <span className="text-[#FFD77A] font-bold">Coins: {user.virtualCoins.toLocaleString()}</span>
              <span className="text-[#D8C59A]/60">•</span>
              <span className="text-purple-300 font-bold">Bonus: {user.bonusCoins.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Action Refill Button */}
        <button
          onClick={() => {
            soundManager.playClick();
            setFaucetOpen(true);
          }}
          className="btn-gold-3d px-6 py-3 rounded-2xl text-xs font-black text-[#120B07] flex items-center justify-center gap-2 shadow-lg active:scale-95 uppercase tracking-wider"
        >
          <Gift className="w-4 h-4" />
          <span>REFILL VIRTUAL COINS</span>
        </button>
      </div>

      {/* Legal Compliance Disclaimer Banner */}
      <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 flex items-center gap-3 text-xs text-[#D8C59A]">
        <AlertCircle className="w-5 h-5 text-[#FFD77A] shrink-0" />
        <div>
          <span className="font-bold text-[#FFF2CC] uppercase block">FREE-TO-PLAY VIRTUAL COIN PORTAL</span>
          <span>
            Virtual Coins are non-transferable entertainment tokens with no cash value. No real-money gambling, deposits, or cashouts take place.
          </span>
        </div>
      </div>

      {/* Account Performance Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40">
          <span className="text-[10px] font-bold text-[#D8C59A] uppercase block">TOTAL WAGERED</span>
          <span className="text-lg font-black text-[#FFD77A] block mt-1">
            {user.totalWageredCoins.toLocaleString()}
          </span>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40">
          <span className="text-[10px] font-bold text-[#D8C59A] uppercase block">TOTAL WON</span>
          <span className="text-lg font-black text-emerald-400 block mt-1">
            {user.totalWonCoins.toLocaleString()}
          </span>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40">
          <span className="text-[10px] font-bold text-[#D8C59A] uppercase block">TOTAL GAMES</span>
          <span className="text-lg font-black text-[#FFF2CC] block mt-1">
            {user.totalGamesPlayed} <span className="text-xs text-[#D8C59A]/60">ROUNDS</span>
          </span>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40">
          <span className="text-[10px] font-bold text-[#D8C59A] uppercase block">WIN RATE</span>
          <span className="text-lg font-black text-cyan-300 block mt-1">
            {winRate}%
          </span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="saloon-wood-panel border border-[#C58A20]/60 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
        
        {/* Navigation Tab Pills */}
        <div className="flex items-center gap-2 border-b border-[#C58A20]/30 pb-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('betting');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'betting'
                ? 'btn-gold-3d text-[#120B07] shadow-md'
                : 'btn-brass-sm text-[#D8C59A]'
            }`}
          >
            BETTING HISTORY ({betHistory.length})
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('coins');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'coins'
                ? 'btn-gold-3d text-[#120B07] shadow-md'
                : 'btn-brass-sm text-[#D8C59A]'
            }`}
          >
            COIN HISTORY ({coinHistory.length})
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('settings');
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'settings'
                ? 'btn-gold-3d text-[#120B07] shadow-md'
                : 'btn-brass-sm text-[#D8C59A]'
            }`}
          >
            ACCOUNT DETAILS
          </button>
        </div>

        {/* TAB 1: BETTING HISTORY TABLE */}
        {activeTab === 'betting' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#C58A20]/30 text-[#D8C59A] font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">GAME NAME</th>
                  <th className="py-2.5 px-3">BET COINS</th>
                  <th className="py-2.5 px-3">MULTIPLIER</th>
                  <th className="py-2.5 px-3">RESULT</th>
                  <th className="py-2.5 px-3 text-right">WIN COINS</th>
                  <th className="py-2.5 px-3 text-right">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C58A20]/20">
                {betHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-[#21140C]/50 transition">
                    <td className="py-3 px-3 font-bold text-[#FFF2CC]">{row.gameName}</td>
                    <td className="py-3 px-3 text-[#D8C59A]">{row.betAmount.toLocaleString()}</td>
                    <td className="py-3 px-3 font-bold text-cyan-300">{row.multiplier > 0 ? `${row.multiplier.toFixed(2)}x` : '-'}</td>
                    <td className="py-3 px-3">
                      {row.isWin ? (
                        <span className="bg-[#8B1717] text-[#FFF2CC] border border-[#FFD77A] px-2 py-0.5 rounded text-[10px] font-bold">
                          WIN
                        </span>
                      ) : (
                        <span className="bg-[#0B0806] text-[#D8C59A]/60 border border-[#C58A20]/30 px-2 py-0.5 rounded text-[10px] font-bold">
                          LOSS
                        </span>
                      )}
                    </td>
                    <td className={`py-3 px-3 text-right font-black ${row.isWin ? 'text-[#FFD77A]' : 'text-[#D8C59A]/50'}`}>
                      {row.isWin ? `+${row.winAmount.toLocaleString()}` : '0'}
                    </td>
                    <td className="py-3 px-3 text-right text-[#D8C59A]/60 text-[10px]">{row.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 2: COIN HISTORY TABLE */}
        {activeTab === 'coins' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#C58A20]/30 text-[#D8C59A] font-bold uppercase text-[10px]">
                  <th className="py-2.5 px-3">TYPE</th>
                  <th className="py-2.5 px-3">DESCRIPTION</th>
                  <th className="py-2.5 px-3">TIMESTAMP</th>
                  <th className="py-2.5 px-3 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#C58A20]/20">
                {coinHistory.map((row) => (
                  <tr key={row.id} className="hover:bg-[#21140C]/50 transition">
                    <td className="py-3 px-3 font-bold text-[#FFD77A]">{row.type}</td>
                    <td className="py-3 px-3 text-[#FFF2CC]">{row.description}</td>
                    <td className="py-3 px-3 text-[#D8C59A]/60 text-[10px]">{row.timestamp}</td>
                    <td className={`py-3 px-3 text-right font-black ${row.amount >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {row.amount >= 0 ? `+${row.amount.toLocaleString()}` : row.amount.toLocaleString()} COINS
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: ACCOUNT DETAILS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
            <h3 className="text-xs font-black text-[#FFD77A] uppercase tracking-wider flex items-center gap-1.5">
              <Edit3 className="w-4 h-4" />
              <span>PLAYER PROFILE DETAILS</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-[#D8C59A] block mb-1">PLAYER USERNAME</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  className="w-full bg-[#050505] border border-[#C58A20]/40 rounded-xl px-3.5 py-2.5 text-[#FFF2CC] font-bold focus:outline-none focus:border-[#FFD77A]"
                />
              </div>

              <div>
                <label className="text-[#D8C59A] block mb-1">REGISTERED EMAIL</label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full bg-[#050505]/50 border border-[#C58A20]/20 rounded-xl px-3.5 py-2.5 text-[#D8C59A]/50 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[#D8C59A] block mb-1">UNIQUE SYSTEM ID</label>
                <input
                  type="text"
                  value={user.id}
                  disabled
                  className="w-full bg-[#050505]/50 border border-[#C58A20]/20 rounded-xl px-3.5 py-2.5 text-[#FFD77A] font-bold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="btn-gold-3d text-[#120B07] font-black text-xs px-6 py-2.5 rounded-xl uppercase"
              >
                SAVE PROFILE
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="btn-brass-sm text-rose-400 font-black text-xs px-4 py-2.5 rounded-xl uppercase flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>LOG OUT</span>
              </button>
            </div>
          </form>
        )}

      </div>

    </div>
  );
};
