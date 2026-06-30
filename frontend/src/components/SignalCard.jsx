import { MiniSparkline } from "./MiniSparkline.jsx";
import "./SignalCard.css";

const TREND_LABEL = {
  rising: "rising",
  cooling: "cooling",
  stable: "steady"
};

export default function SignalCard({ signal, onSelect }) {
  const history = (signal.history || []).map((h) => h.score);
  const sparkData = history.length >= 2 ? history : [signal.score, signal.score];

  return (
    <button className={`signal-card signal-card--${signal.trend}`} onClick={() => onSelect(signal.name)}>
      <div className="signal-card__top">
        <span className="signal-card__category">{signal.category}</span>
        <span className={`signal-card__trend signal-card__trend--${signal.trend}`}>
          {signal.trend === "rising" ? "↗" : signal.trend === "cooling" ? "↘" : "→"} {TREND_LABEL[signal.trend]}
        </span>
      </div>

      <h3 className="signal-card__name">{signal.name}</h3>

      <div className="signal-card__bottom">
        <div className="signal-card__score">
          <span className="signal-card__score-value">{signal.score?.toFixed(1) ?? "—"}</span>
          <span className="signal-card__score-max">/100</span>
        </div>
        <MiniSparkline data={sparkData} className="signal-card__spark" />
      </div>
    </button>
  );
}
