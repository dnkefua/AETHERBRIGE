"""Price helpers using CoinGecko public API.

Provides minimal helpers to fetch native prices for ETH and SOL and attempt
to resolve token contract prices for Ethereum via CoinGecko contract endpoints.
This is intentionally lightweight and tolerant of misses.
"""
import httpx
from typing import Dict, Optional, Tuple
from .cache import get as cache_get, set as cache_set

COINGECKO_BASE = "https://api.coingecko.com/api/v3"


async def get_native_prices() -> Dict[str, float]:
    # cache key
    cached = await cache_get('prices:native')
    if cached:
        return cached

    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(f"{COINGECKO_BASE}/simple/price", params={"ids": "ethereum,solana", "vs_currencies": "usd"})
        resp.raise_for_status()
        data = resp.json()
        out = {"eth": data.get('ethereum', {}).get('usd'), "sol": data.get('solana', {}).get('usd')}
        await cache_set('prices:native', out, ttl=60)
        return out


async def get_token_price_by_contract(contract_address: str, platform: str = 'ethereum') -> Optional[dict]:
    """Try to resolve a token price and image by contract address via CoinGecko.

    Returns dict: {price: float, image: url} or None.
    """
    key = f'price:contract:{platform}:{contract_address.lower()}'
    cached = await cache_get(key)
    if cached:
        return cached

    url = f"{COINGECKO_BASE}/coins/{platform}/contract/{contract_address}"
    async with httpx.AsyncClient(timeout=10.0) as client:
        resp = await client.get(url)
        if resp.status_code != 200:
            return None
        data = resp.json()
        price = data.get('market_data', {}).get('current_price', {}).get('usd')
        image = data.get('image', {}).get('thumb') or data.get('image', {}).get('small')
        out = {'price': price, 'image': image}
        await cache_set(key, out, ttl=300)
        return out
