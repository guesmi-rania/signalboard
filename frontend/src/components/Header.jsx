import "./Header.css";

export default function Header({ onRefresh, refreshing, lastUpdated }) {
  return (
    <header className="header">
      <div className="header__waveform" aria-hidden="true">
        <svg viewBox="0 0 600 60" preserveAspectRatio="none" className="header__wave-svg">
          <polyline
            className="header__wave-line"
            points="0,30 20,30 30,12 40,48 50,30 70,30 80,20 90,40 100,30 600,30"
            fill="none"
          />
          <polyline
            className="header__wave-line header__wave-line--ghost"
            points="0,30 20,30 30,12 40,48 50,30 70,30 80,20 90,40 100,30 600,30"
            fill="none"
          />
        </svg>
      </div>

      <div className="header__row">
        <div>
          <p className="header__eyebrow">live tech radar</p>
          <h1 className="header__title">SignalBoard</h1>
          <p className="header__subtitle">
            Reads GitHub, npm and Hacker News every 6 hours to score which technologies are actually gaining ground —
            not just trending on a feed.
          </p>
        </div>

        <div className="header__meta">
          {lastUpdated && <span className="header__updated">Updated {lastUpdated}</span>}
          <button className="header__refresh" onClick={onRefresh} disabled={refreshing}>
            {refreshing ? "Reading signals…" : "Refresh now"}
          </button>
        </div>
      </div>
    </header>
  );
}
