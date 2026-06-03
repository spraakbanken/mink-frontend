# Development

To run the code, you need Node.js 22 or higher and [mkcert](https://mkcert.dev) or similar.

Contents:

1. [Setting up a development environment](#setting-up-a-development-environment)
2. [Development tasks](#development-tasks)
3. [Code](#code)
4. [Version control](#version-control)

## Setting up a development environment

### Editor

As a suggestion, run
[Visual Studio Code](https://code.visualstudio.com/) with the plugins
[Vue](https://marketplace.visualstudio.com/items?itemName=Vue.volar),
[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint),
[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and
[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss).

Recommended VSCode settings (see [docs on settings.json](https://code.visualstudio.com/docs/getstarted/settings#_settingsjson)):

```jsonc
{
  "css.lint.unknownAtRules": "ignore", // Ignore Tailwind's @apply etc
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "always",
  },
  "editor.formatOnSave": true,
  "editor.formatOnType": true,
  "[javascript][typescript][vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "[json][jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  "[html][css]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
  },
  // Include instance code when searching
  "search.useIgnoreFiles": false,
  "search.exclude": {
    "dist": true,
    "stats.html": true,
  },
}
```

### Instance plugin

For the code to build, you must create `instance/plugin.ts` with an function returning a Vue plugin.
The `instance/` directory is left out of version control so that you can control its content separately.
The recommended approach is to keep your instance code in an external directory and symlink to it:

```
mink-frontend/
  instance -> ../mink-frontend-custom
  ...
mink-frontend-custom/
  plugin.ts
```

Sample `plugin.ts`:

```ts
import type { Plugin } from "vue";
import { injectionKeys } from "@/injection";
import appConfig from "./config.yaml";
import { MyAnalysisRegistryService } from "./services/MyAnalysisRegistryService";
import i18n, { languageNames } from "@/i18n/i18n";

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

    // Modify a language
    import("./locales/sv.yaml").then((module) => {
      i18n.global.mergeLocaleMessage("sv", module.default);
    });

    // Add a language
    import("./locales/es.yaml").then((module) => {
      const messages = module.default as Record<string, string>;
      i18n.global.setLocaleMessage("es", messages);
      languageNames.es = "Español";
    });
  };
}
```

Find more examples at [mink-frontend-sb](https://github.com/spraakbanken/mink-frontend-sb)

### SSL in development

For SB-Auth to allow authentication requests, the frontend must be served under spraakbanken.gu.se, and HTTPS must be enabled.

1. Point the hostname minkdev.spraakbanken.gu.se to localhost. On a UNIX system, you can do this by editing /etc/hosts.
2. Create certificate files with [mkcert](https://mkcert.dev):
   ```sh
   mkcert "*.spraakbanken.gu.se"
   ```
3. Specify host and certificate paths in environment variables, as described in the next section.

### Environment variables

Vite will read variables from env files in the instance directory.
See [Vite docs](https://vitejs.dev/guide/env-and-mode).

It is recommended to keep local variables in `.env.local` and exclude it from git.

| Variable        | Comment                         |
| --------------- | ------------------------------- |
| BASE            | Base path, defaults to `/mink/` |
| DEV_HOST        | Hostname for dev server         |
| DEV_HTTPS_CERT  | Path to HTTPS certificate file  |
| DEV_HTTPS_KEY   | Path to HTTPS private key file  |
| VITE_MATOMO_URL | URL to Matomo instance          |
| VITE_MATOMO_ID  | Matomo site id                  |

Omit any of the Matomo variables to disable [Matomo](https://matomo.org/).

### App configuration

Aside from the env variables listed above, the app is configured using a **config object** provided by the instance plugin.
See the sample plugin above and the [config.types.ts](../src/app/config.types.ts) file for documentation.

## Development tasks

These use commands defined in the `scripts` section of `package.json`.

| Task                                                 | Command         |
| ---------------------------------------------------- | --------------- |
| Install the dependencies needed to run the code      | `npm install`   |
| Serve the frontend from a temporary local dev server | `npm start`     |
| Run tests and watch files to rerun on changes        | `npm test`      |
| Run tests once and check for formatting problems     | `npm run check` |
| Attempt to fix formatting problems automatically     | `npm run fix`   |
| Build the frontend as optimized HTML + assets        | `npm run build` |

### Deploying

After building, the files in `dist/` can be copied to the web server.

Sample deploy script:

```sh
#!/bin/bash
set -e # Abort on errors

npm install
npm run check
npm run build

rsync -a --delete-after dist/ user@example.com:/var/www/mink/
```

## Code

See [ARCHITECTURE.md](ARCHITECTURE.md) for an overview of the structure and [STYLE.md](STYLE.md) for code style.

## Version control

### Commits

A commit should contain a single, coherent change. If suitable, note the change in [CHANGELOG.md](../CHANGELOG.md).

The commit message must be of this form, based on [Conventional commits](https://www.conventionalcommits.org/en/v1.0.0/):

```
<keyword>: <title>

<body>

<footer>
```

where

- `keyword` is the most suitable from the list below
- `title` describes the change briefly
- `body` is optional and can contain any useful explanations or background information to the change
- `footer` is optional and can contain [GitHub keywords](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/using-keywords-in-issues-and-pull-requests) like `Fixes #123`

| Keyword    | Purpose                                                                        |
| ---------- | ------------------------------------------------------------------------------ |
| `fix`      | something broken is being fixed                                                |
| `feat`     | a new feature is added                                                         |
| `docs`     | help text is being changed                                                     |
| `style`    | the change concerns style (of code, prose, appearance or graphics)             |
| `perf`     | the change makes something faster                                              |
| `test`     | testing is improved                                                            |
| `build`    | the build process is affected                                                  |
| `refactor` | code is being restructured for DX, sustainability or similar reasons           |
| `chore`    | for changes that do not affect code, behavior, docs, appearance or performance |
| `merge`    | for merge commits                                                              |
| `revert`   | for revert commits (`git revert`)                                              |
| `release`  | marks a release, see [Releases](#releases)                                     |

### Branches

Continual development happens on the **main** branch.
It should always be healthy, so any changes that break the build should be fixed as soon as possible.
There is a GitHub action [ci.yaml](../.github/workflows/ci.yaml) for this purpose,
meaning someone will be notified if the code is broken.

For a larger change, please create a specific branch, and squash-merge to main when ready.

### Pull requests

Change suggestions in the form of pull requests are very welcome. Fork the repo, create a branch, add your commits, push it to your fork, and then open a pull request against the main branch.

Close collaborators can ask for write access to the repo, and do not need to fork it.

### Releases

The timing of a release is determined by maintainers, and may be more or less connected to the ongoing work at Språkbanken Text.

1. Check and test the code carefully
2. Update [CHANGELOG.md](../CHANGELOG.md):
   1. Update the list under _Unreleased_ to reflect changes made since the last release
   2. From the list of changes, determine whether this is a major, minor or patch release
   3. Add a release number heading directly under the _Unreleased_ heading
   4. Update the _Unreleased_ heading link target
3. Update the version number in `package.json`
   - and run `npm install` to have it propagated into `package-lock.json`
4. Commit as `release: version <version>`
5. Tag the commit as `v` + version number, e.g. `git tag v1.2.3`
6. Push the branch and the tag: `git push --tags origin main`
7. Build and deploy to https://spraakbanken.gu.se/mink
8. Add a newsdesk entry to [mink.yaml](https://github.com/spraakbanken/newsdesk/blob/main/data/mink.yaml)

#### Hotfix release

Sometimes we need to release a fix quickly, without other changes that may be happening on the main branch.
In such cases, it is okay to commit the fix on a new branch directly off the last release commit, and then do the release workflow on that branch.
For this reason, the deploy build must happen on the _latest release commit_, rather than the latest main branch commit.

Get the latest release commit: `git tag --list 'v[0-9]*' --sort=version:refname | tail -n1`

After the fix is deployed, merge the hotfix branch back into main.
