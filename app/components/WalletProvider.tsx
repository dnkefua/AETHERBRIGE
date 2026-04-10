'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

type WalletContextValue = {
  evmAddress: string | null
  solAddress: string | null
  connectEvm: () => Promise<string | null>
  connectSol: () => Promise<string | null>
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined)

export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used within WalletProvider')
  return ctx
}

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const [evmAddress, setEvmAddress] = useState<string | null>(null)
  const [solAddress, setSolAddress] = useState<string | null>(null)

  useEffect(() => {
    // Try to eagerly read connected addresses
    if (typeof window !== 'undefined') {
      const eth = (window as any).ethereum
      if (eth && eth.selectedAddress) setEvmAddress(eth.selectedAddress)
      const sol = (window as any).solana
      if (sol && sol.isPhantom && sol.publicKey) setSolAddress(sol.publicKey.toString())
    }
  }, [])

  const connectEvm = async () => {
    try {
      const eth = (window as any).ethereum
      if (!eth) return null
      const accounts = await eth.request({ method: 'eth_requestAccounts' })
      const addr = accounts && accounts[0]
      setEvmAddress(addr)
      return addr
    } catch (e) {
      return null
    }
  }

  const connectSol = async () => {
    try {
      const sol = (window as any).solana
      if (!sol) return null
      const resp = await sol.connect()
      const addr = resp.publicKey.toString()
      setSolAddress(addr)
      return addr
    } catch (e) {
      return null
    }
  }

  return (
    <WalletContext.Provider value={{ evmAddress, solAddress, connectEvm, connectSol }}>
      {children}
    </WalletContext.Provider>
  )
}
