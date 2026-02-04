import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5000;

// Where the Python microservice runs
const PYTHON_BASE_URL = process.env.PYTHON_BASE_URL || "http://127.0.0.1:5001";

app.use(cors());
app.use(express.json());

/**
 * GET /api/info
 * Static JSON endpoint: easy proof the API is alive, plus clear docs.
 */
app.get("/api/info", (req, res) => {
  res.json({
    name: "FinPulse",
    purpose: "Portfolio demo: React SPA + Node API + Python analytics microservice",
    endpoints: {
      info: "GET /api/info",
      analyze: "POST /api/analyze  { returns: number[] }"
    },
    stack: ["React", "Node.js", "Express", "Python", "Flask"]
  });
});

/**
 * POST /api/analyze
 * Bridges to Python so visitors can see the full stack interaction.
 */
app.post("/api/analyze", async (req, res) => {
  try {
    const { returns } = req.body ?? {};

    // Basic input validation at the API boundary
    if (!Array.isArray(returns) || returns.length < 2) {
      return res.status(400).json({
        error: "Provide `returns` as an array with at least 2 numbers."
      });
    }

    const pythonResp = await fetch(`${PYTHON_BASE_URL}/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ returns })
    });

    const data = await pythonResp.json();

    if (!pythonResp.ok) {
      return res.status(pythonResp.status).json({
        error: "Python service error",
        details: data
      });
    }

    return res.json({
      input_count: returns.length,
      analytics: data,
      source: "python-analytics"
    });
  } catch (err) {
    return res.status(500).json({
      error: "Server error while calling Python service",
      details: String(err?.message || err)
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://127.0.0.1:${PORT}`);
  console.log(`Using Python service at ${PYTHON_BASE_URL}`);
});
