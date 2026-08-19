const crypto = require("crypto");
const { embed } = require("./aiService");

// Small in-memory cache so repeated queries in one conversation don't re-call
// the embedding API. Keyed by SHA-256 of the text; capped at 100 entries.
const cache = new Map();
const CACHE_LIMIT = 100;

const hashText = (text) => crypto.createHash("sha256").update(text).digest("hex");

async function embedQuery(text) {
    const key = hashText(text);
    if (cache.has(key)) {
        return cache.get(key);
    }
    const vector = await embed(text);
    cache.set(key, vector);
    if (cache.size > CACHE_LIMIT) {
        const oldest = cache.keys().next().value;
        cache.delete(oldest);
    }
    return vector;
}

module.exports = { embedQuery, hashText };
