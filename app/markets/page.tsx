'use client'

import React from 'react'
import CrossChainPerpInterface from '../components/CrossChainPerpInterface'

export default function MarketsPage() {
  return (
    <div className="pt-20 px-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-cyan-300 mb-4">Markets</h1>
      <p className="mb-6 text-on-surface-variant">Browse Pacifica markets, view depth and quick trade panels.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-1">
          {/* Trade panel component reused here for demo */}
          <CrossChainPerpInterface />
        </div>
        <div className="col-span-1 bg-surface-container-low rounded-lg p-4 border border-white/5">
          <h3 className="font-bold mb-3">Market Overview</h3>
          <ul className="text-sm space-y-2 text-on-surface-variant">
            <li>SOL-PERP: Price 142.68 • 24h +4.2%</li>
            <li>ETH-PERP: Price 2,451.12 • 24h -0.8%</li>
            <li>BTC-PERP: Price 69,420.00 • 24h +1.1%</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
