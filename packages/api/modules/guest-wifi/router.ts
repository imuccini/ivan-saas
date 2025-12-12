import { deploy } from "./procedures/deploy";
import { get } from "./procedures/get";
import { getStats } from "./procedures/get-stats";
import { save } from "./procedures/save";
import { updateName } from "./procedures/update-name";

export const guestWifiRouter = {
	deploy,
	get,
	getStats,
	save,
	updateName,
};
