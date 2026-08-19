const aiService = require("./aiService");
const { TOOLS, executeTool } = require("./toolService");
const {
    SYSTEM_PROMPT,
    RAG_INSTRUCTIONS,
    buildRagContext,
    buildHistoryMessages,
} = require("./prompts");
const { validateOutput } = require("./guardrails");

const MAX_TOOL_ITERATIONS = 5;

function buildSystemContent(ragChunks) {
    let content = SYSTEM_PROMPT;
    const context = buildRagContext(ragChunks);
    if (context) {
        content += RAG_INSTRUCTIONS + "\n\nRELEVANT KNOWLEDGE:\n" + context;
    }
    return content;
}

/**
 * Run the AI support agent.
 *
 * @param {object} params
 * @param {string} params.userId          Authenticated user id (never client-supplied)
 * @param {string} params.message         Current user message
 * @param {Array}  params.history         Prior {role, content} messages (max 10)
 * @param {Array}  params.ragChunks       Retrieved knowledge chunks (optional)
 * @param {string} params.conversationId  Mongo id of the active conversation
 * @param {Function} [params.llmRespond]  Injectable LLM for tests (defaults to aiService.chat)
 *
 * @returns {Promise<{reply: string, metadata: object}>}
 */
async function runSupportAgent({
    userId,
    message,
    history = [],
    ragChunks = [],
    conversationId = null,
    llmRespond = aiService.chat,
}) {
    const systemContent = buildSystemContent(ragChunks);
    const messages = [
        { role: "system", content: systemContent },
        ...buildHistoryMessages(history),
        { role: "user", content: message },
    ];

    // Structured results surfaced to the client for rich rendering.
    const collected = {
        products: [],
        orders: [],
        order: null,
        orderStatus: null,
    };

    const finalize = (reply, metadata = {}) => {
        const enriched = {
            products: collected.products.length ? collected.products : undefined,
            orders: collected.orders.length ? collected.orders : undefined,
            order: collected.order || undefined,
            orderStatus: collected.orderStatus || undefined,
            ...metadata,
        };
        return { reply, metadata: Object.fromEntries(Object.entries(enriched).filter(([, v]) => v !== undefined)) };
    };

    for (let iteration = 0; iteration < MAX_TOOL_ITERATIONS; iteration++) {
        const assistantMessage = await llmRespond({ messages, tools: TOOLS });

        messages.push({
            role: "assistant",
            content: assistantMessage.content ?? null,
            ...(assistantMessage.tool_calls && assistantMessage.tool_calls.length
                ? { tool_calls: assistantMessage.tool_calls }
                : {}),
        });

        const toolCalls = assistantMessage.tool_calls || [];
        if (toolCalls.length === 0) {
            const text = String(assistantMessage.content || "").trim();
            const check = validateOutput(text);
            if (!check.ok) {
                return finalize(
                    "I'm sorry, I couldn't generate a proper response just now. Please try again."
                );
            }
            return finalize(text);
        }

        for (const toolCall of toolCalls) {
            let args = {};
            try {
                args = JSON.parse(toolCall.function.arguments || "{}");
            } catch (error) {
                args = {};
            }

            const result = await executeTool(userId, toolCall.function.name, args, {
                conversationId,
            });

            // Surface structured data for rich React cards.
            if (result && result.type === "product_results") {
                collected.products.push(...(result.products || []));
            }
            if (result && result.type === "order_list") {
                collected.orders.push(...(result.orders || []));
            }
            if (result && result.type === "order_detail" && result.order) {
                collected.order = result.order;
                collected.orders.push(result.order);
            }
            if (result && result.type === "order_status") {
                collected.orderStatus = result;
            }

            // Short-circuit: an action requires explicit customer confirmation.
            if (result && result.needsConfirmation) {
                return finalize(result.message, { action_request: result });
            }

            // Short-circuit: human escalation resolved by a created ticket.
            if (result && result.type === "ticket_created") {
                return finalize(result.message, {
                    ticket: { id: result.ticketId, message: result.message },
                });
            }

            messages.push({
                role: "tool",
                tool_call_id: toolCall.id,
                content: JSON.stringify(result),
            });
        }
    }

    return finalize(
        "I wasn't able to finish processing your request. Let me connect you with a human support agent.",
        { escalated: true }
    );
}

module.exports = { runSupportAgent, MAX_TOOL_ITERATIONS };
