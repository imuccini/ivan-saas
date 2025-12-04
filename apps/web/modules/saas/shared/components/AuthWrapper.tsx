import { config } from "@repo/config";
import { Footer } from "@saas/shared/components/Footer";
import { ColorModeToggle } from "@shared/components/ColorModeToggle";
import { LocaleSwitch } from "@shared/components/LocaleSwitch";
import { Logo } from "@shared/components/Logo";
import { cn } from "@ui/lib";
import Link from "next/link";
import { type PropsWithChildren, Suspense } from "react";

export function AuthWrapper({
	children,
	contentClass,
	currentStep,
}: PropsWithChildren<{ contentClass?: string; currentStep?: number }>) {
	const totalSteps = 3;
	return (
		<div className="flex min-h-screen w-full py-6">
			<div className="flex w-full flex-col items-center justify-between gap-8">
				<div className="container">
					<div className="flex items-center justify-between">
						<Link href="/" className="block">
							<Logo />
						</Link>

						<div className="flex items-center justify-end gap-2">
							{config.i18n.enabled && (
								<Suspense>
									<LocaleSwitch withLocaleInUrl={false} />
								</Suspense>
							)}
							<ColorModeToggle />
						</div>
					</div>
				</div>

				<div className="container flex justify-center">
					<main
						className={cn(
							"grid grid-cols-1 md:grid-cols-2 gap-0 bg-card rounded-2xl shadow-xl overflow-hidden min-h-[600px] border",
							contentClass,
						)}
					>
						{/* Left column - Form content */}
						<div className="p-8 flex flex-col justify-start relative">
							{/* Stepper - only show if currentStep is provided */}
							{currentStep && (
								<div className="mb-8">
									<p className="text-sm text-muted-foreground mb-2">
										Step {currentStep} of {totalSteps}
									</p>
									<div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
										<div
											className="h-full bg-foreground transition-all duration-500 ease-in-out"
											style={{
												width: `${(currentStep / totalSteps) * 100}%`,
											}}
										/>
									</div>
								</div>
							)}

							{children}
						</div>

						{/* Right column - Image */}
						<div className="hidden md:block bg-slate-900 relative">
							<div
								className="absolute inset-0 bg-cover bg-center bg-no-repeat"
								style={{
									backgroundImage: "url('/auth-bg.png')",
								}}
							>
								{/* Overlay */}
								<div className="absolute inset-0 bg-black/40" />
							</div>

							{/* Text overlay */}
							<div className="relative z-10 flex items-end w-full h-full p-12">
								<div className="max-w-md">
									<h2 className="text-3xl font-bold mb-3 leading-tight text-white">
										Let's get started with Guest WiFi.
									</h2>
									<p className="text-base text-white/90 leading-relaxed">
										Elevate your guest WiFi experience for
										free in a few minutes!.
									</p>
								</div>
							</div>
						</div>
					</main>
				</div>

				<Footer />
			</div>
		</div>
	);
}
