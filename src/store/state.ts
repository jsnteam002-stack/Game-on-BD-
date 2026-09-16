import {
  ViewType,
  UserProfile,
  UserRole,
  NotificationItem,
  LeaderboardEntry,
  AdminConfig,
  AdminAuditLog,
  BetHistoryItem,
  CoinHistoryItem,
  CalculationOutcome,
  WesternSymbolId,
  WesternSymbolDef,
  BoundWallet,
  EWalletProvider,
} from '../types';

export const WESTERN_SYMBOLS: Record<WesternSymbolId, WesternSymbolDef> = {
  WILD: { id: 'WILD', name: 'Golden Wild Star', multiplier: 25, iconName: 'Sparkles', color: 'text-amber-300' },
  SHERIFF_BADGE: { id: 'SHERIFF_BADGE', name: 'Sheriff Badge', multiplier: 15, iconName: 'ShieldAlert', color: 'text-amber-400' },
  COWBOY_HAT: { id: 'COWBOY_HAT', name: 'Cowboy Hat', multiplier: 10, iconName: 'Crown', color: 'text-yellow-500' },
  MONEY_BAG: { id: 'MONEY_BAG', name: 'Gold Coin Bag', multiplier: 8, iconName: 'Briefcase', color: 'text-emerald-400' },
  HORSESHOE: { id: 'HORSESHOE', name: 'Lucky Horseshoe', multiplier: 5, iconName: 'Zap', color: 'text-cyan-400' },
  DYNAMITE: { id: 'DYNAMITE', name: 'TNT Dynamite', multiplier: 4, iconName: 'Flame', color: 'text-rose-500' },
  BULL_SKULL: { id: 'BULL_SKULL', name: 'Desert Bull Skull', multiplier: 3, iconName: 'Skull', color: 'text-orange-400' },
  WAGON: { id: 'WAGON', name: 'Saloon Wagon', multiplier: 2, iconName: 'Truck', color: 'text-slate-300' },
};

export const WESTERN_SYMBOL_KEYS: WesternSymbolId[] = [
  'WILD',
  'SHERIFF_BADGE',
  'COWBOY_HAT',
  'MONEY_BAG',
  'HORSESHOE',
  'DYNAMITE',
  'BULL_SKULL',
  'WAGON',
];

class Store {
  private user: UserProfile;
  private allUsers: UserProfile[] = [];
  private currentView: ViewType = 'home';
  private isAuthenticated: boolean = true;
  private notifications: NotificationItem[] = [];
  private coinHistory: CoinHistoryItem[] = [];
  private betHistory: BetHistoryItem[] = [];
  private auditLogs: AdminAuditLog[] = [];
  private adminConfig: AdminConfig;
  private listeners: (() => void)[] = [];

  constructor() {
    const savedUser = localStorage.getItem('gobd_user_v4');
    if (savedUser) {
      try {
        this.user = JSON.parse(savedUser);
      } catch {
        this.user = this.getDefaultUser('GOBD-8F42K1', 'SaloonGamer', 'player@gameonbd.com', 'user');
      }
    } else {
      this.user = this.getDefaultUser('GOBD-8F42K1', 'SaloonGamer', 'player@gameonbd.com', 'user');
    }

    const savedAllUsers = localStorage.getItem('gobd_all_users_v4');
    if (savedAllUsers) {
      try {
        this.allUsers = JSON.parse(savedAllUsers);
      } catch {
        this.allUsers = [this.user, this.getDefaultUser('GOBD-ADMIN1', 'SheriffAdmin', 'admin@gameonbd.com', 'admin')];
      }
    } else {
      this.allUsers = [
        this.user,
        this.getDefaultUser('GOBD-ADMIN1', 'SheriffAdmin', 'admin@gameonbd.com', 'admin'),
        this.getDefaultUser('GOBD-9K23L0', 'OutlawPete', 'pete@gameonbd.com', 'user'),
        this.getDefaultUser('GOBD-4R11M8', 'CalamityJane', 'jane@gameonbd.com', 'user'),
      ];
    }

    const savedCoins = localStorage.getItem('gobd_coin_history_v4');
    if (savedCoins) {
      try {
        this.coinHistory = JSON.parse(savedCoins);
      } catch {
        this.coinHistory = this.getDefaultCoinHistory();
      }
    } else {
      this.coinHistory = this.getDefaultCoinHistory();
    }

    const savedBets = localStorage.getItem('gobd_bet_history_v4');
    if (savedBets) {
      try {
        this.betHistory = JSON.parse(savedBets);
      } catch {
        this.betHistory = this.getDefaultBetHistory();
      }
    } else {
      this.betHistory = this.getDefaultBetHistory();
    }

    const savedAudit = localStorage.getItem('gobd_audit_logs_v4');
    if (savedAudit) {
      try {
        this.auditLogs = JSON.parse(savedAudit);
      } catch {
        this.auditLogs = this.getDefaultAuditLogs();
      }
    } else {
      this.auditLogs = this.getDefaultAuditLogs();
    }

    this.adminConfig = {
      winProbabilityOverride: 0.15, // 15% win probability engine
      minBetCoins: 50,
      maxBetCoins: 50000,
      faucetAmount: 1000,
      announcementText: '🤠 WESTERN SALOON SLOT LIVE • 100% FREE VIRTUAL COINS • DAILY REWARDS & STREAKS',
      totalSystemGamesPlayed: 1420,
      totalSystemWins: 213,
      totalSystemLosses: 1207,
      totalCoinsDistributed: 4850000,
    };

    this.notifications = [
      {
        id: '1',
        title: 'Welcome to GAME ON BD',
        message: 'Your account has been credited with 5,000 Free Virtual Coins.',
        timestamp: 'Just now',
        read: false,
        type: 'info',
      },
      {
        id: '2',
        title: 'Daily Streak Available',
        message: 'Claim your Day 3 bonus multiplier now in the Bonus tab!',
        timestamp: '15 mins ago',
        read: false,
        type: 'bonus',
      },
    ];
  }

