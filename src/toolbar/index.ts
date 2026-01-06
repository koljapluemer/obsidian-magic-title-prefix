import {MarkdownView, TFile} from "obsidian";
import MagicTitleStartPlugin from "../main";
import {loadRules, ruleForTitle} from "../utils/rules";
import {isTemplateFile} from "../utils/template";
import {ToolbarManager} from "./toolbar-manager";
import {MagicTitleRule} from "../types";

export function initializeToolbarFeature(plugin: MagicTitleStartPlugin): () => void {
	const toolbars = new Map<MarkdownView, ToolbarManager>();

	async function handleFileOpen(file: TFile | null): Promise<void> {
		// Get active markdown view
		const view = plugin.app.workspace.getActiveViewOfType(MarkdownView);

		// Clean up toolbar if view changed or no file
		if (!view || !file) {
			toolbars.forEach((toolbar) => toolbar.hide());
			toolbars.clear();
			return;
		}

		// Check if we should show toolbar
		const result = await shouldShowToolbar(plugin, file);

		// Get or create toolbar manager for this view
		let toolbar = toolbars.get(view);
		if (!toolbar) {
			toolbar = new ToolbarManager(plugin, view);
			toolbars.set(view, toolbar);
		}

		// Show or hide based on result
		if (result.show && result.rules) {
			await toolbar.show(result.rules);
		} else {
			toolbar.hide();
		}
	}

	// Register file-open event
	plugin.registerEvent(
		plugin.app.workspace.on("file-open", (file) => {
			void handleFileOpen(file);
		})
	);

	// Cleanup function
	return () => {
		toolbars.forEach((toolbar) => toolbar.hide());
		toolbars.clear();
	};
}

async function shouldShowToolbar(
	plugin: MagicTitleStartPlugin,
	file: TFile
): Promise<{ show: boolean; rules?: MagicTitleRule[] }> {
	// Don't show for template file
	const templatePath = plugin.settings.templatePath.trim();
	if (templatePath && isTemplateFile(file, templatePath)) {
		return {show: false};
	}

	// Load rules (silently, without notices)
	const rules = await loadRules(plugin, false);
	if (!rules) {
		return {show: false};
	}

	// Check if file already has a prefix
	const title = file.basename;
	const rule = ruleForTitle(title, rules);

	// Show toolbar only if file has NO prefix
	return {show: rule === null, rules};
}
