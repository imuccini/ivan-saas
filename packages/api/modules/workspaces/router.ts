import { createWorkspace } from "./procedures/create";
import { deleteWorkspace } from "./procedures/delete";
import { listWorkspaces } from "./procedures/list";
import { updateWorkspace } from "./procedures/update";

export const workspacesRouter = {
	create: createWorkspace,
	list: listWorkspaces,
	update: updateWorkspace,
	delete: deleteWorkspace,
};
