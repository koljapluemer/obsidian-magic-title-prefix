import {Notice, TFile} from "obsidian";
import MagicTitleStartPlugin from "../main";
import {MagicTitleRule} from "../types";
import {isTemplateFile} from "../utils/template";
import {loadRules, ruleForTitle} from "../utils/rules";

interface FailureCandidate {
	file: TFile;
	reason: string;
}

function formatList(values: string[]): string {
	return values.map((value) => `\`${value}\``).join(", ");
}

async function evaluateFile(file: TFile, rules: MagicTitleRule[], plugin: MagicTitleStartPlugin): Promise<FailureCandidate | null> {
	const title = file.basename;
	const rule = ruleForTitle(title, rules);
	if (!rule) {
		return {file, reason: "Please add a prefix to the note title."};
	}

	const content = await plugin.app.vault.cachedRead(file);
	const missing = rule.required.filter((value) => !content.includes(value));
	const forbidden = rule.forbidden.filter((value) => content.includes(value));

	if (missing.length === 0 && forbidden.length === 0) {
		return null;
	}

	const messages: string[] = [];
	if (missing.length > 0) {
		messages.push(`Missing ${formatList(missing)} in note content.`);
	}
	if (forbidden.length > 0) {
		messages.push(`Forbidden ${formatList(forbidden)} in note content.`);
	}

	return {file, reason: messages.join(" ")};
}

export async function openRandomMagicTitleStart(plugin: MagicTitleStartPlugin) {
	const rules = await loadRules(plugin);
	if (!rules) {
		return;
	}

	const candidates: FailureCandidate[] = [];
	const files = plugin.app.vault.getMarkdownFiles();

	for (const file of files) {
		if (isTemplateFile(file, plugin.settings.templatePath.trim())) {
			continue;
		}

		const result = await evaluateFile(file, rules, plugin);
		if (result) {
			candidates.push(result);
		}
	}

	if (candidates.length === 0) {
		new Notice("All notes match the magic title rules.");
		return;
	}

	const pick = candidates[Math.floor(Math.random() * candidates.length)]!;
	await plugin.app.workspace.getLeaf(false).openFile(pick.file);
	new Notice(pick.reason);
}
