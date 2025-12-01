"use client";

import { Button } from "@ui/components/button";
import { Input } from "@ui/components/input";
import { Label } from "@ui/components/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ui/components/select";
import { Slider } from "@ui/components/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import { Textarea } from "@ui/components/textarea";
import { useState } from "react";

export function StepContent() {
	const [previewMode, setPreviewMode] = useState<
		"mobile" | "tablet" | "desktop"
	>("mobile");
	const [selectedPage, setSelectedPage] = useState("welcome");

	return (
		<div className="flex h-full">
			{/* Left Panel - Configuration */}
			<div className="w-1/2 overflow-y-auto border-r p-6">
				<Tabs defaultValue="content" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="content">Content</TabsTrigger>
						<TabsTrigger value="text">Text & Labels</TabsTrigger>
						<TabsTrigger value="style">Style</TabsTrigger>
					</TabsList>

					{/* Content Tab */}
					<TabsContent value="content" className="space-y-6 mt-6">
						{/* Logo */}
						<div className="space-y-3">
							<Label>Logo</Label>
							<p className="text-xs text-muted-foreground">
								JPG/PNG/SVG, 150px by 30px, 5MB
							</p>
							<div className="flex items-center gap-3">
								<div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
									<span className="text-xs">Logo</span>
								</div>
								<Button variant="outline" size="sm">
									Change
								</Button>
							</div>
						</div>

						{/* Logo size */}
						<div className="space-y-3">
							<Label>Logo size: 50px</Label>
							<Slider defaultValue={[50]} max={150} step={1} />
						</div>

						{/* Title */}
						<div className="space-y-2">
							<Label>Title</Label>
							<Input defaultValue="Get online with free WiFi" />
						</div>

						{/* Description */}
						<div className="space-y-2">
							<Label>Description</Label>
							<Textarea
								defaultValue="How do you want to connect?"
								rows={3}
							/>
						</div>

						{/* Background type */}
						<div className="space-y-2">
							<Label>Background type</Label>
							<Select defaultValue="image">
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="image">Image</SelectItem>
									<SelectItem value="color">Color</SelectItem>
									<SelectItem value="gradient">
										Gradient
									</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Background image */}
						<div className="space-y-3">
							<Label>Background image</Label>
							<p className="text-xs text-muted-foreground">
								JPG/PNG/SVG, 150px, 5MB
							</p>
							<div className="flex items-center gap-3">
								<div className="h-16 w-16 rounded bg-muted flex items-center justify-center">
									<span className="text-xs">BG</span>
								</div>
								<Button variant="outline" size="sm">
									Change
								</Button>
							</div>
						</div>
					</TabsContent>

					{/* Text & Labels Tab */}
					<TabsContent value="text" className="space-y-6 mt-6">
						<div className="space-y-2">
							<Label>Sign Up button</Label>
							<Input defaultValue="Sign up" />
						</div>

						<div className="space-y-2">
							<Label>Login button</Label>
							<Input defaultValue="Sign up" />
						</div>

						<div className="space-y-2">
							<Label>Sponsorship required message</Label>
							<Textarea
								defaultValue="You need to wait that your host approves your access"
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label>Phone validation notice</Label>
							<Textarea
								defaultValue="You need to validate your phone number"
								rows={3}
							/>
						</div>

						<div className="space-y-2">
							<Label>Blocked access notice</Label>
							<Textarea
								defaultValue="Sorry, you have used all your WiFi time allowance for today."
								rows={3}
							/>
						</div>
					</TabsContent>

					{/* Style Tab */}
					<TabsContent value="style" className="space-y-6 mt-6">
						<div className="text-sm text-muted-foreground">
							Style customization options will be available here
						</div>
					</TabsContent>
				</Tabs>
			</div>

			{/* Right Panel - Preview */}
			<div className="w-1/2 bg-muted/30 p-6">
				<div className="space-y-4">
					{/* Preview Controls */}
					<div className="flex items-center justify-between">
						<Select
							value={selectedPage}
							onValueChange={setSelectedPage}
						>
							<SelectTrigger className="w-48">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="welcome">
									Welcome Page
								</SelectItem>
								<SelectItem value="sponsor">
									Sponsor Request
								</SelectItem>
								<SelectItem value="success">
									Success Page
								</SelectItem>
							</SelectContent>
						</Select>

						<div className="flex items-center gap-2">
							<Button
								variant={
									previewMode === "mobile"
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => setPreviewMode("mobile")}
							>
								Mobile
							</Button>
							<Button
								variant={
									previewMode === "tablet"
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => setPreviewMode("tablet")}
							>
								Tablet
							</Button>
							<Button
								variant={
									previewMode === "desktop"
										? "default"
										: "outline"
								}
								size="sm"
								onClick={() => setPreviewMode("desktop")}
							>
								Desktop
							</Button>
						</div>
					</div>

					{/* Preview Frame */}
					<div className="flex items-center justify-center h-[calc(100%-60px)]">
						<div
							className={`bg-background rounded-lg border shadow-lg transition-all ${
								previewMode === "mobile"
									? "w-[375px]"
									: previewMode === "tablet"
										? "w-[768px]"
										: "w-full max-w-4xl"
							}`}
						>
							<div className="p-6 space-y-4">
								<div className="flex justify-center mb-6">
									<div className="h-12 w-32 bg-muted rounded flex items-center justify-center text-xs text-muted-foreground">
										CLOUD4WI
									</div>
								</div>

								<div className="text-center space-y-2">
									<h2 className="text-xl font-bold">
										Get online with free WiFi
									</h2>
									<p className="text-sm text-muted-foreground">
										How do you want to connect?
									</p>
								</div>

								<div className="space-y-3">
									<Button
										variant="outline"
										className="w-full gap-2"
									>
										Continue with OneClick
									</Button>

									<div className="relative">
										<div className="absolute inset-0 flex items-center">
											<span className="w-full border-t" />
										</div>
										<div className="relative flex justify-center text-xs uppercase">
											<span className="bg-background px-2 text-muted-foreground">
												or
											</span>
										</div>
									</div>

									<Input placeholder="Gender" />
									<Input placeholder="First name" />
									<Input placeholder="Last name" />
									<div className="grid grid-cols-3 gap-2">
										<Input placeholder="Day" />
										<Input placeholder="Month" />
										<Input placeholder="Year" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
