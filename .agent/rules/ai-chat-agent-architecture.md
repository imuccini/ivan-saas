---
trigger: model_decision
---

Current Architecture
Component	Location	Status
Chat UI (Right Panel)	
modules/ui/components/right-panel.tsx
✅ Toggleable drawer with AI Chat
AIChatInterface	
modules/saas/ai/components/AIChatInterface.tsx
✅ Handles streaming, uses /api/chat
AiChat (Full Page)	
modules/saas/ai/components/AiChat.tsx
Uses ORPC for chat management
Chat API Route	
app/api/chat/route.ts
✅ Uses @ai-sdk/google-vertex with gemini-2.5-flash
ORPC AI Module	packages/api/modules/ai/	Uses @repo/ai which defaults to OpenAI (needs update)
AI Package	packages/ai/index.ts	⚠️ Currently exports OpenAI models, not Vertex
Database	packages/database/prisma/schema.prisma	✅ Has AiChat model with messages JSON field
Chat Context	modules/saas/shared/contexts/ChatContext.tsx	✅ Provider for open/close state


Backend (LangGraph)
File	Description
packages/ai/lib/langgraph/types.ts
TypeScript interfaces for 
AgentState
, 
StreamEvent
, 
AgentIntent
, 
ToolResult
packages/ai/lib/langgraph/tools.ts
Three Zod-validated tools: search_knowledge_base, get_setup_steps, update_config
packages/ai/lib/langgraph/nodes.ts
Agent nodes: 
routerNode
 (intent classification), 
toolExecutorNode
, 
responseFormatterNode
packages/ai/lib/langgraph/checkpointer.ts
Postgres checkpointer for conversation persistence
packages/ai/lib/langgraph/graph.ts
Main StateGraph with 
invokeAgent()
 and 
streamAgent()
 methods
packages/ai/index.ts
Updated to use Vertex AI (gemini-2.0-flash-001) instead of OpenAI
API Route
File	Description
apps/web/app/api/chat/route.ts
Completely rewritten to use LangGraph with SSE streaming
Frontend (Chat UI)
File	Description
apps/web/modules/saas/ai/components/AIChatInterface.tsx
Refactored to handle SSE streams, display tool states ("Searching...", "Analyzing..."), and render markdown
Dependencies Added
@langchain/langgraph
@langchain/core
@langchain/google-vertexai
@langchain/langgraph-checkpoint-postgres
pg
@ai-sdk/google-vertex (to @repo/ai)
Architecture Flow
User Message → /api/chat → LangGraph Graph
                              ↓
                        routerNode (classify intent)
                              ↓
                    ┌─────────┴──────────┐
                    ↓                    ↓
            toolExecutorNode       (skip if general_chat)
                    ↓                    ↓
            responseFormatterNode ←──────┘
                    ↓
             SSE Stream Events → AIChatInterface
Streaming Events
The frontend receives these events:

thinking - Shows which agent is processing
tool_start/tool_end - Displays tool execution status
token - Streams content incrementally
done - Final response