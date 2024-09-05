# Architecture

This is a [Vue 3](https://v3.vuejs.org/) app using the [Vite](https://vitejs.dev/) build tool.

Contents:

1. [System](#system)
2. [Layout](#layout)
3. [Vue plugins](#vue-plugins)
4. [Helper subsystems](#helper-subsystems)
5. [Testing](#testing)

## System

The Mink system consists of these pieces of software:

- **Mink frontend** runs in the user's web browser and presents a graphical user interface (GUI) to the services of the backend
- **[Mink backend](https://github.com/spraakbanken/mink-backend)** runs on a server where it manages stored data and executes data processing operations
- **[Sparv](https://github.com/spraakbanken/sparv-pipeline)** is the NLP pipeline used for text analysis, operated by the Mink backend. (Sparv lives independently from Mink, but it is listed here because it is essential to Mink.)

The frontend communicates with the backend using the [Mink API](https://ws.spraakbanken.gu.se/ws/mink/api-doc). The API can also be used directly from command-line or scripts.

The Mink system is connected to these other systems:

- **SB-Auth** provides user authentication with [eduGAIN](https://edugain.org/) to Mink and a few other services of Språkbanken Text
- Analysed results can be installed from Mink into:
  - **[Korp](https://spraakbanken.gu.se/en/tools/korp)**, Språkbanken's word research platform
  - **[Strix](https://spraakbanken.gu.se/strix/?lang=eng)**, Språkbanken's text research platform
- [**Matomo**](https://matomo.org/) records anonymized visitor statistics

## Layout

### Source code

Source code lives in `src/`.

#### Topic folders

Code files are largely ordered into folders by topic:

```
APIs:
src/api/ - Mink API and Sparv
src/auth/ - authentication flow, SB-Auth API

UI components:
src/components/ - reusable elements like boxes and buttons
src/page/ - site-wide singular elements (header etc)

Resource pages:
src/corpus/ - corpus-related pages and logic (most of Mink currently)
src/metadata/ - metadata-related pages and logic
src/resource/ - logic common to all resource types

Other pages:
src/home/ - home page
src/library/ - overview of user's resources
src/user/ - user page, admin mode

Plugins:
src/i18n/ - (internationalization) translations, language switcher
src/router/ - config for vue-router
src/store/ - app state

Helper subsystems:
src/message/ - showing alerts and other feedback messages
src/spin/ - UI feedback about pending API requests
```

#### Other code

Directly under `src/` there is:

- Entrypoint (main.ts)
- Vue root component (App.vue)
- Vue plugin config
- Reusable utility functions and types
- General CSS rules

### User documentation

The user interface should explain itself, as largely as possible without cluttering itself with prose.

Use `<HelpBox>` to give context to a page or section. Form inputs should have a label and probably a help text.

Use icons to accompany text snippets, but not by themselves. Exceptions are allowed in tight spaces.

Outside the app, there is also some guidance available at the Språkbanken Text website: [Mink](https://spraakbanken.gu.se/en/tools/mink).

### Developer documentation

You are reading some of it now. See [README.md](../README.md) for a documentation table of contents.

### Assets

- `public/` contains static assets which do not need to be imported in code
- `src/assets/` contains static assets which can be imported in code

See [Vite docs on Assets](https://vitejs.dev/guide/assets).

### GitHub action for CI

There is a GitHub action in `.github/workflows/ci.yml` that will trigger on each push and check that the code builds. It also runs tests, but that is less significant since test coverage is tiny so far. As such, it is a basic implementation of the Continuous integration (CI) principle.

## Vue plugins

These are referenced from [main.ts](../src/main.ts). (Tailwind via `index.css`, I think.)

- Page navigation with [vue-router](https://router.vuejs.org/)
- Reactive app state with [Pinia](https://pinia.vuejs.org/)
- UI translation with [vue-i18n](https://vue-i18n.intlify.dev/)
- Utility-first styling with [Tailwind CSS](https://tailwindcss.com/), see [STYLE.md](STYLE.md)
- Icons with [FontAwesome](https://fontawesome.com/docs/web/use-with/vue/add-icons)
- Form handling with [FormKit](https://formkit.com/getting-started)
- Visitor statistics tracking with [vue-matomo](https://github.com/AmazingDreams/vue-matomo)

## Helper subsystems

These utilities are complex enough that they cannot each be contained in a single file.

### Spin (`src/spin/`)

Wrap an async request with:

```js
spin(promise, token);
```

Show loading animation on top of related UI elements with:

```html
<PendingContent :on="token">[dependent content here]</PendingContent>
```

### Message (`src/message/`)

Show a message:

```js
alert("There is no coffee", "error");
```

Helper for showing a failing Mink API response:

```js
mink.runJob(corpusId).catch(alertError);
```

## Testing

Test files should be named after the files they test, so `HomeView.vue` is tested by `HomeView.test.ts`.

Tests are run with `yarn test`

⚠️ Coverage is currently tiny, partly because most features require authentication. We need some kind of mock authentication.

Read more about testing for Vue at:

- [Vue docs on Testing](https://vuejs.org/guide/scaling-up/testing.html)
- [Vitest API](https://vitest.dev/api/)
- [Vue testing library](https://testing-library.com/docs/vue-testing-library/intro)
