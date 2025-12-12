try {
	console.log("AI Version:", require("ai/package.json").version);
} catch (e) {
	console.log("Could not load ai/package.json");
}
