"use client";

import type { CustomField, Sponsor, Term } from "@repo/portal-shared";

interface PortalShellProps {
	config: Record<string, unknown>;
	workspaceId: string;
	customFields: CustomField[];
	sponsors: Sponsor[];
	terms: Term[];
}

export function PortalShell({
	config,
	workspaceId,
	customFields,
	sponsors,
	terms,
}: PortalShellProps) {
	// Extract styling from config
	const styling = config as {
		fontFamily?: string;
		baseFontSize?: number;
		baseColor?: string;
		primaryColor?: string;
		backgroundType?: "solid" | "gradient" | "image";
		backgroundColor?: string;
		gradientColor1?: string;
		gradientColor2?: string;
		backgroundImage?: string;
		logo?: string;
		logoSize?: number;
		spacing?: number;
		content?: Record<string, { title?: string; description?: string }>;
		selectedLanguages?: string[];
	};

	const defaultLang = styling.selectedLanguages?.[0] ?? "en";
	const content = styling.content?.[defaultLang];

	const getBackground = () => {
		switch (styling.backgroundType) {
			case "gradient":
				return `linear-gradient(135deg, ${styling.gradientColor1 ?? "#ffffff"}, ${styling.gradientColor2 ?? "#f0f0f0"})`;
			case "image":
				return styling.backgroundImage
					? `url(${styling.backgroundImage}) center/cover no-repeat`
					: (styling.backgroundColor ?? "#ffffff");
			default:
				return styling.backgroundColor ?? "#ffffff";
		}
	};

	return (
		<main
			className="flex min-h-screen flex-col items-center justify-start p-4"
			style={{
				fontFamily:
					styling.fontFamily ?? "var(--font-inter), system-ui",
				fontSize: `${styling.baseFontSize ?? 16}px`,
				color: styling.baseColor ?? "#1a1a1a",
				background: getBackground(),
			}}
		>
			<div
				className="w-full max-w-md rounded-xl bg-white/90 p-6 shadow-lg backdrop-blur-sm"
				style={{ marginTop: `${(styling.spacing ?? 4) * 8}px` }}
			>
				{/* Logo */}
				{styling.logo && (
					<div className="mb-6 flex justify-center">
						<img
							src={styling.logo}
							alt="Logo"
							style={{
								height: `${styling.logoSize ?? 48}px`,
								width: "auto",
							}}
						/>
					</div>
				)}

				{/* Title & Description */}
				<div className="mb-6 text-center">
					<h1 className="text-2xl font-bold">
						{content?.title ?? "Welcome"}
					</h1>
					{content?.description && (
						<p className="mt-2 text-sm opacity-70">
							{content.description}
						</p>
					)}
				</div>

				{/* Placeholder for authentication forms */}
				<div className="space-y-4">
					<p className="text-center text-sm text-muted-foreground">
						Portal shell loaded successfully.
					</p>
					<p className="text-center text-xs text-muted-foreground">
						Workspace: {workspaceId}
					</p>
					<p className="text-center text-xs text-muted-foreground">
						Custom Fields: {customFields.length} | Sponsors:{" "}
						{sponsors.length} | Terms: {terms.length}
					</p>
				</div>
			</div>
		</main>
	);
}
