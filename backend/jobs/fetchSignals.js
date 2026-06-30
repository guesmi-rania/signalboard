import "dotenv/config";
import mongoose from "mongoose";
import { connectDB, isUsingMemoryStore } from "../config/db.js";
import Signal from "../models/Signal.js";
import * as memStore from "../services/memoryStore.js";
import { fetchGithubSignal } from "../services/githubService.js";
import { fetchNpmSignal } from "../services/npmService.js";
import { fetchHackerNewsSignal } from "../services/hackernewsService.js";
import { computeScore, computeTrend } from "../services/scoringService.js";
import { TRACKED_TECHNOLOGIES } from "../services/trackedTechnologies.js";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchOneSignal(tech) {
  // Sequential fetches per source to stay polite with unauthenticated rate limits.
  const [github, npm, hn] = await Promise.all([
    fetchGithubSignal(tech.name),
    fetchNpmSignal(tech.npmPackage),
    fetchHackerNewsSignal(tech.name)
  ]);

  const raw = {
    githubStars7d: github.githubStars7d,
    githubRepoCount: github.githubRepoCount,
    npmDownloads: npm.npmDownloads,
    npmDownloadsDelta: npm.npmDownloadsDelta,
    hnMentions: hn.hnMentions,
    hnPoints: hn.hnPoints
  };

  const score = computeScore(raw);
  const snapshot = { date: new Date(), ...raw, score };

  if (isUsingMemoryStore()) {
    const existing = memStore.getSignal(tech.name);
    const trend = computeTrend(score, existing?.score);
    memStore.upsertSignal(tech.name, {
      name: tech.name,
      npmPackage: tech.npmPackage,
      category: tech.category,
      score,
      trend,
      lastFetchedAt: new Date(),
      newSnapshot: snapshot
    });
  } else {
    const existing = await Signal.findOne({ name: tech.name });
    const trend = computeTrend(score, existing?.score);
    await Signal.findOneAndUpdate(
      { name: tech.name },
      {
        $set: { npmPackage: tech.npmPackage, category: tech.category, score, trend, lastFetchedAt: new Date() },
        $push: { history: { $each: [snapshot], $slice: -30 } }
      },
      { upsert: true, new: true }
    );
  }

  return { name: tech.name, score };
}

export async function fetchAllSignals() {
  console.log(`🔭 Fetching signals for ${TRACKED_TECHNOLOGIES.length} technologies...`);
  const results = [];

  for (const tech of TRACKED_TECHNOLOGIES) {
    try {
      const result = await fetchOneSignal(tech);
      results.push(result);
      console.log(`  ✓ ${tech.name}: ${result.score}`);
    } catch (err) {
      console.warn(`  ✗ ${tech.name} failed: ${err.message}`);
    }
    await sleep(300); // gentle pacing across unauthenticated public APIs
  }

  console.log("✅ Signal fetch complete.");
  return results;
}

// Allow running directly: `npm run seed`
if (process.argv[1]?.endsWith("fetchSignals.js")) {
  await connectDB();
  await fetchAllSignals();
  if (mongoose.connection.readyState === 1) await mongoose.disconnect();
  process.exit(0);
}
