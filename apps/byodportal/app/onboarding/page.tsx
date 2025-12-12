"use client";

import { CheckCircle, Download, EyeOff, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import { Button, Card } from "../../components/ui";
import { AppRoute } from "../../types";

export default function OnboardingPage() {
	const [step, setStep] = useState(1);
	const router = useRouter();

	const nextStep = () => setStep((s) => s + 1);
	const prevStep = () => {
		if (step > 1) {
			setStep((s) => s - 1);
		} else {
			router.push("/" + AppRoute.DASHBOARD);
		}
	};

	const Step1 = () => (
		<div className="space-y-8 animate-in slide-in-from-right duration-300">
			<div className="text-center py-6">
				<div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 ring-8 ring-blue-50/50">
					<Shield size={48} strokeWidth={1.5} />
				</div>
				<h2 className="text-2xl font-bold text-slate-900 mb-3">
					Getting Started
				</h2>
				<p className="text-slate-500 max-w-xs mx-auto text-lg leading-relaxed">
					Install the WiFi profile to get seamless and secure access.
				</p>
			</div>

			<Card className="p-6 border-l-[6px] border-l-blue-600 bg-gradient-to-r from-blue-50/80 to-transparent shadow-sm">
				<div className="flex gap-5">
					<div className="bg-white p-2.5 rounded-xl shadow-sm h-fit shrink-0">
						<EyeOff className="text-blue-600" size={24} />
					</div>
					<div>
						<h3 className="font-bold text-[17px] text-slate-900 mb-1">
							WiFi Only - No Tracking
						</h3>
						<p className="text-[15px] text-slate-600 leading-relaxed">
							This profile only grants WiFi access. Your personal
							data and app usage are{" "}
							<strong>not monitored</strong>.
						</p>
					</div>
				</div>
			</Card>

			<div className="pt-4">
				<Button fullWidth onClick={nextStep} className="h-14 text-lg">
					Install Profile
				</Button>

				<p
					className="mt-6 text-center text-sm font-medium text-blue-600 cursor-pointer hover:underline"
					onClick={() => router.push(`/${AppRoute.WIFI_DETAILS}`)}
				>
					Connect manually with Network Credentials
				</p>
			</div>
		</div>
	);

	const Step2 = () => (
		<div className="space-y-8 animate-in slide-in-from-right duration-300">
			<div className="flex items-center justify-between mb-4">
				<span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
					Step 1 of 2
				</span>
				<div className="h-2 flex-1 bg-slate-100 ml-6 rounded-full overflow-hidden">
					<div className="h-full w-1/2 bg-blue-600 rounded-full" />
				</div>
			</div>

			<div className="text-center">
				<h2 className="text-2xl font-bold text-slate-900 mb-3">
					Download WiFi Profile
				</h2>
				<p className="text-slate-500 text-lg">
					Tap the button below to download the configuration file.
				</p>
			</div>

			<Card className="p-4 flex items-center gap-4 bg-slate-50 border-slate-200">
				<div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center shadow-sm shrink-0">
					<Download size={28} className="text-blue-600" />
				</div>
				<div className="flex-1 overflow-hidden">
					<div className="font-bold text-slate-900 truncate text-lg">
						corpnet_secure.mobileconfig
					</div>
					<div className="text-sm text-slate-500 font-medium">
						Signed by Enterprise CA
					</div>
				</div>
			</Card>

			<div className="bg-amber-50 p-5 rounded-2xl text-amber-900 text-[15px] border border-amber-100/50 leading-relaxed">
				<strong>Note:</strong> After downloading, go to your device{" "}
				<strong>Settings</strong> to install the downloaded profile.
			</div>

			<Button fullWidth onClick={nextStep} className="h-14 text-lg">
				I've Downloaded the Profile
			</Button>
		</div>
	);

	const Step3 = () => (
		<div className="space-y-8 text-center pt-8 animate-in slide-in-from-right duration-300">
			<div className="w-28 h-28 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500 animate-in zoom-in duration-300 ring-8 ring-green-50/50">
				<CheckCircle size={56} strokeWidth={1.5} />
			</div>

			<div>
				<h2 className="text-3xl font-extrabold text-slate-900 mb-4">
					You're all set!
				</h2>
				<p className="text-slate-500 max-w-xs mx-auto text-lg leading-relaxed">
					Your device should now be able to connect to{" "}
					<strong>CorpNet_Secure</strong>.
				</p>
			</div>

			<div className="pt-8">
				<Button
					fullWidth
					onClick={() => router.push(`/${AppRoute.DASHBOARD}`)}
					className="h-14 text-lg"
				>
					Finish
				</Button>
				<p className="mt-6 text-sm text-slate-400 font-medium">
					You can view network credentials anytime from the dashboard.
				</p>
			</div>
		</div>
	);

	return (
		<Layout title="Device Onboarding" showBack onBack={prevStep}>
			<div className="max-w-md mx-auto py-2">
				{step === 1 && <Step1 />}
				{step === 2 && <Step2 />}
				{step === 3 && <Step3 />}
			</div>
		</Layout>
	);
}
