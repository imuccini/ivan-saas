"use client";

import {
	BookOpen,
	ChevronRight,
	Copy,
	HelpCircle,
	Key,
	RefreshCw,
	ShieldCheck,
	Wifi,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import { Layout } from "../../components/Layout";
import { Button, Card } from "../../components/ui";
import { AppRoute } from "../../types";

function WifiDetailsContent() {
	const searchParams = useSearchParams();
	const [activeTab, setActiveTab] = useState<"secure" | "iot">("secure");
	const router = useRouter();

	useEffect(() => {
		const tab = searchParams.get("tab");
		if (tab === "iot") setActiveTab("iot");
	}, [searchParams]);

	const CopyButton = ({ text }: { text: string }) => {
		const [copied, setCopied] = useState(false);

		const handleCopy = () => {
			navigator.clipboard.writeText(text);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		};

		return (
			<button
				onClick={handleCopy}
				className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-slate-50 rounded-lg hover:bg-blue-50"
				title="Copy to clipboard"
			>
				{copied ? (
					<span className="text-xs text-green-600 font-bold">
						Copied
					</span>
				) : (
					<Copy size={18} />
				)}
			</button>
		);
	};

	const CredentialRow = ({
		label,
		value,
		sensitive = false,
	}: {
		label: string;
		value: string;
		sensitive?: boolean;
	}) => (
		<div className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
			<div className="flex flex-col gap-1">
				<span className="text-xs text-slate-500 uppercase tracking-wider font-bold">
					{label}
				</span>
				<span
					className={`text-[15px] font-medium text-slate-900 font-mono ${sensitive ? "tracking-wider" : ""}`}
				>
					{value}
				</span>
			</div>
			<CopyButton text={value} />
		</div>
	);

	return (
		<Layout
			title={
				activeTab === "secure"
					? "Secure WiFi Details"
					: "IoT WiFi Details"
			}
			showBack
			backPath={`/${AppRoute.DASHBOARD}`}
		>
			<div className="space-y-6">
				{/* Segmented Control Tabs */}
				<div className="bg-slate-100 p-1.5 rounded-xl flex gap-1">
					<button
						onClick={() => setActiveTab("secure")}
						className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "secure" ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700"}`}
					>
						Personal Devices
					</button>
					<button
						onClick={() => setActiveTab("iot")}
						className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === "iot" ? "bg-white text-slate-900 shadow-sm ring-1 ring-black/5" : "text-slate-500 hover:text-slate-700"}`}
					>
						IoT Devices
					</button>
				</div>

				<div className="bg-blue-50/80 text-blue-900 text-[15px] p-5 rounded-2xl flex items-start gap-4 border border-blue-100">
					<div className="bg-white p-2 rounded-full shrink-0 shadow-sm">
						<Wifi className="text-blue-600" size={20} />
					</div>
					<p className="leading-relaxed font-medium">
						{activeTab === "secure"
							? "Use the credentials below to connect your laptops, phones, and tablets to the secure corporate network."
							: "Use these credentials for devices that don't support 802.1x enterprise auth (e.g., printers, smart TVs, consoles)."}
					</p>
				</div>

				<Card className="p-0 overflow-hidden shadow-sm">
					<div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex items-center gap-3 backdrop-blur-sm">
						<div
							className={`p-2 rounded-full ${activeTab === "secure" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}
						>
							<ShieldCheck size={20} />
						</div>
						<div>
							<h3 className="font-bold text-slate-900 text-base">
								WiFi Network Details
							</h3>
							<p className="text-xs font-medium text-slate-500 uppercase tracking-wide">
								Last updated: 2 days ago
							</p>
						</div>
					</div>
					<div className="px-6 py-2">
						{activeTab === "secure" ? (
							<>
								<CredentialRow
									label="SSID (Network Name)"
									value="CorpNet_Secure"
								/>
								<CredentialRow
									label="Username"
									value="imuccini@cloud4wi.ai"
								/>
								<CredentialRow
									label="Password"
									value="43543r34r43f34f43f"
									sensitive
								/>
							</>
						) : (
							<>
								<CredentialRow
									label="SSID (Network Name)"
									value="CorpNet_IoT"
								/>
								<CredentialRow
									label="Personal Password"
									value="9988-7766-5544"
									sensitive
								/>
							</>
						)}
					</div>
				</Card>

				{/* Security Notice - displayed for both tabs with dynamic content */}
				<div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
					<div className="flex gap-4">
						<div className="bg-amber-100 p-2 rounded-full h-fit shrink-0 text-amber-600">
							<Key size={20} />
						</div>
						<div>
							<h4 className="font-bold text-amber-900 text-base">
								Security First
							</h4>
							<p className="text-sm text-amber-800 mt-1 leading-relaxed">
								{activeTab === "secure" ? (
									<>
										Your derived Network Credentials are not
										your corporate credentials.
										<strong> Do not share them.</strong> You
										are responsible for all activity.
									</>
								) : (
									<>
										You are accountable for all network
										activity from devices connected using
										your Personal WiFi password.{" "}
										<strong> Do not share it.</strong>
									</>
								)}
							</p>
						</div>
					</div>
					<Button
						variant="outline"
						className="w-full mt-5 bg-white border-amber-200 text-amber-900 hover:bg-amber-50 h-11"
						fullWidth
					>
						<RefreshCw size={16} className="mr-2" />
						{activeTab === "secure"
							? "Regenerate Credentials"
							: "Regenerate WiFi Password"}
					</Button>
				</div>

				{/* Connection Guides - Only shown for Secure tab */}
				{activeTab === "secure" && (
					<div className="pt-4">
						<h4 className="font-bold text-slate-900 mb-4 text-[15px] px-1">
							Connection Guides
						</h4>
						<div className="grid grid-cols-1 gap-3">
							{[
								"How to connect Android devices",
								"How to connect Windows laptops",
								"How to connect manually on iOS",
							].map((guide, i) => (
								<Card
									key={i}
									className="p-4 flex items-center justify-between hover:border-blue-300 cursor-pointer group transition-all active:scale-[0.99]"
									onClick={() =>
										router.push(`/${AppRoute.GUIDES}`)
									}
								>
									<div className="flex items-center gap-3">
										<HelpCircle
											size={20}
											className="text-slate-400 group-hover:text-blue-500 transition-colors"
										/>
										<span className="text-[15px] font-medium text-slate-700 group-hover:text-slate-900">
											{guide}
										</span>
									</div>
									<ChevronRight
										className="text-slate-300"
										size={18}
									/>
								</Card>
							))}

							{/* Other Devices Guides Link */}
							<Card
								className="p-4 flex items-center justify-between hover:border-blue-300 cursor-pointer group transition-all border-dashed active:scale-[0.99]"
								onClick={() =>
									router.push(`/${AppRoute.GUIDES}`)
								}
							>
								<div className="flex items-center gap-3">
									<div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
										<BookOpen size={16} />
									</div>
									<span className="text-[15px] font-medium text-slate-700 group-hover:text-blue-700">
										Other devices guides
									</span>
								</div>
								<ChevronRight
									className="text-slate-300 group-hover:text-blue-400"
									size={18}
								/>
							</Card>
						</div>
					</div>
				)}
			</div>
		</Layout>
	);
}

export default function WifiDetailsPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<WifiDetailsContent />
		</Suspense>
	);
}
