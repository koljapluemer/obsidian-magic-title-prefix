# Magic Title Prefix

An Obsidian plugin that enforces note title prefixes and validates note content against configurable rules.

## Features

- Define rules in a markdown table template specifying:
  - **Prefix**: Symbol the title must start with (e.g., `⬡`, `◊`, `📖`)
  - **Required content**: Strings that must appear in the note
  - **Forbidden content**: Strings that must not appear in the note
- Toolbar appears at the bottom of notes without a prefix, allowing quick prefix assignment
- Command to open a random non-compliant note for review

## Usage

1. Run "Create default template" command to generate the rules template
2. Edit the template table to define your prefixes and rules
3. Set the template path in plugin settings
4. Use "Open random magic title prefix" to find notes that need attention
5. Click toolbar buttons to add prefixes to untitled notes

## Template Format

```markdown
| `⬡`  | Shape  | `- **`       |             |
| `◊`  | Entity | `- *`        |             |
| `📖` | Book   |              | `location:` |
```

Columns: prefix | label | required content | forbidden content

## Installation

Copy `main.js`, `styles.css`, and `manifest.json` to your vault's `.obsidian/plugins/obsidian-magic-title-prefix/` folder.
