import { useMemo, useState } from "react";
import SignalCard from "./SignalCard.jsx";
import "./SignalGrid.css";

export default function SignalGrid({ signals, onSelect }) {
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = useMemo(() => {
    const set = new Set(signals.map((s) => s.category).filter(Boolean));
    return ["all", ...Array.from(set).sort()];
  }, [signals]);

  const filtered = activeCategory === "all" ? signals : signals.filter((s) => s.category === activeCategory);

  return (
    <section className="signal-grid-wrap">
      <div className="signal-grid__filters">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`chip ${activeCategory === cat ? "chip--active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="signal-grid__empty">No signals in this category yet.</p>
      ) : (
        <div className="signal-grid">
          {filtered.map((signal) => (
            <SignalCard key={signal.name} signal={signal} onSelect={onSelect} />
          ))}
        </div>
      )}
    </section>
  );
}
