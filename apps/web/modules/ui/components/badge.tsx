import { cn } from "@ui/lib";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";
import type React from "react";

export const badge = cva(
	[
		"inline-flex",
		"items-center",
		"gap-1",
		"rounded-full",
		"px-3",
		"py-1",
		"text-xs",
		"uppercase",
		"font-semibold",
		"leading-tight",
		"transition-colors",
		"focus:outline-none",
		"focus:ring-2",
		"focus:ring-ring",
		"focus:ring-offset-2",
	],
	{
		variants: {
			status: {
				success: ["bg-emerald-500/10", "text-emerald-500"],
				info: ["bg-primary/10", "text-primary"],
				warning: ["bg-amber-500/10", "text-amber-500"],
				error: ["bg-rose-500/10", "text-rose-500"],
			},
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
				outline: "text-foreground border",
			},
		},
	},
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> &
	VariantProps<typeof badge>;

export const Badge = ({
	children,
	className,
	status,
	variant,
	...props
}: BadgeProps) => {
	const badgeProps = variant ? { variant } : { status: status ?? "info" };

	return (
		<span className={cn(badge(badgeProps), className)} {...props}>
			{children}
		</span>
	);
};

Badge.displayName = "Badge";
