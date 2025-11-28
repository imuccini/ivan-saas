import { createWorkspace } from "./procedures/create";
import { listWorkspaces } from "./procedures/list";
import { updateWorkspace } from "./procedures/update";
import { deleteWorkspace } from "./procedures/delete";

export const workspacesRouter = {
	create: createWorkspace,
	list: listWorkspaces,
	update: updateWorkspace,
	delete: deleteWorkspace,
};
