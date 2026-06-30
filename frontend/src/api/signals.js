const BASE = "/api/signals";

export async function getSignals() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error(`Failed to load signals (${res.status})`);
  return res.json();
}

export async function getSignal(name) {
  const res = await fetch(`${BASE}/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(`Failed to load "${name}" (${res.status})`);
  return res.json();
}

export async function triggerRefresh() {
  const res = await fetch(`${BASE}/refresh`, { method: "POST" });
  if (!res.ok) throw new Error(`Refresh failed (${res.status})`);
  return res.json();
}
