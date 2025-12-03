import { copyGlobalTemplate } from "./procedures/copy-global-template";
import { listCategories } from "./procedures/list-categories";
import { toggleTemplate } from "./procedures/toggle-template";
import { updateTemplate } from "./procedures/update-template";

export const communicationsRouter = {
	listCategories,
	updateTemplate,
	toggleTemplate,
	copyGlobalTemplate,
};
