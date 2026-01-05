import {App, PluginSettingTab, Setting} from "obsidian";
import MagicTitleStartPlugin from "./main";
import {DEFAULT_TEMPLATE_PATH} from "./utils/template";

export interface MagicTitleSettings {
	templatePath: string;
}

export const DEFAULT_SETTINGS: MagicTitleSettings = {
	templatePath: "",
};

export class MagicTitleSettingTab extends PluginSettingTab {
	plugin: MagicTitleStartPlugin;

	constructor(app: App, plugin: MagicTitleStartPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Template note")
			.setDesc("Path to the note containing the rules table.")
			.addText((text) => text
				.setPlaceholder(DEFAULT_TEMPLATE_PATH)
				.setValue(this.plugin.settings.templatePath)
				.onChange(async (value) => {
					this.plugin.settings.templatePath = value.trim();
					await this.plugin.saveSettings();
				}));
	}
}
