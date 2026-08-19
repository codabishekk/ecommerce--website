// ─── Knowledge ingestion pipeline ─────────────────────────────────────────────
// Reads knowledge/**/*.md, chunks the text, generates embeddings and upserts
// into MongoDB. Run with:  node scripts/ingestKnowledge.js
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("../config/db");
const KnowledgeChunk = require("../models/KnowledgeChunk");
const { embedBatch } = require("../services/ai/aiService");
const { chunkText } = require("../services/ai/rag/chunker");

const KNOWLEDGE_DIR = path.join(__dirname, "..", "knowledge");

function walk(dir, base = dir) {
    const results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results.push(...walk(full, base));
        } else if (entry.name.endsWith(".md")) {
            results.push(full);
        }
    }
    return results;
}

function extractTitle(content, filePath) {
    const heading = content.match(/^#\s+(.+)$/m);
    if (heading) return heading[1].trim();
    return path.basename(filePath, ".md").replace(/[-_]+/g, " ").trim();
}

async function ingestAll() {
    const files = walk(KNOWLEDGE_DIR);
    if (files.length === 0) {
        console.error("No markdown files found under", KNOWLEDGE_DIR);
        process.exit(1);
    }

    console.log(`Found ${files.length} knowledge files.`);

    const toInsert = [];
    for (const file of files) {
        const content = fs.readFileSync(file, "utf8");
        const title = extractTitle(content, file);
        // Category = the top folder under knowledge/ (faq, shipping, returns, ...)
        const rel = path.relative(KNOWLEDGE_DIR, file);
        const category = rel.split(path.sep)[0] || "general";
        const source = rel.split(path.sep).join("/");

        const chunks = chunkText(content);
        for (const chunk of chunks) {
            toInsert.push({
                title: chunk.index === 0 ? title : `${title} (${chunk.index + 1})`,
                content: chunk.text,
                category,
                source,
                metadata: { file: source, order: chunk.index },
            });
        }
    }

    console.log(`Generated ${toInsert.length} chunks. Generating embeddings...`);

    const batchSize = 50;
    for (let i = 0; i < toInsert.length; i += batchSize) {
        const batch = toInsert.slice(i, i + batchSize);
        const texts = batch.map((c) => c.title + "\n" + c.content);
        const embeddings = await embedBatch(texts);
        batch.forEach((chunk, idx) => {
            chunk.embedding = embeddings[idx];
        });
        console.log(`  embedded ${i + batch.length}/${toInsert.length}`);
    }

    // Upsert per source file (idempotent re-runs).
    const sources = [...new Set(toInsert.map((c) => c.source))];
    await KnowledgeChunk.deleteMany({ source: { $in: sources } });
    await KnowledgeChunk.insertMany(toInsert);

    // Ensure text index exists so the keyword fallback ($text) always works,
    // even if autoIndex is disabled on the connection.
    await KnowledgeChunk.createIndexes();
    await KnowledgeChunk.collection.createIndex(
        { embedding: 1 },
        { name: "embedding_1" }
    );

    const total = await KnowledgeChunk.countDocuments();
    console.log(`Ingestion complete. Knowledge base now has ${total} chunks.`);
    process.exit(0);
}

connectDB().then(ingestAll).catch((error) => {
    console.error("Ingestion failed:", error.message);
    process.exit(1);
});
