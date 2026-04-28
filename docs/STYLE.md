# Style

## Files

- There are three kinds of code files:
  - Regular ts modules (`*.ts`)
  - Component files (`*.vue`)
  - Composables (`*.composable.ts`)
- Follow [ARCHITECTURE.md: Layout](./ARCHITECTURE.md#layout) and update it if needed
- Group three or more related files in a directory
- There must not be circular dependencies between files
- Group related type definitions in a `*.types.ts` file, if:
  - this solves circular dependencies, or
  - they are many
  - A `*.types.ts` file should only contain type definitions and helpers, e.g. type guards

## Formatting

- Code must pass the `yarn lint` script
  - It uses [Prettier](https://prettier.io/) and [Eslint](https://eslint.org/)
    - Prettier is configured in `.editorconfig`, `package.json`
    - Eslint is configured in `eslint.config.mjs`
  - Run `yarn lintfix` to try to fix problems automatically
  - Configure your editor to lint and format automatically, see [DEVELOPMENT.md: Editor](DEVELOPMENT.md#editor)

## TypeScript

This covers regular ts modules as well as the `<script>` blocks of component files.

- Only use TypeScript, not vanilla JavaScript
- Beyond what is enforced by linters, create and use types if it makes coding easier

### Naming

- Casing:
  - Use `camelCase` for variables and functions
  - Use `PascalCase` for types, components and classes
  - Use `CONSTANT_CASE` for constant variables and environment variables
  - Treat abbreviations as normal words, e.g. `HtmlDocument`
  - Keep original casing of externally named symbols, e.g. properties in parsed JSON/YAML or library members

### Doc comments

- Summarize each file with a `/** @file doc comment */` on the first line
- Describe defined variables/functions/types, as well as object properties and function parameters, with a `/** doc comment */` on the line above
  - Not needed if the name and type is immediately self-explanatory
    - Think: "If I see this name later somewhere in the code, will I want a description on hover?"
  - Function parameters can alternatively be documented with @param lines in the function doc comment
- If a doc comment has multiple lines, put `/**` and `*/` on their own lines

## Markdown

- Add linebreaks between each sentence

## Component files

- Use `<script setup lang="ts">`, see [Vue docs on \<script setup>](https://v3.vuejs.org/api/sfc-script-setup.html)
- Organize the component file in the order `<script>`, `<template>`, `<style>`
- Omit the `<script>` and `<style>` blocks if empty
- Organize the script block as in the template below
  - Use double newlines between sections
  - Use double newlines within sections around statements that are over 2 lines
- In addition to top-level variables/functions, document each element in `defineProps` and `defineEmits` with `/** doc comments */` on the line above
- Try to keep component files small by pushing code to composables and regular ts modules
- Label visually distinctive parts of the template block with short `<!-- HTML comments -->`
- When passing a variable to a prop with the same name, abbreviate `:foo-bar="fooBar"` to `:fooBar`

Sections of the `<script>` block:

```ts
import ...                              //  1. Imports

type Item = ...                         //  2. Type definitions

defineModel(...);                       //  3. Models

defineProps<{...}>();                   //  4. Props

defineEmits<{...}>();                   //  5. Emits

const isDark = useDark();               //  6. Composables

let counter = 0;                        //  7. Reactive/nonreactive data
const foo = ref(0);

const isActive = computed(...);         //  8. Computeds

function onHover() {...};               //  9. Functions

onMounted(() => {...});                 // 10. Lifecycle hooks

watch(isActive, ...);                   // 11. Watchers
```

## Composables

- A composable encapsulates functionality used by components, see [Vue docs on Composables](https://vuejs.org/guide/reusability/composables.html)
  - Functionality being used in multiple places is a strong but not necessary reason to create a composable
  - Functionality that does not depend on Vue concepts (reactivity, other composables) should be in a regular ts module instead
- A composable for a feature called "foo" should be named `foo.composable.ts` and have a default export `useFoo()`

### Stores

- Manage global state in [Pinia](https://pinia.vuejs.org/) stores under `src/store/`

## CSS

- Use Tailwind CSS classes rather than plain CSS wherever possible

## Libraries

## User documentation

- Maintain full documentation outside the app, and link to it as _Help_ in the app header
- The user interface should explain itself with concise descriptions
- Use `<HelpBox>` to give context to a page or section
- Form inputs should have a label and probably a help text

### Language

- Be friendly
- Address the user as _you/your_
- Only use _we/us/our_ in a context where the speaker is specified (is it the hosting organization, the developer team, the community...?)
