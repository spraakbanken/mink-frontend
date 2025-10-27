# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

As this project is a user-facing application, the places in the semantic versioning number `MAJOR`.`MINOR`.`PATCH` are redefined as follows:

- `MAJOR` denotes changes that are expected to significantly disrupt the flow of a returning user with some experience of the application, _or_ that significantly affects the development workflow
- `MINOR` denotes changes that may affect the user experience _or_ the development workflow
- `PATCH` denotes changes that are insignificant to the user experience or the develpment workflow

## [Unreleased](https://github.com/spraakbanken/mink-frontend/compare/v1.12.2...HEAD)

### Added

- Sort sources files by name

### Changed

- Removed storage of resource data in browser

### Fixed

- Strix deeplink parameters

## [1.12.2](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.12.2) (2025-09-26)

### Fixed

- Source file listing does not update when file is added or removed [#210](https://github.com/spraakbanken/mink-frontend/issues/210)

## [1.12.1](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.12.1) (2025-09-26)

### Fixed

- Resources not loaded for admins outside admin mode

## [1.12.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.12.0) (2025-08-26)

### Added

- Strix docs link

### Changed

- New layout for the app header section, mostly to make changing organization logos easier
- Use versioned backend URL `/v1`
- Dependencies upgraded
  - Node >=20 is now required

### Fixed

- For some users, corpora are not showing up [#206](https://github.com/spraakbanken/mink-frontend/issues/206)

## [1.11.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.11.0) (2025-06-16)

### Changed

- Data loading and caching have been rewritten
  - The `useSources`, `useConfig`, `useStatus` and `useExports` composables were merged as `useCorpus(corpusId)`
  - `useCorpus(corpusId)` returns lazy-loading computeds `corpus`, `sources`, `config`, `exports` etc.
  - There's mostly no need to call `loadSources` etc explicitly now
  - Data is cached using freshness registers, and can be invalidated with the `skipCache` argument of `loadSources` etc
  - Corpus-specific parts of `resourceStore` are now in `corpusStore`
- In the resource/corpus store, `status` has been renamed to `job`

### Fixed

- JWT not updated when corpus is added/removed [#201](https://github.com/spraakbanken/mink-frontend/issues/201)

## [1.10.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.10.0) (2025-05-19)

### Added

- Button to clear previous annotations [#195](https://github.com/spraakbanken/mink-frontend/issues/195)

### Changed

- Use `/jwt?version=2` to avoid console error when not authenticated
- Use corpusState only for guiding the user [#149](https://github.com/spraakbanken/mink-frontend/issues/149)
- Mark routes that require authentication on router level (`meta: {protected: true}`)

### Fixed

- Hide news items with a future creation date
- Forward from login view to destination if already logged in

## [1.9.1](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.9.1) (2025-03-13)

### Added

- Link to user documentation [#188](https://github.com/spraakbanken/mink-frontend/issues/188)

### Changed

- Progressive JWT timeout [#190](https://github.com/spraakbanken/mink-frontend/issues/190)

### Fixed

- Show spinner before anything is loaded [#172](https://github.com/spraakbanken/mink-frontend/issues/172)

## [1.9.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.9.0) (2025-02-12)

### Added

- Validate edited YAML against Sparv config schema [#185](https://github.com/spraakbanken/mink-frontend/issues/185)
- Prettier YAML lists [#180](https://github.com/spraakbanken/mink-frontend/issues/180)

### Fixed

- Update translation for footer on homepage [#184](https://github.com/spraakbanken/mink-frontend/issues/184)

## [1.8.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.8.0) (2025-01-20)

### Added

- Checkboxes to disable groups of the default annotations [#182](https://github.com/spraakbanken/mink-frontend/pull/182)

### Fixed

- Updated screenshots

## [1.7.1](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.7.1) (2024-12-03)

### Added

- Add geotagging to the NER option [#174](https://github.com/spraakbanken/mink-frontend/issues/174)
- Editable config file in browser [#178](https://github.com/spraakbanken/mink-frontend/issues/178)

### Fixed

- Accessibility improvements (contrast, alt attributes, keyboard navigation, etc)
- Use corpus name in breadcrumbs

## [1.7.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.7.0) (2024-09-30)

### Added

- Track some events to Matomo [#166](https://github.com/spraakbanken/mink-frontend/issues/166)
- Added `.editorconfig`

### Changed

- Improved repo documentation
- Replaced Font Awesome with Phosphor Icons
- Clearer message of caution next to custom config upload form

### Fixed

- Show loading spinners on the custom config page
- Show loading spinners when downloading export files
- Strip slash from Matomo url
- Backend error messages are ignored when fetching files with "blob" as responseType [#171](https://github.com/spraakbanken/mink-frontend/issues/171)
- Remove unnecessary scroll bars from HeightResizable, used in code boxes

## [1.6.1](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.6.1) (2024-08-13)

### Added

- Code highlighting for XML and YAML [#30](https://github.com/spraakbanken/mink-frontend/issues/30)
- HTTP compression

### Changed

- Drop unnecessary async usage of the `js-yaml` package
- The FormKit and Highlight.js libs are imported dynamically to allow for a smaller main asset chunk

### Fixed

- Require authentication for the custom config page

## [1.6.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.6.0) (2024-04-30)

### Added

- News shown in two places on home page: featured on top, others under the intro text

### Changed

- Restructured panels on corpus overview to better match backend concepts:
  - New _Analysis_ panel with the run button from _Status_ and the downloads from _Results_
  - Renamed _Result_ to _Explore_ [#115](https://github.com/spraakbanken/mink-frontend/issues/115)
- Fetching news from the Newsdesk repo on page load, instead of a static file at build time
- The `on` prop of `PendingContent` now matches by start of string

### Fixed

- Clarify that data installed in tools is outdated after annotation re-run [#154](https://github.com/spraakbanken/mink-frontend/issues/154)

## [1.5.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.5.0) (2024-04-23)

### Added

- Upload custom corpus config [#99](https://github.com/spraakbanken/mink-frontend/issues/99)
- A quick, brief resource listing view for admin [#146](https://github.com/spraakbanken/mink-frontend/issues/146)
- Group export files by folder [#95](https://github.com/spraakbanken/mink-frontend/issues/95)
- JWT request now has a 2s timeout and two retries [#124](https://github.com/spraakbanken/mink-frontend/issues/124)
- Upload an entire folder of source files [#97](https://github.com/spraakbanken/mink-frontend/issues/97)

### Changed

- Removed unused `message` param from `spin()` [#157](https://github.com/spraakbanken/mink-frontend/issues/157)
- Merged the corpus Metadata and Configuration panels/forms
- Updated dependencies

### Fixed

- Use the new Språkbanken Text logo
- Unallowed file format sometimes saved to local config [#153](https://github.com/spraakbanken/mink-frontend/issues/153)
- Make language switcher more visible [#90](https://github.com/spraakbanken/mink-frontend/issues/90)
- Show hint if parsing config fails

## [1.4.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.4.0) (2024-03-11)

### Added

- Basic functionality for adding and removing metadata resources [#145](https://github.com/spraakbanken/mink-frontend/issues/145)
- Progress bar for source file uploads [#45](https://github.com/spraakbanken/mink-frontend/issues/45)
- Some dynamic imports to reduce main chunk size

### Changed

- Extracted the concept of a Resource as a supertype of Corpus, in preparation for adding the Metadata resource type [#145](https://github.com/spraakbanken/mink-frontend/issues/145)
- Defer loading source text if file is large [#29](https://github.com/spraakbanken/mink-frontend/issues/29)
- Source text file content now looks the same as log output

### Fixed

- Missing `type` in store caused new corpus form to crash
- Fix visual feedback when saving config and deleting resource

## [1.3.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.3.0) (2024-02-12)

### Added

- Converted code to TypeScript [#113](https://github.com/spraakbanken/mink-frontend/issues/113)
- Lint check in CI workflow script

### Changed

- Renamed one-word components, for linting

### Fixed

- Status panel is empty for new corpus, until page is reloaded [#151](https://github.com/spraakbanken/mink-frontend/issues/151)
- Word wrapping in log output in status panel [#139](https://github.com/spraakbanken/mink-frontend/issues/139)
- Upgraded dependencies

## [1.2.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.2.0) (2024-01-17)

### Added

- Option to enable named entity recognition
- Check if admin mode is enabled on load
- Build check in CI workflow script

### Changed

- Dependencies upgraded
  - Node 18 is now required, due to @vitejs/plugin-vue@5
- Request `resource-info` once for all resources
- `UrlButton` component replaces `a > ActionButton`
- `RouteButton` component replaces `router-link > ActionButton`
- `ActionButton` uses `<button>` and is tabbable

### Fixed

- Error handling when deleting corpus

### Removed

- `useVariant`

## [1.1.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.1.0) (2024-01-02)

### Added

- Link to manual about exports files

### Changed

- Rename "Dashboard" to "Library"
- Use new `resource-info` route, drop `check-status` and `list-sources`
- The local storage key is now tagged with a datestamp, and should be changed when the data shape of the state changes

### Fixed

- Allow clicking most elements behind a loading spinner
- Home page width on small screen

## [1.0.5](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.0.5) (2023-11-28)

### Changed

- Improved sync between source files and settings: set format from files, set name to corpus id

### Fixed

- Set `lang` param of Korp/Strix urls

## [1.0.4](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.0.4) (2023-10-24)

### Fixed

- Drop requirement of mink-app permission for write check

## [1.0.3](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.0.3) (2023-10-19)

### Added

- Showing warnings from jobs
- Messages from jobs are limited in size, but resizeable

### Fixed

- Downloading source file was broken for binary files
- Correct file size outputs using binary base instead of decimal
- Translate "Create account" page to Swedish

## [1.0.2](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.0.2) (2023-10-03)

### Added

- Logo large with slogan on front page

### Fixed

- Handle unknown corpus state nicer
- Dark-safe background color of welcome card on home page
- Orange color of progress bar same as logo and links

## [1.0.1](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.0.1) (2023-10-02)

### Fixed

- Adjusted the layout in the Tools panel
- Updated screenshot for home page
- Corpus buttons on Dashboard are now real links, can be opened in new tab

### Added

- Messages from the backend are now kept in frontend code, including Swedish translations
- Added an introduction with screenshot to the README

### Changed

- New Mink logo, and added Göteborgs unversitet logo

## [1.0.0](https://github.com/spraakbanken/mink-frontend/releases/tag/v1.0.0) (2023-09-20)

The frontend is now open to the general public! This version allows users to:

- Create corpora and upload text files
- Run a predefined set of linguistic annotations
- Download results as XML and CSV
- Export results into Korp and Strix

Code changes up until this point are not documented other than in the git commit log.
