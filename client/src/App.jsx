import { useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:5000";

function Chip({ children }) {
  return (
    <span style={{
      display: "inline-flex",
      padding: "6px 10px",
      borderRadius: 999,
      border: "1px solid rgba(255,255,255,0.15)",
      background: "rgba(255,255,255,0.06)",
      fontSize: 12
    }}>
      {children}
    </span>
  );
}

export default function App() {
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);

  // Dummy data to keep the demo consistent
  const sampleReturns = useMemo(() => ([
    0.012, -0.004, 0.006, 0.003, -0.011, 0.009, 0.002, -0.001
  ]), []);

  async function fetchInfo() {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch(`${API_BASE}/api/info`);
      const data = await res.json();
      setOutput(data);
    } catch (e) {
      setOutput({ error: String(e?.message || e) });
    } finally {
      setLoading(false);
    }
  }

  async function runAnalytics() {
    setLoading(true);
    setOutput(null);
    try {
      const res = await fetch(`${API_BASE}/api/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returns: sampleReturns })
      });
      const data = await res.json();
      setOutput(data);
    } catch (e) {
      setOutput({ error: String(e?.message || e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "radial-gradient(1200px 600px at 20% 10%, rgba(80,120,255,0.35), transparent), radial-gradient(1000px 600px at 80% 30%, rgba(0,200,160,0.25), transparent), #0b0f19",
      color: "rgba(255,255,255,0.92)",
      fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
    }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "72px 20px" }}>
        <header style={{ marginBottom: 28 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 12, height: 12, borderRadius: 999,
              background: "linear-gradient(135deg, #5b8cff, #00d3a7)"
            }} />
            <span style={{ letterSpacing: 2, fontSize: 12, opacity: 0.8 }}>
              FINTECH PORTFOLIO DEMO
            </span>
          </div>

          <h1 style={{ fontSize: 44, lineHeight: 1.05, margin: "14px 0 10px" }}>
            FinPulse: React → Node → Python
          </h1>

          <p style={{ fontSize: 16, maxWidth: 720, opacity: 0.85 }}>
            A clean, minimal demo showing how I wire a modern frontend to an Express API,
            bridged to a tiny Python analytics service. No auth. No dashboards. Just clear structure,
            readable code, and a working end-to-end request.
          </p>
        </header>

        <section style={{
          display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 24
        }}>
          {["React (SPA)", "Node.js", "Express REST API", "Python", "Flask microservice"].map(t => (
            <Chip key={t}>{t}</Chip>
          ))}
        </section>

        <section style={{
          display: "grid",
          gridTemplateColumns: "1.2fr 0.8fr",
          gap: 18
        }}>
          <div style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 18,
            background: "rgba(255,255,255,0.04)"
          }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Live demo</h2>
            <p style={{ marginTop: 8, opacity: 0.85 }}>
              Click a button to hit the Node API. The second route forwards to Python,
              computes a small “risk score,” and returns results back to the UI.
            </p>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
              <button
                onClick={fetchInfo}
                disabled={loading}
                style={buttonStyle}
              >
                {loading ? "Loading…" : "Fetch API Info"}
              </button>

              <button
                onClick={runAnalytics}
                disabled={loading}
                style={{ ...buttonStyle, background: "linear-gradient(135deg, #5b8cff, #00d3a7)" }}
              >
                {loading ? "Running…" : "Run Analytics (Python)"}
              </button>
            </div>

            <div style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
              Sample returns sent to API: [{sampleReturns.join(", ")}]
            </div>
          </div>

          <div style={{
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 16,
            padding: 18,
            background: "rgba(255,255,255,0.04)"
          }}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Output</h2>
            <pre style={{
              marginTop: 10,
              padding: 12,
              borderRadius: 12,
              background: "rgba(0,0,0,0.35)",
              border: "1px solid rgba(255,255,255,0.08)",
              minHeight: 220,
              overflow: "auto",
              fontSize: 12,
              lineHeight: 1.5
            }}>
              {output ? JSON.stringify(output, null, 2) : "Click a button to see results…"}
            </pre>
          </div>
        </section>

        <footer style={{ marginTop: 28, opacity: 0.7, fontSize: 12 }}>
          Tip: set <code>VITE_API_BASE</code> in <code>client/.env</code> if your API runs elsewhere.
        </footer>
      </div>
    </div>
  );
}

const buttonStyle = {
  border: "0",
  padding: "10px 14px",
  borderRadius: 12,
  cursor: "pointer",
  color: "#0b0f19",
  fontWeight: 700,
  background: "rgba(255,255,255,0.92)"
};
