'use client'

import React, { useState } from 'react'

type IntentPayload = {
  bridge_tx_hash: string
  solana_wallet_address: string
  market: string
  side: string
  leverage: number
  size: number
  evm_chain?: string
  source_token?: string
  agent_wallet_address?: string
  agent_private_key?: string
}

// A polished, self-contained interface component that simulates wallet
// connections, simulates a bridge tx, and submits the intent to the backend.
export default function CrossChainPerpInterface() {
  const [evmConnected, setEvmConnected] = useState(false)
  const [solConnected, setSolConnected] = useState(false)
  const [amount, setAmount] = useState('1000')
  const [market, setMarket] = useState('SOL-PERP')
  const [side, setSide] = useState<'long'|'short'>('long')
  const [leverage, setLeverage] = useState(5)
  const [size, setSize] = useState(1)
  const [status, setStatus] = useState<string | null>(null)

  const simulateBridgeTx = () => {
    // Create a pseudo tx hash to emulate a bridge transaction
    return '0x' + Array.from({length: 32}).map(() => Math.floor(Math.random()*16).toString(16)).join('')
  }

  const execute = async () => {
    if (!evmConnected || !solConnected) {
      setStatus('Connect both wallets before executing')
      return
    }

    setStatus('Simulating bridge transaction...')
    const tx = simulateBridgeTx()
    setTimeout(async () => {
      setStatus('Bridge submitted: ' + tx + ' — sending intent to backend')

      const payload: IntentPayload = {
        bridge_tx_hash: tx,
        solana_wallet_address: solConnected ? 'ExampleSolanaPubKey' : '',
        market,
        side,
        leverage,
        size,
        evm_chain: 'arbitrum',
        source_token: 'USDC',
        // NOTE: In production do NOT send private keys from the browser.
        agent_wallet_address: 'AgentPubKeyExample',
        agent_private_key: 'AgentPrivateKeyExample',
      }

      try {
        const res = await fetch('http://localhost:8000/intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (res.ok) {
          setStatus('Intent accepted; watch backend for execution')
        } else {
          const body = await res.json()
          setStatus('Backend error: ' + (body.detail || JSON.stringify(body)))
        }
      } catch (err: any) {
        setStatus('Network error: ' + err.message)
      }
    }, 800)
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-gradient-to-b from-[#061018] to-[#08121a] rounded-lg border border-white/5 shadow-lg">
      <h3 className="text-xl font-bold text-cyan-300 mb-4">Cross-Chain Perp Interface</h3>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <button
          onClick={() => setEvmConnected(v => !v)}
          className={`py-2 rounded ${evmConnected ? 'bg-green-600' : 'bg-white/5'}`}>
          {evmConnected ? 'EVM: Connected (MetaMask)' : 'Connect EVM Wallet'}
        </button>
        <button
          onClick={() => setSolConnected(v => !v)}
          className={`py-2 rounded ${solConnected ? 'bg-green-600' : 'bg-white/5'}`}>
          {solConnected ? 'Solana: Connected (Phantom)' : 'Connect Solana Wallet'}
        </button>
      </div>

      <div className="mb-3">
        <label className="text-xs text-on-surface-variant">Source Token (USDC)</label>
        <input value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 bg-transparent border border-white/5 rounded mt-1" />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div>
          <label className="text-xs">Market</label>
          <select value={market} onChange={e => setMarket(e.target.value)} className="w-full p-2 bg-transparent border border-white/5 rounded mt-1">
            <option>SOL-PERP</option>
            <option>ETH-PERP</option>
            <option>BTC-PERP</option>
          </select>
        </div>
        <div>
          <label className="text-xs">Side</label>
          <div className="flex gap-2 mt-1">
            <button onClick={() => setSide('long')} className={`flex-1 py-2 rounded ${side==='long' ? 'bg-cyan-500' : 'bg-white/5'}`}>Long</button>
            <button onClick={() => setSide('short')} className={`flex-1 py-2 rounded ${side==='short' ? 'bg-rose-500' : 'bg-white/5'}`}>Short</button>
          </div>
        </div>
      </div>

      <div className="mb-3">
        <label className="text-xs">Leverage: {leverage}x</label>
        <input type="range" min={1} max={20} value={leverage} onChange={e => setLeverage(Number(e.target.value))} className="w-full" />
      </div>

      <div className="mb-3">
        <label className="text-xs">Size</label>
        <input type="number" value={size} onChange={e => setSize(Number(e.target.value))} className="w-full p-2 bg-transparent border border-white/5 rounded mt-1" />
      </div>

      <div className="flex gap-3">
        <button onClick={execute} className="flex-1 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded font-bold">Execute Cross-Chain Trade</button>
        <button onClick={() => { setStatus(null); setAmount('1000') }} className="py-3 px-4 bg-white/5 rounded">Reset</button>
      </div>

      <div className="mt-3 text-sm text-on-surface-variant">
        <div>Bridge: Arbitrum → Solana (USDC)</div>
        <div className="mt-2 py-2 px-3 bg-white/5 rounded text-xs">Status: {status ?? 'idle'}</div>
      </div>
    </div>
  )
}
