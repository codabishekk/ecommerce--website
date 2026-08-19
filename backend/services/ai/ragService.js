const KnowledgeChunk = require("../../models/KnowledgeChunk");
const { embedQuery } = require("./embeddingService");

const VECTOR_INDEX = process.env.ATLAS_VECTOR_INDEX || "default";
const MIN_SCORE = Number(process.env.RAG_MIN_SCORE) || 0.25;
const DEFAULT_K = 4;

/**
 * Try MongoDB Atlas Vector Search. Returns chunks with a cosine `score`,
 * or null when the search fails (e.g. no vector index on a shared cluster).
 */
async function vectorSearch(query, k = DEFAULT_K) {
    let embedding;
    try {
        embedding = await embedQuery(query);
    } catch (error) {
        return null;
    }

    try {
        const results = await KnowledgeChunk.aggregate([
            {
                $vectorSearch: {
                    index: VECTOR_INDEX,
                    queryVector: embedding,
                    path: "embedding",
                    numCandidates: k * 10,
                    limit: k,
                },
            },
            { $project: { title: 1, content: 1, category: 1, source: 1, score: { $meta: "vectorSearchScore" } } },
        ]);
        return results;
    } catch (error) {
        return null;
    }
}

/**
 * Keyword fallback using Mongo $text search. Works on every Atlas tier.
 */
async function keywordSearch(query, k = DEFAULT_K) {
    const keywords = String(query)
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 2)
        .slice(0, 8)
        .join(" ");
    if (!keywords.trim()) return [];

    const results = await KnowledgeChunk.find(
        { $text: { $search: keywords } },
        { score: { $meta: "textScore" } }
    )
        .sort({ score: { $meta: "textScore" } })
        .limit(k)
        .lean();

    return results;
}

/**
 * Retrieve the most relevant knowledge chunks for a customer question.
 * Uses vector search first, falls back to keyword search.
 * Applies a relevance threshold to avoid sending irrelevant context to the LLM.
 */
async function retrieveRelevantChunks(query, k = DEFAULT_K) {
    const vectorResults = await vectorSearch(query, k);
    if (vectorResults && vectorResults.length > 0) {
        const filtered = vectorResults.filter((c) => c.score >= MIN_SCORE);
        if (filtered.length > 0) {
            return filtered.map(({ _id, title, content, category, source }) => ({
                id: _id,
                title,
                content,
                category,
                source,
            }));
        }
    }

    const keywordResults = await keywordSearch(query, k);
    return keywordResults.map(({ _id, title, content, category, source }) => ({
        id: _id,
        title,
        content,
        category,
        source,
    }));
}

module.exports = { retrieveRelevantChunks, vectorSearch, keywordSearch };
