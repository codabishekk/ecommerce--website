const mongoose = require("mongoose");

const knowledgeChunkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            index: true,
            default: "general",
        },
        source: {
            type: String,
            default: "",
        },
        embedding: {
            type: [Number],
            index: false,
        },
        metadata: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
    },
    { timestamps: true }
);

// Text index for the keyword fallback path (works on every Atlas tier).
knowledgeChunkSchema.index({ content: "text", title: "text" });

const KnowledgeChunk = mongoose.model("KnowledgeChunk", knowledgeChunkSchema);

module.exports = KnowledgeChunk;
