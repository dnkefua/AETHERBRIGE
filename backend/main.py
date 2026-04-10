"""FastAPI application exposing the /intent endpoint.

This very small API accepts an "intent" describing a combined cross-chain
bridge + trade. It enqueues a background task which will wait for the
cross-chain settlement and then instruct the Pacifica client to execute the
requested trade.
"""
from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from .moralis_service import get_evm_balance, get_evm_erc20, MoralisError
from .solana_service import get_solana_balance, get_solana_tokens, SolanaError
from .price_service import get_native_prices, get_token_price_by_contract
from .tracker_service import poll_bridge_and_execute


class Intent(BaseModel):
    bridge_tx_hash: str = Field(..., description="Transaction hash on the source/EVM chain")
    solana_wallet_address: str = Field(..., description="Destination Solana wallet address to receive bridged funds")
    market: str = Field(..., description="Pacifica market name, e.g. SOL-PERP")
    side: str = Field(..., description="'long' or 'short'")
    leverage: float = Field(..., gt=0, description="Leverage factor")
    size: float = Field(..., gt=0, description="Order size (market-specific units)")
    evm_chain: Optional[str] = Field("arbitrum")
    source_token: Optional[str] = Field("USDC")
    # Agent wallet credentials: in production do NOT accept raw private keys
    # via the public API. This example accepts them to show the flow.
    agent_wallet_address: Optional[str] = None
    agent_private_key: Optional[str] = None
    solana_rpc: Optional[str] = None


app = FastAPI(title="AetherBridge Intent API")

# Allow local frontend dev (http://localhost:3000) to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/intent", status_code=202)
async def create_intent(intent: Intent, background_tasks: BackgroundTasks):
    # Basic validation
    if intent.side.lower() not in ("long", "short", "buy", "sell"):
        raise HTTPException(status_code=400, detail="side must be 'long' or 'short'")

    # Enqueue background worker that will poll for settlement and execute the
    # requested trade. We pass the raw dict so the background task can be
    # executed outside the request lifecycle.
    background_tasks.add_task(poll_bridge_and_execute, intent.dict())
    return {"status": "accepted", "message": "Intent received and queued"}



 @app.get("/moralis/evm/balance")
 async def evm_balance(address: str, chain: str = "eth"):
     """Fetch native balance for an EVM address using Moralis.

     Example: /moralis/evm/balance?address=0xabc&chain=arbitrum
     """
     try:
         res = await get_evm_balance(address, chain)
         return {"ok": True, "data": res}
     except MoralisError as e:
         raise HTTPException(status_code=502, detail=str(e))


 @app.get("/moralis/evm/tokens")
 async def evm_tokens(address: str, chain: str = "eth"):
     """Fetch ERC-20 token balances for an EVM address via Moralis."""
     try:
         res = await get_evm_erc20(address, chain)
         return {"ok": True, "tokens": res}
     except MoralisError as e:
         raise HTTPException(status_code=502, detail=str(e))


@app.get("/solana/balance")
async def sol_balance(address: str, rpc: str | None = None):
    try:
        res = await get_solana_balance(address, rpc)
        return {"ok": True, "data": res}
    except SolanaError as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.get("/solana/tokens")
async def sol_tokens(address: str, rpc: str | None = None):
    try:
        res = await get_solana_tokens(address, rpc)
        return {"ok": True, "tokens": res}
    except SolanaError as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.get('/portfolio/summary')
async def portfolio_summary(evm_address: str | None = None, sol_address: str | None = None, evm_chain: str = 'eth', rpc: str | None = None):
    """Return aggregated balances and token lists for EVM and Solana addresses, with fiat estimates where available."""
    out = {"evm": None, "solana": None, "prices": {}}
    # Fetch native prices first
    try:
        prices = await get_native_prices()
        out['prices'] = prices
    except Exception:
        out['prices'] = {}

    if evm_address:
        try:
            bal = await get_evm_balance(evm_address, chain=evm_chain)
            tokens = await get_evm_erc20(evm_address, chain=evm_chain)
            # Try to enrich tokens with USD values where possible (contract-based)
            enriched = []
                    for t in tokens:
                        contract = (t.get('token_address') or t.get('contract_address') or t.get('contractAddress') or t.get('contract'))
                        price_info = None
                        if contract:
                            try:
                                price_info = await get_token_price_by_contract(contract, platform='ethereum')
                            except Exception:
                                price_info = None

                        price = price_info.get('price') if price_info else None
                        icon = price_info.get('image') if price_info else None

                        # compute usd if we have price and amount
                        amount_raw = t.get('balance') or t.get('amount') or t.get('value')
                        usd = None
                        try:
                            if price and amount_raw:
                                decimals = int(t.get('decimals', 0) or 0)
                                amt = int(amount_raw) / (10 ** decimals) if decimals else float(t.get('balance', 0))
                                usd = amt * price
                        except Exception:
                            usd = None

                        enriched.append({**t, 'price_usd': price, 'usd_value': usd, 'icon': icon})

            native_usd = None
            try:
                native_usd = float(bal.get('balance_eth')) * float(out['prices'].get('eth', 0) or 0)
            except Exception:
                native_usd = None

            out['evm'] = {"address": evm_address, "balance": bal, "tokens": enriched, "native_usd": native_usd}
        except Exception as e:
            out['evm'] = {"error": str(e)}

    if sol_address:
        try:
            bal = await get_solana_balance(sol_address, rpc)
            tokens = await get_solana_tokens(sol_address, rpc)
            # Solana token price resolution is best-effort (CoinGecko contract lookup)
            enriched = []
            for t in tokens:
                mint = t.get('mint')
                price_info = None
                if mint:
                    try:
                        price_info = await get_token_price_by_contract(mint, platform='solana')
                    except Exception:
                        price_info = None
                price = price_info.get('price') if price_info else None
                icon = price_info.get('image') if price_info else None
                amt = None
                try:
                    amt = float(t.get('amount') or 0)
                except Exception:
                    amt = None
                usd = amt * price if (amt is not None and price is not None) else None
                enriched.append({**t, 'price_usd': price, 'usd_value': usd, 'icon': icon})

            native_usd = None
            try:
                native_usd = float(bal.get('sol')) * float(out['prices'].get('sol', 0) or 0)
            except Exception:
                native_usd = None

            out['solana'] = {"address": sol_address, "balance": bal, "tokens": enriched, "native_usd": native_usd}
        except Exception as e:
            out['solana'] = {"error": str(e)}

    return out
