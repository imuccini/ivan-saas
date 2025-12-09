"use client";

import { cn } from "./ui-components/lib";

interface PortalContainerProps {
	children: React.ReactNode;
	fontFamily?: string;
	baseFontSize?: string;
	baseColor?: string;
	primaryColor?: string;
	spacing?: number;
	backgroundType?: "color" | "image" | "gradient";
	backgroundColor?: string;
	gradientColor1?: string;
	gradientColor2?: string;
	backgroundImage?: string;
	logo?: string;
	logoSize?: number;
}

export function PortalContainer({
	children,
	fontFamily,
	baseFontSize,
	baseColor,
	primaryColor,
	backgroundType,
	backgroundColor,
	gradientColor1,
	gradientColor2,
	backgroundImage,
	logo,
	logoSize,
	spacing,
}: PortalContainerProps) {
	const getBackground = () => {
		switch (backgroundType) {
			case "gradient":
				return `linear-gradient(135deg, ${gradientColor1}, ${gradientColor2})`;
			case "image":
				return backgroundImage
					? `url(${backgroundImage}) center/cover no-repeat`
					: backgroundColor;
			default:
				return backgroundColor;
		}
	};

	return (
		<main
			className="relative flex min-h-screen w-full flex-col items-center md:justify-center"
			style={{
				fontFamily: fontFamily || "var(--font-inter), system-ui",
				fontSize: `${baseFontSize}px`,
				color: baseColor,
				background: getBackground(),
			}}
		>
			<div
				className={cn(
					"relative flex w-full flex-col bg-white p-6 shadow-none",
					// Mobile styles: Sheet-like appearance
					"mt-24 min-h-[calc(100vh-6rem)] rounded-t-[2.5rem]",
					// Desktop styles: Centered card
					"md:mt-0 md:min-h-0 md:w-full md:max-w-[440px] md:rounded-2xl md:shadow-2xl md:p-10",
				)}
			>
				{/* Logo */}
				{logo && (
					<div
						className="absolute left-1/2 flex -translate-x-1/2 items-center justify-center rounded-full bg-white shadow-sm overflow-hidden"
						style={{
							width: `${(logoSize || 50) + 32}px`,
							height: `${(logoSize || 50) + 32}px`,
							top: `-${((logoSize || 50) + 32) / 2}px`,
						}}
					>
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={logo}
							alt="Logo"
							className="object-contain"
							style={{
								height: `${logoSize || 50}px`,
								width: `${logoSize || 50}px`,
							}}
						/>
					</div>
				)}

				{/* Content */}
				<div
					className={cn(
						"flex flex-col flex-1",
						spacing === 2
							? "gap-2"
							: spacing === 8
								? "gap-8"
								: "gap-4",
					)}
					style={{
						marginTop: logo
							? `${((logoSize || 50) + 32) / 2 + 24}px`
							: "2rem",
					}}
				>
					{children}
				</div>
			</div>

			{/* Pass primary color to children via CSS variable */}
			<style jsx>{`
				main {
					--primary-color: ${primaryColor};
				}
			`}</style>
		</main>
	);
}
