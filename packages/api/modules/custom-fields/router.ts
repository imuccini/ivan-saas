import { create } from "./procedures/create";
import { deleteCustomField } from "./procedures/delete";
import { list } from "./procedures/list";
import { update } from "./procedures/update";

export const customFieldsRouter = {
	list,
	create,
	update,
	delete: deleteCustomField,
};
