"""Simple Redis-based async cache wrapper used by backend services.

Uses `REDIS_URL` environment variable. Provides `get(key)` and `set(key, value, ttl)`.
"""
import os
import json
import asyncio
from typing import Any, Optional

import redis.asyncio as aioredis

REDIS_URL = os.environ.get('REDIS_URL')
_client: Optional[aioredis.Redis] = None


def _get_client() -> aioredis.Redis:
    global _client
    if _client is None:
        if not REDIS_URL:
            raise RuntimeError('REDIS_URL not configured')
        _client = aioredis.from_url(REDIS_URL)
    return _client


async def get(key: str) -> Optional[Any]:
    try:
        c = _get_client()
        raw = await c.get(key)
        if raw is None:
            return None
        return json.loads(raw)
    except Exception:
        return None


async def set(key: str, value: Any, ttl: int = 60) -> None:
    try:
        c = _get_client()
        await c.set(key, json.dumps(value), ex=ttl)
    except Exception:
        return None
