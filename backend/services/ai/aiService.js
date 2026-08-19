const { OpenAI } = require("openai");

// ─── Custom provider error (maps to HTTP 503 in errorMiddleware) ─────────────
class AIProviderError extends Error {
    constructor(message) {
        super(message);
        this.name = "AIProviderError";
        this.statusCode = 503;
    }
}

let client = null;

function getClient() {
    if (!process.env.OPENAI_API_KEY) {
        return null;
    }
    if (!client) {
        client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
            ...(process.env.OPENAI_BASE_URL && { baseURL: process.env.OPENAI_BASE_URL }),
        });
    }
    return client;
}

function getModel() {
    return process.env.AI_MODEL || "gpt-4o-mini";
}

function getEmbeddingModel() {
    return process.env.EMBEDDING_MODEL || "text-embedding-3-small";
}

function getEmbeddingDimension() {
    return Number(process.env.AI_EMBEDDING_DIM) || 1536;
}

/**
 * Chat completion. Returns the assistant message object
 * `{ role: "assistant", content, tool_calls }`.
 */
async function chat({ messages, tools, toolChoice, temperature }) {
    const openai = getClient();
    if (!openai) {
        throw new AIProviderError(
            "AI support is not configured. OPENAI_API_KEY is missing."
        );
    }

    const body = {
        model: getModel(),
        messages,
        temperature: typeof temperature === "number" ? temperature : 0.4,
    };

    if (tools && tools.length > 0) {
        body.tools = tools;
        body.tool_choice = toolChoice || "auto";
    }

    try {
        const res = await openai.chat.completions.create(body);
        const message = res.choices[0]?.message;
        if (!message) {
            throw new AIProviderError("AI provider returned an empty response.");
        }
        return message;
    } catch (error) {
        if (error instanceof AIProviderError) throw error;
        throw new AIProviderError(`AI provider error: ${error.message}`);
    }
}

/**
 * Generate an embedding vector for a single piece of text.
 */
async function embed(text) {
    const openai = getClient();
    if (!openai) {
        throw new AIProviderError(
            "AI support is not configured. OPENAI_API_KEY is missing."
        );
    }
    try {
        const res = await openai.embeddings.create({
            model: getEmbeddingModel(),
            input: text,
        });
        return res.data[0].embedding;
    } catch (error) {
        throw new AIProviderError(`Embedding provider error: ${error.message}`);
    }
}

/**
 * Generate embeddings for many pieces of text in one API call.
 */
async function embedBatch(texts) {
    const openai = getClient();
    if (!openai) {
        throw new AIProviderError(
            "AI support is not configured. OPENAI_API_KEY is missing."
        );
    }
    try {
        const res = await openai.embeddings.create({
            model: getEmbeddingModel(),
            input: texts,
        });
        return res.data.map((d) => d.embedding);
    } catch (error) {
        throw new AIProviderError(`Embedding provider error: ${error.message}`);
    }
}

module.exports = {
    AIProviderError,
    chat,
    embed,
    embedBatch,
    getModel,
    getEmbeddingModel,
    getEmbeddingDimension,
};
