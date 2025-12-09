import "./globals.css";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import type { PropsWithChildren } from "react";

// Self-hosted Inter font for walled garden compliance
const inter = localFont({
	src: [
		{
			path: "../public/fonts/Inter-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/Inter-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/fonts/Inter-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
		{
			path: "../public/fonts/Inter-Bold.woff2",
			weight: "700",
			style: "normal",
		},
	],
	display: "swap",
	variable: "--font-inter",
	preload: true,
	fallback: ["system-ui", "sans-serif"],
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: "#ffffff",
};

export const metadata: Metadata = {
	title: "Guest WiFi Portal",
	description: "Connect to our guest network",
	robots: "noindex, nofollow", // Captive portals should not be indexed
};

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<html lang="en" className={inter.variable}>
			<head>
				{/* Preload critical fonts */}
				<link
					rel="preload"
					href="/fonts/Inter-Regular.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
			</head>
			<body className="min-h-screen bg-background font-sans antialiased">
				{children}
			</body>
		</html>
	);
}
