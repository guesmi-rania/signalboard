import "dotenv/config";
import express from "express";
import cors from "cors";
import cron from "node-cron";
import { connectDB } from "./config/db.js";
import signalsRouter from "./routes/signals.js";
import { fetchAllSignals } from "./jobs/fetchSignals.js";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok", time: new Date().toISOString() }));
app.use("/api/signals", signalsRouter);

async function start() {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 SignalBoard API running on http://localhost:${PORT}`));

  // Refresh every 6 hours. Also run once on boot if the store looks empty.
  cron.schedule("0 */6 * * *", () => {
    console.log("⏰ Scheduled signal refresh starting...");
    fetchAllSignals().catch((err) => console.error("Scheduled refresh failed:", err.message));
  });
}

start();
