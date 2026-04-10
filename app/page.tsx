'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CrossChainPerpInterface from './components/CrossChainPerpInterface';

export default function TerminalPage() {
  const [isExecuting, setIsExecuting] = useState(false);

  return (
    <div className="overflow-x-hidden pb-20">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#0e0e0e] bg-gradient-to-b from-[#0e0e0e] to-transparent shadow-[0_0_15px_rgba(161,250,255,0.05)]">
        <div className="flex justify-between items-center px-6 h-16 w-full max-w-none">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">hub</span>
            <span className="text-xl font-bold tracking-tighter text-cyan-400 font-headline uppercase">AETHER_BRIDGE</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border border-primary/20 bg-surface-container-high flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-[16px] text-blue-400">token</span>
              </div>
              <div className="w-8 h-8 rounded-full border border-primary/20 bg-surface-container-high flex items-center justify-center overflow-hidden">
                <span className="material-symbols-outlined text-[16px] text-purple-400">rocket_launch</span>
              </div>
            </div>
            <button className="bg-primary/10 border border-primary/30 px-3 py-1.5 rounded-sm text-[10px] font-headline font-bold text-primary tracking-widest hover:bg-cyan-400/20 transition-all uppercase">
              CONNECT_WALLETS
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-20 px-4 space-y-4 max-w-md mx-auto">
        {/* Embedded demo component: Cross-Chain Perp Interface */}
        <div className="mb-6">
          <CrossChainPerpInterface />
        </div>
        {/* Data Ribbon */}
        <div className="data-ribbon h-7 flex items-center px-4 border-l-2 border-primary overflow-hidden">
          <div className="flex space-x-6 whitespace-nowrap animate-marquee">
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-on-surface-variant">SOL_PERP</span>
              <span className="text-primary">$142.68</span>
              <span className="text-primary-dim">+4.2%</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-on-surface-variant">ETH_MAIN</span>
              <span className="text-tertiary">$2,451.12</span>
              <span className="text-tertiary-dim">-0.8%</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono">
              <span className="text-on-surface-variant">AETHER_INDEX</span>
              <span className="text-primary">$1.02</span>
              <span className="text-primary-dim">+12.5%</span>
            </div>
          </div>
        </div>

        {/* Intent Panel: Step 1 (Bridge) */}
        <section className="bg-surface-container-low rounded-lg p-4 space-y-4 border border-white/5 relative overflow-hidden">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-headline font-bold text-on-surface-variant tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full"></span> STEP_01: SOURCE_INTENT
            </h2>
            <span className="text-[10px] font-mono text-primary-dim">GAS: 0.0004 ETH</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">Source Chain</label>
              <div className="bg-surface-container-high h-12 flex items-center px-3 rounded-sm justify-between border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400 text-sm">dataset</span>
                  <span className="text-xs font-headline">ARBITRUM</span>
                </div>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">Asset</label>
              <div className="bg-surface-container-high h-12 flex items-center px-3 rounded-sm justify-between border border-white/5">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">monetization_on</span>
                  <span className="text-xs font-headline">USDC</span>
                </div>
                <span className="material-symbols-outlined text-sm text-on-surface-variant">expand_more</span>
              </div>
            </div>
          </div>
          <div className="bg-surface-container-high p-4 rounded-sm border border-white/5 relative">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">Transfer Amount</label>
              <button className="text-[9px] font-mono text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">Max_42,000</button>
            </div>
            <div className="flex items-baseline justify-between">
              <input className="bg-transparent border-none p-0 text-2xl font-mono text-on-surface focus:ring-0 w-full" type="text" defaultValue="1,250.00" />
              <span className="text-[10px] font-mono text-on-surface-variant">≈ $1,250.00</span>
            </div>
          </div>
        </section>

        {/* Connectivity Line */}
        <div className="flex justify-center -my-2 relative z-10">
          <div className="bg-primary-container p-2 rounded-full shadow-[0_0_15px_rgba(161,250,255,0.4)]">
            <span className="material-symbols-outlined text-on-primary-container">swap_vert</span>
          </div>
        </div>

        {/* Intent Panel: Step 2 (Trade) */}
        <section className="bg-surface-container-low rounded-lg p-4 space-y-4 border border-white/5">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xs font-headline font-bold text-on-surface-variant tracking-widest uppercase flex items-center gap-2">
              <span className="w-2 h-2 bg-tertiary rounded-full"></span> STEP_02: DESTINATION_TRADE
            </h2>
          </div>
          <div className="flex items-center justify-between bg-surface-container-high p-3 rounded-sm border border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">hub</span>
              </div>
              <div>
                <div className="text-[10px] font-mono text-on-surface-variant">MARKET_SELECTOR</div>
                <div className="text-xs font-headline font-bold uppercase tracking-widest text-on-surface">SOLANA / SOL-PERP</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-sm text-on-surface-variant">settings_input_component</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center justify-center gap-2 py-3 bg-primary/10 border border-primary/20 rounded-sm text-primary font-headline font-bold uppercase text-xs tracking-widest">
              <span className="material-symbols-outlined text-sm">trending_up</span> LONG
            </button>
            <button className="flex items-center justify-center gap-2 py-3 bg-error-container/10 border border-error-container/40 rounded-sm text-error font-headline font-bold uppercase text-xs tracking-widest">
              <span className="material-symbols-outlined text-sm">trending_down</span> SHORT
            </button>
          </div>
          <div className="space-y-4 py-2">
            <div className="flex justify-between items-center text-[9px] uppercase font-bold text-on-surface-variant tracking-wider">
              <span>Leverage_Factor</span>
              <span className="text-primary font-mono text-xs">12.5x</span>
            </div>
            <input className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" max="20" min="1" type="range" defaultValue="12" />
            <div className="flex justify-between text-[8px] font-mono text-outline">
              <span>1x</span>
              <span>5x</span>
              <span>10x</span>
              <span>15x</span>
              <span>20x</span>
            </div>
          </div>
        </section>

        {/* Market Data Summary */}
        <section className="grid grid-cols-2 gap-4">
          <div className="bg-surface-container-low p-3 rounded-lg border border-white/5 h-40 relative">
            <div className="text-[9px] font-bold text-on-surface-variant uppercase mb-2 tracking-widest">Price_Chart</div>
            <Image src="https://picsum.photos/seed/chart/400/200" alt="Chart" fill className="object-cover opacity-60 grayscale brightness-125" referrerPolicy="no-referrer" />
            <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low to-transparent"></div>
          </div>
          <div className="bg-surface-container-low p-3 rounded-lg border border-white/5 h-40">
            <div className="text-[9px] font-bold text-on-surface-variant uppercase mb-2 tracking-widest">Order_Book</div>
            <div className="space-y-1 font-mono text-[9px]">
              <div className="flex justify-between text-error/80"><span>142.91</span><span>0.42</span></div>
              <div className="flex justify-between text-error/60"><span>142.85</span><span>1.12</span></div>
              <div className="flex justify-between text-error/40"><span>142.72</span><span>4.20</span></div>
              <div className="text-center py-1 text-on-surface border-y border-white/5 my-1">142.68</div>
              <div className="flex justify-between text-primary/40"><span>142.65</span><span>0.88</span></div>
              <div className="flex justify-between text-primary/60"><span>142.58</span><span>2.15</span></div>
              <div className="flex justify-between text-primary/80"><span>142.50</span><span>3.44</span></div>
            </div>
          </div>
        </section>

        {/* Execution */}
        <div className="py-4">
          <button 
            onClick={() => setIsExecuting(true)}
            className="w-full py-4 bg-gradient-to-r from-primary to-secondary-container rounded-sm flex flex-col items-center justify-center gap-1 shadow-[0_0_30px_rgba(161,250,255,0.2)] active:scale-95 transition-transform"
          >
            <span className="text-xs font-headline font-bold text-on-secondary uppercase tracking-[0.2em]">Authorize & Execute Cross-Chain Intent</span>
            <span className="text-[9px] font-mono text-on-secondary/80">ETA: &lt; 15 SECONDS</span>
          </button>
        </div>

        {/* Open Positions Tab */}
        <section className="bg-surface-container-low rounded-lg border border-white/5 overflow-hidden">
          <div className="flex border-b border-white/5">
            <button className="flex-1 py-3 text-[10px] font-headline font-bold tracking-widest text-primary border-b-2 border-primary bg-primary/5">POSITIONS (2)</button>
            <button className="flex-1 py-3 text-[10px] font-headline font-bold tracking-widest text-on-surface-variant">BALANCES</button>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-tight">SOL-PERP</span>
                  <span className="bg-primary/20 text-primary text-[8px] px-1 font-mono">10x</span>
                </div>
                <div className="text-[9px] font-mono text-on-surface-variant">Size: 42.5 SOL</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-primary font-bold">+$420.69</div>
                <div className="text-[9px] font-mono text-on-surface-variant">+12.4%</div>
              </div>
            </div>
            <div className="flex justify-between items-center opacity-60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-tight">ETH-PERP</span>
                  <span className="bg-tertiary/20 text-tertiary text-[8px] px-1 font-mono">5x</span>
                </div>
                <div className="text-[9px] font-mono text-on-surface-variant">Size: 1.2 ETH</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-error font-bold">-$12.45</div>
                <div className="text-[9px] font-mono text-on-surface-variant">-0.4%</div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center h-16 px-4 pb-safe bg-[#0e0e0e]/80 backdrop-blur-xl border-t border-white/5 z-40">
        <a className="flex flex-col items-center justify-center text-cyan-400 bg-cyan-400/5 rounded-none border-t-2 border-cyan-400 py-1 flex-1" href="#">
          <span className="material-symbols-outlined text-[20px]">grid_view</span>
          <span className="font-headline text-[10px] tracking-widest uppercase">DASHBOARD</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 py-1 flex-1 hover:text-cyan-300 transition-colors" href="#">
          <span className="material-symbols-outlined text-[20px]">monitoring</span>
          <span className="font-headline text-[10px] tracking-widest uppercase">MARKETS</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 py-1 flex-1 hover:text-cyan-300 transition-colors" href="#">
          <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
          <span className="font-headline text-[10px] tracking-widest uppercase">PORTFOLIO</span>
        </a>
        <a className="flex flex-col items-center justify-center text-slate-500 py-1 flex-1 hover:text-cyan-300 transition-colors" href="#">
          <span className="material-symbols-outlined text-[20px]">settings</span>
          <span className="font-headline text-[10px] tracking-widest uppercase">SETTINGS</span>
        </a>
      </nav>

      {/* Execution Modal */}
      {isExecuting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel border border-white/5 rounded-none shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden w-full max-w-2xl">
            <div className="p-8 border-b border-white/5 bg-surface-container-high/50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface mb-1">INTENT_EXECUTION</h2>
                  <p className="text-on-surface-variant text-xs font-mono uppercase tracking-widest">ID: 0x82...f92a • STATUS: IN_PROGRESS</p>
                </div>
                <button onClick={() => setIsExecuting(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="bg-surface-container-lowest p-6 border-l-4 border-primary">
                <p className="text-on-surface-variant text-[10px] font-headline font-bold tracking-[0.2em] uppercase mb-2">Primary Intent</p>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-[16px] text-blue-400">token</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-surface-container-highest border border-white/10 flex items-center justify-center overflow-hidden">
                      <span className="material-symbols-outlined text-[16px] text-purple-400">rocket_launch</span>
                    </div>
                  </div>
                  <h3 className="font-headline text-lg md:text-xl font-medium tracking-tight">
                    Bridge <span className="text-primary-fixed">$1000 USDC</span> from Arbitrum → Open <span className="text-tertiary">5x Long</span> SOL-PERP
                  </h3>
                </div>
              </div>
            </div>
            <div className="p-8 space-y-0 relative">
              <div className="absolute left-[2.75rem] top-12 bottom-12 w-px bg-white/10">
                <div className="absolute top-0 left-0 w-full bg-primary h-[35%]"></div>
              </div>
              <div className="relative flex items-start gap-6 pb-12 group">
                <div className="z-10 w-10 h-10 rounded-none bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(161,250,255,0.4)]">
                  <span className="material-symbols-outlined text-on-primary text-xl font-bold">check</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-primary">Initiating Bridge</h4>
                    <span className="text-[10px] font-mono text-on-surface-variant/60">0.2s ago</span>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Authorized withdrawal of 1,000.00 USDC from Arbitrum One. Transaction 0xf1...3b confirmed.
                  </p>
                </div>
              </div>
              <div className="relative flex items-start gap-6 pb-12 group">
                <div className="z-10 w-10 h-10 rounded-none bg-surface-container-highest border border-primary/50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-xl animate-spin">sync</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-headline text-sm font-bold uppercase tracking-wider text-on-surface">Waiting for Funds</h4>
                    <div className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-tighter rounded-sm">Processing</div>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Cross-chain message detected. Waiting for 12/15 network confirmations on Solana destination.
                  </p>
                  <div className="mt-4 h-1 w-full bg-white/5 overflow-hidden">
                    <div className="h-full bg-primary w-[80%] transition-all duration-500"></div>
                  </div>
                </div>
              </div>
              <div className="relative flex items-start gap-6 pb-12 group opacity-40">
                <div className="z-10 w-10 h-10 rounded-none bg-surface-container-highest border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">tune</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-headline text-sm font-bold uppercase tracking-wider">Setting Leverage</h4>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Configuring sub-account with 5x leverage parameters for SOL/USDC Perpetual market.
                  </p>
                </div>
              </div>
              <div className="relative flex items-start gap-6 group opacity-40">
                <div className="z-10 w-10 h-10 rounded-none bg-surface-container-highest border border-white/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-xl">bolt</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-headline text-sm font-bold uppercase tracking-wider">Executing Market Order</h4>
                  </div>
                  <p className="text-on-surface-variant text-sm leading-relaxed">
                    Submitting high-priority atomic transaction to the Order Book. Estimated slippage 0.05%.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-surface-container-high border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
              <a className="flex items-center gap-2 text-secondary hover:text-primary transition-colors text-xs font-mono font-bold uppercase tracking-widest" href="#">
                <span className="material-symbols-outlined text-sm">open_in_new</span>
                View in Explorer
              </a>
              <div className="flex gap-4">
                <button onClick={() => setIsExecuting(false)} className="px-6 py-2 bg-surface-container-highest text-on-surface text-xs font-headline font-bold uppercase hover:bg-white/5 transition-all">
                  CANCEL_INTENT
                </button>
                <button className="px-6 py-2 bg-primary text-on-primary text-xs font-headline font-bold uppercase shadow-[0_0_20px_rgba(161,250,255,0.2)] hover:scale-105 transition-all">
                  MONITOR_POSITION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
