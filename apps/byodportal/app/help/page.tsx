"use client";

import React from "react";
import { Layout } from "../../components/Layout";
import { AppRoute } from "../../types";

export default function HelpPage() {
	return (
		<Layout
			title="Help Center"
			showBack
			backPath={`/${AppRoute.DASHBOARD}`}
		>
			<div className="p-4 text-center text-slate-500">
				<h2 className="text-xl font-bold text-slate-900 mb-2">
					How can we help?
				</h2>
				<p className="mb-8">Support chat and FAQs would appear here.</p>
			</div>
		</Layout>
	);
}
