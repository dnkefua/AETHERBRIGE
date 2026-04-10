"""Solana JSON-RPC helper functions.

Provides simple helpers to query native SOL balance and parsed token accounts
using the Solana JSON-RPC `getBalance` and `getTokenAccountsByOwner` methods
with `jsonParsed` encoding.
"""
from typing import Any, Dict, List, Optional
import httpx
from .cache import get as cache_get, set as cache_set

DEFAULT_RPC = "https://api.mainnet-beta.solana.com"


class SolanaError(RuntimeError):
    pass


async def _rpc_request(rpc_url: str, method: str, params: Optional[list] = None) -> Any:
    payload = {"jsonrpc": "2.0", "id": 1, "method": method, "params": params or []}
    async with httpx.AsyncClient(timeout=20.0) as client:
        resp = await client.post(rpc_url, json=payload)
        if resp.status_code >= 400:
            raise SolanaError(f"RPC request failed: {resp.status_code} {resp.text}")
        data = resp.json()
        if 'error' in data:
            raise SolanaError(f"RPC error: {data['error']}")
        return data.get('result')


async def get_solana_balance(address: str, rpc_url: Optional[str] = None) -> Dict[str, Any]:
    rpc = rpc_url or DEFAULT_RPC
    key = f'solana:balance:{rpc}:{address}'
    cached = await cache_get(key)
    if cached:
        return cached

    result = await _rpc_request(rpc, 'getBalance', [address])
    lamports = int(result.get('value', 0))
    sol = lamports / 10**9
    out = {"lamports": lamports, "sol": sol, "rpc": rpc}
    await cache_set(key, out, ttl=15)
    return out


async def get_solana_tokens(address: str, rpc_url: Optional[str] = None) -> List[Dict[str, Any]]:
    rpc = rpc_url or DEFAULT_RPC
    key = f'solana:tokens:{rpc}:{address}'
    cached = await cache_get(key)
    if cached:
        return cached
    # Use jsonParsed to get token amounts and mint addresses
    params = [address, {"encoding": "jsonParsed", "commitment": "confirmed", "filters": []}]
    result = await _rpc_request(rpc, 'getTokenAccountsByOwner', params)
    items = []
    for acc in result.get('value', []):
        info = acc.get('account', {}).get('data', {})
        parsed = info.get('parsed', {})
        if parsed:
            token_info = parsed.get('info', {})
            mint = token_info.get('mint')
            token_amount = token_info.get('tokenAmount', {})
            items.append({
                'mint': mint,
                'amount': token_amount.get('uiAmountString') or token_amount.get('amount'),
                'decimals': token_amount.get('decimals'),
            })
    return items

