import { ChatVertexAI } from "@langchain/google-vertexai";
import {
	AIMessage,
	HumanMessage,
	type BaseMessage,
	SystemMessage,
	ToolMessage,
} from "@langchain/core/messages";
import type { AgentState, AgentIntent } from "./types";
import { allTools, toolMap } from "./tools";

/**
 * Get the Vertex AI model instance
 */
function getModel() {
	return new ChatVertexAI({
		model: "gemini-2.0-flash-001",
		temperature: 0.7,
		maxOutputTokens: 2048,
	});
}

/**
 * Router Node - Classifies user intent and routes to appropriate handler
 */
export async function routerNode(
	state: AgentState,
): Promise<Partial<AgentState>> {
	const model = getModel();

	const systemPrompt = `You are a routing assistant for the Antigravity SaaS platform.
Analyze the user's message and classify their intent into one of these categories:

1. "search_knowledge" - User is asking for documentation, how-to guides, or information
2. "get_setup_steps" - User wants step-by-step instructions to set up a feature
3. "update_config" - User wants to change a configuration or setting
4. "general_chat" - General conversation, greetings, or unclear intent

Respond with ONLY a JSON object in this format:
{"type": "<intent_type>", "confidence": <0.0-1.0>, "entities": {"feature": "...", "query": "..."}}`;

	const response = await model.invoke([
		new SystemMessage(systemPrompt),
		...state.messages,
	]);

	let intent: AgentIntent;
	try {
		const content =
			typeof response.content === "string"
				? response.content
				: JSON.stringify(response.content);

		// Extract JSON from the response
		const jsonMatch = content.match(/\{[\s\S]*\}/);
		if (jsonMatch) {
			intent = JSON.parse(jsonMatch[0]) as AgentIntent;
		} else {
			intent = { type: "general_chat", confidence: 0.5 };
		}
	} catch {
		intent = { type: "general_chat", confidence: 0.5 };
	}

	// Determine next agent based on intent
	let nextAgent: AgentState["currentAgent"];
	if (
		intent.type === "search_knowledge" ||
		intent.type === "get_setup_steps" ||
		intent.type === "update_config"
	) {
		nextAgent = "tool_executor";
	} else {
		nextAgent = "response_formatter";
	}

	return {
		intent,
		currentAgent: nextAgent,
	};
}

/**
 * Tool Executor Node - Executes tools based on the classified intent
 */
export async function toolExecutorNode(
	state: AgentState,
): Promise<Partial<AgentState>> {
	if (!state.intent) {
		return { currentAgent: "response_formatter", toolResults: [] };
	}

	const model = getModel().bindTools(allTools);

	// Build a prompt that encourages tool use
	const toolPrompt = `Based on the user's request and the classified intent (${state.intent.type}), 
use the appropriate tool to help the user. Available tools:
- search_knowledge_base: For documentation and knowledge queries
- get_setup_steps: For step-by-step setup instructions
- update_config: For configuration changes (use with caution)

User's request follows. Use the most appropriate tool.`;

	const response = await model.invoke([
		new SystemMessage(toolPrompt),
		...state.messages,
	]);

	const toolResults: AgentState["toolResults"] = [];

	// Check if the model wants to call tools
	if (response.tool_calls && response.tool_calls.length > 0) {
		for (const toolCall of response.tool_calls) {
			try {
				let result: string;
				const args = toolCall.args as Record<string, unknown>;

				// Execute the appropriate tool based on name
				switch (toolCall.name) {
					case "search_knowledge_base":
						result = await toolMap.search_knowledge_base.invoke({
							query: args.query as string,
							category: args.category as
								| "setup"
								| "configuration"
								| "troubleshooting"
								| "general"
								| undefined,
						});
						break;
					case "get_setup_steps":
						result = await toolMap.get_setup_steps.invoke({
							feature: args.feature as string,
						});
						break;
					case "update_config":
						result = await toolMap.update_config.invoke({
							configPath: args.configPath as string,
							value: args.value as string,
						});
						break;
					default:
						throw new Error(`Unknown tool: ${toolCall.name}`);
				}

				toolResults.push({
					toolName: toolCall.name,
					result: JSON.parse(result),
				});
			} catch (error) {
				toolResults.push({
					toolName: toolCall.name,
					result: null,
					error: error instanceof Error ? error.message : "Tool execution failed",
				});
			}
		}
	}

	// Add tool results to messages for context
	const updatedMessages = [...state.messages];
	if (toolResults.length > 0) {
		updatedMessages.push(
			new AIMessage({
				content: "",
				tool_calls: response.tool_calls,
			}),
		);

		for (const result of toolResults) {
			updatedMessages.push(
				new ToolMessage({
					tool_call_id: result.toolName,
					content: JSON.stringify(result.result),
				}),
			);
		}
	}

	return {
		messages: updatedMessages,
		toolResults,
		currentAgent: "response_formatter",
	};
}

/**
 * Response Formatter Node - Generates the final response
 */
export async function responseFormatterNode(
	state: AgentState,
): Promise<Partial<AgentState>> {
	const model = getModel();

	let systemPrompt = `You are a helpful AI assistant for the Antigravity SaaS platform.
Provide clear, concise, and helpful responses. Use markdown formatting when appropriate.
Be friendly and professional.`;

	// Add context about tool results
	if (state.toolResults && state.toolResults.length > 0) {
		const toolContext = state.toolResults
			.map((r) => `Tool "${r.toolName}" result: ${JSON.stringify(r.result)}`)
			.join("\n");

		systemPrompt += `\n\nTool execution results:\n${toolContext}\n\nUse these results to provide a helpful response to the user.`;
	}

	const response = await model.invoke([
		new SystemMessage(systemPrompt),
		...state.messages,
	]);

	return {
		messages: [...state.messages, response],
		currentAgent: "end",
	};
}

/**
 * Determine the next node based on current state
 */
export function routeNext(
	state: AgentState,
): "tool_executor" | "response_formatter" | "__end__" {
	switch (state.currentAgent) {
		case "tool_executor":
			return "tool_executor";
		case "response_formatter":
			return "response_formatter";
		case "end":
			return "__end__";
		default:
			return "response_formatter";
	}
}
