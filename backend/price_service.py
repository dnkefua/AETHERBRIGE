"""Price helpers using CoinGecko public API.

Provides minimal helpers to fetch native prices for ETH and SOL and attempt
to resolve token contract prices for Ethereum via CoinGecko contract endpoints.
This is intentionally lightweight and tolerant of misses.
"""
import httpx
from typing import Dict, Optional

COINGECKO_BASE = "https://api.coingecko.com/api/v3"


async def get_native_prices() -> Dict[str, float]:
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(f"{COINGECKO_BASE}/simple/price", params={"ids": "ethereum,solana", "vs_currencies": "usd"})
        resp.raise_for_status()
        data = resp.json()
        return {"eth": data.get('ethereum', {}).get('usd'), "sol": data.get('solana', {}).get('usd')}


async def get_token_price_by_contract(contract_address: str, platform: str = 'ethereum') -> Optional[float]:
    """Try to resolve a token price by contract address via CoinGecko.

    Platform examples: 'ethereum'
    Returns USD price or None if not found.
    """
    url = f"{COINGECKO_BASE}/coins/{platform}/contract/{contract_address}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            return None
        data = resp.json()
        return data.get('market_data', {}).get('current_price', {}).get('usd')
