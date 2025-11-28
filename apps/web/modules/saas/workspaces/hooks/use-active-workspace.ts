import { useContext } from "react";
import { ActiveWorkspaceContext } from "../lib/active-workspace-context";

export function useActiveWorkspace() {
	const context = useContext(ActiveWorkspaceContext);

	if (context === undefined) {
		return {
			activeWorkspace: null,
			isLoading: false,
		};
	}

	return context;
}
