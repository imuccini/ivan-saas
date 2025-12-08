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
import { Switch } from "@ui/components/switch";
import { FileText } from "lucide-react";
import { useState } from "react";
import { useWizard } from "../../wizard-context";

export function AccessControlSection() {
	const {
		sponsorshipEnabled,
		setSponsorshipEnabled,
		registrationFields,
		phoneValidationEnabled,
		setPhoneValidationEnabled,
	} = useWizard();

	const [timeLimitEnabled, setTimeLimitEnabled] = useState(false);
	const [accessHoursEnabled, setAccessHoursEnabled] = useState(false);
	const [timeSlots, setTimeSlots] = useState<
		{ id: string; start: string; end: string }[]
	>([{ id: "1", start: "09:00", end: "17:00" }]);

	const addTimeSlot = () => {
		const newId = (timeSlots.length + 1).toString();
		setTimeSlots([
			...timeSlots,
			{ id: newId, start: "09:00", end: "17:00" },
		]);
	};

	const removeTimeSlot = (id: string) => {
		setTimeSlots(timeSlots.filter((slot) => slot.id !== id));
	};

	return (
		<div className="space-y-4 mt-6">
			{/* Time Limit Card */}
			<div className="rounded-lg border bg-card p-4 space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="font-semibold">Time Limit</div>
						<p className="text-sm text-muted-foreground">
							Set a maximum internet access per day for guest
							users
						</p>
					</div>
					<Switch
						checked={timeLimitEnabled}
						onCheckedChange={setTimeLimitEnabled}
					/>
				</div>

				{timeLimitEnabled && (
					<div className="space-y-2">
						<Select defaultValue="24">
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Array.from(
									{ length: 24 },
									(_, i) => i + 1,
								).map((hour) => (
									<SelectItem
										key={hour}
										value={hour.toString()}
									>
										{hour} {hour === 1 ? "hour" : "hours"}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<p className="text-xs text-muted-foreground">
							Limit per day
						</p>
					</div>
				)}
			</div>

			{/* Sponsorship approval Card */}
			<div className="rounded-lg border bg-card p-4 space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="font-semibold">
							Sponsorship approval
						</div>
						<p className="text-sm text-muted-foreground">
							Require guest to be approved by a host
						</p>
					</div>
					<Switch
						checked={sponsorshipEnabled}
						onCheckedChange={setSponsorshipEnabled}
					/>
				</div>

				{sponsorshipEnabled && (
					<div className="space-y-4 pl-6">
						<div className="space-y-3">
							<Label>Chose how sponsors are selected</Label>
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<input
										type="radio"
										id="email-dropdown"
										name="sponsor-selection"
										defaultChecked
									/>
									<Label
										htmlFor="email-dropdown"
										className="font-normal"
									>
										Select email form dropdown
									</Label>
								</div>
								<div className="flex items-center gap-2">
									<input
										type="radio"
										id="type-email"
										name="sponsor-selection"
									/>
									<Label
										htmlFor="type-email"
										className="font-normal"
									>
										Type email
									</Label>
								</div>
							</div>
						</div>

						<Button variant="outline" size="sm" className="gap-2">
							<FileText className="h-4 w-4" />
							Manage sponsors (0)
						</Button>

						<div className="space-y-2">
							<Label>Visitor Access Duration</Label>
							<div className="flex items-center gap-2">
								<Input
									type="number"
									defaultValue="24"
									className="w-20"
								/>
								<Select defaultValue="hours">
									<SelectTrigger className="w-32">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="hours">
											Hours
										</SelectItem>
										<SelectItem value="days">
											Days
										</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Switch />
							<Label className="font-normal">
								Enable sponsor duration override
							</Label>
						</div>
					</div>
				)}
			</div>

			{/* Verification Card - Only show if email or phone fields exist */}
			{(() => {
				const hasEmailField = registrationFields.some(
					(field) => field.type === "email",
				);
				const hasPhoneField = registrationFields.some(
					(field) => field.type === "tel",
				);

				// Don't show the card if neither email nor phone fields exist
				if (!hasEmailField && !hasPhoneField) {
					return null;
				}

				return (
					<div className="rounded-lg border bg-card p-4 space-y-4">
						<div className="font-semibold">Verification</div>

						<div className="space-y-3">
							{hasEmailField && (
								<div className="space-y-2">
									<Label>Email verification</Label>
									<Select defaultValue="soft">
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="soft">
												Soft
											</SelectItem>
											<SelectItem value="enabled">
												Enabled
											</SelectItem>
											<SelectItem value="disabled">
												Disabled
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}

							{hasPhoneField && (
								<div className="space-y-2">
									<Label>Phone verification</Label>
									<Select
										value={
											phoneValidationEnabled
												? "enabled"
												: "disabled"
										}
										onValueChange={(value) =>
											setPhoneValidationEnabled(
												value === "enabled",
											)
										}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="enabled">
												Enabled
											</SelectItem>
											<SelectItem value="disabled">
												Disabled
											</SelectItem>
										</SelectContent>
									</Select>
								</div>
							)}
						</div>
					</div>
				);
			})()}

			{/* Access Hours Card */}
			<div className="rounded-lg border bg-card p-4 space-y-4">
				<div className="flex items-center justify-between">
					<div className="space-y-1">
						<div className="font-semibold">Access Hours</div>
						<p className="text-sm text-muted-foreground">
							Limit access to WiFi to business hours
						</p>
					</div>
					<Switch
						checked={accessHoursEnabled}
						onCheckedChange={setAccessHoursEnabled}
					/>
				</div>

				{accessHoursEnabled && (
					<div className="space-y-3">
						<Label className="text-sm">Time Slots</Label>
						<div className="space-y-2">
							{timeSlots.map((slot, index) => (
								<div
									key={slot.id}
									className="flex items-center gap-2"
								>
									<div className="flex items-center gap-2 flex-1">
										<Input
											type="time"
											value={slot.start}
											onChange={(e) => {
												const newSlots = [...timeSlots];
												newSlots[index].start =
													e.target.value;
												setTimeSlots(newSlots);
											}}
											className="w-32"
										/>
										<span className="text-muted-foreground">
											to
										</span>
										<Input
											type="time"
											value={slot.end}
											onChange={(e) => {
												const newSlots = [...timeSlots];
												newSlots[index].end =
													e.target.value;
												setTimeSlots(newSlots);
											}}
											className="w-32"
										/>
									</div>
									{timeSlots.length > 1 && (
										<Button
											variant="ghost"
											size="sm"
											onClick={() =>
												removeTimeSlot(slot.id)
											}
											type="button"
										>
											×
										</Button>
									)}
								</div>
							))}
						</div>
						<Button
							variant="outline"
							size="sm"
							onClick={addTimeSlot}
							type="button"
							className="w-full"
						>
							+ Add Time Slot
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
