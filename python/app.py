from flask import Flask, request, jsonify
from statistics import mean, pstdev
import time

app = Flask(__name__)

@app.get("/health")
def health():
    return jsonify(status="ok", service="python-analytics")

@app.post("/analyze")
def analyze():
    """
    Minimal "FinTech analytics" example:
    - expects JSON: { "returns": [0.01, -0.02, ...] }
    - outputs: avg_return, volatility, risk_score, processed_at
    """
    payload = request.get_json(silent=True) or {}
    returns = payload.get("returns", [])

    if not isinstance(returns, list) or not all(isinstance(x, (int, float)) for x in returns):
        return jsonify(error="`returns` must be an array of numbers."), 400

    if len(returns) < 2:
        return jsonify(error="Provide at least 2 return values."), 400

    avg = mean(returns)
    vol = pstdev(returns)  # population stdev for simplicity

    # Simple "risk score": volatility scaled to 0-100-ish range
    risk_score = min(100.0, max(0.0, vol * 1000))

    return jsonify(
        avg_return=avg,
        volatility=vol,
        risk_score=risk_score,
        processed_at=int(time.time())
    )

if __name__ == "__main__":
    # Runs on localhost:5001
    app.run(host="127.0.0.1", port=5001, debug=True)
