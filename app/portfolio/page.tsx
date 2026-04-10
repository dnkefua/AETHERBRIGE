'use client'

import React, { useEffect, useState } from 'react'
import { useWallet } from '../components/WalletProvider'

export default function PortfolioPage() {
  const wallet = useWallet()
  const [summary, setSummary] = useState<any>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      if (!wallet) return
      const evm = wallet.evmAddress
      const sol = wallet.solAddress
      if (!evm && !sol) return
      const params = new URLSearchParams()
      if (evm) params.set('evm_address', evm)
      if (sol) params.set('sol_address', sol)
      const url = 'http://localhost:8000/portfolio/summary?' + params.toString()
      try {
        const res = await fetch(url)
        const j = await res.json()
        setSummary(j)
      } catch (e) {
        setSummary({ error: (e as any).message })
      }
    }
    fetchSummary()
  }, [wallet?.evmAddress, wallet?.solAddress])

  return (
    <div className="pt-20 px-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-cyan-300 mb-4">Portfolio</h1>
      <p className="mb-6 text-on-surface-variant">Your open positions, P&L, balances and history.</p>

      <div className="bg-surface-container-low rounded-lg p-4 border border-white/5">
        <h3 className="font-bold mb-2">Balances</h3>
        {!wallet.evmAddress && !wallet.solAddress && (
          <div className="text-sm text-on-surface-variant">Connect MetaMask and/or Phantom to view your portfolio.</div>
        )}

        {summary && summary.evm && (
          <div className="mt-3">
            <div className="font-bold">EVM ({summary.evm.address})</div>
            <div className="text-sm">Native: {summary.evm.balance.balance_eth} ETH • ≈ ${summary.evm.native_usd?.toFixed(2) ?? '—'}</div>
            <div className="mt-2">
              <div className="font-semibold">Tokens</div>
              <ul className="mt-2 space-y-2 text-sm">
                {summary.evm.tokens.map((t: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {t.icon ? (
                        <img src={t.icon} alt="icon" className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs">?</div>
                      )}
                      <div>
                        <div className="font-medium text-sm">{t.symbol || t.name || t.contract_address || t.token_address}</div>
                        <div className="text-xs text-on-surface-variant">{t.decimals ? (Number(t.balance) / (10 ** t.decimals)).toFixed(4) : t.balance}</div>
                      </div>
                    </div>
                    <div>{t.usd_value ? '$' + Number(t.usd_value).toFixed(2) : '—'}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {summary && summary.solana && (
          <div className="mt-4">
            <div className="font-bold">Solana ({summary.solana.address})</div>
            <div className="text-sm">Native: {summary.solana.balance.sol} SOL • ≈ ${summary.solana.native_usd?.toFixed(2) ?? '—'}</div>
            <div className="mt-2">
              <div className="font-semibold">Tokens</div>
              <ul className="mt-2 space-y-2 text-sm">
                {summary.solana.tokens.map((t: any, idx: number) => (
                  <li key={idx} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {t.icon ? (
                        <img src={t.icon} alt="icon" className="w-6 h-6 rounded-full" />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-xs">S</div>
                      )}
                      <div>
                        <div className="font-medium text-sm">{t.mint}</div>
                        <div className="text-xs text-on-surface-variant">{t.amount}</div>
                      </div>
                    </div>
                    <div>{t.usd_value ? '$' + Number(t.usd_value).toFixed(2) : '—'}</div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
