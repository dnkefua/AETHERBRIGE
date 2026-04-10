'use client'

import React from 'react'

export default function PortfolioPage() {
  return (
    <div className="pt-20 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-cyan-300 mb-4">Portfolio</h1>
      <p className="mb-6 text-on-surface-variant">Your open positions, P&L, balances and history.</p>

      <div className="bg-surface-container-low rounded-lg p-4 border border-white/5">
        <h3 className="font-bold mb-2">Open Positions</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <div>
              <div className="font-bold">SOL-PERP • 10x</div>
              <div className="text-on-surface-variant text-xs">Size: 42.5 SOL</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-mono text-primary font-bold">+$420.69</div>
              <div className="text-on-surface-variant text-xs">+12.4%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
