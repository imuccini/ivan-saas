"use client";

import { Button } from "@ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ui/components/card";
import {
	CheckCircle2Icon,
	NetworkIcon,
	RocketIcon,
	WifiIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface OnboardingTask {
	id: string;
	title: string;
	description: string;
	completed: boolean;
	action: () => void;
	icon: React.ComponentType<{ className?: string }>;
}

interface OnboardingStatus {
	networkSetup: boolean;
	wifiPersonalized: boolean;
	serviceDeployed: boolean;
	completedCount: number;
	totalCount: number;
	isComplete: boolean;
}

interface OnboardingChecklistProps {
	status: OnboardingStatus;
	basePath: string;
	onOpenWifiWizard?: () => void;
}

export function OnboardingChecklist({
	status,
	basePath,
	onOpenWifiWizard,
}: OnboardingChecklistProps) {
	const router = useRouter();

	const tasks: OnboardingTask[] = [
		{
			id: "network",
			title: "Setup your first network",
			description: "Connect to your network infrastructure",
			completed: status.networkSetup,
			action: () => router.push(`${basePath}/manage/networks?add=true`),
			icon: NetworkIcon,
		},
		{
			id: "wifi",
			title: "Personalize your Guest WiFi Onboarding",
			description: "Configure branding and user flow",
			completed: status.wifiPersonalized,
			action: () => {
				if (onOpenWifiWizard) {
					onOpenWifiWizard();
				} else {
					router.push(`${basePath}/guest-wifi`);
				}
			},
			icon: WifiIcon,
		},
		{
			id: "deploy",
			title: "Deploy the service",
			description: "Activate Guest WiFi on your network",
			completed: status.serviceDeployed,
			action: () => router.push(`${basePath}/guest-wifi`),
			icon: RocketIcon,
		},
	];

	return (
		<Card>
			<CardHeader>
				<CardTitle>Getting Started</CardTitle>
				<CardDescription>
					Complete these steps to activate your Cloud NAC service (
					{status.completedCount}/{status.totalCount})
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				{tasks.map((task) => (
					<OnboardingTaskItem key={task.id} task={task} />
				))}
			</CardContent>
		</Card>
	);
}

function OnboardingTaskItem({ task }: { task: OnboardingTask }) {
	return (
		<div className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50">
			<div
				className={`flex size-10 flex-none items-center justify-center rounded-lg ${
					task.completed
						? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
						: "bg-muted text-muted-foreground"
				}`}
			>
				<task.icon className="size-5" />
			</div>
			<div className="flex-1">
				<div className="flex items-center gap-2">
					<h4 className="text-sm font-medium">{task.title}</h4>
					{task.completed && (
						<CheckCircle2Icon className="size-4 text-green-600 dark:text-green-400" />
					)}
				</div>
				<p className="text-xs text-muted-foreground">
					{task.description}
				</p>
			</div>
			{!task.completed && (
				<Button size="sm" variant="outline" onClick={task.action}>
					Start
				</Button>
			)}
		</div>
	);
}
