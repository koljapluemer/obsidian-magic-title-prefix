import MagicTitleStartPlugin from "../main";
import {createDefaultTemplate} from "./create-default-template";
import {openRandomMagicTitleStart} from "./open-random-magic-title-start";

export function registerCommands(plugin: MagicTitleStartPlugin) {
	plugin.addCommand({
		id: "open-random-magic-title-start",
		name: "Open random magic title start",
		callback: () => openRandomMagicTitleStart(plugin),
	});

	plugin.addCommand({
		id: "create-default-magic-template",
		name: "Create default template",
		callback: () => createDefaultTemplate(plugin),
	});

	plugin.addRibbonIcon("dice", "Open random magic title start", () => {
		void openRandomMagicTitleStart(plugin);
	});
}
