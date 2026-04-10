# AetherBridge — Cross-Chain Intent Perps (Demo)

This workspace contains a Next.js frontend and a Python FastAPI backend demonstrating an "intent-based" cross-chain bridge + perpetuals execution flow.

Quick start (development)

1. Frontend

```bash
# from workspace root
npm install
npm run dev
# Open http://localhost:3000
```

2. Backend

```bash
# from workspace root
python -m venv .venv
.\.venv\Scripts\activate     # Windows
# or: source .venv/bin/activate  # macOS / Linux
pip install -r backend/requirements.txt
# (Optional) Install the Pacifica SDK in production:
# pip install "git+https://github.com/pacifica-fi/python-sdk.git"

# Start the API server
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
# Backend API: http://localhost:8000
```

3. Tests

```bash
# from workspace root
cd backend
pytest -q
```

Notes & safety
- The included `pacifica_client.py` is a wrapper that simulates SDK calls when the real SDK is not installed. Replace simulated branches with the real SDK in production.
- Never send or store raw private keys from the browser or on public endpoints. The example accepts `agent_private_key` only to demonstrate the flow — in production use secure delegation flows and never transmit private keys from the frontend.
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/9145056a-e457-4f4b-9a7a-e698ddb84b41

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
