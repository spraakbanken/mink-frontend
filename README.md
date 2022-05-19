# Min språkbank frontend

Frontend for Min språkbank.

## Architecture

[Vue 3](https://v3.vuejs.org/) app using [Vite](https://vitejs.dev/).

Design patterns used:

- Single-file components with [`<script setup>`](https://v3.vuejs.org/api/sfc-script-setup.html)
- [Composables](https://vuejs.org/guide/reusability/composables.html) to group state+logic for distinct features
- Utility-first styling with [Tailwind CSS](https://tailwindcss.com/)
- Visualization of API calls:
  1. Wrap async calls in [`spin`](src/assets/spin.js):
     ```js
     spin(loadCorpora(), "Loading corpora", "corpora");
     ```
  2. For markup that might change after the call, wrap it in [`<PendingContent>`](src/components/PendingContent.vue) to apply animation:
     ```html
     <PendingContent on="corpora"> {{ corpora.length }} </PendingContent>
     ```

See:

- [Min SB API documentation](https://ws.spraakbanken.gu.se/ws/min-sb/api-doc)
- [Min SB project board](https://github.com/orgs/spraakbanken/projects/10)

## Recommended IDE setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar).

VSCode settings:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "vetur.validation.template": false,
  "editor.formatOnSave": true,
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```
