# AI Customer Support Agent — Deliverables

**Project:** Skin Care Product (MERN e-commerce)
**Type:** AI-powered customer support integration (production-grade)
**Date:** 13 Aug 2026

---

## 1. Executive Summary

A fully integrated AI support assistant has been added to the existing MERN storefront.
It answers policy questions from an ingested knowledge base (RAG with vector + keyword
fallback), searches the product catalog, tracks user orders, and lets users request
returns/refunds/cancellations with a **two-step confirmation** (no destructive action is
executed without explicit user consent). All chat and actions are authenticated,
per-user rate-limited, and scoped so a user can only ever see their own orders.
Existing app functionality was not modified beyond adding the widget mount point and
the `/api/ai` router.

## 2. What Was Built

### 2.1 Backend (Node/Express, CommonJS)

| Area | Files |
|---|---|
| AI core | `backend/services/ai/aiService.js`, `prompts.js`, `guardrails.js` |
| Orchestrator | `backend/services/ai/orchestrator.js` (tool-calling loop) |
| RAG | `backend/services/ai/ragService.js`, `embeddingService.js`, `rag/chunker.js` |
| Tools / actions | `backend/services/ai/toolService.js` (security-critical) |
| API | `backend/controllers/aiController.js`, `backend/routes/aiRoutes.js` |
| Models | `Conversation.js`, `KnowledgeChunk.js`, `ReturnRequest.js`, `SupportTicket.js` |
| Knowledge | `backend/knowledge/**` (8 policy markdown docs) |
| Ingestion | `backend/scripts/ingestKnowledge.js` |
| Tests | `backend/tests/ai.test.js` (15 tests) |

Mount: `app.use("/api/ai", require("./routes/aiRoutes")());` — server.js line 115.

### 2.2 Frontend (React 19 + Vite)

| File | Purpose |
|---|---|
| `components/ai/AIChatWidget.jsx` | Floating chat launcher + panel (storefront only) |
| `components/ai/ChatMessage.jsx` | Renders text + structured metadata |
| `components/ai/ChatProductResults.jsx` | Product grid (reuses `ProductCard`) |
| `components/ai/ChatOrderCard.jsx` | Order summary cards |
| `components/ai/ChatConfirm.jsx` | In-chat action confirmation buttons |
| `components/ai/AIChatWidget.css` | Themed to the aqua/teal palette |

Mounted in `App.jsx` beside the WhatsApp button; hidden on admin routes.

## 3. API Surface

All endpoints under `/api/ai`, all protected by the customer `protect` middleware.

| Method & Path | Auth | Rate limit | Purpose |
|---|---|---|---|
| `POST /api/ai/chat` | JWT (customer) | 15 msg / 60s | Send a message; returns `{success, message, data:{reply, conversationId, metadata}}` |
| `POST /api/ai/actions/confirm` | JWT + `scope:"ai_action"` | 5 / 60s | Confirm a pending return/refund/cancellation |

Response shape follows the existing convention: `{ success, message, data }`.

## 4. Authentication & Authorization

- **Login required** for all chat and all actions.
- Chat verifies `req.user._id`, validates ObjectId, and enforces conversation ownership
  (`Conversation.findOne({ _id, user: userId })`).
- **No IDOR:** every order lookup uses `Order.findOne({ _id, user: userId })`, never a
  bare `findById`.
- Confirmed actions are re-verified server-side: JWT `scope:"ai_action"` claim +
  `req.user._id` + ownership query + business rules (paid orders cannot be cancelled;
  duplicate return tickets blocked; existing ticket on same order blocks escalation).
- Admin flow untouched (`adminAuthMiddleware`); admin-only routes keep working.

## 5. Security & Guardrails

- **Prompt injection defense:** system prompt boundary enforcement + pattern checks on
  every user message and every tool argument. Refusals return a neutral message and are
  not persisted as knowledge.
- **Secrets redaction** in all debug logging.
- **Per-user rate limiting** using `express-rate-limit` with the `ipKeyGenerator` helper
  (fixed for Node 20+ / express-rate-limit v7).
- **LLM output is advisory only** — destructive actions are never auto-executed.
- No secrets committed: `backend/.env.example` added, `.env` remains gitignored.

