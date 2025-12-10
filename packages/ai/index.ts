import { vertex } from "@ai-sdk/google-vertex";

/**
 * Lazy-loaded Vertex AI models.
 * These are created on-demand to avoid errors at module load time
 * when Vertex credentials aren't configured.
 */
let _textModel: ReturnType<typeof vertex> | null = null;
let _fastModel: ReturnType<typeof vertex> | null = null;
let _proModel: ReturnType<typeof vertex> | null = null;

/**
 * Get the default text model (Gemini 2.0 Flash)
 * Lazily initialized to avoid startup errors when credentials aren't set.
 */
export function getTextModel() {
	if (!_textModel) {
		_textModel = vertex("gemini-2.0-flash-001");
	}
	return _textModel;
}

/**
 * Get the fast model (Gemini 2.0 Flash)
 */
export function getFastModel() {
	if (!_fastModel) {
		_fastModel = vertex("gemini-2.0-flash-001");
	}
	return _fastModel;
}

/**
 * Get the pro model (Gemini 1.5 Pro)
 */
export function getProModel() {
	if (!_proModel) {
		_proModel = vertex("gemini-1.5-pro");
	}
	return _proModel;
}

// Re-export AI SDK utilities
export * from "ai";
export * from "./lib";

// LangGraph Multi-Agent System
export * from "./lib/langgraph";
