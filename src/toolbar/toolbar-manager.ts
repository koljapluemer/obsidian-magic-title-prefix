import {MarkdownView, Notice} from "obsidian";
import MagicTitleStartPlugin from "../main";
import {MagicTitleRule} from "../types";

export class ToolbarManager {
	private plugin: MagicTitleStartPlugin;
	private view: MarkdownView;
	private toolbarEl: HTMLElement | null = null;

	constructor(plugin: MagicTitleStartPlugin, view: MarkdownView) {
		this.plugin = plugin;
		this.view = view;
	}

	async show(rules: MagicTitleRule[]): Promise<void> {
		// Clean up any existing toolbar
		this.hide();

		// Create toolbar container
		this.toolbarEl = this.view.containerEl.createDiv("magic-title-toolbar");

		// Add button for each prefix
		for (const rule of rules) {
			const button = this.toolbarEl.createEl("button", {
				cls: "magic-title-toolbar-btn",
				text: rule.prefix,
				attr: {
					"aria-label": `Add prefix: ${rule.prefix} (${rule.label})`,
					"title": rule.label || rule.prefix,
				},
			});

			// Register click handler (auto-cleaned when toolbar is removed)
			this.plugin.registerDomEvent(button, "click", () => {
				void this.handlePrefixClick(rule.prefix);
			});
		}
	}

	hide(): void {
		if (this.toolbarEl) {
			this.toolbarEl.remove();
			this.toolbarEl = null;
		}
	}

	isVisible(): boolean {
		return this.toolbarEl !== null;
	}

	private async handlePrefixClick(prefix: string): Promise<void> {
		const file = this.view.file;
		if (!file) {
			new Notice("No active file");
			return;
		}

		const oldName = file.basename;
		const newName = prefix + " " + oldName;
		const extension = file.extension;
		const parentPath = file.parent?.path || "";
		const newPath = parentPath ? `${parentPath}/${newName}.${extension}` : `${newName}.${extension}`;

		try {
			await this.plugin.app.fileManager.renameFile(file, newPath);
			// Toolbar will auto-hide via file-open event after rename
		} catch (error) {
			const message = error instanceof Error ? error.message : String(error);
			new Notice(`Failed to rename file: ${message}`);
		}
	}
}
