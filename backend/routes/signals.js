import { Router } from "express";
import { isUsingMemoryStore } from "../config/db.js";
import Signal from "../models/Signal.js";
import * as memStore from "../services/memoryStore.js";
import { fetchAllSignals } from "../jobs/fetchSignals.js";

const router = Router();

// GET /api/signals — all tracked technologies, sorted by score desc
router.get("/", async (req, res) => {
  try {
    const signals = isUsingMemoryStore()
      ? memStore.getAllSignals()
      : await Signal.find().sort({ score: -1 }).lean();

    const sorted = [...signals].sort((a, b) => b.score - a.score);
    res.json({ count: sorted.length, signals: sorted, source: isUsingMemoryStore() ? "memory" : "mongodb" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/signals/:name — single technology with full history
router.get("/:name", async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name);
    const signal = isUsingMemoryStore() ? memStore.getSignal(name) : await Signal.findOne({ name }).lean();

    if (!signal) return res.status(404).json({ error: `No signal tracked for "${name}"` });
    res.json(signal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/signals/refresh — manually trigger a fetch cycle (useful for demos)
router.post("/refresh", async (req, res) => {
  try {
    // Don't block the response on the full multi-API crawl; kick it off and report started.
    res.json({ status: "refresh started", note: "Poll GET /api/signals in ~20-30s for updated data." });
    fetchAllSignals().catch((err) => console.error("Background refresh failed:", err.message));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
