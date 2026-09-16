import React, { useState } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import {
  ShieldCheck,
  Users,
  Coins,
  Gamepad2,
  Sliders,
  FileText,
  UserCheck,
  UserX,
  PlusCircle,
  MinusCircle,
  AlertTriangle,
  Search,
  CheckCircle2,
  Lock
} from 'lucide-react';

export const AdminView: React.FC = () => {
  const currentUser = store.getUser();
  const allUsers = store.getAllUsers();
  const adminConfig = store.getAdminConfig();
  const auditLogs = store.getAuditLogs();

  const [searchTerm, setSearchTerm] = useState('');
  const [winProbInput, setWinProbInput] = useState(adminConfig.winProbabilityOverride || 0.15);
  const [minBetInput, setMinBetInput] = useState(adminConfig.minBetCoins);
  const [maxBetInput, setMaxBetInput] = useState(adminConfig.maxBetCoins);

  // User Adjustment Form state
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [adjustAmount, setAdjustAmount] = useState<number>(1000);
  const [adjustReason, setAdjustReason] = useState<string>('Daily VIP Reward Adjustment');

  // RBAC Access Check
  if (currentUser.role !== 'admin') {
    return (
      <div className="w-full max-w-lg mx-auto px-4 py-12 text-center select-none animate-fade-in space-y-4">
        <div className="saloon-wood-panel p-8 rounded-3xl border border-[#8B1717] shadow-2xl space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#8B1717]/30 border border-[#8B1717] flex items-center justify-center mx-auto text-rose-400">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-[#FFF2CC] font-mono uppercase">ACCESS DENIED</h2>
          <p className="text-xs text-[#D8C59A] font-mono leading-relaxed">
            You are currently logged in as a standard user (<span className="text-[#FFD77A] font-bold">{currentUser.username}</span>). Only verified Administrator accounts with active role claims can access `/admin`.
          </p>
          <button
            onClick={() => {
              soundManager.playClick();
              store.loginAsDemoAdmin();
            }}
            className="w-full btn-gold-3d py-3 rounded-xl text-xs font-black font-mono uppercase text-[#120B07] shadow-lg"
          >
            LOG IN AS DEMO VERIFIED ADMIN
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = allUsers.filter(
    (u) =>
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUpdateRules = (e: React.FormEvent) => {
    e.preventDefault();
    soundManager.playClick();
    store.adminUpdateGameRules(winProbInput, minBetInput, maxBetInput);
    toast.show('Rules Updated', `Slot win probability updated to ${(winProbInput * 100).toFixed(0)}%!`, 'success');
  };

  const handleAdjustUserCoins = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
      toast.show('Select User', 'Please choose a target user account first.', 'error');
      return;
    }

    soundManager.playWinChime();
    const success = store.adminAdjustUserCoins(selectedUserId, adjustAmount, adjustReason);
    if (success) {
      toast.show('Balance Adjusted', `Coins updated successfully with Audit Log.`, 'success');
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    soundManager.playClick();
    store.adminToggleUserStatus(userId);
    toast.show('Status Updated', `User active status toggled.`, 'info');
  };

  const totalUsersCount = allUsers.length;
  const activeUsersCount = allUsers.filter((u) => u.isActive).length;
  const totalCoinsSystem = allUsers.reduce((acc, u) => acc + u.virtualCoins, 0);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 py-6 space-y-6 animate-fade-in text-left select-none font-mono">
      
      {/* Admin Dashboard Header */}
      <div className="saloon-wood-panel p-6 rounded-3xl border border-[#C58A20] shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#8B1717] border border-[#FFD77A] flex items-center justify-center text-[#FFD77A] shadow-lg">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-gold-metallic uppercase tracking-wider">
                ADMIN BACK-OFFICE DASHBOARD
              </h1>
              <span className="bg-[#8B1717] text-[#FFF2CC] text-[9px] font-black px-2 py-0.5 rounded border border-[#FFD77A]">
                VERIFIED ADMIN
              </span>
            </div>
            <p className="text-xs text-[#D8C59A] mt-0.5">
              Role-Based Access Control • User Auditing • Game Odds & Rules Engine
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            soundManager.playClick();
            store.loginAsDemoUser();
          }}
          className="btn-brass-sm px-4 py-2 rounded-xl text-xs font-black uppercase text-[#FFF2CC] flex items-center gap-1.5"
        >
          <span>EXIT ADMIN MODE</span>
        </button>
      </div>

      {/* MODULE 1: KPI OVERVIEW CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40">
          <div className="flex items-center justify-between text-[#D8C59A] mb-1">
            <span className="text-[10px] font-black uppercase">TOTAL USERS</span>
            <Users className="w-4 h-4 text-[#FFD77A]" />
          </div>
          <span className="text-xl font-black text-[#FFF2CC]">{totalUsersCount}</span>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40">
          <div className="flex items-center justify-between text-[#D8C59A] mb-1">
            <span className="text-[10px] font-black uppercase">ACTIVE PLAYERS</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-xl font-black text-emerald-400">{activeUsersCount}</span>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40">
          <div className="flex items-center justify-between text-[#D8C59A] mb-1">
            <span className="text-[10px] font-black uppercase">TOTAL COINS</span>
            <Coins className="w-4 h-4 text-[#FFD77A]" />
          </div>
          <span className="text-xl font-black text-[#FFD77A]">{totalCoinsSystem.toLocaleString()}</span>
        </div>

        <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40">
          <div className="flex items-center justify-between text-[#D8C59A] mb-1">
            <span className="text-[10px] font-black uppercase">SYSTEM SPINS</span>
            <Gamepad2 className="w-4 h-4 text-cyan-400" />
          </div>
          <span className="text-xl font-black text-cyan-300">{adminConfig.totalSystemGamesPlayed}</span>
        </div>

        <div className="col-span-2 md:col-span-1 display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40">
          <div className="flex items-center justify-between text-[#D8C59A] mb-1">
            <span className="text-[10px] font-black uppercase">WIN / LOSS</span>
            <Sliders className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xs font-black">
            <span className="text-emerald-400">{adminConfig.totalSystemWins} W</span> /{' '}
            <span className="text-rose-400">{adminConfig.totalSystemLosses} L</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* MODULE 2: USER MANAGEMENT & COIN ADJUSTMENTS */}
        <div className="saloon-wood-panel p-5 rounded-3xl border border-[#C58A20]/60 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#C58A20]/30 pb-2">
            <h3 className="text-xs font-black text-[#FFD77A] uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#FFD77A]" />
              <span>USER MANAGEMENT & COIN ADJUSTMENT</span>
            </h3>
            <span className="text-[10px] text-[#D8C59A]">{filteredUsers.length} FOUND</span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-[#D8C59A]/60" />
            <input
              type="text"
              placeholder="Search by ID, Username, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#050505] border border-[#C58A20]/40 rounded-xl pl-9 pr-3 py-2 text-xs text-[#FFF2CC] focus:outline-none focus:border-[#FFD77A]"
            />
          </div>

          {/* User List Table */}
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {filteredUsers.map((u) => (
              <div
                key={u.id}
                onClick={() => setSelectedUserId(u.id)}
                className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between text-xs ${
                  selectedUserId === u.id
                    ? 'bg-[#21140C] border-[#FFD77A] shadow-[0_0_10px_rgba(255,215,122,0.2)]'
                    : 'bg-[#0B0806] border-[#C58A20]/30 hover:border-[#C58A20]'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#FFF2CC]">{u.username}</span>
                    <span className="text-[9px] text-[#D8C59A] bg-[#18100B] px-1.5 py-0.2 rounded border border-[#C58A20]/30">
                      ID: {u.id}
                    </span>
                    <span className={`text-[8px] font-black px-1.5 py-0.2 rounded ${
                      u.role === 'admin' ? 'bg-[#8B1717] text-[#FFF2CC]' : 'bg-[#18100B] text-[#D8C59A]'
                    }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#D8C59A]/80 mt-0.5">
                    Coins: <span className="text-[#FFD77A] font-bold">{u.virtualCoins.toLocaleString()}</span> • Status:{' '}
                    <span className={u.isActive ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {u.isActive ? 'ACTIVE' : 'BLOCKED'}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleUserStatus(u.id);
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black uppercase flex items-center gap-1 transition ${
                    u.isActive
                      ? 'bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900'
                      : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900'
                  }`}
                >
                  {u.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                  <span>{u.isActive ? 'BLOCK' : 'ACTIVATE'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Coin Adjustment Form */}
          <form onSubmit={handleAdjustUserCoins} className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 space-y-3">
            <span className="text-[10px] font-black text-[#FFD77A] uppercase tracking-wider block">
              ADJUST USER COIN BALANCE (WITH AUDIT LOG)
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-[#D8C59A] block mb-1">AMOUNT (+ OR -)</label>
                <input
                  type="number"
                  step="500"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(parseInt(e.target.value) || 0)}
                  className="w-full bg-[#050505] border border-[#C58A20]/40 rounded-xl px-3 py-1.5 text-[#FFD77A] font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-[#D8C59A] block mb-1">AUDIT REASON</label>
                <input
                  type="text"
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  className="w-full bg-[#050505] border border-[#C58A20]/40 rounded-xl px-3 py-1.5 text-[#FFF2CC]"
                  placeholder="Reason..."
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={!selectedUserId}
              className="w-full btn-gold-3d py-2 rounded-xl text-xs font-black uppercase text-[#120B07] disabled:opacity-50"
            >
              APPLY COIN ADJUSTMENT & LOG AUDIT
            </button>
          </form>
        </div>

        {/* MODULE 3: GAME CONTROL & STATISTICS */}
        <div className="saloon-wood-panel p-5 rounded-3xl border border-[#C58A20]/60 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#C58A20]/30 pb-2">
            <h3 className="text-xs font-black text-[#FFD77A] uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-[#FFD77A]" />
              <span>WESTERN SLOT ENGINE & GAME RULES</span>
            </h3>
          </div>

          <form onSubmit={handleUpdateRules} className="space-y-4">
            <div className="display-panel-inset p-4 rounded-2xl border border-[#C58A20]/40 space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[#D8C59A]">SLOT WIN PROBABILITY:</span>
                <span className="text-cyan-300">
                  {(winProbInput * 100).toFixed(0)}% WIN / {((1 - winProbInput) * 100).toFixed(0)}% HOUSE
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.50"
                step="0.01"
                value={winProbInput}
                onChange={(e) => setWinProbInput(parseFloat(e.target.value))}
                className="w-full accent-[#FFD77A] cursor-pointer"
              />
              <p className="text-[10px] text-[#D8C59A]/70">
                Default: 15% Win Rate. This controls the mathematical probability threshold for slot reel payouts.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="display-panel-inset p-3 rounded-2xl border border-[#C58A20]/40">
                <label className="text-[10px] text-[#D8C59A] block mb-1">MIN BET COINS</label>
                <input
                  type="number"
                  value={minBetInput}
                  onChange={(e) => setMinBetInput(parseInt(e.target.value) || 10)}
                  className="w-full bg-[#050505] border border-[#C58A20]/40 rounded-xl px-3 py-1.5 text-[#FFF2CC] font-bold"
                />
              </div>

              <div className="display-panel-inset p-3 rounded-2xl border border-[#C58A20]/40">
                <label className="text-[10px] text-[#D8C59A] block mb-1">MAX BET COINS</label>
                <input
                  type="number"
                  value={maxBetInput}
                  onChange={(e) => setMaxBetInput(parseInt(e.target.value) || 50000)}
                  className="w-full bg-[#050505] border border-[#C58A20]/40 rounded-xl px-3 py-1.5 text-[#FFF2CC] font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-gold-3d py-2.5 rounded-xl text-xs font-black uppercase text-[#120B07]"
            >
              UPDATE GAME CONFIGURATION
            </button>
          </form>
        </div>

      </div>

      {/* MODULE 4: READ-ONLY AUDIT LOG TABLE */}
      <div className="saloon-wood-panel p-5 rounded-3xl border border-[#C58A20]/60 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-[#C58A20]/30 pb-2">
          <h3 className="text-xs font-black text-[#FFD77A] uppercase tracking-wider flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-[#FFD77A]" />
            <span>ADMINISTRATIVE AUDIT LOG TRAIL</span>
          </h3>
          <span className="text-[10px] text-[#D8C59A]">{auditLogs.length} LOG RECORDS</span>
        </div>

        {auditLogs.length === 0 ? (
          <p className="text-xs text-[#D8C59A]/60 py-4 text-center">No audit records found.</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="display-panel-inset p-3 rounded-2xl border border-[#C58A20]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-[#FFD77A]">{log.action}</span>
                    <span className="text-[10px] text-[#D8C59A]">By Admin: {log.adminUsername}</span>
                    <span className="text-[10px] text-[#D8C59A]/60">{log.timestamp}</span>
                  </div>
                  <div className="text-[11px] text-[#FFF2CC] mt-0.5">
                    Target: <span className="font-bold">{log.targetUsername}</span> ({log.targetUserId}) • Reason:{' '}
                    <span className="text-[#D8C59A] font-italic">{log.reason}</span>
                  </div>
                </div>

                {log.amount !== 0 && (
                  <span className={`font-black ${log.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {log.amount > 0 ? `+${log.amount.toLocaleString()}` : log.amount.toLocaleString()} COINS
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
