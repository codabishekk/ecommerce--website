const jwt = require("jsonwebtoken");
const Conversation = require("../models/Conversation");
const { runSupportAgent } = require("../services/ai/orchestrator");
const { retrieveRelevantChunks } = require("../services/ai/ragService");
const { executeConfirmedAction } = require("../services/ai/toolService");
const { checkPromptInjection, MAX_MESSAGE_LENGTH } = require("../services/ai/guardrails");

const REFUSAL_REPLY =
    "I can't help with that request. For security reasons I can't ignore my instructions or share private data. " +
    "How else can I help you today?";

// Test seam: allows tests to inject a fake LLM responder without an API key.
let testLlmsRespond = null;
const setTestLlmsRespond = (fn) => {
    testLlmsRespond = fn;
};

const buildHistory = (messages) =>
    messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-10)
        .map((m) => ({ role: m.role, content: m.content }));

// ─── POST /api/ai/chat ────────────────────────────────────────────────────────
const chatHandler = async (req, res, next) => {
    try {
        const { message, conversationId } = req.body;
        const userId = req.user._id;

        if (typeof message !== "string" || !message.trim()) {
            return res.status(400).json({ success: false, message: "Message is required." });
        }
        if (message.length > MAX_MESSAGE_LENGTH) {
            return res.status(400).json({
                success: false,
                message: `Message too long (max ${MAX_MESSAGE_LENGTH} characters).`,
            });
        }

        // Load or create the authenticated user's conversation only.
        let conversation = null;
        if (conversationId) {
            if (!/^[0-9a-fA-F]{24}$/.test(String(conversationId))) {
                return res.status(400).json({ success: false, message: "Invalid conversation id." });
            }
            conversation = await Conversation.findOne({ _id: conversationId, userId });
        }
        if (!conversation) {
            conversation = await Conversation.create({ userId });
        }

        const history = buildHistory(conversation.messages);
        const injection = checkPromptInjection(message);

        let reply;
        let metadata = {};

        if (injection.flagged) {
            reply = REFUSAL_REPLY;
            metadata = { refused: true };
        } else {
            // RAG context is best-effort; never fail the request if retrieval does.
            let ragChunks = [];
            try {
                ragChunks = await retrieveRelevantChunks(message);
            } catch (error) {
                ragChunks = [];
            }

            const result = await runSupportAgent({
                userId: String(userId),
                message,
                history,
                ragChunks,
                conversationId: conversation._id,
                llmRespond: testLlmsRespond || undefined,
            });
            reply = result.reply;
            metadata = result.metadata || {};
        }

        conversation.messages.push({ role: "user", content: message, metadata: { refused: injection.flagged } });
        conversation.messages.push({ role: "assistant", content: reply, metadata });
        await conversation.save();

        res.json({
            success: true,
            message: "OK",
            data: { conversationId: conversation._id, reply, metadata },
        });
    } catch (error) {
        next(error);
    }
};

// ─── POST /api/ai/actions/confirm ─────────────────────────────────────────────
const confirmActionHandler = async (req, res, next) => {
    try {
        const { confirmationKey } = req.body;
        if (!confirmationKey || typeof confirmationKey !== "string") {
            return res.status(400).json({ success: false, message: "confirmationKey is required." });
        }

        let payload;
        try {
            payload = jwt.verify(confirmationKey, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({ success: false, message: "Confirmation link is invalid or expired." });
        }

        if (payload.scope !== "ai_action") {
            return res.status(401).json({ success: false, message: "Invalid confirmation token." });
        }
        if (String(payload.userId) !== String(req.user._id)) {
            return res.status(403).json({ success: false, message: "Not authorized to perform this action." });
        }

        const result = await executeConfirmedAction(req.user._id, payload.action, payload.orderId);

        if (result && result.error) {
            return res.status(409).json({ success: false, message: result.message });
        }

        res.json({ success: true, message: "Action completed.", data: result });
    } catch (error) {
        next(error);
    }
};

module.exports = { chatHandler, confirmActionHandler, setTestLlmsRespond };
