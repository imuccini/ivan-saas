import { create } from "./procedures/create";
import { deleteSponsor } from "./procedures/delete";
import { importSponsors } from "./procedures/import";
import { list } from "./procedures/list";
import { sync } from "./procedures/sync";

export const sponsorsRouter = {
	list,
	create,
	delete: deleteSponsor,
	import: importSponsors,
	sync,
};
