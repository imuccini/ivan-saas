"use client";

import { Activity, ChevronRight, HelpCircle, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Layout } from "../../components/Layout";
import { Button, Card } from "../../components/ui";
import { AppRoute } from "../../types";

interface MenuItemProps {
	icon: React.ReactNode;
	title: string;
	subtitle: string;
	onClick: () => void;
	cta?: string;
	featured?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
	icon,
	title,
	subtitle,
	onClick,
	cta,
	featured,
}) => (
	<Card
		className={
			"p-5 cursor-pointer transition-all active:scale-[0.98] hover:border-blue-200 group relative overflow-hidden"
		}
		onClick={onClick}
	>
		<div className="flex items-start gap-4">
			<div
				className={`p-3.5 rounded-2xl shrink-0 ${featured ? "bg-blue-600 text-white" : "bg-slate-50 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"}`}
			>
				{icon}
			</div>
			<div className="flex-1 py-0.5">
				<h3 className="font-bold text-[17px] text-slate-900 mb-1">
					{title}
				</h3>
				<p className="text-[15px] text-slate-500 leading-relaxed">
					{subtitle}
				</p>
				{cta && (
					<span
						className={`text-sm font-medium mt-2 inline-block ${featured ? "text-blue-700" : "text-blue-600"}`}
					>
						{cta}
					</span>
				)}
			</div>
			<ChevronRight
				className="text-slate-300 group-hover:text-blue-400 self-center transition-colors"
				size={20}
			/>
		</div>
	</Card>
);

export default function DashboardPage() {
	const router = useRouter();

	return (
		<Layout>
			<div className="space-y-8 animate-in fade-in duration-500">
				{/* Unified Hero Card */}
				<div className="bg-gradient-to-br from-[#E0E7FF] via-[#EEF2FF] to-[#F5F3FF] rounded-[32px] p-8 shadow-sm relative overflow-hidden border border-white">
					{/* Decorative elements */}
					<div className="absolute top-0 right-0 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
					<div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300/10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

					<div className="relative">
						<div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm mb-6 border border-white/50">
							<svg
								viewBox="0 0 384 512"
								fill="currentColor"
								className="w-3.5 h-3.5 text-[#2563EB]"
							>
								<path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 52.3-11.4 69.5-34.3z" />
							</svg>
							<span className="text-sm font-bold text-[#2563EB]">
								iPhone 14 Pro
							</span>
						</div>

						<h1 className="text-[32px] leading-tight font-extrabold text-slate-900 mb-3 tracking-tight">
							Onboard This Device
						</h1>
						<p className="text-slate-600 text-[17px] mb-8 max-w-sm leading-relaxed">
							Get connected to the corporate WiFi in a few steps.
						</p>

						<Button
							onClick={() =>
								router.push(`/${AppRoute.ONBOARDING}`)
							}
							className="rounded-full px-12 h-14 text-[17px] font-bold bg-[#2563EB] hover:bg-blue-700 shadow-xl shadow-blue-200 transform transition-transform active:scale-95"
						>
							Start
						</Button>
					</div>
				</div>

				{/* Action Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
					<MenuItem
						icon={<Smartphone size={26} strokeWidth={1.5} />}
						title="Onboard other devices"
						subtitle="Connect personal devices or IoT gadgets using network credentials."
						onClick={() => router.push(`/${AppRoute.WIFI_DETAILS}`)}
					/>

					<MenuItem
						icon={<Activity size={26} strokeWidth={1.5} />}
						title="Network activity"
						subtitle="Monitor your devices, traffic usage, and connection history."
						onClick={() => router.push(`/${AppRoute.DEVICES}`)}
					/>

					<MenuItem
						icon={<HelpCircle size={26} strokeWidth={1.5} />}
						title="Help & Support"
						subtitle="Get help with common connection issues or contact IT."
						onClick={() => router.push(`/${AppRoute.HELP}`)}
					/>
				</div>
			</div>
		</Layout>
	);
}
