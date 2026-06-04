# Architecture

This is a [Vue 3](https://v3.vuejs.org/) app using the [Vite](https://vitejs.dev/) build tool.

Contents:

1. [System](#system)
2. [Layout](#layout)
3. [Helper subsystems](#helper-subsystems)
4. [Testing](#testing)

## System

The Mink system consists of:

- **Mink frontend** runs in the user's web browser and presents a graphical user interface (GUI) to the services of the backend
- **[Mink backend](https://github.com/spraakbanken/mink-backend)** runs on a server where it manages stored data and executes data processing operations

The frontend communicates with the backend using the [Mink API](https://ws.spraakbanken.gu.se/docs/mink). The API can also be used directly from command-line or scripts.

The Mink system is connected to these other systems:

- [**Sparv**](https://github.com/spraakbanken/sparv-pipeline) is a corpus processing pipeline operated by the Mink backend
- [**Språkbanken Text Metadata API**](https://github.com/spraakbanken/metadata-api) provides information about Sparv analyses
- **SB-Auth** provides user authentication with [eduGAIN](https://edugain.org/) to Mink and a few other services of Språkbanken Text
- Analysed results can be installed from Mink into:
  - **[Korp](https://spraakbanken.gu.se/en/tools/korp)**, Språkbanken's word research platform
  - **[Strix](https://spraakbanken.gu.se/strix/)**, Språkbanken's text research platform
- [**Newsdesk**](https://github.com/spraakbanken/newsdesk/) is a simple news feed storage
- [**Matomo**](https://matomo.org/) records anonymized visitor statistics

## Layout

### Core code

Core source code lives in `src/`.

Code files are largely ordered into folders by topic:

```
APIs:
src/api/ - Mink API, Sparv, Metadata API
src/auth/ - authentication flow, SB-Auth API

UI components:
src/components/ - reusable elements like boxes and buttons
src/page/ - site-wide singular elements (header etc)

Resources:
src/corpus/ - corpus-related pages and logic
src/lexicon/ - lexicon-related pages and logic
src/metadata/ - metadata-related pages and logic
src/resource/ - logic common to all resource types
src/sources/ - related to source files
src/job/ - related to running processing/installation jobs
src/exports/ - related to export files

Non-resource pages:
src/home/ - home page
src/library/ - overview of user's resources
src/user/ - user page, admin mode
src/tools/ - features not related to user's resources

Plugins:
src/i18n/ - (internationalization) translations, language switcher
src/router/ - config for vue-router
src/store/ - Pinia stores for cached backend data and app state

Helper subsystems:
src/alert/ - showing alerts and other feedback messages
src/spin/ - UI feedback about pending API requests
```

Directly under `src/` there is:

- Entrypoint (main.ts)
- Vue root component (App.vue)
- Vue plugin config
- Reusable utility functions and types
- General CSS rules

### Instance code

Core code expects **instance** source code to live in `instance/`.
This is where you can add your own branding and customize functionality without modifying core code.

The directory is left out of version control so that you can control its content separately.
The recommended approach is to keep your instance code in an external directory and symlink to it:

```
mink-frontend/
  instance -> ../mink-frontend-custom/
  src/
  ...
mink-frontend-custom/
  plugin.ts
```

At the very least, the plugin must provide **app config** under the `injectionKeys.config` key.
See [config.types.ts](../src/app/config.types.ts) for structure and documentation.

Here is a sample `plugin.ts`:

```ts
import type { Plugin } from "vue";
import { injectionKeys } from "@/injection";
import appConfig from "./config.yaml";
import { MyAnalysisRegistryService } from "./services/MyAnalysisRegistryService";
import i18n, { languageNames } from "@/i18n/i18n";
import es from "./locales/es.yaml";

export default function createPlugin(): Plugin {
  return (app) => {
    // Use app config object from YAML file
    app.provide(injectionKeys.config, appConfig);

    // Provide services and components
    app.provide(
      injectionKeys.service.analysisRegistry,
      new MyAnalysisRegistryService(),
    );
    app.provide(
      injectionKeys.component.MinkLogo,
      () => import("./components/MyMinkLogo.vue"),
    );

    // Add a language
    languageNames.es = "Español";
    i18n.global.setLocaleMessage("es", es as Record<string, string>);
  };
}
```

Find more examples at [mink-frontend-sb](https://github.com/spraakbanken/mink-frontend-sb).

### Developer documentation

You are reading some of it now. See [README.md](../README.md) for a documentation table of contents.

Also see [STYLE.md: User documentation](STYLE.md).

### Assets

- Files in `src/assets/` are renamed by the build process to contain content-based hashes for caching purposes
- Files in `public/` are copied directly to the build output, retaining a persistent filename

See [Vite docs on Assets](https://vitejs.dev/guide/assets).

### GitHub action

There is a GitHub action in `.github/workflows/ci.yaml`
that will trigger on each push and check that the code builds.
It also runs tests, see [Testing](#testing) below

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

### Alert (`src/alert/`)

Show an alert:

```js
showAlert("There is no coffee");
```

It handles Mink backend errors specially:

```js
api.runJob("corpus", id).catch(showAlert);
```

## Testing

Test files should be named after the files they test, so `HomeView.vue` is tested by `HomeView.test.ts`.

Tests are run with `npm test`

⚠️ Coverage is currently tiny, partly because most features require authentication. We need some kind of mock authentication.

Read more about testing for Vue at:

- [Vue docs on Testing](https://vuejs.org/guide/scaling-up/testing.html)
- [Vitest API](https://vitest.dev/api/)
- [Vue testing library](https://testing-library.com/docs/vue-testing-library/intro)
