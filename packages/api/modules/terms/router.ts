import { create } from "./procedures/create";
import { deleteTerm } from "./procedures/delete";
import { get } from "./procedures/get";
import { list } from "./procedures/list";
import { publish } from "./procedures/publish";
import { update } from "./procedures/update";

export const termsRouter = {
	list,
	get,
	create,
	update,
	delete: deleteTerm,
	publish,
};
