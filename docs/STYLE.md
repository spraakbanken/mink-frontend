# Style

## Formatting

Use Prettier and Eslint to automatically check for formatting problems:

- [Eslint](https://eslint.org/) is configured in `eslint.config.mjs`
- [Prettier](https://prettier.io/) is configured in `package.json` and `.editorconfig`

They can be invoked by scripts defined in `package.json`:

- `yarn lint` will run them and report problems
- `yarn lintfix` will also attempt to fix them

Committed code must pass the lint script. The [ci.yaml](../.github/workflows/ci.yaml) workflow will alert if it doesn't.

If you can, set up your environment to lint and format automatically, see [DEVELOPMENT.md: Recommended IDE setup](DEVELOPMENT.md#recommended-ide-setup).

## TypeScript

- Use TypeScript and no vanilla JavaScript: `*.ts` and `<script lang="ts">`
- Use types at least as enforced by linters
- Beyond that, let developer experience guide usage, i.e. create and use them if it makes coding easier

## Components

- Use single-file components with `<script setup>`, see [Vue docs on \<script setup>](https://v3.vuejs.org/api/sfc-script-setup.html)
- Strive to keep components small by pushing logic and down to composables and regular `*.ts` modules

## Composables

- A composable for a feature called "foo" should be named `foo.composable.ts` and have a default export `useFoo()`

See [Vue docs on composables](https://vuejs.org/guide/reusability/composables).

## Stores

[Pinia](https://pinia.vuejs.org/) stores are used to manage global state. They look a lot like composables, but are created with `defineStore()` which provide specific functionality.

## CSS

- Use Tailwind CSS classes rather than plain CSS wherever possible
- Omit the `<style>` tag completely if empty

## User documentation

The _Help_ link in the header leads to extensive documentation at the Språkbanken Text website: [Mink](https://spraakbanken.gu.se/en/tools/mink).

- The user interface should explain itself with concise descriptions
- Use `<HelpBox>` to give context to a page or section
- Form inputs should have a label and probably a help text
