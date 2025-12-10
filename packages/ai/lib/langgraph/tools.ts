import { tool } from "@langchain/core/tools";
import { z } from "zod";

/**
 * Tool to search the knowledge base / documentation
 */
export const searchKnowledgeBaseTool = tool(
	async ({ query, category }) => {
		// TODO: Implement actual knowledge base search
		// For now, return mock results that can be replaced with real implementation
		console.log(`[Tool] Searching knowledge base for: ${query} in ${category}`);

		// Simulate search results
		const mockResults = [
			{
				title: `Guide: ${query}`,
				content: `Here's information about ${query}...`,
				url: `/docs/${query.toLowerCase().replace(/\s+/g, "-")}`,
			},
		];

		return JSON.stringify({
			success: true,
			results: mockResults,
			query,
			category,
		});
	},
	{
		name: "search_knowledge_base",
		description:
			"Search the documentation and knowledge base for relevant information",
		schema: z.object({
			query: z.string().describe("The search query"),
			category: z
				.enum(["setup", "configuration", "troubleshooting", "general"])
				.optional()
				.describe("Optional category to filter results"),
		}),
	},
);

/**
 * Tool to get setup steps for a feature
 */
export const getSetupStepsTool = tool(
	async ({ feature }) => {
		console.log(`[Tool] Getting setup steps for: ${feature}`);

		// TODO: Implement actual setup steps retrieval
		const mockSteps = [
			`1. Navigate to the ${feature} settings`,
			`2. Configure the basic options`,
			`3. Enable the feature`,
			`4. Test the configuration`,
		];

		return JSON.stringify({
			success: true,
			feature,
			steps: mockSteps,
		});
	},
	{
		name: "get_setup_steps",
		description: "Get step-by-step instructions for setting up a feature",
		schema: z.object({
			feature: z.string().describe("The feature or functionality to set up"),
		}),
	},
);

/**
 * Tool to update configuration (mock for now)
 */
export const updateConfigTool = tool(
	async ({ configPath, value }) => {
		console.log(`[Tool] Updating config at ${configPath} to ${value}`);

		// TODO: Implement actual config update via ORPC
		return JSON.stringify({
			success: true,
			message: `Configuration at ${configPath} would be updated to ${value}. (Simulated - requires approval)`,
			configPath,
			value,
		});
	},
	{
		name: "update_config",
		description:
			"Update a configuration setting. Use with caution - requires user confirmation.",
		schema: z.object({
			configPath: z.string().describe("The path to the configuration setting"),
			value: z.string().describe("The new value to set"),
		}),
	},
);

/**
 * All available tools
 */
export const allTools = [
	searchKnowledgeBaseTool,
	getSetupStepsTool,
	updateConfigTool,
];

/**
 * Tool map for quick lookup
 */
export const toolMap = {
	search_knowledge_base: searchKnowledgeBaseTool,
	get_setup_steps: getSetupStepsTool,
	update_config: updateConfigTool,
};
