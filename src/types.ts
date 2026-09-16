export type ViewType =
  | 'home'
  | 'games'
  | 'bonus'
  | 'daily'
  | 'leaderboard'
  | 'profile'
  | 'slot'
  | 'crash'
  | 'roulette'
  | 'dice'
  | 'cards'
  | 'wheel'
  | 'admin';

export type GameCategory = 'ALL' | 'SLOTS' | 'CRASH' | 'ROULETTE' | 'DICE' | 'CARDS';

export type UserRole = 'user' | 'admin';

export type EWalletProvider = 'bKash' | 'Nagad' | 'Rocket' | 'Upay';

export interface BoundWallet {
  id: string;
  provider: EWalletProvider;
  accountNumber: string; // 11-digit Bangladeshi phone number (e.g. 01712345678)
  accountType: 'Personal' | 'Agent';
  isDefault: boolean;
  boundAt: string;
}

export interface DepositRequest {
  id: string;
  userId: string;
  provider: EWalletProvider;
  amount: number;
  bonusAmount: number;
  senderPhone: string;
  trxId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timestamp: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  provider: EWalletProvider;
  amount: number;
  fee: number;
  receiverPhone: string;
  accountType: 'Personal' | 'Agent';
  status: 'PENDING' | 'PROCESSED' | 'REJECTED';
  timestamp: string;
}

export interface UserProfile {
  id: string; // Auto-generated ID (e.g., GOBD-8F42K1)
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  virtualCoins: number; // Main Balance
  bonusCoins: number; // Promotional & Streak Bonus Coins
  xp: number;
  level: number;
  vipTier: 'VIP 1' | 'VIP 2' | 'VIP 3' | 'VIP 4' | 'VIP 5' | 'VIP 6' | 'VIP 7' | 'VIP 8' | 'Diamond Legend' | 'Saloon Novice' | 'Bronze Cowboy' | 'Silver Sheriff' | 'Gold Outlaw';
  avatarUrl: string;
  boundWallets?: BoundWallet[];
  totalGamesPlayed: number;
  totalWins: number;
  totalLosses: number;
  totalWageredCoins: number;
  totalWonCoins: number;
  biggestWinCoins: number;
  dailyStreak: number;
  lastDailyClaim: string | null; // ISO Date string
  createdAt: string;
}

export interface AdminAuditLog {
  id: string;
  adminId: string;
  adminUsername: string;
  targetUserId: string;
  targetUsername: string;
  amount: number;
  action: 'CREDIT_COINS' | 'DEBIT_COINS' | 'TOGGLE_STATUS' | 'UPDATE_BET_RULES' | 'UPDATE_PROBABILITY';
  reason: string;
  timestamp: string;
}

export interface BetHistoryItem {
  id: string;
  gameId: string;
  gameName: string;
  betAmount: number;
  winAmount: number;
  multiplier: number;
  isWin: boolean;
  timestamp: string;
}

export interface CoinHistoryItem {
  id: string;
  type: 'DAILY_BONUS' | 'ADMIN_ADJUST' | 'GAME_WIN' | 'GAME_BET' | 'WELCOME_CREDIT';
  amount: number;
  description: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  avatar: string;
  virtualCoinsWon: number;
  vipTier: string;
  level: number;
  gamesPlayed: number;
}

export interface AdminConfig {
  winProbabilityOverride: number; // Configurable Western Slot / Game win probability (default 0.15 = 15%)
  minBetCoins: number;
  maxBetCoins: number;
  faucetAmount: number;
  announcementText: string;
  totalSystemGamesPlayed: number;
  totalSystemWins: number;
  totalSystemLosses: number;
  totalCoinsDistributed: number;
}

export type WesternSymbolId =
  | 'WILD'
  | 'SHERIFF_BADGE'
  | 'COWBOY_HAT'
  | 'MONEY_BAG'
  | 'HORSESHOE'
  | 'DYNAMITE'
  | 'BULL_SKULL'
  | 'WAGON';

export interface WesternSymbolDef {
  id: WesternSymbolId;
  name: string;
  multiplier: number;
  iconName: string;
  color: string;
}

export interface CalculationOutcome {
  isWin: boolean;
  multiplier?: number;
  slotGrid?: WesternSymbolId[][];
  winPaylines?: number[]; // indices of winning paylines (0 to 4)
  crashPoint?: number;
  diceResult?: { d1: number; d2: number; total: number };
  rouletteNumber?: number;
  cardRank?: string;
  wheelIndex?: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'bonus' | 'level' | 'win' | 'info';
  timestamp: string;
  read: boolean;
}
