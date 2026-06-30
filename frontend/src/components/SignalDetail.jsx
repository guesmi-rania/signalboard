import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { getSignal } from "../api/signals.js";
import "./SignalDetail.css";

export default function SignalDetail({ name, onClose }) {
  const [signal, setSignal] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setSignal(null);
    setError(null);

    getSignal(name)
      .then((data) => !cancelled && setSignal(data))
      .catch((err) => !cancelled && setError(err.message));

    return () => {
      cancelled = true;
    };
  }, [name]);

  const chartData = (signal?.history || []).map((h) => ({
    date: new Date(h.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
    score: h.score
  }));

  const latest = signal?.history?.[signal.history.length - 1];

  return (
    <div className="detail-overlay" onClick={onClose}>
      <div className="detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="detail-panel__close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        {error && <p className="detail-panel__error">{error}</p>}

        {!signal && !error && <p className="detail-panel__loading">Reading signal history…</p>}

        {signal && (
          <>
            <p className="detail-panel__category">{signal.category}</p>
            <h2 className="detail-panel__name">{signal.name}</h2>
            <p className="detail-panel__score">
              <span>{signal.score?.toFixed(1)}</span>/100 · trending {signal.trend}
            </p>

            <div className="detail-panel__chart">
              {chartData.length >= 2 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid stroke="var(--line)" strokeDasharray="3 3" />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} domain={[0, 100]} />
                    <Tooltip
                      contentStyle={{
                        background: "var(--bg-panel-raised)",
                        border: "1px solid var(--line)",
                        borderRadius: 8,
                        fontFamily: "var(--font-mono)",
                        fontSize: 12
                      }}
                    />
                    <Line type="monotone" dataKey="score" stroke="var(--accent-cyan)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="detail-panel__no-history">
                  Not enough history yet — run a few refresh cycles to see the trend line.
                </p>
              )}
            </div>

            {latest && (
              <dl className="detail-panel__breakdown">
                <div>
                  <dt>npm downloads / wk</dt>
                  <dd>{latest.npmDownloads.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>npm growth WoW</dt>
                  <dd>{latest.npmDownloadsDelta > 0 ? "+" : ""}{latest.npmDownloadsDelta}%</dd>
                </div>
                <div>
                  <dt>GitHub stars (active repos, 7d)</dt>
                  <dd>{latest.githubStars7d.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>Active repos found</dt>
                  <dd>{latest.githubRepoCount.toLocaleString()}</dd>
                </div>
                <div>
                  <dt>HN mentions (7d)</dt>
                  <dd>{latest.hnMentions}</dd>
                </div>
                <div>
                  <dt>HN points (7d)</dt>
                  <dd>{latest.hnPoints.toLocaleString()}</dd>
                </div>
              </dl>
            )}
          </>
        )}
      </div>
    </div>
  );
}
