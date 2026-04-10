"""FastAPI application exposing the /intent endpoint.

This very small API accepts an "intent" describing a combined cross-chain
bridge + trade. It enqueues a background task which will wait for the
cross-chain settlement and then instruct the Pacifica client to execute the
requested trade.
"""
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel, Field
from typing import Optional

from .moralis_service import get_evm_balance, get_evm_erc20, MoralisError
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
