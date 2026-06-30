import mongoose from "mongoose";

const snapshotSchema = new mongoose.Schema(
  {
    date: { type: Date, default: Date.now },
    githubStars7d: { type: Number, default: 0 },
    githubRepoCount: { type: Number, default: 0 },
    npmDownloads: { type: Number, default: 0 },
    npmDownloadsDelta: { type: Number, default: 0 },
    hnMentions: { type: Number, default: 0 },
    hnPoints: { type: Number, default: 0 },
    score: { type: Number, default: 0 }
  },
  { _id: false }
);

const signalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    npmPackage: { type: String, default: null },
    category: { type: String, default: "general" },
    score: { type: Number, default: 0, index: true },
    trend: { type: String, enum: ["rising", "stable", "cooling"], default: "stable" },
    history: { type: [snapshotSchema], default: [] },
    lastFetchedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.models.Signal || mongoose.model("Signal", signalSchema);
