Let's build a minimal Obsidian plugin from this template.

The goal is for this plugin to guide the user to have each note's title in the vault start with a special character such as "~" or "📖" (determined by a whitelist)

## Features

### Open random magic title start

- a command (triggerable from command palette, and sidebar icon) that opens a random note in the vault that either
    - does not start with any of the defined strings
    - does start with one of the defined strings and not containing all required strings
    - does start with one of the defined strings and contains one of the forbidden strings.

in all cases, trigger a `Notice` like "Please add a prefix to the note title" or "Missing `$whatever` in note content" etc.


### Create default Template

Creates a note with an exemplary table as described below,
and if template note setting is not set, sets it.

## Settings

### Template

A note that must contain a table in the format 

```

| `⬡`  | Shape  | `- **`       |             |
| ---- | ------ | ------------ | ----------- |
| `◊`  | Entity | `- *`        |             |
| `⋱`  | Guide  | `1.`<br>`2.` |             |
| `📖` | Book   |              | `location:` |
| `~`  | Take   | `—`          |             |

```

The first column defines a legal start-of-note-title character.
The second column gives a name for this type of note, for user's reference.
The third col defines strings that *should* exist in the *content* of such a note, one per line.
The fourth column defines strings that *should not* exist in the content of such a note, one per line.