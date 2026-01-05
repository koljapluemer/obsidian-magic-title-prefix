import {Plugin} from "obsidian";
import {registerCommands} from "./commands";
import {DEFAULT_SETTINGS, MagicTitleSettings, MagicTitleSettingTab} from "./settings";

export default class MagicTitleStartPlugin extends Plugin {
	settings: MagicTitleSettings;

	async onload() {
		await this.loadSettings();
		registerCommands(this);
		this.addSettingTab(new MagicTitleSettingTab(this.app, this));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<MagicTitleSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
