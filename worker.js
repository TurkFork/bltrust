const ALLOWED_DOMAINS = ["nasa.gov", "who.int", "cdc.gov", "reuters.com", "theguardian.com"];

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const query = url.searchParams.get("q");

    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const duckUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_redirect=1`;
    const res = await fetch(duckUrl);
    const data = await res.json();

    const filtered = (data.RelatedTopics || []).filter(item => {
      const url = item.FirstURL;
      if (!url) return false;

      try {
        const hostname = new URL(url).hostname;
        return ALLOWED_DOMAINS.some(domain => hostname.endsWith(domain));
      } catch {
        return false;
      }
    });

    return new Response(JSON.stringify({ results: filtered }), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
    if (!query) {
      return new Response(JSON.stringify({ error: "Missing query" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }
  }
};