# Development

To run the code, you need Node.js 18 or higher, [Yarn 1](https://classic.yarnpkg.com/en/docs) and [mkcert](https://mkcert.dev) or similar.

Contents:

1. [Setting up a development environment](#setting-up-a-development-environment)
2. [Development tasks](#development-tasks)
3. [Code](#code)
4. [Version control](#version-control)

## Setting up a development environment

### Recommended IDE setup

As a suggestion, run
[VSCode](https://code.visualstudio.com/) with the plugins
[Vue](https://marketplace.visualstudio.com/items?itemName=Vue.volar),
[ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint),
[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and
[Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss).

VSCode settings:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll": "explicit"
  },
  "editor.formatOnSave": true,
  "[javascript][typescript][vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json][jsonc]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### SSL in local development

For SB-Auth to allow authentication requests, the frontend must be served under `spraakbanken.gu.se`, and HTTPS must be enabled.

The configuration in [vite.config.ts](../vite.config.ts) therefore expects

Point the hostname `minkdev.spraakbanken.gu.se` to `localhost`. On a UNIX system, you can do this by editing `/etc/hosts`.

Create certificates with [mkcert](https://mkcert.dev):

```sh
mkcert "*.spraakbanken.gu.se"
```

and refer to them in `.env.local`:

```sh
DEV_HTTPS_KEY=../spraakbanken.gu.se+1-key.pem
DEV_HTTPS_CERT=../spraakbanken.gu.se+1.pem
```

### Environment variables

Vite will read variables from [.env](../.env), see [Vite docs](https://vitejs.dev/guide/env-and-mode). It will also read from .env.local, which is ignored by Git, so you can create it locally to override .env.

The dev server might not properly pick up on changes to these, so better kill and rerun the `yarn dev` command.

## Development tasks

### Install dependencies

Install the dependencies needed to run the code (Vite, Vue, etc):

```sh
yarn
# or
yarn install
```

### Run dev server

Serve the frontend from a temporary local development server:

```sh
yarn dev
```

Now you can open the frontend in a web browser at https://minkdev.spraakbanken.gu.se:5173/mink/

### Run tests

```sh
yarn test
```

Note that test coverage is very low so far. One thing that makes testing difficult is that most API calls require authentication.

### Build

Build the frontend as optimized static HTML+JS+CSS assets:

```sh
yarn build
```

The files in `dist/` can now be copied to the web server. The `rsync` command is useful for copying across servers and including hidden files like `.htaccess`.

## Code

See [ARCHITECTURE.md](ARCHITECTURE) for an overview of the structure and [STYLE.md](STYLE.md) for code style.

## Version control

### Commits

A commit should contain a single, coherent change.

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
| `feat`     | something non-broken is being improved                                         |
| `docs`     | help text is being changed                                                     |
| `style`    | the change concerns style (of code, prose, appearance or graphics)             |
| `perf`     | the change makes something faster                                              |
| `test`     | testing is improved                                                            |
| `build`    | the build process is affected                                                  |
| `refactor` | code is being restructured for DX, sustainability or similar reasons           |
| `chore`    | for changes that do not affect code, behavior, docs, appearance or performance |
| `revert`   | for revert commits (`git revert`)                                              |

### Branches

Continual development happens on the **dev** branch. It should always be healthy, so any changes that break the build should be fixed as soon as possible. There is a GitHub action [ci.yml](../.github/workflows/ci.yml) for this purpose, meaning someone will be notified if the code is broken.

For a larger change, please create a specific branch, and merge to dev when ready. Merging without squash nor rebase is preferred but not mandatory.

The **main** branch must only consist of release merges (see [#Releases](#releases)) and hotfix commits.

A **hotfix** is an urgent fix that is small enough that making a new release seems overkill. Commit the fix to the main branch and deploy, and then cherry-pick it (`git cherry-pick`) to the dev branch.

### Pull requests

Change suggestions in the form of pull requests are very welcome. Fork the repo, create a branch, add your commits, push it to your fork, and then open a pull request against the dev branch.

Close collaborators can ask for write access to the repo, and do not need to fork it.

### Releases

The timing of a release is determined by maintainers, and may be more or less connected to the ongoing work at Språkbanken Text.

1. Update [CHANGELOG.md](../CHANGELOG.md):
   1. Update the list under _Unreleased_ to reflect changes made since the last release
   2. From the list of changes, determine whether this is a major, minor or patch release
   3. Add a release number heading directly under the _Unreleased_ heading
   4. Update the compare urls in the bottom of the file
2. Update the version number in `package.json`
3. Commit and include the new version number in the commit message
4. Merge dev to main
5. Tag the merge commit as `v` + version number, e.g. `git tag v1.2.3`
6. Push both branches and the tag: `git push --tags origin main dev`
7. Build the main branch and deploy to https://spraakbanken.gu.se/mink
8. Add a newsdesk entry to [mink.yaml](https://github.com/spraakbanken/newsdesk/blob/main/data/mink.yaml)
