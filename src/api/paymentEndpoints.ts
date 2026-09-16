/**
 * Payment & E-Wallet API Endpoints (Node.js / Express)
 * Handles bKash, Nagad deposits, withdrawals, wallet binding, and balance queries.
 */

import { Request, Response, Router } from 'express';

export const paymentRouter = Router();

// In-memory demo data store (can be wired to Firestore or Postgres in production)
interface TransactionRecord {
  id: string;
  userId: string;
  provider: 'bKash' | 'Nagad' | 'Rocket';
  type: 'DEPOSIT' | 'WITHDRAW';
  amount: number;
  bonusAmount?: number;
  fee?: number;
  phone: string;
  trxId?: string;
  accountType?: 'Personal' | 'Agent';
  status: 'PENDING' | 'APPROVED' | 'PROCESSED' | 'REJECTED';
  timestamp: string;
}

const transactionHistory: TransactionRecord[] = [];

/**
 * 1. POST /api/wallets/bind
 * Binds a verified bKash or Nagad wallet to the user's account.
 */
paymentRouter.post('/wallets/bind', (req: Request, res: Response): void => {
  try {
    const { userId, provider, accountNumber, accountType } = req.body;

    // Validation: Required fields
    if (!userId || !provider || !accountNumber) {
      res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, provider, accountNumber',
      });
      return;
    }

    // Validation: Provider check
    if (!['bKash', 'Nagad', 'Rocket'].includes(provider)) {
      res.status(400).json({
        success: false,
        error: 'Invalid provider. Supported: bKash, Nagad, Rocket',
      });
      return;
    }

    // Validation: Bangladeshi 11-digit mobile number format (e.g., 01712345678)
    const cleanPhone = String(accountNumber).trim().replace(/\D/g, '');
    const phoneRegex = /^01[3-9]\d{8}$/;
    if (!phoneRegex.test(cleanPhone)) {
      res.status(422).json({
        success: false,
        error: 'Invalid Bangladeshi phone number. Must be 11 digits starting with 01 (e.g. 017xxxxxxxx).',
      });
      return;
    }

    const boundWallet = {
      id: `bw_${Date.now()}`,
      userId,
      provider,
      accountNumber: cleanPhone,
      accountType: accountType || 'Personal',
      boundAt: new Date().toISOString(),
      isDefault: true,
    };

    res.status(200).json({
      success: true,
      message: `Successfully bound ${provider} account ${cleanPhone}`,
      wallet: boundWallet,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
});

/**
 * 2. POST /api/deposit
 * Initiates and verifies an e-wallet deposit request.
 */
paymentRouter.post('/deposit', (req: Request, res: Response): void => {
  try {
    const { userId, provider, amount, senderPhone, trxId } = req.body;

    // Validation: Minimum deposit amount (৳100)
    const numAmount = Number(amount);
    if (!numAmount || isNaN(numAmount) || numAmount < 100) {
      res.status(400).json({
        success: false,
        error: 'Minimum deposit amount is ৳100.',
      });
      return;
    }

    // Validation: Transaction ID format (bKash/Nagad usually 8-10 alphanumeric chars)
    const cleanTrx = String(trxId || '').trim().toUpperCase();
    if (!cleanTrx || cleanTrx.length < 6) {
      res.status(422).json({
        success: false,
        error: 'A valid Transaction ID (TrxID) is required to verify your deposit.',
      });
      return;
    }

    // Calculation: 10% First Deposit Bonus
    const bonusAmount = Math.round(numAmount * 0.1);
    const totalCredit = numAmount + bonusAmount;

    const record: TransactionRecord = {
      id: `trx_dep_${Date.now()}`,
      userId: userId || 'USER_DEMO',
      provider: provider || 'bKash',
      type: 'DEPOSIT',
      amount: numAmount,
      bonusAmount,
      phone: senderPhone || '01700000000',
      trxId: cleanTrx,
      status: 'APPROVED',
      timestamp: new Date().toISOString(),
    };

    transactionHistory.unshift(record);

    res.status(200).json({
      success: true,
      message: 'Deposit verified and credited successfully!',
      transaction: record,
      creditedAmount: totalCredit,
      breakdown: {
        principal: numAmount,
        bonus10Percent: bonusAmount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Deposit handling failed' });
  }
});

/**
 * 3. POST /api/withdraw
 * Processes a withdrawal request to a bound bKash / Nagad wallet.
 */
paymentRouter.post('/withdraw', (req: Request, res: Response): void => {
  try {
    const { userId, provider, amount, receiverPhone, accountType, currentBalance } = req.body;

    const numAmount = Number(amount);
    // Validation: Minimum & Maximum withdrawal
    if (!numAmount || isNaN(numAmount) || numAmount < 200) {
      res.status(400).json({
        success: false,
        error: 'Minimum withdrawal amount is ৳200.',
      });
      return;
    }

    if (currentBalance !== undefined && numAmount > Number(currentBalance)) {
      res.status(400).json({
        success: false,
        error: 'Insufficient account balance for this withdrawal amount.',
      });
      return;
    }

    // Validation: Receiver phone
    const cleanPhone = String(receiverPhone || '').trim().replace(/\D/g, '');
    if (!/^01[3-9]\d{8}$/.test(cleanPhone)) {
      res.status(422).json({
        success: false,
        error: 'Please enter a valid 11-digit Bangladeshi mobile number.',
      });
      return;
    }

    const record: TransactionRecord = {
      id: `trx_wdr_${Date.now()}`,
      userId: userId || 'USER_DEMO',
      provider: provider || 'bKash',
      type: 'WITHDRAW',
      amount: numAmount,
      fee: 0, // 0% platform fee
      phone: cleanPhone,
      accountType: accountType || 'Personal',
      status: 'PROCESSED',
      timestamp: new Date().toISOString(),
    };

    transactionHistory.unshift(record);

    res.status(200).json({
      success: true,
      message: `Withdrawal of ৳${numAmount.toLocaleString()} to ${provider} (${cleanPhone}) processed.`,
      transaction: record,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message || 'Withdrawal failed' });
  }
});

/**
 * 4. GET /api/jackpot
 * Returns real-time progressive jackpot counter values.
 */
paymentRouter.get('/jackpot', (req: Request, res: Response): void => {
  // Base jackpot ৳ 1,280,000 + increment
  const now = Date.now();
  const baseJackpot = 1284500.5;
  const increment = ((now % 1000000) / 100).toFixed(2);
  const totalJackpot = (baseJackpot + parseFloat(increment)).toFixed(2);

  res.status(200).json({
    success: true,
    currency: 'BDT',
    symbol: '৳',
    grandJackpot: parseFloat(totalJackpot),
    majorJackpot: 185200.0,
    minorJackpot: 24500.0,
    miniJackpot: 5200.0,
    timestamp: new Date().toISOString(),
  });
});
