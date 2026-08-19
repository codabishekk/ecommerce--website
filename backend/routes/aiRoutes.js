const express = require("express");
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const { protect } = require("../middleware/authMiddleware");
const { chatHandler, confirmActionHandler } = require("../controllers/aiController");

// Factory so tests can inject a fake `protect` middleware.
const createAiRouter = ({ protect: protectMiddleware = protect } = {}) => {
    const router = express.Router();

    // ─── Dedicated rate limits for the AI endpoints (per authenticated user) ──
    const keyByUser = (req) => (req.user ? String(req.user._id) : ipKeyGenerator(req));

    const aiChatLimiter = rateLimit({
        windowMs: 60 * 1000,
        max: 20,
        keyGenerator: keyByUser,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message: "Too many AI requests. Please slow down and try again." },
    });

    const aiActionLimiter = rateLimit({
        windowMs: 60 * 1000,
        max: 10,
        keyGenerator: keyByUser,
        standardHeaders: true,
        legacyHeaders: false,
        message: { success: false, message: "Too many requests. Please try again shortly." },
    });

    // All AI routes require a valid customer JWT. Identity comes from req.user only.
    router.post("/chat", protectMiddleware, aiChatLimiter, chatHandler);
    router.post("/actions/confirm", protectMiddleware, aiActionLimiter, confirmActionHandler);

    return router;
};

module.exports = createAiRouter;
