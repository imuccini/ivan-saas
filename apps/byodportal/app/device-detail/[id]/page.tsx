import { Laptop, Monitor, Smartphone } from "lucide-react";
import React from "react";
import { Layout } from "../../../components/Layout";
import { Card } from "../../../components/ui";
import { AppRoute } from "../../../types";

const DeviceIcon = ({ type }: { type: string }) => {
	if (type === "MacBook" || type === "Windows" || type === "Laptop")
		return <Laptop size={24} />;
	if (type === "Tablet") return <Monitor size={24} />;
	return <Smartphone size={24} />;
};

export default async function DeviceDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	// Mock lookup based on ID (In a real app, this would fetch from API)
	const deviceName =
		id === "1"
			? "Jane's MacBook Pro"
			: id === "2"
				? "Personal iPhone 15"
				: "Android Tablet";

	const deviceType =
		id === "1" ? "MacBook" : id === "2" ? "iPhone" : "Tablet";

	// Mock History Data
	const history = [
		{
			date: "Today, June 26",
			events: [
				{
					id: 1,
					status: "Connected",
					time: "at 2:15 PM",
					traffic: "45 Mb traffic",
					isLive: true,
				},
				{
					id: 2,
					status: "Disconnected",
					time: "From 2:15 PM to 5:16 PM",
					traffic: "45 Mb traffic",
					isLive: false,
				},
			],
		},
		{
			date: "Yesterday, June 25",
			events: [
				{
					id: 3,
					status: "Disconnected",
					time: "From 2:15 PM to 5:16 PM",
					traffic: "45 Mb traffic",
					isLive: false,
				},
			],
		},
	];

	return (
		<Layout title={deviceName} showBack backPath={`/${AppRoute.DEVICES}`}>
			<div className="space-y-6">
				<p className="text-slate-500 text-sm">
					Showing activity from the last 3 days.
				</p>

				<div className="space-y-8">
					{history.map((day, index) => (
						<div key={index}>
							<h3 className="text-sm font-bold text-slate-900 mb-3">
								{day.date}
							</h3>
							<div className="space-y-3">
								{day.events.map((event) => (
									<Card
										key={event.id}
										className="p-4 flex items-center gap-4"
									>
										<div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 shrink-0">
											<DeviceIcon type={deviceType} />
										</div>

										<div className="flex-1 min-w-0">
											<div className="flex items-center justify-between">
												<h4 className="font-semibold text-slate-900 text-sm md:text-base truncate">
													{event.status ===
													"Connected"
														? `Connected ${event.time}`
														: event.time}
												</h4>
												{event.isLive && (
													<div className="flex items-center gap-1.5 ml-2 shrink-0">
														<span className="relative flex h-2.5 w-2.5">
															<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
															<span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
														</span>
														<span className="text-green-600 font-medium text-xs md:text-sm">
															Live
														</span>
													</div>
												)}
											</div>
											<p className="text-sm text-slate-500 mt-0.5">
												{event.traffic}
											</p>
										</div>
									</Card>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</Layout>
	);
}
