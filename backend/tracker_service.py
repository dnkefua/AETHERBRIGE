"""Background tracker service.

This module provides a simple background poller that waits for the cross-chain
bridge to be settled on Solana and then triggers the Pacifica client to execute
the requested trade. In production this would be a robust Celery worker or
cloud task; here we use an asyncio polling loop started via FastAPI's
BackgroundTasks for simplicity.
"""
import asyncio
import logging
from typing import Dict, Any

from .pacifica_client import PacificaClient


async def _poll_and_execute(intent: Dict[str, Any]) -> None:
    bridge_tx = intent.get("bridge_tx_hash")
    sol_addr = intent.get("solana_wallet_address")
    market = intent.get("market")
    side = intent.get("side")
    leverage = float(intent.get("leverage"))
    size = float(intent.get("size"))

    # Best-effort: allow providing a custom Solana RPC URL in the intent; if
    # omitted we'll simulate settlement after a short delay to keep the demo
    # lightweight and deterministic.
    solana_rpc = intent.get("solana_rpc")

    logging.info("Tracker started for bridge_tx=%s -> %s", bridge_tx, sol_addr)

    # Simple simulation mode: if a solana_rpc URL is provided, you could query
    # the RPC for transaction confirmation. For the purposes of this sample
    # we wait a short period and assume success.
    if solana_rpc:
        # In production, implement a robust check here using `httpx` or
        # `solana-py` to validate the destination credit.
        checks = 0
        max_checks = 60
        interval = 5
        while checks < max_checks:
            logging.debug("Polling solana RPC %s (attempt %d)", solana_rpc, checks + 1)
            await asyncio.sleep(interval)
            checks += 1
            # Insert real check here; break when credit detected.
            # For this template we'll break immediately for brevity.
            break
    else:
        # Simulate a quick settlement for demo / tests
        await asyncio.sleep(3)

    logging.info("Bridge appears settled for tx=%s; executing trade", bridge_tx)

    # Initialize Pacifica client and execute the requested actions.
    client = PacificaClient(
        network="mainnet",
        account_address=sol_addr,
        agent_wallet_address=intent.get("agent_wallet_address"),
        agent_private_key=intent.get("agent_private_key"),
    )

    try:
        res_leverage = client.update_leverage(market, leverage)
        logging.info("Leverage result: %s", res_leverage)

        res_order = client.create_market_order(market, side.lower(), size)
        logging.info("Order result: %s", res_order)
    except Exception:
        logging.exception("Error executing trade for intent=%s", intent)


def poll_bridge_and_execute(intent: Dict[str, Any]) -> None:
    """Entry point expected by FastAPI BackgroundTasks.

    `BackgroundTasks.add_task` expects a normal callable. We run the async
    routine using `asyncio.run` so the background runner can be synchronous.
    """
    try:
        asyncio.run(_poll_and_execute(intent))
    except Exception:
        logging.exception("Background task failed")
