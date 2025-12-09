"use client";

import { useActiveWorkspace } from "@saas/workspaces/hooks/use-active-workspace";
import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

interface WorkspaceServices {
	guestWifi: boolean;
	byod: boolean;
	iot: boolean;
}

interface WorkspaceServicesContextType {
	services: WorkspaceServices;
	toggleService: (service: keyof WorkspaceServices, enabled: boolean) => void;
	isLoading: boolean;
}

const defaultServices: WorkspaceServices = {
	guestWifi: true,
	byod: true,
	iot: true,
};

const WorkspaceServicesContext = createContext<
	WorkspaceServicesContextType | undefined
>(undefined);

export function WorkspaceServicesProvider({
	children,
}: {
	children: ReactNode;
}) {
	const { activeWorkspace } = useActiveWorkspace();
	const [services, setServices] =
		useState<WorkspaceServices>(defaultServices);
	const [isLoading, setIsLoading] = useState(true);

	// Load settings from localStorage when workspace changes
	useEffect(() => {
		if (!activeWorkspace?.id) {
			setIsLoading(false);
			return;
		}

		const storageKey = `workspace-services-${activeWorkspace.id}`;
		const storedServices = localStorage.getItem(storageKey);

		if (storedServices) {
			try {
				setServices(JSON.parse(storedServices));
			} catch (e) {
				console.error("Failed to parse stored services", e);
				setServices(defaultServices);
			}
		} else {
			setServices(defaultServices);
		}
		setIsLoading(false);
	}, [activeWorkspace?.id]);

	const toggleService = (
		service: keyof WorkspaceServices,
		enabled: boolean,
	) => {
		if (!activeWorkspace?.id) return;

		const newServices = { ...services, [service]: enabled };
		setServices(newServices);

		const storageKey = `workspace-services-${activeWorkspace.id}`;
		localStorage.setItem(storageKey, JSON.stringify(newServices));
	};

	return (
		<WorkspaceServicesContext.Provider
			value={{ services, toggleService, isLoading }}
		>
			{children}
		</WorkspaceServicesContext.Provider>
	);
}

export function useWorkspaceServices() {
	const context = useContext(WorkspaceServicesContext);
	if (context === undefined) {
		throw new Error(
			"useWorkspaceServices must be used within a WorkspaceServicesProvider",
		);
	}
	return context;
}
