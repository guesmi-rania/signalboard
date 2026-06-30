/**
 * Combines heterogeneous raw signals (stars, downloads, HN points...) into
 * one comparable 0-100 score using log-scaling (so a few huge outliers like
 * "react" don't blow the scale for everyone) and fixed weights.
 *
 * Weights: npm momentum matters most (real adoption), GitHub activity next
 * (active building), HN buzz last (talk is cheap but still signal).
 */
const WEIGHTS = {
  npmDownloads: 0.35,
  npmDownloadsDelta: 0.15,
  githubStars7d: 0.25,
  hnPoints: 0.25
};

function logScale(value, max) {
  if (value <= 0) return 0;
  return Math.min(100, (Math.log10(value + 1) / Math.log10(max + 1)) * 100);
}

export function computeScore(raw) {
  const npmScore = logScale(raw.npmDownloads, 5_000_000);
  const npmDeltaScore = Math.max(0, Math.min(100, 50 + raw.npmDownloadsDelta)); // centered at 0% growth = 50
  const githubScore = logScale(raw.githubStars7d, 50_000);
  const hnScore = logScale(raw.hnPoints, 5_000);

  const score =
    npmScore * WEIGHTS.npmDownloads +
    npmDeltaScore * WEIGHTS.npmDownloadsDelta +
    githubScore * WEIGHTS.githubStars7d +
    hnScore * WEIGHTS.hnPoints;

  return Math.round(score * 10) / 10;
}

export function computeTrend(currentScore, previousScore) {
  if (previousScore == null) return "stable";
  const diff = currentScore - previousScore;
  if (diff > 2) return "rising";
  if (diff < -2) return "cooling";
  return "stable";
}
