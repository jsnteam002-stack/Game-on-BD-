import React from 'react';
import { HelpCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const SupportView: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-4 space-y-6 animate-fade-in select-none text-left">
      <div className="casino-panel p-6 rounded-3xl border border-slate-800 text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center mx-auto text-cyan-400">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-white uppercase font-sans">
          FAIR PLAY & <span className="text-cyan-400">SUPPORT</span>
        </h1>
        <p className="text-xs text-slate-300">
          GAME ON BD operates strictly on transparent, audited Pseudo-Random Number Generators (PRNG) with virtual coins.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="casino-panel p-5 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-black text-amber-300 font-mono">FAIRNESS & RNG LAWS</h3>
          <ul className="space-y-2 text-xs text-slate-300 font-sans">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>All flight crash points and slot reel stops are generated independently per round.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>Virtual coins are 100% free and refillable at any time.</span>
            </li>
          </ul>
        </div>

        <div className="casino-panel p-5 rounded-3xl border border-slate-800 space-y-3">
          <h3 className="text-sm font-black text-cyan-300 font-mono">LEGAL COMPLIANCE</h3>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            This platform is strictly an entertainment portal. No real money wagering, deposits, or withdrawals are permitted or technically implemented.
          </p>
        </div>
      </div>
    </div>
  );
};
