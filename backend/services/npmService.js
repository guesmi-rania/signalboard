import fetch from "node-fetch";

const NPM_RANGE_API = "https://api.npmjs.org/downloads/range/last-month";

/**
 * Pulls daily download counts for the last month and compares the most
 * recent 7 days against the prior 7 days to get a week-over-week delta —
 * a good proxy for adoption acceleration vs a noisy single-day snapshot.
 */
export async function fetchNpmSignal(packageName) {
  if (!packageName) return { npmDownloads: 0, npmDownloadsDelta: 0 };

  try {
    const res = await fetch(`${NPM_RANGE_API}/${encodeURIComponent(packageName)}`);
    if (!res.ok) {
      console.warn(`npm API ${res.status} for "${packageName}"`);
      return { npmDownloads: 0, npmDownloadsDelta: 0 };
    }
    const data = await res.json();
    const days = data.downloads || [];
    if (days.length < 14) {
      const total = days.reduce((s, d) => s + d.downloads, 0);
      return { npmDownloads: total, npmDownloadsDelta: 0 };
    }

    const lastWeek = days.slice(-7).reduce((s, d) => s + d.downloads, 0);
    const priorWeek = days.slice(-14, -7).reduce((s, d) => s + d.downloads, 0);
    const delta = priorWeek === 0 ? 0 : ((lastWeek - priorWeek) / priorWeek) * 100;

    return { npmDownloads: lastWeek, npmDownloadsDelta: Math.round(delta * 10) / 10 };
  } catch (err) {
    console.warn(`npm fetch failed for "${packageName}": ${err.message}`);
    return { npmDownloads: 0, npmDownloadsDelta: 0 };
  }
}
