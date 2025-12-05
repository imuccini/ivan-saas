export interface AiSuggestion {
	id: string;
	text: string;
}

export interface PageSuggestions {
	pattern: RegExp;
	suggestions: AiSuggestion[];
}

export const pageSuggestions: PageSuggestions[] = [
	// Launchpad (workspace root)
	{
		pattern: /\/app\/[^/]+\/[^/]+\/?$/,
		suggestions: [
			{
				id: "launchpad-trends",
				text: "Tell me what's working and what's not",
			},
			{
				id: "launchpad-guest-experience",
				text: "How can I improve guest user's experience?",
			},
			{
				id: "launchpad-data-trends",
				text: "Is there any strange trend in the data that I should take a look at?",
			},
		],
	},
	// Employees section
	{
		pattern: /\/employees/,
		suggestions: [
			{
				id: "employee-connectivity",
				text: "A user laments is not able to connect, investigate",
			},
			{
				id: "employee-onboarding",
				text: "A user reports not being able to complete the onboarding",
			},
			{
				id: "employee-network-visibility",
				text: "A user says the network is not visible anymore",
			},
		],
	},
	// Guest WiFi section
	{
		pattern: /\/guest-wifi/,
		suggestions: [
			{
				id: "guest-access-issues",
				text: "Guest users are reporting connection issues",
			},
			{
				id: "guest-onboarding-flow",
				text: "How can I improve the guest onboarding flow?",
			},
			{
				id: "guest-portal-customization",
				text: "Help me customize the guest portal experience",
			},
		],
	},
	// IoT section
	{
		pattern: /\/iot/,
		suggestions: [
			{
				id: "iot-device-connectivity",
				text: "IoT devices are having connectivity issues",
			},
			{
				id: "iot-security",
				text: "Review security settings for IoT devices",
			},
			{
				id: "iot-management",
				text: "Help me manage and organize IoT devices",
			},
		],
	},
	// Monitor - Health
	{
		pattern: /\/monitor\/health/,
		suggestions: [
			{
				id: "health-analysis",
				text: "Analyze current network health status",
			},
			{
				id: "health-issues",
				text: "What are the most critical health issues?",
			},
			{
				id: "health-recommendations",
				text: "Provide recommendations to improve network health",
			},
		],
	},
	// Monitor - Logs
	{
		pattern: /\/monitor\/logs/,
		suggestions: [
			{
				id: "logs-errors",
				text: "Show me recent error patterns in the logs",
			},
			{
				id: "logs-investigation",
				text: "Help me investigate unusual log activity",
			},
			{
				id: "logs-user-activity",
				text: "Analyze user activity from the logs",
			},
		],
	},
	// Monitor - Performance
	{
		pattern: /\/monitor\/performances/,
		suggestions: [
			{
				id: "performance-bottlenecks",
				text: "Identify performance bottlenecks",
			},
			{
				id: "performance-trends",
				text: "Show me performance trends over time",
			},
			{
				id: "performance-optimization",
				text: "Suggest optimizations to improve performance",
			},
		],
	},
	// Manage - Networks
	{
		pattern: /\/manage\/networks/,
		suggestions: [
			{
				id: "network-configuration",
				text: "Help me configure network settings",
			},
			{
				id: "network-security",
				text: "Review network security configuration",
			},
			{
				id: "network-optimization",
				text: "Optimize network configuration for better performance",
			},
		],
	},
	// Manage - Integrations
	{
		pattern: /\/manage\/integrations/,
		suggestions: [
			{
				id: "integration-setup",
				text: "Help me set up a new integration",
			},
			{
				id: "integration-troubleshoot",
				text: "Troubleshoot integration connection issues",
			},
			{
				id: "integration-recommendations",
				text: "Recommend useful integrations for my setup",
			},
		],
	},
	// Manage - Communications
	{
		pattern: /\/manage\/communications/,
		suggestions: [
			{
				id: "communications-templates",
				text: "Help me create effective communication templates",
			},
			{
				id: "communications-review",
				text: "Review my current communication settings",
			},
			{
				id: "communications-best-practices",
				text: "What are best practices for user communications?",
			},
		],
	},
];

/**
 * Get AI suggestions based on the current pathname
 */
export function getSuggestionsForPath(pathname: string): AiSuggestion[] {
	for (const { pattern, suggestions } of pageSuggestions) {
		if (pattern.test(pathname)) {
			return suggestions;
		}
	}
	return [];
}
