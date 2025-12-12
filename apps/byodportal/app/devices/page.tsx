"use client";

import {
	AlertTriangle,
	ChevronRight,
	Laptop,
	Monitor,
	Smartphone,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import {
	Bar,
	BarChart,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from "recharts";
import { Layout } from "../../components/Layout";
import { Card } from "../../components/ui";
import { AppRoute } from "../../types";

const mockData = [
	{ name: "Mon", traffic: 120 },
	{ name: "Tue", traffic: 200 },
	{ name: "Wed", traffic: 150 },
	{ name: "Thu", traffic: 300 },
	{ name: "Fri", traffic: 250 },
	{ name: "Sat", traffic: 80 },
	{ name: "Sun", traffic: 100 },
];

const devices = [
	{
		id: "1",
		name: "Jane's MacBook Pro",
		type: "MacBook",
		status: "Connected",
		lastSeen: "Live",
		network: "CorpNet_Secure",
		traffic: "45 Mb",
	},
	{
		id: "2",
		name: "Personal iPhone 15",
		type: "iPhone",
		status: "Offline",
		lastSeen: "Yesterday",
		network: "CorpNet_Secure",
		traffic: "120 Mb",
	},
	{
		id: "3",
		name: "Android Tablet",
		type: "Android",
		status: "Offline",
		lastSeen: "> 7 days ago",
		network: "CorpNet_IoT",
		traffic: "0 Mb",
	},
];

const DeviceIcon = ({ type }: { type: string }) => {
	if (type.includes("MacBook") || type.includes("Windows"))
		return <Laptop size={22} />;
	if (type.includes("Tablet")) return <Monitor size={22} />;
	return <Smartphone size={22} />;
};

export default function DevicesPage() {
	const router = useRouter();

	const handleDeviceClick = (id: string) => {
		router.push(`/device-detail/${id}`);
	};

	return (
		<Layout
			title="My Devices (3)"
			showBack
			backPath={`/${AppRoute.DASHBOARD}`}
		>
			<div className="space-y-8">
				{/* Unrecognized Device Warning */}
				<div className="bg-amber-50 p-4 rounded-2xl flex gap-3 border border-amber-100 shadow-sm">
					<div className="bg-amber-100 p-2 rounded-full h-fit text-amber-600">
						<AlertTriangle size={20} />
					</div>
					<div>
						<h3 className="text-[15px] font-bold text-amber-900">
							Don't recognize a device?
						</h3>
						<p className="text-sm text-amber-800 mt-1 leading-relaxed">
							If you don't recognize a device, immediately block
							it and regenerate your network credentials.
						</p>
					</div>
				</div>

				{/* Device List */}
				<div className="space-y-4">
					<h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
						Devices seen on CorpNet_Secure
					</h3>
					{devices
						.filter((d) => d.network === "CorpNet_Secure")
						.map((device) => (
							<Card
								key={device.id}
								className="p-4 flex items-center gap-4 hover:shadow-md transition-all hover:border-blue-300 cursor-pointer active:scale-[0.99]"
								onClick={() => handleDeviceClick(device.id)}
							>
								<div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 border border-slate-100">
									<DeviceIcon type={device.type} />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<h4 className="font-bold text-slate-900 text-[15px] truncate">
											{device.name}
										</h4>
										{device.status === "Connected" && (
											<span className="relative flex h-2 w-2">
												<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
												<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
											</span>
										)}
									</div>
									<p className="text-sm text-slate-500 mt-0.5 font-medium">
										{device.status === "Connected"
											? "Connected at 2:15 PM"
											: `Last seen ${device.lastSeen}`}
									</p>
								</div>
								<div className="text-right shrink-0">
									<div className="text-sm font-bold text-slate-900">
										{device.traffic}
									</div>
									<div className="text-[10px] text-slate-400 font-medium uppercase">
										Traffic
									</div>
								</div>
								<ChevronRight
									className="text-slate-300"
									size={18}
								/>
							</Card>
						))}
				</div>

				<div className="space-y-4">
					<h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">
						Devices seen on CorpNet_IoT
					</h3>
					{devices
						.filter((d) => d.network === "CorpNet_IoT")
						.map((device) => (
							<Card
								key={device.id}
								className="p-4 flex items-center gap-4 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
								onClick={() => handleDeviceClick(device.id)}
							>
								<div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center text-slate-600 border border-slate-100">
									<DeviceIcon type={device.type} />
								</div>
								<div className="flex-1 min-w-0">
									<h4 className="font-bold text-slate-900 text-[15px] truncate">
										{device.name}
									</h4>
									<p className="text-sm text-slate-500 mt-0.5 font-medium">
										Last seen {device.lastSeen}
									</p>
								</div>
								<ChevronRight
									className="text-slate-300"
									size={18}
								/>
							</Card>
						))}
				</div>

				{/* Activity Chart */}
				<Card className="p-6">
					<h3 className="font-bold text-slate-900 mb-6 text-base">
						Traffic Activity (Last 7 Days)
					</h3>
					<div className="h-52 w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={mockData}>
								<XAxis
									dataKey="name"
									axisLine={false}
									tickLine={false}
									tick={{
										fontSize: 12,
										fill: "#94a3b8",
										fontWeight: 500,
									}}
									dy={10}
								/>
								<Tooltip
									cursor={{ fill: "#f8fafc", radius: 4 }}
									contentStyle={{
										borderRadius: "12px",
										border: "none",
										boxShadow:
											"0 10px 15px -3px rgb(0 0 0 / 0.1)",
										padding: "12px",
									}}
								/>
								<Bar dataKey="traffic" radius={[6, 6, 6, 6]}>
									{mockData.map((entry, index) => (
										<Cell
											key={`cell-${index}`}
											fill={
												index === 3
													? "#3b82f6"
													: "#e2e8f0"
											}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</Card>
			</div>
		</Layout>
	);
}
