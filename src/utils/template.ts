import {TFile} from "obsidian";
import {MagicTitleRule} from "../types";

export const DEFAULT_TEMPLATE_PATH = "Magic Title Template.md";

export const DEFAULT_TEMPLATE_CONTENT = [
	"| `⬡`  | Shape  | `- **`       |             |",
	"| ---- | ------ | ------------ | ----------- |",
	"| `◊`  | Entity | `- *`        |             |",
	"| `⋱`  | Guide  | `1.`<br>`2.` |             |",
	"| `📖` | Book   |              | `location:` |",
	"| `~`  | Take   | `—`          |             |",
	"",
].join("\n");

const TABLE_SEPARATOR = /^:?-{3,}:?$/;
const BR_SPLIT = /<br\s*\/?>|\n/gi;

function stripBackticks(value: string): string {
	const trimmed = value.trim();
	if (/^`[^`]+`$/.test(trimmed)) {
		return trimmed.slice(1, -1).trim();
	}
	return trimmed;
}

function splitCellValues(cell: string): string[] {
	return cell
		.split(BR_SPLIT)
		.map((value) => stripBackticks(value).trim())
		.filter((value) => value.length > 0);
}

export function parseTemplateRules(content: string): MagicTitleRule[] {
	const lines = content.split(/\r?\n/);
	const rules: MagicTitleRule[] = [];

	for (const line of lines) {
		if (!line.includes("|")) {
			continue;
		}

		const rawCells = line.split("|").slice(1, -1);
		if (rawCells.length < 4) {
			continue;
		}

		const cells = rawCells.map((cell) => cell.trim());
		if (cells.every((cell) => TABLE_SEPARATOR.test(cell))) {
			continue;
		}

		const [prefixCell, labelCell, requiredCell, forbiddenCell] = cells;
		if (!prefixCell) {
			continue;
		}

		const prefix = stripBackticks(prefixCell);
		if (!prefix) {
			continue;
		}

		const label = labelCell?.trim() ?? "";
		const required = requiredCell ? splitCellValues(requiredCell) : [];
		const forbidden = forbiddenCell ? splitCellValues(forbiddenCell) : [];

		rules.push({prefix, label, required, forbidden});
	}

	return rules;
}

export function isTemplateFile(file: TFile, templatePath: string): boolean {
	return file.path === templatePath;
}