## 6. Tooling / Orchestration

Tools registered with the model: `search_products`, `get_product_details`,
`get_customer_orders`, `get_order_details`, `get_order_status`, `get_return_status`,
`escalate_to_human`, `request_order_cancellation`, `request_return`, `request_refund`.

- Orchestrator runs a max-iteration tool loop and enforces a hard token cap.
- `request_*` tools return **confirmation payloads** (`{ confirmationKey, type, orderId, ... }`)
  that are surfaced in the UI as a Confirm / Cancel box — nothing is executed until the
  user clicks Confirm.
- `escalate_to_human` creates a `SupportTicket` (no duplicate tickets per order).
- Every reply carries structured `metadata` (products/orders/order/orderStatus/
  action_request/ticket) so the chat renders rich cards.

## 7. RAG Knowledge Base

- 8 markdown documents: FAQ, Shipping, Returns, Refunds, Payments, Cancellation,
  General, plus product-info guidance.
- `chunkText()` splits on paragraphs; each chunk is embedded (OpenAI embeddings,
  batch of 50) and upserted per source (idempotent re-runs).
- Retrieval: vector search (`$vectorSearch` on `knowledgechunks`, index
  `ATLAS_VECTOR_INDEX`) with **keyword fallback** (`$text` search) when the vector index
  is unavailable — never an empty answer when relevant knowledge exists.
- Ingestion command: `npm run ingest:knowledge` (or
  `node scripts/ingestKnowledge.js`).

## 8. Frontend UX

- Floating chat button (bottom-right, z-index 10001) opens a 390px panel; hidden on
  admin routes; `WhatsAppButton` z-index unchanged.
- Welcome message + quick-prompt chips. Typing indicator, per-message error bubbles.
- Logged-out users see a login prompt that opens the existing auth modal
  (`setIsAuthOpen(true)`).
- Product results render with existing `ProductCard`s wired to the app's
  `handleAddToCart` / `handleBuyClick` (cart context + checkout flow reused unchanged).
- Orders/order-status/return-status render as cards; confirmation box sends
  `POST /api/ai/actions/confirm` and shows done/cancelled states.

## 9. Configuration (`.env.example`)

```
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o-mini
EMBEDDING_MODEL=text-embedding-3-small
AI_EMBEDDING_DIM=1536
ATLAS_VECTOR_INDEX=vector_index
RAG_MIN_SCORE=0.25
```
`openai@7.4.0` was installed in `backend/package.json`.

## 10. Testing & Verification

- `npm test` (backend): **15 tests, 7 pass, 8 skip**. Skips are DB-gated — Atlas was
  unreachable from the current IP during the run (test suite auto-skips when Mongo is
  down). Skipped coverage: rate limit 429, end-to-end injection refusal, conversation
  persistence + ownership, cross-user order isolation, confirmed-action ownership &
  business rules, product search tool, keyword RAG retrieval, structured results E2E.
- Frontend `npm run build` (vite): builds cleanly (1966 modules).

## 11. Blocker / Follow-up

- **Live E2E not yet run**: MongoDB Atlas rejected connections from the current IP.
  Next steps once Mongo is reachable:
  1. `npm run ingest:knowledge`
  2. `npm test` (expect all 15 to run)
  3. Boot server, log in as a seeded user, chat end-to-end, and complete one
     return/refund/cancellation confirmation.

## 12. Files Changed / Added

**Backend (new):** `services/ai/{aiService,prompts,guardrails,orchestrator,ragService,embeddingService,toolService}.js`,
`services/ai/rag/chunker.js`, `controllers/aiController.js`, `routes/aiRoutes.js`,
`models/{Conversation,KnowledgeChunk,ReturnRequest,SupportTicket}.js`,
`scripts/ingestKnowledge.js`, `tests/ai.test.js`, `knowledge/**` (8 docs),
`.env.example`.

**Backend (modified):** `server.js` (mount `/api/ai`), `middleware/authMiddleware.js`
(401 on missing token — previously unused), `package.json` (test + ingest scripts).

**Frontend (new):** `components/ai/*` (6 files).

**Frontend (modified):** `App.jsx` (widget import + mount with cart/buy/login wiring).
