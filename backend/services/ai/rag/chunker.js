// Simple word-based chunker (no external dependencies).
const DEFAULT_CHUNK_SIZE = 400;
const DEFAULT_OVERLAP = 40;

/**
 * Split a document into overlapping chunks of roughly `chunkSize` words.
 * Returns [{ text, index }].
 */
function chunkText(text, options = {}) {
    const chunkSize = options.chunkSize || DEFAULT_CHUNK_SIZE;
    const overlap = Math.min(options.overlap || DEFAULT_OVERLAP, chunkSize - 1);

    const words = String(text)
        .replace(/\s+/g, " ")
        .trim()
        .split(" ");

    if (words.length === 0) return [];
    if (words.length <= chunkSize) {
        return [{ text: words.join(" "), index: 0 }];
    }

    const chunks = [];
    let start = 0;
    while (start < words.length) {
        const end = Math.min(start + chunkSize, words.length);
        chunks.push({ text: words.slice(start, end).join(" "), index: chunks.length });
        if (end === words.length) break;
        start = end - overlap;
    }
    return chunks;
}

module.exports = { chunkText, DEFAULT_CHUNK_SIZE, DEFAULT_OVERLAP };
