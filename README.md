# Min språkbank frontend

Frontend for Min språkbank.

## Architecture

[Vue 3](https://v3.vuejs.org/) app using [Vite](https://vitejs.dev/). Recommended IDE Setup: [VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=johnsoncodehk.volar).

Design patterns used:

- Single-file components with `<script setup>` ([Vue doc](https://v3.vuejs.org/api/sfc-script-setup.html))
- Utility-first styling with [Tailwind CSS](https://tailwindcss.com/)
- Wrap async calls in a homegrown [`spin`](src/assets/spin.js) decorator to visualize loading state

See:

- [Min SB API documentation](https://ws.spraakbanken.gu.se/ws/min-sb/api-doc)
- [Min SB project board](https://github.com/orgs/spraakbanken/projects/10)
