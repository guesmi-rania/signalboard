// Lightweight in-memory store used when no MongoDB is configured.
// Mirrors just enough of the Mongoose API shape that routes/services
// don't need to branch on which store is active.

const store = new Map(); // name -> signal object

export function upsertSignal(name, data) {
  const existing = store.get(name) || { name, history: [] };
  const merged = {
    ...existing,
    ...data,
    history: [...(existing.history || []), ...(data.newSnapshot ? [data.newSnapshot] : [])].slice(-30)
  };
  delete merged.newSnapshot;
  store.set(name, merged);
  return merged;
}

export function getAllSignals() {
  return Array.from(store.values());
}

export function getSignal(name) {
  return store.get(name) || null;
}

export function clearStore() {
  store.clear();
}
