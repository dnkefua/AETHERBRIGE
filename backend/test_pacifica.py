import os
import sys
import time

# Ensure backend packages are importable when pytest runs from the backend folder
sys.path.insert(0, os.path.dirname(__file__))

from fastapi.testclient import TestClient

from backend.main import app


def test_intent_accepted_and_background_trigger(monkeypatch):
    called = {}

    def fake_poll(intent):
        # simple replacement for the long-running background poll; record call
        called['intent'] = intent

    # Patch the tracker function used by the API (it was imported into backend.main)
    monkeypatch.setattr('backend.main.poll_bridge_and_execute', fake_poll)

    client = TestClient(app)

    payload = {
        "bridge_tx_hash": "0xdeadbeef",
        "solana_wallet_address": "8fG6...ExampleSolanaPubKey",
        "market": "SOL-PERP",
        "side": "long",
        "leverage": 5,
        "size": 1.25,
        "agent_wallet_address": "AgentPubKeyExample",
        "agent_private_key": "AgentPrivateKeyExample",
    }

    resp = client.post('/intent', json=payload)
    assert resp.status_code == 202
    # Background task runs synchronously in the test because we patched the
    # callable; verify the patched function was invoked.
    assert 'intent' in called
    assert called['intent']['bridge_tx_hash'] == payload['bridge_tx_hash']
