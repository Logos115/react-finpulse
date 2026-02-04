# FinPulse (Portfolio Demo)

A minimal FinTech-style demo showing a full request path:

React SPA → Node/Express REST API → Python/Flask “analytics” microservice → back to React.

No auth, no routing, no dashboards — just clean structure and readable code.

## Tech
- React (Vite)
- Node.js + Express
- Python + Flask

## Setup

### 1) Python service
```bash
cd python
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python app.py
