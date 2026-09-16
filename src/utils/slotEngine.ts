/**
 * Slot Engine & Game Logic (5x3 Reel Matrix, Paylines, Wild Substitution, Jackpot Counter)
 */

export interface SlotSymbol {
  id: string;
  name: string;
  label: string;
  multiplier3x: number;
  multiplier4x: number;
  multiplier5x: number;
  isWild: boolean;
  isScatter: boolean;
  color: string;
  glowColor: string;
}

export const SLOT_SYMBOLS: Record<string, SlotSymbol> = {
  WILD: {
    id: 'WILD',
    name: 'Emerald Wild',
    label: 'WILD',
    multiplier3x: 10,
    multiplier4x: 25,
    multiplier5x: 100,
    isWild: true,
    isScatter: false,
    color: 'from-amber-300 via-yellow-400 to-amber-600',
    glowColor: '#FFD700',
  },
  SEVEN: {
    id: 'SEVEN',
    name: 'Lucky 777',
    label: '777',
    multiplier3x: 8,
    multiplier4x: 20,
    multiplier5x: 75,
    isWild: false,
    isScatter: false,
    color: 'from-red-500 via-rose-600 to-red-800',
    glowColor: '#EF4444',
  },
  DIAMOND: {
    id: 'DIAMOND',
    name: 'Royal Diamond',
    label: '💎',
    multiplier3x: 6,
    multiplier4x: 15,
    multiplier5x: 50,
    isWild: false,
    isScatter: false,
    color: 'from-cyan-300 via-blue-400 to-indigo-600',
    glowColor: '#38BDF8',
  },
  CROWN: {
    id: 'CROWN',
    name: 'Gold Crown',
    label: '👑',
    multiplier3x: 4,
    multiplier4x: 10,
    multiplier5x: 35,
    isWild: false,
    isScatter: false,
    color: 'from-yellow-300 via-amber-400 to-yellow-600',
    glowColor: '#F59E0B',
  },
  GOLD_BAR: {
    id: 'GOLD_BAR',
    name: 'Gold Bar',
    label: '🪙',
    multiplier3x: 3,
    multiplier4x: 8,
    multiplier5x: 25,
    isWild: false,
    isScatter: false,
    color: 'from-amber-400 to-yellow-700',
    glowColor: '#FBBF24',
  },
  BELL: {
    id: 'BELL',
    name: 'Liberty Bell',
    label: '🔔',
    multiplier3x: 2.5,
    multiplier4x: 6,
    multiplier5x: 18,
    isWild: false,
    isScatter: false,
    color: 'from-amber-200 via-yellow-400 to-amber-600',
    glowColor: '#FCD34D',
  },
  CHERRY: {
    id: 'CHERRY',
    name: 'Twin Cherries',
    label: '🍒',
    multiplier3x: 2,
    multiplier4x: 5,
    multiplier5x: 12,
    isWild: false,
    isScatter: false,
    color: 'from-rose-400 via-red-600 to-rose-800',
    glowColor: '#F43F5E',
  },
  HORSESHOE: {
    id: 'HORSESHOE',
    name: 'Lucky Horseshoe',
    label: '🧲',
    multiplier3x: 1.5,
    multiplier4x: 4,
    multiplier5x: 10,
    isWild: false,
    isScatter: false,
    color: 'from-emerald-300 via-teal-500 to-emerald-700',
    glowColor: '#10B981',
  },
  SCATTER: {
    id: 'SCATTER',
    name: 'Star Scatter',
    label: '⭐',
    multiplier3x: 5,
    multiplier4x: 20,
    multiplier5x: 50,
    isWild: false,
    isScatter: true,
    color: 'from-purple-300 via-fuchsia-500 to-purple-800',
    glowColor: '#D946EF',
  },
};

export const SYMBOL_POOL: string[] = [
  'CHERRY', 'CHERRY', 'CHERRY', 'CHERRY',
  'HORSESHOE', 'HORSESHOE', 'HORSESHOE',
  'BELL', 'BELL', 'BELL',
  'GOLD_BAR', 'GOLD_BAR',
  'CROWN', 'CROWN',
  'DIAMOND', 'DIAMOND',
  'SEVEN',
  'WILD',
  'SCATTER',
];

/**
 * 20 Standard Slot Paylines (5 columns, 3 rows: row index 0 = top, 1 = middle, 2 = bottom)
 */
export const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1], // 1: Middle horizontal
  [0, 0, 0, 0, 0], // 2: Top horizontal
  [2, 2, 2, 2, 2], // 3: Bottom horizontal
  [0, 1, 2, 1, 0], // 4: V-Shape
  [2, 1, 0, 1, 2], // 5: Inverted V
  [0, 0, 1, 2, 2], // 6: High to low steps
  [2, 2, 1, 0, 0], // 7: Low to high steps
  [1, 0, 0, 0, 1], // 8: Top dip
  [1, 2, 2, 2, 1], // 9: Bottom dip
  [0, 1, 0, 1, 0], // 10: Zig-zag top
  [2, 1, 2, 1, 2], // 11: Zig-zag bottom
  [1, 0, 1, 0, 1], // 12: Wave high
  [1, 2, 1, 2, 1], // 13: Wave low
  [0, 1, 1, 1, 0], // 14: Top arch
  [2, 1, 1, 1, 2], // 15: Bottom arch
  [0, 0, 1, 0, 0], // 16: Top wedge
  [2, 2, 1, 2, 2], // 17: Bottom wedge
  [0, 2, 0, 2, 0], // 18: Wide teeth
  [2, 0, 2, 0, 2], // 19: Inverted teeth
  [1, 1, 0, 1, 1], // 20: Center wave
];

