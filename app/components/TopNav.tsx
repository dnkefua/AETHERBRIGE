'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useWallet } from './WalletProvider'

export default function TopNav() {
  const [open, setOpen] = useState(false)

  const wallet = (typeof window !== 'undefined') ? useWallet() : null

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#071019] bg-gradient-to-b from-[#071019] to-transparent border-b border-white/5">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-cyan-400">hub</span>
            <span className="text-lg font-bold text-cyan-400 uppercase">AETHER_BRIDGE</span>
          </Link>

          <nav className="hidden md:flex items-center gap-2 bg-transparent">
            <div className="relative">
              <button onClick={() => setOpen(v => !v)} className="px-3 py-1 rounded text-sm bg-white/5 hover:bg-white/8">
                Markets
              </button>
              {open && (
                <div className="absolute left-0 mt-2 w-48 bg-[#0c1114] border border-white/5 rounded shadow-lg p-2">
                  <Link href="/markets" className="block px-2 py-1 hover:bg-white/3 rounded">All Markets</Link>
                  <Link href="/markets#sol" className="block px-2 py-1 hover:bg-white/3 rounded">SOL-PERP</Link>
                  <Link href="/markets#eth" className="block px-2 py-1 hover:bg-white/3 rounded">ETH-PERP</Link>
                  <Link href="/markets#btc" className="block px-2 py-1 hover:bg-white/3 rounded">BTC-PERP</Link>
                </div>
              )}
            </div>
            <Link href="/portfolio" className="px-3 py-1 rounded text-sm bg-transparent hover:bg-white/5">Portfolio</Link>
            <Link href="/settings" className="px-3 py-1 rounded text-sm bg-transparent hover:bg-white/5">Settings</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/" className="text-xs font-mono text-on-surface-variant hidden md:block">Docs</Link>
          {wallet ? (
            <div className="flex items-center gap-2">
              <button onClick={() => wallet.connectEvm()} className="px-3 py-1 rounded bg-white/5 text-sm">{wallet.evmAddress ? wallet.evmAddress.slice(0,6)+'...'+wallet.evmAddress.slice(-4) : 'Connect EVM'}</button>
              <button onClick={() => wallet.connectSol()} className="px-3 py-1 rounded bg-white/5 text-sm">{wallet.solAddress ? wallet.solAddress.slice(0,6)+'...'+wallet.solAddress.slice(-4) : 'Connect SOL'}</button>
            </div>
          ) : (
            <button className="px-3 py-1 rounded bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm">Connect Wallets</button>
          )}
        </div>
      </div>
    </header>
  )
}
