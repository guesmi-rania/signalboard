import fetch from "node-fetch";

const HN_API = "https://hn.algolia.com/api/v1/search_by_date";

/**
 * Counts recent Hacker News stories/comments mentioning the technology
 * and sums their points — a proxy for "developers are talking about this".
 */
export async function fetchHackerNewsSignal(techQuery) {
  const sevenDaysAgoUnix = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
  const url = `${HN_API}?query=${encodeURIComponent(techQuery)}&tags=story&numericFilters=created_at_i>${sevenDaysAgoUnix}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`HN API ${res.status} for "${techQuery}"`);
      return { hnMentions: 0, hnPoints: 0 };
    }
    const data = await res.json();
    const hits = data.hits || [];
    const points = hits.reduce((sum, h) => sum + (h.points || 0), 0);

    return { hnMentions: hits.length, hnPoints: points };
  } catch (err) {
    console.warn(`HN fetch failed for "${techQuery}": ${err.message}`);
    return { hnMentions: 0, hnPoints: 0 };
  }
}
