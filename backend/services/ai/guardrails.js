// ─── Guardrails: prompt injection & output validation ────────────────────────

const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(your\s+)?(previous|prior|above)\s+(instructions|rules|prompts|messages)/i,
    /ignore\s+(all\s+)?instructions/i,
    /forget\s+(everything|all)\s+(you|your)/i,
    /disregard\s+(your\s+)?(instructions|rules|system)/i,
    /you\s+are\s+now\s+(a|an)\b/i,
    /act\s+as\s+(a\s+)?(developer|admin|system)\b/i,
    /reveal\s+(your\s+)?(system\s+prompt|instructions|prompt)/i,
    /show\s+(me\s+)?(your\s+)?(system\s+prompt|instructions|source\s+code)/i,
    /print\s+(your\s+)?(system\s+prompt|instructions)/i,
    /jailbreak|dev\s?mode|super\s?mode|do\s+anything\s+now/i,
    /show\s+(me\s+)?(another\s+|any\s+)?(customer|customers|user|users)['\s]?(s)?\s*(data|orders|details|info|information)/i,
    /access\s+the\s+database/i,
    /run\s+(a\s+)?sql|mongo\s+query|query\s+the\s+database/i,
    /bypass\s+(authentication|authorization|security|permissions)/i,
];

const SENSITIVE_PATTERNS = [
    /sk-[A-Za-z0-9_-]{20,}/g,
    /mongodb(\+srv)?:\/\/[^\s"']+/g,
    /AIza[0-9A-Za-z_-]{20,}/g,
    /AKIA[0-9A-Z]{16}/g,
];

/**
 * Scan untrusted user input for prompt-injection attempts.
 * Returns { flagged, reason }. Treat all customer messages as untrusted.
 */
const checkPromptInjection = (text) => {
    const input = String(text || "");
    if (input.length === 0) {
        return { flagged: false, reason: null };
    }
    for (const pattern of INJECTION_PATTERNS) {
        if (pattern.test(input)) {
            return { flagged: true, reason: pattern.source };
        }
    }
    return { flagged: false, reason: null };
};

/**
 * Strip credential-like strings from any text before persisting/logging.
 */
const redactSecrets = (text) => {
    let result = String(text || "");
    for (const pattern of SENSITIVE_PATTERNS) {
        result = result.replace(pattern, "[REDACTED]");
    }
    return result;
};

/**
 * Validate model output before sending to the client.
 * Returns { ok, reason } or normalized text.
 */
const validateOutput = (text, options = {}) => {
    const maxLen = options.maxLength || 4000;
    const input = String(text || "");
    if (input.length === 0) {
        return { ok: false, reason: "empty" };
    }
    if (input.length > maxLen) {
        return { ok: false, reason: `exceeds ${maxLen} chars` };
    }
    // Reject model output that appears to leak secrets.
    for (const pattern of SENSITIVE_PATTERNS) {
        if (pattern.test(input)) {
            return { ok: false, reason: "contains sensitive material" };
        }
    }
    return { ok: true, reason: null };
};

const MAX_MESSAGE_LENGTH = 2000;

module.exports = {
    checkPromptInjection,
    redactSecrets,
    validateOutput,
    MAX_MESSAGE_LENGTH,
};
