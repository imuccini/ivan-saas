export interface TermTranslation {
	label: string;
	linkText: string;
	documentTitle: string;
	documentContent: string;
}

export interface Term {
	id: string;
	workspaceId: string;
	name: string;
	version: string;
	category: "PRIVACY_POLICY" | "TERMS_OF_USE" | "COOKIE_POLICY" | "OTHER";
	isMandatory: boolean;
	isPreChecked: boolean;
	status: "DRAFT" | "PUBLISHED";
	translations: Record<string, TermTranslation>;
	createdAt: Date;
	updatedAt: Date;
}

export type TermCategory = Term["category"];
export type TermStatus = Term["status"];
