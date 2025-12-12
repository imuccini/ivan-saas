"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Layout } from "../../components/Layout";
import { Button, Card, Input } from "../../components/ui";
import { AppRoute } from "../../types";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		// Simulate API call
		setTimeout(() => {
			setLoading(false);
			router.push(`/${AppRoute.DASHBOARD}`);
		}, 1000);
	};

	return (
		<Layout>
			<div className="w-full max-w-md flex flex-col items-center pt-8">
				{/* Hero / Header Images (Abstract representation) */}
				<div className="flex justify-center -space-x-4 mb-10">
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className="w-20 h-20 rounded-full border-4 border-white bg-slate-200 overflow-hidden shadow-lg ring-1 ring-slate-100"
						>
							<img
								src={`https://picsum.photos/200/200?random=${i}`}
								alt="Office"
								className="w-full h-full object-cover"
							/>
						</div>
					))}
				</div>

				<div className="text-center mb-10 px-4">
					<h1 className="text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
						BYOD Portal
					</h1>
					<p className="text-slate-500 text-lg">
						Onboard your personal devices to the corporate network
						securely.
					</p>
				</div>

				<Card className="w-full p-8 shadow-xl shadow-slate-200/50 border-slate-100">
					<form onSubmit={handleLogin} className="space-y-8">
						<Input
							label="Enter your work email address"
							placeholder="m@example.com"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="h-14"
						/>

						<Button
							type="submit"
							fullWidth
							disabled={loading}
							variant="primary"
							className="h-14 text-lg"
						>
							{loading ? "Verifying..." : "Continue"}
						</Button>
					</form>

					<p className="text-xs text-center text-slate-400 mt-8 leading-relaxed">
						By clicking Continue, you agree to our
						<br />
						<a
							href="#"
							className="font-medium text-slate-600 hover:text-blue-600 underline decoration-slate-300"
						>
							Terms of Service
						</a>{" "}
						and{" "}
						<a
							href="#"
							className="font-medium text-slate-600 hover:text-blue-600 underline decoration-slate-300"
						>
							Privacy Policy
						</a>
					</p>
				</Card>
			</div>
		</Layout>
	);
}
