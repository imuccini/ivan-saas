"use client";

import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { type AiSuggestion, getSuggestionsForPath } from "../lib/ai-suggestions";

/**
 * Hook to get AI suggestions based on the current page
 */
export function useAiSuggestions(): AiSuggestion[] {
	const pathname = usePathname();

	const suggestions = useMemo(() => {
		return getSuggestionsForPath(pathname);
	}, [pathname]);

	return suggestions;
}
