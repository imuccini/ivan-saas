"use client";

import { Badge } from "@ui/components/badge";
import { Button } from "@ui/components/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@ui/components/popover";
import { Plus, Search, X } from "lucide-react";
import { useState } from "react";
import {
	getLanguageByCode,
	type Language,
	searchLanguages,
} from "../lib/languages";

interface LanguageSelectorProps {
	/**
	 * Array of selected language codes (e.g., ["en", "it", "es"])
	 */
	selectedLanguages: string[];
	/**
	 * Currently active language code for editing
	 */
	activeLanguage: string;
	/**
	 * Callback when active language changes (user clicks on a language badge)
	 */
	onActiveLanguageChange: (code: string) => void;
	/**
	 * Callback when a new language is added
	 */
	onAddLanguage: (code: string) => void;
	/**
	 * Optional callback when a language is removed
	 */
	onRemoveLanguage?: (code: string) => void;
	/**
	 * Whether to show the remove button on language badges
	 */
	showRemoveButton?: boolean;
	/**
	 * Minimum number of languages that must remain (default: 1)
	 */
	minLanguages?: number;
}

export function LanguageSelector({
	selectedLanguages,
	activeLanguage,
	onActiveLanguageChange,
	onAddLanguage,
	onRemoveLanguage,
	showRemoveButton = true,
	minLanguages = 1,
}: LanguageSelectorProps) {
	const [open, setOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");

	const availableLanguages = searchLanguages(searchQuery, selectedLanguages);

	const handleSelectLanguage = (language: Language) => {
		onAddLanguage(language.code);
		setOpen(false);
		setSearchQuery("");
	};

	const handleRemoveLanguage = (code: string, e: React.MouseEvent) => {
		e.stopPropagation();
		if (onRemoveLanguage && selectedLanguages.length > minLanguages) {
			onRemoveLanguage(code);
			// If removing the active language, switch to the first remaining one
			if (code === activeLanguage) {
				const remaining = selectedLanguages.filter((c) => c !== code);
				if (remaining.length > 0) {
					onActiveLanguageChange(remaining[0]);
				}
			}
		}
	};

	const canRemove = selectedLanguages.length > minLanguages;

	return (
		<div className="flex items-center gap-2 flex-wrap">
			{selectedLanguages.map((code) => {
				const language = getLanguageByCode(code);
				const isActive = code === activeLanguage;

				return (
					<Badge
						key={code}
						variant={isActive ? "default" : "outline"}
						className="cursor-pointer gap-1 pr-1.5 transition-colors"
						onClick={() => onActiveLanguageChange(code)}
					>
						<span className="uppercase">{code}</span>
						{showRemoveButton && canRemove && onRemoveLanguage && (
							<button
								type="button"
								onClick={(e) => handleRemoveLanguage(code, e)}
								className="ml-1 rounded-full p-0.5 hover:bg-muted-foreground/20"
								title={`Remove ${language?.name || code}`}
							>
								<X className="h-3 w-3" />
							</button>
						)}
					</Badge>
				);
			})}

			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button variant="outline" size="sm" className="gap-1">
						<Plus className="h-3.5 w-3.5" />
						Add Language
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-64 p-0" align="start">
					<div className="flex items-center border-b px-3 py-2">
						<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
						<input
							className="flex h-8 w-full rounded-md bg-transparent text-sm outline-none placeholder:text-muted-foreground"
							placeholder="Search languages..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="max-h-64 overflow-y-auto p-1">
						{availableLanguages.length === 0 ? (
							<div className="py-6 text-center text-sm text-muted-foreground">
								No languages found
							</div>
						) : (
							availableLanguages.map((language) => (
								<button
									key={language.code}
									type="button"
									className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted cursor-pointer text-left"
									onClick={() =>
										handleSelectLanguage(language)
									}
								>
									<span className="font-medium uppercase w-8 text-muted-foreground">
										{language.code}
									</span>
									<span className="flex-1">
										{language.name}
									</span>
									<span className="text-muted-foreground text-xs">
										{language.nativeName}
									</span>
								</button>
							))
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
}