  private getDefaultUser(id: string, username: string, email: string, role: UserRole): UserProfile {
    return {
      id,
      username,
      email,
      role,
      isActive: true,
      virtualCoins: 5000,
      bonusCoins: 1000,
      level: 12,
      xp: 2840,
      vipTier: 'Bronze Cowboy',
      avatarUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      totalGamesPlayed: 142,
      totalWins: 21,
      totalLosses: 121,
      totalWageredCoins: 24500,
      totalWonCoins: 8400,
      biggestWinCoins: 4500,
      dailyStreak: 3,
      lastDailyClaim: null,
      createdAt: '2026-01-15',
    };
  }

  private getDefaultCoinHistory(): CoinHistoryItem[] {
    return [
      {
        id: 'c_101',
        type: 'WELCOME_CREDIT',
        amount: 5000,
        description: 'Free Registration Welcome Gift (Virtual Coins)',
        timestamp: 'Today, 10:30 AM',
      },
      {
        id: 'c_102',
        type: 'DAILY_BONUS',
        amount: 1000,
        description: 'Day 3 Daily Streak Bonus Reward',
        timestamp: 'Today, 10:35 AM',
      },
    ];
  }

  private getDefaultBetHistory(): BetHistoryItem[] {
    return [
      {
        id: 'b_201',
        gameId: 'slot',
        gameName: 'Western 5x3 Slot',
        betAmount: 500,
        multiplier: 10,
        winAmount: 5000,
        isWin: true,
        timestamp: '10 mins ago',
      },
      {
        id: 'b_202',
        gameId: 'slot',
        gameName: 'Western 5x3 Slot',
        betAmount: 200,
        multiplier: 0,
        winAmount: 0,
        isWin: false,
        timestamp: '15 mins ago',
      },
      {
        id: 'b_203',
        gameId: 'crash',
        gameName: 'Aviator Crash',
        betAmount: 1000,
        multiplier: 0,
        winAmount: 0,
        isWin: false,
        timestamp: '22 mins ago',
      },
    ];
  }

