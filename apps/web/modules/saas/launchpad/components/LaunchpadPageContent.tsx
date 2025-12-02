"use client";

import { useActiveOrganization } from "@saas/organizations/hooks/use-active-organization";
import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import { Input } from "@ui/components/input";
import {
	AlertTriangleIcon,
	BotIcon,
	ChartLineIcon,
	LightbulbIcon,
	SparklesIcon,
	UsersIcon,
	WifiIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const QUICK_ACTIONS = [
	{
		title: "Guest Wi-Fi",
		description: "Manage visitor access",
		icon: WifiIcon,
		href: "guest-wifi",
		color: "text-blue-500",
		bgColor: "bg-blue-500/10",
	},
	{
		title: "Employees BYOD",
		description: "Onboard employee devices",
		icon: UsersIcon,
		href: "employees",
		color: "text-teal-500",
		bgColor: "bg-teal-500/10",
	},
	{
		title: "IoT Devices",
		description: "Secure IoT network",
		icon: BotIcon,
		href: "iot",
		color: "text-rose-500",
		bgColor: "bg-rose-500/10",
	},
];

const INSIGHTS = [
	{
		id: "critical",
		type: "Critical Issue",
		icon: AlertTriangleIcon,
		iconColor: "text-orange-600",
		iconBg: "bg-orange-100 dark:bg-orange-900/30",
		description:
			"Unrecognized IoT devices found on the Employee BYOD network.",
		action: "Review Devices",
		actionHref: "#",
	},
	{
		id: "optimization",
		type: "Optimization",
		icon: LightbulbIcon,
		iconColor: "text-blue-600",
		iconBg: "bg-blue-100 dark:bg-blue-900/30",
		description:
			"64% of Guest Wi-Fi users provide marketing consent. Automate onboarding?",
		action: "Configure Automation",
		actionHref: "#",
	},
	{
		id: "insight",
		type: "New Insight",
		icon: ChartLineIcon,
		iconColor: "text-teal-600",
		iconBg: "bg-teal-100 dark:bg-teal-900/30",
		description:
			"High traffic on Guest Wi-Fi overlaps with employee network peak hours.",
		action: "Create Policy",
		actionHref: "#",
	},
];

export function LaunchpadPageContent() {
	const [aiInput, setAiInput] = useState("");
	const { activeOrganization } = useActiveOrganization();
	const { activeWorkspace } = useActiveWorkspace();

	const basePath =
		activeOrganization && activeWorkspace
			? `/app/${activeOrganization.slug}/${activeWorkspace.slug}`
			: "/app";

	// Get user name from session (placeholder for now)
	const userName = "Ivan";
	const greeting = getGreeting();

	function getGreeting() {
		const hour = new Date().getHours();
		if (hour < 12) {
			return "Good morning";
		}
		if (hour < 18) {
			return "Good afternoon";
		}
		return "Good evening";
	}

	const handleAISubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!aiInput.trim()) {
			return;
		}

		// Use global function to open AI chat
		if ((window as any).openAIChat) {
			(window as any).openAIChat(aiInput);
		}
		setAiInput("");
	};

	return (
		<div className="mx-auto max-w-5xl space-y-8 py-8">
			{/* AI Greeting Section */}
			<div className="flex flex-col items-center text-center">
				<div className="mb-6 flex size-16 items-center justify-center rounded-full bg-primary/10">
					<SparklesIcon className="size-8 text-primary" />
				</div>
				<h1 className="text-4xl font-bold">
					{greeting}, {userName}.
				</h1>
				<p className="mt-2 text-lg text-muted-foreground">
					I'm here to help you manage your Cloud NAC service. What
					would you like to do?
				</p>
			</div>

			{/* AI Input */}
			<form onSubmit={handleAISubmit} className="mx-auto max-w-3xl">
				<div className="relative">
					<SparklesIcon className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
					<Input
						value={aiInput}
						onChange={(e) => setAiInput(e.target.value)}
						placeholder="Ask AI anything... (e.g., 'show all unassigned devices')"
						className="h-14 pl-12 pr-4 text-base"
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								handleAISubmit(e);
							}
						}}
					/>
				</div>
			</form>

			{/* Quick Actions */}
			<div className="grid gap-6 md:grid-cols-3">
				{QUICK_ACTIONS.map((action) => (
					<Link key={action.href} href={`${basePath}/${action.href}`}>
						<Card className="transition-all hover:shadow-md">
							<CardHeader className="text-center">
								<div
									className={`mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl ${action.bgColor}`}
								>
									<action.icon
										className={`size-8 ${action.color}`}
									/>
								</div>
								<CardTitle className="text-xl">
									{action.title}
								</CardTitle>
								<CardDescription>
									{action.description}
								</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}
			</div>

			{/* Insights Section */}
			<div className="grid gap-6 md:grid-cols-3">
				{INSIGHTS.map((insight) => (
					<Card key={insight.id} className="flex flex-col">
						<CardHeader>
							<div className="flex items-center gap-2">
								<div
									className={`flex size-8 items-center justify-center rounded-lg ${insight.iconBg}`}
								>
									<insight.icon
										className={`size-4 ${insight.iconColor}`}
									/>
								</div>
								<CardTitle className="text-base">
									{insight.type}
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="flex flex-1 flex-col">
							<p className="flex-1 text-sm text-muted-foreground">
								{insight.description}
							</p>
							<Link
								href={insight.actionHref}
								className="mt-4 text-sm font-medium text-primary hover:underline"
							>
								{insight.action} →
							</Link>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
