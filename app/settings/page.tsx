'use client'

import React from 'react'

export default function SettingsPage() {
  return (
    <div className="pt-20 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-cyan-300 mb-4">Settings</h1>
      <p className="mb-6 text-on-surface-variant">Manage wallets, API keys, agent delegation, and preferences.</p>

      <div className="bg-surface-container-low rounded-lg p-4 border border-white/5 space-y-4">
        <div>
          <div className="text-sm font-bold">Wallets</div>
          <div className="text-xs text-on-surface-variant">Connect or disconnect MetaMask and Phantom, view addresses.</div>
        </div>
        <div>
          <div className="text-sm font-bold">Agent Delegation</div>
          <div className="text-xs text-on-surface-variant">Register agent wallet public key and set delegation options.</div>
        </div>
        <div>
          <div className="text-sm font-bold">Advanced</div>
          <div className="text-xs text-on-surface-variant">RPC settings, slippage defaults, and safety limits.</div>
        </div>
      </div>
    </div>
  )
}