  private getDefaultAuditLogs(): AdminAuditLog[] {
    return [
      {
        id: 'aud_1',
        adminId: 'GOBD-ADMIN1',
        adminUsername: 'SheriffAdmin',
        targetUserId: 'GOBD-8F42K1',
        targetUsername: 'SaloonGamer',
        amount: 1000,
        action: 'CREDIT_COINS',
        reason: 'Daily VIP Promo Adjustment',
        timestamp: 'Today, 09:00 AM',
      },
    ];
  }

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    localStorage.setItem('gobd_user_v4', JSON.stringify(this.user));
    localStorage.setItem('gobd_all_users_v4', JSON.stringify(this.allUsers));
    localStorage.setItem('gobd_coin_history_v4', JSON.stringify(this.coinHistory));
    localStorage.setItem('gobd_bet_history_v4', JSON.stringify(this.betHistory));
    localStorage.setItem('gobd_audit_logs_v4', JSON.stringify(this.auditLogs));
    this.listeners.forEach((l) => l());
  }

  // Getters
  public getUser(): UserProfile {
    return this.user;
  }

  public getAllUsers(): UserProfile[] {
    return this.allUsers;
  }

  public getCurrentView(): ViewType {
    return this.currentView;
  }

  public isAuth(): boolean {
    return this.isAuthenticated;
  }

  public getNotifications(): NotificationItem[] {
    return this.notifications;
  }

  public getUnreadNotificationCount(): number {
    return this.notifications.filter((n) => !n.read).length;
  }

  public getCoinHistory(): CoinHistoryItem[] {
    return this.coinHistory;
  }

  public getBetHistory(): BetHistoryItem[] {
    return this.betHistory;
  }

  public getAuditLogs(): AdminAuditLog[] {
    return this.auditLogs;
  }

  public getAdminConfig(): AdminConfig {
    return this.adminConfig;
  }

  // View & Auth Actions
  public setView(view: ViewType) {
    if (view === 'admin' && this.user.role !== 'admin') {
      this.addNotification('Access Denied', 'Admin privileges are required to view the Admin Dashboard.', 'info');
      this.currentView = 'home';
      this.notify();
      return;
    }
    this.currentView = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.notify();
  }

  public register(username: string, email: string) {
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newId = `GOBD-${randomHex}`;
    
    this.user = this.getDefaultUser(newId, username, email, 'user');
    this.isAuthenticated = true;
    this.allUsers.unshift(this.user);
    this.addNotification('Account Created!', `Welcome ${username}! Unique ID: ${newId}. +5,000 Virtual Coins added!`, 'info');
    this.setView('home');
  }

  public login(email: string) {
    const existing = this.allUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      this.user = existing;
    } else {
      const role: UserRole = email.toLowerCase().includes('admin') ? 'admin' : 'user';
      this.user = this.getDefaultUser(`GOBD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`, email.split('@')[0], email, role);
      this.allUsers.unshift(this.user);
    }
    this.isAuthenticated = true;
    this.addNotification('Welcome Back', `Logged in as ${this.user.username} (${this.user.role.toUpperCase()})`, 'info');
    this.setView('home');
  }

  public loginAsDemoAdmin() {
    let adminAcc = this.allUsers.find((u) => u.role === 'admin');
    if (!adminAcc) {
      adminAcc = this.getDefaultUser('GOBD-ADMIN1', 'SheriffAdmin', 'admin@gameonbd.com', 'admin');
      this.allUsers.unshift(adminAcc);
    }
    this.user = adminAcc;
    this.isAuthenticated = true;
    this.addNotification('Admin Mode Active', 'Switched session to Verified Admin Account.', 'info');
    this.setView('admin');
  }

  public loginAsDemoUser() {
    let userAcc = this.allUsers.find((u) => u.role === 'user');
    if (!userAcc) {
      userAcc = this.getDefaultUser('GOBD-8F42K1', 'SaloonGamer', 'player@gameonbd.com', 'user');
      this.allUsers.unshift(userAcc);
    }
    this.user = userAcc;
    this.isAuthenticated = true;
    this.addNotification('User Session Active', 'Switched session to Regular Player Account.', 'info');
    this.setView('home');
  }

  public logout() {
    this.isAuthenticated = false;
    this.notify();
  }

  public switchRole(role: UserRole) {
    this.user.role = role;
    this.addNotification('Role Switched', `Account role changed to ${role.toUpperCase()}`, 'info');
    this.notify();
  }

  // Daily Streak Bonus
  public claimDailyBonus(): { coins: number; streak: number } | null {
    const todayStr = new Date().toISOString().split('T')[0];
    if (this.user.lastDailyClaim === todayStr) {
      return null;
    }

    const newStreak = (this.user.dailyStreak % 7) + 1;
    const bonusCoins = 1000 + newStreak * 250;

    this.user.virtualCoins += bonusCoins;
    this.user.bonusCoins += bonusCoins;
    this.user.dailyStreak = newStreak;
    this.user.lastDailyClaim = todayStr;

    const coinLog: CoinHistoryItem = {
      id: 'coin_' + Date.now(),
      type: 'DAILY_BONUS',
      amount: bonusCoins,
      description: `Day ${newStreak} Daily Streak Reward (+${bonusCoins.toLocaleString()} Coins)`,
      timestamp: 'Just now',
    };
    this.coinHistory.unshift(coinLog);

    this.addNotification(
      'Daily Streak Claimed!',
      `+${bonusCoins.toLocaleString()} Virtual Coins credited for Day ${newStreak} streak!`,
      'bonus'
    );

    this.notify();
    return { coins: bonusCoins, streak: newStreak };
  }

  // Betting & Deductions
  public deductBetCoins(amount: number): boolean {
    if (this.user.virtualCoins < amount) return false;

    this.user.virtualCoins -= amount;
    this.user.totalGamesPlayed++;
    this.user.totalWageredCoins += amount;
    this.adminConfig.totalSystemGamesPlayed++;

    const coinLog: CoinHistoryItem = {
      id: 'coin_' + Date.now(),
      type: 'GAME_BET',
      amount: -amount,
      description: `Bet placed on game (-${amount.toLocaleString()} Virtual Coins)`,
      timestamp: 'Just now',
    };
    this.coinHistory.unshift(coinLog);

    this.notify();
    return true;
  }

  public recordGameResult(
    arg1: boolean | string,
    arg2: number | string,
    arg3: number | boolean,
    arg4?: string | number,
    arg5?: number,
    arg6?: number
  ) {
    let won: boolean;
    let betAmount: number;
    let winAmount: number;
    let gameName: string;
    let gameId: string;
    let multiplier: number = 0;

    if (typeof arg1 === 'boolean') {
      won = arg1;
      betAmount = arg2 as number;
      winAmount = arg3 as number;
      gameName = (arg4 as string) || 'Casino Game';
      gameId = gameName.toLowerCase().replace(/\s+/g, '_');
      multiplier = (arg5 as number) || 0;
    } else {
      gameId = arg1 as string;
      gameName = arg2 as string;
      won = arg3 as boolean;
      betAmount = (arg4 as number) || 0;
      winAmount = (arg5 as number) || 0;
      multiplier = arg6 || 0;
    }

    const calcMultiplier = multiplier > 0 ? multiplier : won && betAmount > 0 ? parseFloat((winAmount / betAmount).toFixed(2)) : 0;

    const betItem: BetHistoryItem = {
      id: 'bet_' + Date.now(),
      gameId,
      gameName,
      betAmount,
      winAmount,
      multiplier: calcMultiplier,
      isWin: won,
      timestamp: 'Just now',
    };
    this.betHistory.unshift(betItem);

    if (won) {
      this.user.totalWins++;
      this.user.virtualCoins += winAmount;
      if (winAmount > this.user.biggestWinCoins) {
        this.user.biggestWinCoins = winAmount;
      }
      this.user.totalWonCoins += winAmount;
      this.adminConfig.totalSystemWins++;

      const coinLog: CoinHistoryItem = {
        id: 'coin_' + Date.now(),
        type: 'GAME_WIN',
        amount: winAmount,
        description: `${gameName} Win (+${winAmount.toLocaleString()} Virtual Coins)`,
        timestamp: 'Just now',
      };
      this.coinHistory.unshift(coinLog);
    } else {
      this.user.totalLosses++;
      this.adminConfig.totalSystemLosses++;
    }

    this.user.xp += 25;
    if (this.user.xp >= this.user.level * 300) {
      this.user.level++;
      this.user.virtualCoins += 500;
      this.addNotification('Level Up!', `Reached Level ${this.user.level}! +500 Virtual Coins bonus!`, 'level');
    }

    this.notify();
  }

  // Western Slot 5x3 Reel Calculation Engine
  public calculateWesternSlot(betAmount: number): CalculationOutcome {
    const winRate = this.adminConfig.winProbabilityOverride || 0.15;
    const isWin = Math.random() < winRate;

    // Create 5x3 grid
    const grid: WesternSymbolId[][] = [];

    if (isWin) {
      // Choose winning symbol
      const winKeys: WesternSymbolId[] = ['SHERIFF_BADGE', 'COWBOY_HAT', 'MONEY_BAG', 'HORSESHOE', 'WILD'];
      const winSym = winKeys[Math.floor(Math.random() * winKeys.length)];
      const def = WESTERN_SYMBOLS[winSym];

      // Row 1 (center payline) matches win symbol
      grid[0] = [winSym, winSym, winSym, winSym, winSym];
      grid[1] = ['DYNAMITE', 'BULL_SKULL', 'WAGON', 'HORSESHOE', 'DYNAMITE'];
      grid[2] = ['WAGON', 'BULL_SKULL', 'DYNAMITE', 'SHERIFF_BADGE', 'MONEY_BAG'];

      return {
        isWin: true,
        multiplier: def.multiplier,
        slotGrid: grid,
        winPaylines: [0],
      };
    } else {
      // Non-winning reel arrangement
      grid[0] = ['COWBOY_HAT', 'DYNAMITE', 'BULL_SKULL', 'WAGON', 'HORSESHOE'];
      grid[1] = ['SHERIFF_BADGE', 'WAGON', 'MONEY_BAG', 'DYNAMITE', 'BULL_SKULL'];
      grid[2] = ['BULL_SKULL', 'HORSESHOE', 'WAGON', 'SHERIFF_BADGE', 'COWBOY_HAT'];

      return {
        isWin: false,
        multiplier: 0,
        slotGrid: grid,
        winPaylines: [],
      };
    }
  }

  // Admin Actions
  public adminAdjustUserCoins(targetUserId: string, amount: number, reason: string): boolean {
    const target = this.allUsers.find((u) => u.id === targetUserId);
    if (!target) return false;

    target.virtualCoins = Math.max(0, target.virtualCoins + amount);

    const audit: AdminAuditLog = {
      id: 'aud_' + Date.now(),
      adminId: this.user.id,
      adminUsername: this.user.username,
      targetUserId: target.id,
      targetUsername: target.username,
      amount,
      action: amount >= 0 ? 'CREDIT_COINS' : 'DEBIT_COINS',
      reason,
      timestamp: 'Just now',
    };
    this.auditLogs.unshift(audit);

    if (target.id === this.user.id) {
      this.user.virtualCoins = target.virtualCoins;
    }

    this.addNotification(
      'Admin Adjustment',
      `${amount >= 0 ? '+' : ''}${amount.toLocaleString()} Virtual Coins applied to ${target.username}`,
      'info'
    );

    this.notify();
    return true;
  }

  public adminToggleUserStatus(targetUserId: string): boolean {
    const target = this.allUsers.find((u) => u.id === targetUserId);
    if (!target) return false;

    target.isActive = !target.isActive;

    const audit: AdminAuditLog = {
      id: 'aud_' + Date.now(),
      adminId: this.user.id,
      adminUsername: this.user.username,
      targetUserId: target.id,
      targetUsername: target.username,
      amount: 0,
      action: 'TOGGLE_STATUS',
      reason: `User active status toggled to ${target.isActive ? 'ACTIVE' : 'BLOCKED'}`,
      timestamp: 'Just now',
    };
    this.auditLogs.unshift(audit);

    this.notify();
    return true;
  }

  public adminUpdateGameRules(winProbability: number, minBet: number, maxBet: number) {
    this.adminConfig.winProbabilityOverride = winProbability;
    this.adminConfig.minBetCoins = minBet;
    this.adminConfig.maxBetCoins = maxBet;

    const audit: AdminAuditLog = {
      id: 'aud_' + Date.now(),
      adminId: this.user.id,
      adminUsername: this.user.username,
      targetUserId: 'SYSTEM',
      targetUsername: 'SYSTEM',
      amount: 0,
      action: 'UPDATE_PROBABILITY',
      reason: `Win rate set to ${(winProbability * 100).toFixed(0)}%, Min Bet: ${minBet}, Max Bet: ${maxBet}`,
      timestamp: 'Just now',
    };
    this.auditLogs.unshift(audit);

    this.addNotification('Game Rules Updated', `Slot win probability set to ${(winProbability * 100).toFixed(0)}%`, 'info');
    this.notify();
  }

  // E-Wallet & Payment Management
  public getBoundWallets(): BoundWallet[] {
    if (!this.user.boundWallets || this.user.boundWallets.length === 0) {
      this.user.boundWallets = [
        {
          id: 'w_bkash_default',
          provider: 'bKash',
          accountNumber: '01798123456',
          accountType: 'Personal',
          isDefault: true,
          boundAt: '2026-02-01',
        },
        {
          id: 'w_nagad_default',
          provider: 'Nagad',
          accountNumber: '01855654321',
          accountType: 'Personal',
          isDefault: false,
          boundAt: '2026-02-10',
        },
      ];
      this.notify();
    }
    return this.user.boundWallets;
  }

  public bindWallet(provider: EWalletProvider, accountNumber: string, accountType: 'Personal' | 'Agent'): { success: boolean; message: string } {
    const cleanPhone = accountNumber.trim().replace(/\D/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      this.addNotification('Invalid Phone Number', 'Please enter a valid 11-digit Bangladeshi mobile number starting with 01.', 'info');
      return { success: false, message: 'Invalid 11-digit Bangladeshi mobile number.' };
    }

    if (!this.user.boundWallets) {
      this.user.boundWallets = [];
    }

    // Check if already bound
    const existingIndex = this.user.boundWallets.findIndex(
      (w) => w.provider === provider && w.accountNumber === cleanPhone
    );

    if (existingIndex >= 0) {
      this.user.boundWallets[existingIndex].accountType = accountType;
    } else {
      this.user.boundWallets.push({
        id: 'w_' + Date.now(),
        provider,
        accountNumber: cleanPhone,
        accountType,
        isDefault: this.user.boundWallets.length === 0,
        boundAt: new Date().toISOString().split('T')[0],
      });
    }

    this.addNotification('E-Wallet Bound Successfully', `${provider} account ${cleanPhone} (${accountType}) is now connected.`, 'bonus');
    this.notify();
    return { success: true, message: `${provider} account ${cleanPhone} bound successfully.` };
  }

  public submitDeposit(provider: EWalletProvider, amount: number, senderPhone: string, trxId: string): { success: boolean; message: string; newBalance: number } {
    if (amount < 100) {
      return { success: false, message: 'Minimum deposit amount is ৳100', newBalance: this.user.virtualCoins };
    }
    const cleanTrx = trxId.trim().toUpperCase();
    if (!cleanTrx || cleanTrx.length < 6) {
      return { success: false, message: 'Please provide a valid Transaction ID (TrxID)', newBalance: this.user.virtualCoins };
    }

    // 10% First/Deposit bonus calculation
    const bonusAmount = Math.round(amount * 0.1);
    const totalCredit = amount + bonusAmount;

    this.user.virtualCoins += totalCredit;
    this.user.bonusCoins += bonusAmount;

    this.coinHistory.unshift({
      id: 'dep_' + Date.now(),
      type: 'ADMIN_ADJUST',
      amount: totalCredit,
      description: `E-Wallet Deposit via ${provider} (TrxID: ${cleanTrx}) + ৳${bonusAmount} Bonus`,
      timestamp: 'Just now',
    });

    this.addNotification(
      'Deposit Successful!',
      `Credited ৳${amount.toLocaleString()} + ৳${bonusAmount.toLocaleString()} bonus via ${provider}!`,
      'win'
    );
    this.notify();

    return { success: true, message: `Deposit of ৳${amount.toLocaleString()} processed!`, newBalance: this.user.virtualCoins };
  }

  public submitWithdraw(provider: EWalletProvider, amount: number, receiverPhone: string, accountType: 'Personal' | 'Agent'): { success: boolean; message: string; newBalance: number } {
    if (amount < 200) {
      return { success: false, message: 'Minimum withdrawal amount is ৳200', newBalance: this.user.virtualCoins };
    }
    if (amount > this.user.virtualCoins) {
      return { success: false, message: 'Insufficient balance for this withdrawal request.', newBalance: this.user.virtualCoins };
    }
    const cleanPhone = receiverPhone.trim().replace(/\D/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      return { success: false, message: 'Please enter a valid 11-digit Bangladeshi mobile number.', newBalance: this.user.virtualCoins };
    }

    this.user.virtualCoins -= amount;

    this.coinHistory.unshift({
      id: 'wdr_' + Date.now(),
      type: 'GAME_BET',
      amount: -amount,
      description: `Withdrawal Request to ${provider} (${cleanPhone}) - 0% Fee`,
      timestamp: 'Just now',
    });

    this.addNotification(
      'Withdrawal Requested',
      `৳${amount.toLocaleString()} withdrawal submitted to ${provider} account ${cleanPhone}. Instant processing.`,
      'info'
    );
    this.notify();

    return { success: true, message: `Withdrawal of ৳${amount.toLocaleString()} requested successfully!`, newBalance: this.user.virtualCoins };
  }

  public markNotificationsRead() {
    this.notifications.forEach((n) => (n.read = true));
    this.notify();
  }

  public addNotification(title: string, message: string, type: NotificationItem['type']) {
    const notif: NotificationItem = {
      id: 'notif_' + Date.now(),
      title,
      message,
      timestamp: 'Just now',
      read: false,
      type,
    };
    this.notifications.unshift(notif);
    this.notify();
  }
}

export const store = new Store();
