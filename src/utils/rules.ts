import {Notice, TFile} from "obsidian";
import MagicTitleStartPlugin from "../main";
import {MagicTitleRule} from "../types";
import {parseTemplateRules} from "./template";

export async function loadRules(
	plugin: MagicTitleStartPlugin,
	showNotices = true
): Promise<MagicTitleRule[] | null> {
	const templatePath = plugin.settings.templatePath.trim();
	if (!templatePath) {
		if (showNotices) {
			new Notice("Set a template note in settings or run \"Create default template\".");
		}
		return null;
	}

	const file = plugin.app.vault.getAbstractFileByPath(templatePath);
	if (!(file instanceof TFile)) {
		if (showNotices) {
			new Notice(`Template note not found: ${templatePath}`);
		}
		return null;
	}

	const content = await plugin.app.vault.cachedRead(file);
	const rules = parseTemplateRules(content);
	if (rules.length === 0) {
		if (showNotices) {
			new Notice("No rules found in the template note.");
		}
		return null;
	}

	return rules;
}

export function ruleForTitle(title: string, rules: MagicTitleRule[]): MagicTitleRule | null {
	for (const rule of rules) {
		if (title.startsWith(rule.prefix)) {
			return rule;
		}
	}
	return null;
}
