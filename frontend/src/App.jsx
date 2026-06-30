import { useEffect, useState, useCallback } from "react";
import Header from "./components/Header.jsx";
import SignalGrid from "./components/SignalGrid.jsx";
import SignalDetail from "./components/SignalDetail.jsx";
import { getSignals, triggerRefresh } from "./api/signals.js";
import "./App.css";

export default function App() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selected, setSelected] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await getSignals();
      setSignals(data.signals || []);
      setError(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await triggerRefresh();
      // The crawl runs in the background on the API; poll once after a delay.
      setTimeout(async () => {
        await load();
        setRefreshing(false);
      }, 25000);
    } catch (err) {
      setError(err.message);
      setRefreshing(false);
    }
  }

  return (
    <div className="app">
      <Header onRefresh={handleRefresh} refreshing={refreshing} lastUpdated={lastUpdated} />

      <main>
        {loading && <p className="app__status">Tuning in to the signals…</p>}

        {!loading && error && (
          <div className="app__status app__status--error">
            <p>Couldn't reach the API: {error}</p>
            <p className="app__status-hint">
              Make sure the backend is running on port 4000, then refresh this page.
            </p>
          </div>
        )}

        {!loading && !error && signals.length === 0 && (
          <div className="app__status">
            <p>No signals tracked yet.</p>
            <p className="app__status-hint">
              Run <code>npm run seed</code> in the backend, or click "Refresh now" above.
            </p>
          </div>
        )}

        {!loading && !error && signals.length > 0 && <SignalGrid signals={signals} onSelect={setSelected} />}
      </main>

      {selected && <SignalDetail name={selected} onClose={() => setSelected(null)} />}

      <footer className="app__footer">
        Built with React, Express &amp; MongoDB — scores derived from public GitHub, npm and Hacker News data.
      </footer>
    </div>
  );
}
