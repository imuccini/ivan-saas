/**
 * Top 50 most spoken languages in the world
 * Each language includes:
 * - code: ISO 639-1 two-letter code
 * - name: English name of the language
 * - nativeName: Name in the native script/language
 */

export interface Language {
	code: string;
	name: string;
	nativeName: string;
}

export const LANGUAGES: Language[] = [
	{ code: "en", name: "English", nativeName: "English" },
	{ code: "zh", name: "Chinese", nativeName: "中文" },
	{ code: "hi", name: "Hindi", nativeName: "हिन्दी" },
	{ code: "es", name: "Spanish", nativeName: "Español" },
	{ code: "fr", name: "French", nativeName: "Français" },
	{ code: "ar", name: "Arabic", nativeName: "العربية" },
	{ code: "bn", name: "Bengali", nativeName: "বাংলা" },
	{ code: "pt", name: "Portuguese", nativeName: "Português" },
	{ code: "ru", name: "Russian", nativeName: "Русский" },
	{ code: "ja", name: "Japanese", nativeName: "日本語" },
	{ code: "de", name: "German", nativeName: "Deutsch" },
	{ code: "ko", name: "Korean", nativeName: "한국어" },
	{ code: "it", name: "Italian", nativeName: "Italiano" },
	{ code: "tr", name: "Turkish", nativeName: "Türkçe" },
	{ code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
	{ code: "pl", name: "Polish", nativeName: "Polski" },
	{ code: "uk", name: "Ukrainian", nativeName: "Українська" },
	{ code: "nl", name: "Dutch", nativeName: "Nederlands" },
	{ code: "th", name: "Thai", nativeName: "ไทย" },
	{ code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
	{ code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
	{ code: "fa", name: "Persian", nativeName: "فارسی" },
	{ code: "he", name: "Hebrew", nativeName: "עברית" },
	{ code: "sv", name: "Swedish", nativeName: "Svenska" },
	{ code: "cs", name: "Czech", nativeName: "Čeština" },
	{ code: "el", name: "Greek", nativeName: "Ελληνικά" },
	{ code: "ro", name: "Romanian", nativeName: "Română" },
	{ code: "hu", name: "Hungarian", nativeName: "Magyar" },
	{ code: "da", name: "Danish", nativeName: "Dansk" },
	{ code: "fi", name: "Finnish", nativeName: "Suomi" },
	{ code: "no", name: "Norwegian", nativeName: "Norsk" },
	{ code: "sk", name: "Slovak", nativeName: "Slovenčina" },
	{ code: "bg", name: "Bulgarian", nativeName: "Български" },
	{ code: "hr", name: "Croatian", nativeName: "Hrvatski" },
	{ code: "sr", name: "Serbian", nativeName: "Српски" },
	{ code: "sl", name: "Slovenian", nativeName: "Slovenščina" },
	{ code: "lt", name: "Lithuanian", nativeName: "Lietuvių" },
	{ code: "lv", name: "Latvian", nativeName: "Latviešu" },
	{ code: "et", name: "Estonian", nativeName: "Eesti" },
	{ code: "ca", name: "Catalan", nativeName: "Català" },
	{ code: "eu", name: "Basque", nativeName: "Euskara" },
	{ code: "gl", name: "Galician", nativeName: "Galego" },
	{ code: "fil", name: "Filipino", nativeName: "Filipino" },
	{ code: "sw", name: "Swahili", nativeName: "Kiswahili" },
	{ code: "ta", name: "Tamil", nativeName: "தமிழ்" },
	{ code: "te", name: "Telugu", nativeName: "తెలుగు" },
	{ code: "mr", name: "Marathi", nativeName: "मराठी" },
	{ code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
	{ code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
	{ code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
];

/**
 * Get a language by its code
 */
export function getLanguageByCode(code: string): Language | undefined {
	return LANGUAGES.find((lang) => lang.code === code);
}

/**
 * Get languages excluding a set of codes
 */
export function getAvailableLanguages(excludeCodes: string[]): Language[] {
	return LANGUAGES.filter((lang) => !excludeCodes.includes(lang.code));
}

/**
 * Search languages by name or native name
 */
export function searchLanguages(
	query: string,
	excludeCodes: string[] = [],
): Language[] {
	const lowerQuery = query.toLowerCase();
	return LANGUAGES.filter(
		(lang) =>
			!excludeCodes.includes(lang.code) &&
			(lang.name.toLowerCase().includes(lowerQuery) ||
				lang.nativeName.toLowerCase().includes(lowerQuery) ||
				lang.code.toLowerCase().includes(lowerQuery)),
	);
}
