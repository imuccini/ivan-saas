"use client";

import { Button } from "@ui/components/button";
import { SparklesIcon } from "lucide-react";
import type { AiSuggestion } from "../lib/ai-suggestions";

interface SuggestionChipsProps {
	suggestions: AiSuggestion[];
	onSelect: (suggestion: string) => void;
}

export function SuggestionChips({
	suggestions,
	onSelect,
}: SuggestionChipsProps) {
	if (suggestions.length === 0) {
		return null;
	}

	return (
		<div className="space-y-3">
			<div className="flex items-center gap-2 text-sm text-muted-foreground">
				<SparklesIcon className="size-4" />
				<span>Suggested prompts</span>
			</div>
			<div className="flex flex-col gap-2">
				{suggestions.map((suggestion) => (
					<Button
						key={suggestion.id}
						variant="outline"
						size="sm"
						className="h-auto w-full whitespace-normal text-left justify-start py-2.5 px-3 text-sm"
						onClick={() => onSelect(suggestion.text)}
					>
						{suggestion.text}
					</Button>
				))}
			</div>
		</div>
	);
}