export interface PaylineWin {
  paylineIndex: number;
  symbolId: string;
  matchCount: number;
  multiplier: number;
  winAmount: number;
  coords: { col: number; row: number }[];
}

export interface SpinResult {
  grid: string[][]; // 5 columns x 3 rows: grid[col][row]
  wins: PaylineWin[];
  totalWin: number;
  isBigWin: boolean;
  isMegaWin: boolean;
  scatterCount: number;
  freeSpinsAwarded: number;
}

/**
 * Generates a random 5x3 slot grid
 */
export function generateRandomGrid(): string[][] {
  const grid: string[][] = [];
  for (let col = 0; col < 5; col++) {
    const colSymbols: string[] = [];
    for (let row = 0; row < 3; row++) {
      const randomIndex = Math.floor(Math.random() * SYMBOL_POOL.length);
      colSymbols.push(SYMBOL_POOL[randomIndex]);
    }
    grid.push(colSymbols);
  }
  return grid;
}

/**
 * Evaluates payline wins and wild substitutions on a 5x3 grid
 */
export function evaluateSlotSpin(
  grid: string[][],
  betPerLine: number,
  activePaylinesCount: number = 20
): SpinResult {
  const wins: PaylineWin[] = [];
  let totalWin = 0;
  let scatterCount = 0;

  // Count Scatters across entire grid
  for (let c = 0; c < 5; c++) {
    for (let r = 0; r < 3; r++) {
      if (grid[c][r] === 'SCATTER') {
        scatterCount++;
      }
    }
  }

  // Check each active payline
  const linesToCheck = PAYLINES.slice(0, activePaylinesCount);

  linesToCheck.forEach((linePattern, lineIdx) => {
    // Extract the symbols along this payline (left to right)
    const lineSymbols = linePattern.map((rowIdx, colIdx) => grid[colIdx][rowIdx]);

    // Find the primary matching symbol (ignoring wild for base identification)
    let matchSymbolId: string | null = null;
    for (const sym of lineSymbols) {
      if (sym !== 'WILD' && sym !== 'SCATTER') {
        matchSymbolId = sym;
        break;
      }
    }

    // If all are wild, treat as WILD line
    if (!matchSymbolId) {
      matchSymbolId = 'WILD';
    }

    // Count consecutive matching symbols from left to right with Wild substitution
    let matchCount = 0;
    const winningCoords: { col: number; row: number }[] = [];

    for (let col = 0; col < 5; col++) {
      const currentSym = lineSymbols[col];
      if (currentSym === matchSymbolId || currentSym === 'WILD') {
        matchCount++;
        winningCoords.push({ col, row: linePattern[col] });
      } else {
        break; // Consecutive requirement from reel 1
      }
    }

    // Only 3, 4, or 5 matches score a win
    if (matchCount >= 3) {
      const symbolDef = SLOT_SYMBOLS[matchSymbolId] || SLOT_SYMBOLS.CHERRY;
      let multiplier = symbolDef.multiplier3x;
      if (matchCount === 4) multiplier = symbolDef.multiplier4x;
      if (matchCount === 5) multiplier = symbolDef.multiplier5x;

      const lineWinAmount = Math.round(betPerLine * multiplier);
      totalWin += lineWinAmount;

      wins.push({
        paylineIndex: lineIdx + 1,
        symbolId: matchSymbolId,
        matchCount,
        multiplier,
        winAmount: lineWinAmount,
        coords: winningCoords,
      });
    }
  });

  // Scatter Payout
  let freeSpinsAwarded = 0;
  if (scatterCount >= 3) {
    freeSpinsAwarded = scatterCount === 3 ? 10 : scatterCount === 4 ? 15 : 25;
    const scatterMultiplier = scatterCount === 3 ? 5 : scatterCount === 4 ? 20 : 50;
    const scatterWin = Math.round(betPerLine * activePaylinesCount * (scatterMultiplier / 10));
    totalWin += scatterWin;
  }

  const totalBet = betPerLine * activePaylinesCount;
  const isBigWin = totalWin >= totalBet * 10;
  const isMegaWin = totalWin >= totalBet * 25;

  return {
    grid,
    wins,
    totalWin,
    isBigWin,
    isMegaWin,
    scatterCount,
    freeSpinsAwarded,
  };
}

/**
 * Animated Progressive Jackpot Counter Helper
 */
export class JackpotTicker {
  private currentVal: number;
  private targetVal: number;
  private onUpdate: (val: number) => void;
  private animId: number | null = null;

  constructor(initialVal: number, onUpdate: (val: number) => void) {
    this.currentVal = initialVal;
    this.targetVal = initialVal;
    this.onUpdate = onUpdate;
  }

  public setTarget(target: number) {
    this.targetVal = target;
    if (!this.animId) {
      this.step();
    }
  }

  private step = () => {
    const diff = this.targetVal - this.currentVal;
    if (Math.abs(diff) < 0.05) {
      this.currentVal = this.targetVal;
      this.onUpdate(this.currentVal);
      this.animId = null;
      return;
    }

    this.currentVal += diff * 0.08;
    this.onUpdate(this.currentVal);
    this.animId = requestAnimationFrame(this.step);
  };

  public destroy() {
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }
}
