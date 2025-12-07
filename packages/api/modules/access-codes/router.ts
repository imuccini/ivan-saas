import { bulkGenerateCodes } from "./procedures/code-bulk-generate";
import { createCode } from "./procedures/code-create";
import { deleteCode } from "./procedures/code-delete";
import { listCodes } from "./procedures/code-list";
import { createGroup } from "./procedures/group-create";
import { deleteGroup } from "./procedures/group-delete";
import { listGroups } from "./procedures/group-list";
import { updateGroup } from "./procedures/group-update";

export const accessCodesRouter = {
	listGroups,
	createGroup,
	updateGroup,
	deleteGroup,
	listCodes,
	createCode,
	deleteCode,
	bulkGenerateCodes,
};
