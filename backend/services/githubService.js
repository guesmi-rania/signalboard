import fetch from "node-fetch";

const GITHUB_API = "https://api.github.com/search/repositories";

// Optional token raises the rate limit from 10/min to 30/min for search endpoints.
const headers = {
  Accept: "application/vnd.github+json",
  ...(process.env.GITHUB_TOKEN ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` } : {})
};

/**
 * Measures GitHub momentum for a technology by searching repos that
 * mention it in topics/description and were pushed to in the last 7 days,
 * sorted by stars. We use the result count + top stars as a momentum proxy.
 */
export async function fetchGithubSignal(techQuery) {
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const q = encodeURIComponent(`${techQuery} in:name,description,topics pushed:>=${since}`);
  const url = `${GITHUB_API}?q=${q}&sort=stars&order=desc&per_page=10`;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      console.warn(`GitHub API ${res.status} for "${techQuery}"`);
      return { githubRepoCount: 0, githubStars7d: 0 };
    }
    const data = await res.json();
    const items = data.items || [];
    const topStars = items.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

    return {
      githubRepoCount: data.total_count || 0,
      githubStars7d: topStars
    };
  } catch (err) {
    console.warn(`GitHub fetch failed for "${techQuery}": ${err.message}`);
    return { githubRepoCount: 0, githubStars7d: 0 };
  }
}
