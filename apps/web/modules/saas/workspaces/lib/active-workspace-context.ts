import type { orpcClient } from "@shared/lib/orpc-client";
import React from "react";

type Workspace = Awaited<ReturnType<typeof orpcClient.workspaces.list>>[number];

export const ActiveWorkspaceContext = React.createContext<
	| {
			activeWorkspace: Workspace | null;
			isLoading: boolean;
	  }
	| undefined
>(undefined);
