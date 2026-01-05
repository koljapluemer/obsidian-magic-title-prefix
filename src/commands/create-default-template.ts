import {Notice, TFile} from "obsidian";
import MagicTitleStartPlugin from "../main";
import {DEFAULT_TEMPLATE_CONTENT, DEFAULT_TEMPLATE_PATH} from "../utils/template";

export async function createDefaultTemplate(plugin: MagicTitleStartPlugin) {
	const desiredPath = plugin.settings.templatePath.trim() || DEFAULT_TEMPLATE_PATH;
	let file = plugin.app.vault.getAbstractFileByPath(desiredPath);

	if (!file) {
		try {
			file = await plugin.app.vault.create(desiredPath, DEFAULT_TEMPLATE_CONTENT);
		} catch (error) {
			new Notice("Unable to create the template note. Check the path and try again.");
			return;
		}
	}

	if (!(file instanceof TFile)) {
		new Notice("Template path points to a folder.");
		return;
	}

	if (!plugin.settings.templatePath.trim()) {
		plugin.settings.templatePath = file.path;
		await plugin.saveSettings();
	}

	await plugin.app.workspace.getLeaf(true).openFile(file);
	new Notice("Template note is ready.");
}
