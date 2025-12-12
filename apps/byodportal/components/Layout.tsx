"use client";

import { ArrowLeft, User as UserIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { AppRoute } from "../types";

interface LayoutProps {
	children: React.ReactNode;
	title?: string;
	showBack?: boolean;
	onBack?: () => void;
	backPath?: string;
	actions?: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
	children,
	title,
	showBack = false,
	onBack,
	backPath,
	actions,
}) => {
	const router = useRouter();
	const pathname = usePathname();

	const handleBack = () => {
		if (onBack) {
			onBack();
		} else if (backPath) {
			router.push(backPath);
		} else {
			router.back();
		}
	};

	const isDashboard = pathname === "/" || pathname.includes("dashboard");
	const isLogin = pathname.includes("login");

	if (isLogin) {
		return (
			<div className="min-h-screen w-full flex items-center justify-center bg-slate-50 p-4">
				{children}
			</div>
		);
	}

	return (
		<div className="min-h-screen w-full bg-slate-50 flex flex-col items-center">
			{/* Top Navigation Bar */}
			<div className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
				<div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
					<div className="flex items-center gap-3">
						{showBack && (
							<button
								type="button"
								onClick={handleBack}
								className="p-2 -ml-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
								aria-label="Go back"
							>
								<ArrowLeft size={20} />
							</button>
						)}
						{title && (
							<h1 className="text-lg font-semibold text-slate-900 truncate">
								{title}
							</h1>
						)}
						{!title && !showBack && (
							<div className="font-bold text-xl text-slate-900 tracking-tight flex items-center gap-2">
								<div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="20"
										height="20"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
										strokeLinecap="round"
										strokeLinejoin="round"
									>
										<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
									</svg>
								</div>
								BYOD Portal
							</div>
						)}
					</div>
					<div className="flex items-center gap-2">
						{actions}
						{!isLogin && (
							<button
								onClick={() =>
									router.push("/" + AppRoute.ACCOUNT)
								}
								className="p-2 rounded-full hover:bg-slate-100 text-slate-500 md:hidden"
							>
								<UserIcon size={20} />
							</button>
						)}
					</div>
				</div>
			</div>

			{/* Main Content Area */}
			<main className="w-full max-w-6xl p-4 md:p-8 flex-1">
				<div
					className={`mx-auto ${isDashboard ? "w-full" : "max-w-lg"} transition-all duration-300`}
				>
					{children}
				</div>
			</main>

			{/* Footer (Desktop only mainly) */}
			<footer className="w-full py-6 text-center text-slate-400 text-sm hidden md:block">
				&copy; 2024 Enterprise Secure Corp. All rights reserved.
			</footer>
		</div>
	);
};
