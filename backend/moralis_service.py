"""Simple Moralis API wrapper for EVM chain queries.

This module provides async helpers to query Moralis REST endpoints for basic
EVM account information (balance and ERC-20 token balances). It reads the
`MORALIS_API_KEY` from the environment and returns JSON-like dicts.

Replace or extend with additional Moralis endpoints as needed.
"""
import os
from typing import Any, Dict, List, Optional
import httpx
from .cache import get as cache_get, set as cache_set

MORALIS_KEY = os.environ.get("MORALIS_API_KEY")
EVM_BASE = "https://deep-index.moralis.io/api/v2"


class MoralisError(RuntimeError):
    pass


async def _get(path: str, params: Optional[Dict[str, Any]] = None) -> Any:
    if not MORALIS_KEY:
        raise MoralisError("MORALIS_API_KEY not configured in environment")

    headers = {"X-API-Key": MORALIS_KEY, "Accept": "application/json"}
    url = path if path.startswith("http") else f"{EVM_BASE}{path}"

    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.get(url, headers=headers, params=params)
        if resp.status_code >= 400:
            raise MoralisError(f"Moralis request failed ({resp.status_code}): {resp.text}")
        return resp.json()


async def get_evm_balance(address: str, chain: str = "eth") -> Dict[str, Any]:
    """Return the native balance (wei) for an EVM address on the specified chain.

    Returns a dict: {"balance": <wei string>, "balance_eth": <float>}
    """
    key = f'evm:balance:{chain}:{address.lower()}'
    cached = await cache_get(key)
    if cached:
        return cached

    data = await _get(f"/{address}/balance", params={"chain": chain})
    # Moralis returns a string balance in wei
    balance_wei = int(data.get("balance", 0))
    balance_eth = balance_wei / 10**18
    out = {"balance": str(balance_wei), "balance_eth": balance_eth, "chain": chain}
    await cache_set(key, out, ttl=15)
    return out


async def get_evm_erc20(address: str, chain: str = "eth") -> List[Dict[str, Any]]:
    """Return list of ERC-20 token balances for an address.

    Each entry follows Moralis' shape (contract_address, name, symbol, decimals, balance).
    """
    key = f'evm:erc20:{chain}:{address.lower()}'
    cached = await cache_get(key)
    if cached:
        return cached

    data = await _get(f"/{address}/erc20", params={"chain": chain})
    await cache_set(key, data, ttl=30)
    return data
