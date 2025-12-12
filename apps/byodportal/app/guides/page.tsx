"use client";

import {
	Laptop,
	Monitor,
	MonitorSmartphone,
	Smartphone,
	Smartphone as Tablet,
} from "lucide-react";
import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/ui";
import { AppRoute } from "../../types";

type OSType = "mac" | "ios" | "android" | "windows" | "chrome";

interface GuideStep {
	text: React.ReactNode;
	subContent?: React.ReactNode;
}

const OS_CONFIG: { id: OSType; label: string; icon: React.ReactNode }[] = [
	{ id: "mac", label: "MacBook", icon: <Laptop size={24} /> },
	{ id: "ios", label: "iPhone & iPad", icon: <Tablet size={24} /> },
	{ id: "android", label: "Android", icon: <Smartphone size={24} /> },
	{ id: "windows", label: "Windows", icon: <MonitorSmartphone size={24} /> },
	{ id: "chrome", label: "ChromeOS", icon: <Monitor size={24} /> },
];

export default function GuidesPage() {
	const [selectedOS, setSelectedOS] = useState<OSType>("chrome");

	const renderContent = () => {
		// For prototype purposes, we are implementing the ChromeOS guide in detail as requested.
		// Other tabs can display a placeholder or similar structure.
		if (selectedOS === "chrome") {
			return (
				<div className="space-y-6 animate-in fade-in duration-300">
					<h2 className="text-xl font-bold text-slate-900">
						ChromeOS 802.1X Connection
					</h2>

					<div className="space-y-6 text-slate-700">
						<div className="flex gap-3">
							<span className="font-medium text-slate-900 shrink-0">
								1.
							</span>
							<p>
								Click on the{" "}
								<span className="text-blue-600 font-medium">
									network icon
								</span>{" "}
								in the bottom-right corner of your screen
							</p>
						</div>

						<div className="flex gap-3">
							<span className="font-medium text-slate-900 shrink-0">
								2.
							</span>
							<p>
								Find and select the{" "}
								<span className="text-blue-600 font-medium">
									CorpNet_Secure
								</span>{" "}
								network
							</p>
						</div>

						<div className="flex gap-3">
							<span className="font-medium text-slate-900 shrink-0">
								3.
							</span>
							<p>
								In the connection dialog, set the following
								options:
							</p>
						</div>

						<div className="ml-7 bg-slate-50 p-5 rounded-lg border border-slate-100 text-sm space-y-2">
							<div className="grid grid-cols-[140px_1fr] gap-2">
								<span className="font-bold text-slate-800">
									EAP Method:
								</span>
								<span className="text-blue-600 font-medium">
									PEAP
								</span>
							</div>
							<div className="grid grid-cols-[140px_1fr] gap-2">
								<span className="font-bold text-slate-800">
									Phase 2 authentication:
								</span>
								<span className="text-blue-600 font-medium">
									MSCHAPv2
								</span>
							</div>
							<div className="grid grid-cols-[140px_1fr] gap-2">
								<span className="font-bold text-slate-800">
									Server CA certificate:
								</span>
								<span className="text-blue-600 font-medium">
									Do not check
								</span>
							</div>
							<div className="grid grid-cols-[140px_1fr] gap-2">
								<span className="font-bold text-slate-800">
									Identity:
								</span>
								<span className="text-blue-600 font-medium">
									imuccini@cloud4wi.ai
								</span>
							</div>
							<div className="grid grid-cols-[140px_1fr] gap-2">
								<span className="font-bold text-slate-800">
									Password:
								</span>
								<span className="text-blue-600 font-medium">
									43543r34r43f34f43f
								</span>
							</div>
						</div>

						<div className="flex gap-3">
							<span className="font-medium text-slate-900 shrink-0">
								5.
							</span>
							<p>
								Click{" "}
								<span className="text-blue-600 font-medium">
									Connect
								</span>
							</p>
						</div>

						<div className="flex gap-3">
							<span className="font-medium text-slate-900 shrink-0">
								6.
							</span>
							<p>
								If prompted to accept certificates, click{" "}
								<span className="text-blue-600 font-medium">
									Continue
								</span>
							</p>
						</div>

						<div className="flex gap-3">
							<span className="font-medium text-slate-900 shrink-0">
								7.
							</span>
							<p>
								Your Chromebook should now connect to the secure
								network
							</p>
						</div>

						<div className="flex gap-3">
							<span className="font-medium text-slate-900 shrink-0">
								8.
							</span>
							<p>The connection will be saved for future use</p>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="text-center py-12 text-slate-500">
				<p>
					Instructions for{" "}
					{OS_CONFIG.find((os) => os.id === selectedOS)?.label} would
					appear here.
				</p>
			</div>
		);
	};

	return (
		<Layout
			title="Connection Guides"
			showBack
			backPath={`/${AppRoute.WIFI_DETAILS}`}
		>
			<div className="space-y-6">
				{/* OS Selector */}
				<div className="flex justify-between overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 md:mx-0 md:px-0">
					{OS_CONFIG.map((os) => (
						<button
							key={os.id}
							onClick={() => setSelectedOS(os.id)}
							className="flex flex-col items-center gap-2 min-w-[70px] focus:outline-none"
						>
							<div
								className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
									selectedOS === os.id
										? "bg-blue-100 text-blue-600 ring-2 ring-blue-600 ring-offset-2"
										: "bg-slate-100 text-slate-500 hover:bg-slate-200"
								}`}
							>
								{os.icon}
							</div>
							<span
								className={`text-xs font-medium ${selectedOS === os.id ? "text-slate-900" : "text-slate-500"}`}
							>
								{os.label}
							</span>
						</button>
					))}
				</div>

				{/* Content Card */}
				<Card className="p-6 md:p-8">{renderContent()}</Card>
			</div>
		</Layout>
	);
}
