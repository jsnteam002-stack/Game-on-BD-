import React, { useState, useEffect, useRef } from 'react';
import { store } from '../store/state';
import { soundManager } from '../utils/sound';
import { toast } from '../components/ToastContainer';
import { Rocket, TrendingUp, Users, MessageSquare, Send } from 'lucide-react';

interface LiveBetUser {
  id: string;
  username: string;
  betAmount: number;
  status: 'BETTING' | 'CASHED_OUT' | 'CRASHED';
  cashoutMultiplier?: number;
  profit?: number;
}

interface LiveChatMessage {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  winAmount?: number;
}

export const AviatorCrashGame: React.FC = () => {
  const user = store.getUser();
  const adminConfig = store.getAdminConfig();
  const [gamePhase, setGamePhase] = useState<'WAITING' | 'RUNNING' | 'CRASHED'>('WAITING');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [crashPoint, setCrashPoint] = useState<number>(2.0);
  const [countdown, setCountdown] = useState<number>(5);

  // Betting state
  const [betAmount, setBetAmount] = useState<number>(50);
  const [isBetPlaced, setIsBetPlaced] = useState<boolean>(false);
  const [hasCashedOut, setHasCashedOut] = useState<boolean>(false);

  // Auto cashout
  const [autoCashoutEnabled, setAutoCashoutEnabled] = useState<boolean>(false);
  const [autoCashoutValue, setAutoCashoutValue] = useState<number>(2.0);

  // Recent crash outcomes history
  const [historyPills, setHistoryPills] = useState<number[]>([1.45, 2.80, 1.12, 18.5, 1.05, 3.42, 1.95, 8.20]);

  // Live Multiplayer Bets Simulation
  const [liveBets, setLiveBets] = useState<LiveBetUser[]>([]);

  // Live Chat Simulation
  const [chatMessages, setChatMessages] = useState<LiveChatMessage[]>([
    { id: 'c1', username: 'Dhaka_Rider', message: 'Rocket scaling high!', timestamp: '12:40' },
    { id: 'c2', username: 'Sylhet_Cowboy', message: 'Targeting 5x auto cashout!', timestamp: '12:41' },
    { id: 'c3', username: 'Sheriff_Pro', message: '+1,500 Virtual Coins last flight!', timestamp: '12:41' },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Initial simulated live bets
  const generateSimulatedLiveBets = (): LiveBetUser[] => {
    const names = ['Dhaka_Rider', 'Sylhet_Cowboy', 'Chittagong_Ace', 'Khulna_Titan', 'Rajshahi_Rider', 'Cumilla_Pro', 'Barishal_Jet', 'OutlawBD'];
    return names.map((name, i) => ({
      id: 'bet_' + i,
      username: name,
      betAmount: Math.floor(Math.random() * 8 + 1) * 50,
      status: 'BETTING',
    }));
  };

  // Start new round loop
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gamePhase === 'WAITING') {
      setIsBetPlaced(false);
      setHasCashedOut(false);
      setMultiplier(1.0);
      setLiveBets(generateSimulatedLiveBets());

      // Generate random crash point based on probability override in admin config
      const isWinRound = Math.random() < adminConfig.winProbabilityOverride;
      const targetCrash = isWinRound
        ? parseFloat((Math.random() * 4 + 1.8).toFixed(2))
        : parseFloat((Math.random() * 0.4 + 1.05).toFixed(2));
      setCrashPoint(targetCrash);

      // Countdown 5s
      let count = 5;
      setCountdown(count);

      timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        if (count <= 0) {
          clearInterval(timer);
          setGamePhase('RUNNING');
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [gamePhase]);

  // Handle RUNNING phase flight
  useEffect(() => {
    if (gamePhase !== 'RUNNING') return;

    let currentMult = 1.0;
    const startTime = Date.now();
    soundManager.playRocketRumble();

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      currentMult = parseFloat((1 + Math.pow(elapsed, 1.8) * 0.12).toFixed(2));

      if (currentMult >= crashPoint) {
        clearInterval(interval);
        setMultiplier(crashPoint);
        setGamePhase('CRASHED');
        soundManager.playCrashSound();

        setHistoryPills((prev) => [crashPoint, ...prev.slice(0, 7)]);
        setLiveBets((prev) => prev.map((b) => (b.status === 'BETTING' ? { ...b, status: 'CRASHED' } : b)));

        if (isBetPlaced && !hasCashedOut) {
          store.recordGameResult(false, betAmount, 0, 'Aviator Crash', 0);
          toast.show('FLEW AWAY!', `Rocket crashed @ ${crashPoint}x.`, 'error');
        }

        setTimeout(() => {
          setGamePhase('WAITING');
        }, 3500);

      } else {
        setMultiplier(currentMult);

        if (isBetPlaced && !hasCashedOut && autoCashoutEnabled && currentMult >= autoCashoutValue) {
          executeUserCashout(currentMult);
        }

        setLiveBets((prev) =>
          prev.map((b) => {
            if (b.status === 'BETTING' && Math.random() < 0.12) {
              const profit = Math.floor(b.betAmount * currentMult);
              return {
                ...b,
                status: 'CASHED_OUT',
                cashoutMultiplier: currentMult,
                profit,
              };
            }
            return b;
          })
        );
      }
    }, 60);

    return () => clearInterval(interval);
  }, [gamePhase, crashPoint]);

  // Execute User Cashout
  const executeUserCashout = (currentMult: number) => {
    if (hasCashedOut || !isBetPlaced) return;

    setHasCashedOut(true);
    const win = Math.floor(betAmount * currentMult);

    soundManager.playCashoutChime();
    store.recordGameResult(true, betAmount, win, 'Aviator Crash', currentMult);
    toast.show('AUTO CASHOUT!', `Cashed out @ ${currentMult}x for +${win.toLocaleString()} Virtual Coins!`, 'success');

    const userMsg: LiveChatMessage = {
      id: 'chat_' + Date.now(),
      username: user.username,
      message: `Cashed out @ ${currentMult}x (+${win} coins)!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      winAmount: win,
    };
    setChatMessages((prev) => [userMsg, ...prev.slice(0, 15)]);
  };

  // Place Bet
  const handlePlaceBet = () => {
    if (user.virtualCoins < betAmount) {
      toast.show('Insufficient Balance', 'Refill free virtual coins from the top bar!', 'error');
      return;
    }

    const deducted = store.deductBetCoins(betAmount);
    if (!deducted) {
      toast.show('Insufficient Coins', 'Could not deduct bet coins.', 'error');
      return;
    }

    soundManager.playClick();
    setIsBetPlaced(true);
    setHasCashedOut(false);
    toast.show('Bet Placed!', `${betAmount.toLocaleString()} Virtual Coins locked for next flight!`, 'info');
  };

  // Canvas Drawing for Rocket Flight Curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 280);

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(197, 138, 32, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (gamePhase === 'WAITING') {
      ctx.fillStyle = '#FFD77A';
      ctx.font = 'bold 16px "Courier New", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`NEXT ROUND STARTS IN ${countdown}s`, width / 2, height / 2);
      return;
    }

    const progress = Math.min(1, (multiplier - 1) / (crashPoint > 1 ? crashPoint : 2));
    const endX = 30 + progress * (width - 80);
    const endY = height - 30 - progress * (height - 80);

    const fillGrad = ctx.createLinearGradient(0, height, endX, endY);
    if (gamePhase === 'CRASHED') {
      fillGrad.addColorStop(0, 'rgba(139, 23, 23, 0.4)');
      fillGrad.addColorStop(1, 'rgba(139, 23, 23, 0.0)');
    } else {
      fillGrad.addColorStop(0, 'rgba(229, 185, 79, 0.4)');
      fillGrad.addColorStop(1, 'rgba(229, 185, 79, 0.0)');
    }

    ctx.beginPath();
    ctx.moveTo(30, height - 30);
    ctx.quadraticCurveTo(width / 2, height - 30, endX, endY);
    ctx.lineTo(endX, height - 30);
    ctx.closePath();
    ctx.fillStyle = fillGrad;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(30, height - 30);
    ctx.quadraticCurveTo(width / 2, height - 30, endX, endY);
    ctx.strokeStyle = gamePhase === 'CRASHED' ? '#8B1717' : '#FFD77A';
    ctx.lineWidth = 4;
    ctx.stroke();

    if (gamePhase === 'RUNNING') {
      ctx.fillStyle = '#FFF2CC';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('🚀', endX - 10, endY + 5);
    } else if (gamePhase === 'CRASHED') {
      ctx.fillStyle = '#8B1717';
      ctx.font = 'bold 18px monospace';
      ctx.fillText('CRASHED!', endX - 30, endY - 10);
    }
  }, [gamePhase, multiplier, countdown, crashPoint]);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    soundManager.playClick();
    const newMsg: LiveChatMessage = {
      id: 'chat_' + Date.now(),
      username: user.username,
      message: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages((prev) => [newMsg, ...prev]);
    setChatInput('');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4 space-y-4 animate-fade-in select-none text-left font-mono">
      
      {/* Top History Pills Bar */}
      <div className="saloon-wood-panel p-2.5 rounded-2xl flex items-center gap-2 overflow-x-auto shadow-xl border border-[#C58A20]">
        <div className="flex items-center gap-1 text-[10px] font-black text-[#D8C59A] shrink-0 px-2 border-r border-[#C58A20]/30">
          <TrendingUp className="w-3.5 h-3.5 text-[#FFD77A]" />
          <span>PAST ROUNDS</span>
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          {historyPills.map((m, idx) => (
            <span
              key={idx}
              className={`text-xs font-black px-2.5 py-1 rounded-xl shrink-0 shadow border ${
                m >= 10.0
                  ? 'bg-[#8B1717] text-[#FFF2CC] border-[#FFD77A]'
                  : m >= 2.0
                  ? 'bg-emerald-900/60 text-emerald-300 border-emerald-500/40'
                  : 'bg-[#18100B] text-[#D8C59A] border-[#C58A20]/30'
              }`}
            >
              {m.toFixed(2)}x
            </span>
          ))}
        </div>
      </div>

      {/* Main Game Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Flight Canvas & Bet Controls */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="saloon-wood-panel rounded-3xl p-4 relative overflow-hidden border border-[#C58A20] shadow-2xl">
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
              <span
                className={`text-4xl sm:text-6xl font-black font-mono tracking-wider ${
                  gamePhase === 'CRASHED'
                    ? 'text-rose-500 animate-bounce'
                    : 'text-gold-metallic'
                }`}
              >
                {multiplier.toFixed(2)}x
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#D8C59A] block mt-1">
                {gamePhase === 'WAITING'
                  ? 'PREPARING FOR TAKE OFF...'
                  : gamePhase === 'CRASHED'
                  ? 'CRASHED!'
                  : 'CURRENT MULTIPLIER'}
              </span>
            </div>

            <div className="w-full h-64 sm:h-72 bg-[#050505] rounded-2xl border border-[#C58A20]/40 relative flex items-center justify-center overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-full block" />
            </div>
          </div>

          {/* Interactive Betting Controls Bar */}
          <div className="saloon-wood-panel p-4 sm:p-5 rounded-3xl border border-[#C58A20] space-y-4 shadow-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#D8C59A]">
                  <span>BET AMOUNT (COINS)</span>
                  <span className="text-[#FFD77A]">BAL: {user.virtualCoins.toLocaleString()}</span>
                </div>

                <div className="flex items-center bg-[#050505] rounded-2xl border border-[#C58A20]/40 p-1.5 gap-2">
                  <input
                    type="number"
                    min={10}
                    max={10000}
                    value={betAmount}
                    onChange={(e) => setBetAmount(Math.max(10, parseInt(e.target.value) || 10))}
                    disabled={isBetPlaced && gamePhase === 'RUNNING'}
                    className="w-full bg-transparent px-3 text-sm font-black text-[#FFD77A] focus:outline-none"
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setBetAmount(Math.max(10, Math.floor(betAmount / 2)))}
                      disabled={isBetPlaced && gamePhase === 'RUNNING'}
                      className="btn-brass-sm px-2 py-1 rounded-xl text-[10px] font-black"
                    >
                      1/2
                    </button>
                    <button
                      onClick={() => setBetAmount(betAmount * 2)}
                      disabled={isBetPlaced && gamePhase === 'RUNNING'}
                      className="btn-brass-sm px-2 py-1 rounded-xl text-[10px] font-black"
                    >
                      2X
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {[20, 50, 100, 200, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setBetAmount(amt)}
                      disabled={isBetPlaced && gamePhase === 'RUNNING'}
                      className={`px-2.5 py-1 rounded-xl text-[10px] font-black transition ${
                        betAmount === amt
                          ? 'btn-gold-3d text-[#120B07]'
                          : 'btn-brass-sm text-[#D8C59A]'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between bg-[#050505] p-2 rounded-2xl border border-[#C58A20]/40">
                  <label className="flex items-center gap-2 text-xs font-bold text-[#D8C59A] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoCashoutEnabled}
                      onChange={(e) => setAutoCashoutEnabled(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#FFD77A]"
                    />
                    <span>AUTO CASHOUT</span>
                  </label>

                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min="1.1"
                      max="100"
                      value={autoCashoutValue}
                      onChange={(e) => setAutoCashoutValue(parseFloat(e.target.value) || 1.5)}
                      disabled={!autoCashoutEnabled}
                      className="w-16 bg-[#18100B] text-center text-xs font-black text-[#FFD77A] py-1 rounded-xl border border-[#C58A20]/40 focus:outline-none"
                    />
                    <span className="text-xs font-black text-[#FFD77A]">X</span>
                  </div>
                </div>

                {gamePhase === 'RUNNING' && isBetPlaced && !hasCashedOut ? (
                  <button
                    onClick={() => executeUserCashout(multiplier)}
                    className="w-full btn-gold-3d py-4 rounded-2xl text-base font-black uppercase flex flex-col items-center justify-center animate-pulse"
                  >
                    <span>CASHOUT NOW</span>
                    <span className="text-xs text-[#120B07] font-bold">
                      +{(Math.floor(betAmount * multiplier)).toLocaleString()} COINS ({multiplier.toFixed(2)}X)
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={handlePlaceBet}
                    disabled={isBetPlaced || gamePhase === 'RUNNING'}
                    className={`w-full py-4 rounded-2xl text-base font-black uppercase transition ${
                      isBetPlaced
                        ? 'bg-[#18100B] text-emerald-400 border border-emerald-500/50 cursor-default'
                        : 'btn-gold-3d text-[#120B07]'
                    }`}
                  >
                    {isBetPlaced
                      ? '✓ BET PLACED FOR NEXT ROUND'
                      : `BET ${betAmount} VIRTUAL COINS`}
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Live Bets & Community Live Chat */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="saloon-wood-panel rounded-3xl p-3.5 border border-[#C58A20]/60 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#C58A20]/30">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#FFD77A]" />
                <h4 className="text-xs font-black text-[#FFF2CC] uppercase">
                  LIVE BETS ({liveBets.length})
                </h4>
              </div>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {liveBets.map((b) => (
                <div
                  key={b.id}
                  className="bg-[#050505] p-2 rounded-xl border border-[#C58A20]/20 flex items-center justify-between text-xs"
                >
                  <span className="font-bold text-[#FFF2CC] text-[11px]">{b.username}</span>
                  <div className="text-right">
                    {b.status === 'CASHED_OUT' ? (
                      <span className="text-emerald-400 font-black text-[11px] block">
                        +{b.profit?.toLocaleString()} ({b.cashoutMultiplier?.toFixed(2)}x)
                      </span>
                    ) : (
                      <span className="text-[#D8C59A]/60 text-[10px] block">
                        {b.status}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="saloon-wood-panel rounded-3xl p-3.5 border border-[#C58A20]/60 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#C58A20]/30">
              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#FFD77A]" />
                <h4 className="text-xs font-black text-[#FFF2CC] uppercase">
                  PLAYER CHAT
                </h4>
              </div>
            </div>

            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 text-xs">
              {chatMessages.map((msg) => (
                <div key={msg.id} className="bg-[#050505] p-2 rounded-xl border border-[#C58A20]/20">
                  <div className="flex items-center justify-between text-[10px] text-[#D8C59A]">
                    <span className="font-bold text-[#FFD77A]">{msg.username}</span>
                    <span>{msg.timestamp}</span>
                  </div>
                  <p className="text-[#FFF2CC] text-[11px] mt-0.5">{msg.message}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                placeholder="Say something..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="w-full bg-[#050505] border border-[#C58A20]/40 rounded-xl px-3 py-1.5 text-xs text-[#FFF2CC] focus:outline-none focus:border-[#FFD77A]"
              />
              <button
                type="submit"
                className="p-2 btn-gold-3d text-[#120B07] rounded-xl font-bold transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
