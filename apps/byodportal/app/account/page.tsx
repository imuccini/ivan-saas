"use client";

import {
	Calendar,
	ChevronRight,
	Lock,
	LogOut,
	Shield,
	Trash2,
	User,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import { Button, Card, Modal } from "../../components/ui";
import { AppRoute } from "../../types";

export default function AccountPage() {
	const router = useRouter();
	const [showPwdModal, setShowPwdModal] = useState(false);

	const ListItem = ({ icon, label, value, onClick, isDanger }: any) => (
		<div
			className={`p-4 flex items-center justify-between cursor-pointer transition-colors ${isDanger ? "hover:bg-red-50" : "hover:bg-slate-50"}`}
			onClick={onClick}
		>
			<div className="flex items-center gap-4">
				<div
					className={`text-slate-400 ${isDanger ? "text-slate-400 group-hover:text-red-500" : ""}`}
				>
					{icon}
				</div>
				<div>
					{value ? (
						<>
							<p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-0.5">
								{label}
							</p>
							<p className="text-[15px] font-medium text-slate-900">
								{value}
							</p>
						</>
					) : (
						<span
							className={`text-[15px] font-medium ${isDanger ? "text-slate-700 group-hover:text-red-600" : "text-slate-700"}`}
						>
							{label}
						</span>
					)}
				</div>
			</div>
			{onClick && <ChevronRight className="text-slate-300" size={18} />}
		</div>
	);

	return (
		<Layout title="Account" showBack backPath={`/${AppRoute.DASHBOARD}`}>
			<div className="space-y-8">
				{/* Profile Header */}
				<div className="flex flex-col items-center py-6">
					<div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 shadow-xl shadow-blue-200 ring-4 ring-white">
						IM
					</div>
					<h2 className="text-xl font-bold text-slate-900">
						Ivan Muccini
					</h2>
					<p className="text-slate-500 font-medium">
						imuccini@enterprise.com
					</p>
				</div>

				{/* Details Card */}
				<Card className="divide-y divide-slate-100 overflow-hidden">
					<ListItem
						icon={<User size={22} />}
						label="Name"
						value="Ivan Muccini"
					/>
					<div className="p-4 flex items-center justify-between">
						<div className="flex items-center gap-4">
							<div className="text-slate-400">
								<Calendar size={22} />
							</div>
							<div>
								<p className="text-xs text-slate-500 uppercase tracking-wide font-bold mb-0.5">
									Account Expiration
								</p>
								<p className="text-[15px] font-medium text-slate-900">
									May 27, 2026
								</p>
							</div>
						</div>
						<span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold">
							72 days left
						</span>
					</div>
				</Card>

				{/* Security Section */}
				<div>
					<h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 px-2">
						Privacy and Security
					</h3>
					<Card className="divide-y divide-slate-100 overflow-hidden">
						<ListItem
							icon={<Lock size={22} />}
							label="Change Network Password"
							onClick={() => setShowPwdModal(true)}
						/>
						<ListItem
							icon={<Shield size={22} />}
							label="Privacy Policy"
							onClick={() => {}}
						/>
						<div className="group">
							<ListItem
								icon={<Trash2 size={22} />}
								label="Delete Account"
								onClick={() => {}}
								isDanger
							/>
						</div>
					</Card>
				</div>

				<Button
					variant="outline"
					fullWidth
					className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-200"
					onClick={() => router.push(`/${AppRoute.LOGIN}`)}
				>
					<LogOut size={18} className="mr-2" />
					Log Out
				</Button>

				{/* Change Password Modal */}
				<Modal
					isOpen={showPwdModal}
					onClose={() => setShowPwdModal(false)}
					title="Change Network Password"
					footer={
						<>
							<Button
								variant="ghost"
								onClick={() => setShowPwdModal(false)}
								className="rounded-full"
							>
								Cancel
							</Button>
							<Button
								onClick={() => setShowPwdModal(false)}
								className="rounded-full"
							>
								Change Password
							</Button>
						</>
					}
				>
					<div className="space-y-4">
						<div className="bg-amber-50 p-4 rounded-2xl text-amber-900 text-sm border border-amber-100/50 flex gap-3">
							<div className="bg-amber-100 p-1.5 rounded-full h-fit text-amber-600 shrink-0">
								<Shield size={16} />
							</div>
							<p className="leading-relaxed">
								By changing your Network Password,{" "}
								<strong>
									all your devices will need to be
									re-onboarded
								</strong>{" "}
								to connect to the secure network.
							</p>
						</div>
						<p className="text-[15px] text-slate-600 leading-relaxed">
							For security reasons, the password cannot be
							manually selected. A secure password will be
							automatically generated for you.
						</p>
						<p className="font-bold text-slate-900">
							Are you sure you want to continue?
						</p>
					</div>
				</Modal>
			</div>
		</Layout>
	);
}
