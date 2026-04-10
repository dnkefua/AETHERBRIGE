"""Pacifica client wrapper.

This module provides a thin wrapper around the (external) Pacifica Python SDK.
If the SDK is not installed, the wrapper will operate in a simulated mode so
the rest of the application and tests can run without the real SDK.

Replace the simulated branches with real SDK calls in production.
"""
from typing import Optional
import logging

try:
    # The real SDK import placeholder. The real package name and client API
    # may differ; this is a safe import wrapper.
    import pacifica  # type: ignore
    HAS_PACIFICA = True
except Exception:  # pragma: no cover - simulation branch
    HAS_PACIFICA = False


class PacificaClient:
    def __init__(self, network: str, account_address: str, agent_wallet_address: Optional[str], agent_private_key: Optional[str]):
        self.network = network
        self.account_address = account_address
        self.agent_wallet_address = agent_wallet_address
        self.agent_private_key = agent_private_key
        self._client = None

        if HAS_PACIFICA:
            # Example initialization - replace with real SDK constructor when available
            try:
                # pacifica.PacificaClient is a placeholder name
                self._client = pacifica.PacificaClient(
                    network=network,
                    account_address=account_address,
                    agent_wallet_address=agent_wallet_address,
                    agent_private_key=agent_private_key,
                )
            except Exception:
                logging.exception("Failed to initialize Pacifica SDK client")
                self._client = None

    def update_leverage(self, market: str, leverage: float) -> dict:
        """Update margin/leverage for the agent's trading context.

        Returns a dict with operation result. In real mode it proxies the SDK
        call, in simulated mode it returns a helpful dict for testing.
        """
        if self._client:
            # Proxy to real SDK; adjust API call to match the SDK
            result = self._client.update_leverage(market=market, leverage=leverage)
            return {"status": "ok", "result": result}

        # Simulation mode
        logging.info("[pacifica-client] simulated update_leverage %s %s", market, leverage)
        return {"status": "simulated", "market": market, "leverage": leverage}

    def create_market_order(self, market: str, side: str, size: float, slippage: float = 0.005) -> dict:
        """Create a market order on the specified market.

        - side: 'long' or 'short'
        - size: notional or base size depending on market conventions
        """
        if self._client:
            # Proxy to real SDK; adjust API call to match the SDK
            result = self._client.create_market_order(market=market, side=side, size=size, slippage=slippage)
            return {"status": "ok", "result": result}

        logging.info("[pacifica-client] simulated create_market_order %s %s %s", market, side, size)
        return {"status": "simulated", "market": market, "side": side, "size": size}
