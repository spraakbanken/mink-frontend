# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

As this project is a user-facing application, the places in the semantic versioning number `MAJOR`.`MINOR`.`PATCH` are redefined as follows:

- `MAJOR` denotes changes that are expected to significantly disrupt the flow of a returning user with some experience of the application, _or_ that significantly affects the development workflow
- `MINOR` denotes changes that may affect the user experience _or_ the development workflow
- `PATCH` denotes changes that are insignificant to the user experience or the develpment workflow

## [Unreleased]

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

## [1.5.0] (2024-04-23)

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

## [1.4.0] (2024-03-11)

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

## [1.3.0] (2024-02-12)

### Added

- Converted code to TypeScript [#113](https://github.com/spraakbanken/mink-frontend/issues/113)
- Lint check in CI workflow script

### Changed

- Renamed one-word components, for linting

### Fixed

- Status panel is empty for new corpus, until page is reloaded [#151](https://github.com/spraakbanken/mink-frontend/issues/151)
- Word wrapping in log output in status panel [#139](https://github.com/spraakbanken/mink-frontend/issues/139)
- Upgraded dependencies

## [1.2.0] (2024-01-17)

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

## [1.1.0] (2024-01-02)

### Added

- Link to manual about exports files

### Changed

- Rename "Dashboard" to "Library"
- Use new `resource-info` route, drop `check-status` and `list-sources`
- The local storage key is now tagged with a datestamp, and should be changed when the data shape of the state changes

### Fixed

- Allow clicking most elements behind a loading spinner
- Home page width on small screen

## [1.0.5] (2023-11-28)

### Changed

- Improved sync between source files and settings: set format from files, set name to corpus id

### Fixed

- Set `lang` param of Korp/Strix urls

## [1.0.4] (2023-10-24)

### Fixed

- Drop requirement of mink-app permission for write check

## [1.0.3] (2023-10-19)

### Added

- Showing warnings from jobs
- Messages from jobs are limited in size, but resizeable

### Fixed

- Downloading source file was broken for binary files
- Correct file size outputs using binary base instead of decimal
- Translate "Create account" page to Swedish

## [1.0.2] (2023-10-03)

### Added

- Logo large with slogan on front page

### Fixed

- Handle unknown corpus state nicer
- Dark-safe background color of welcome card on home page
- Orange color of progress bar same as logo and links

## [1.0.1] (2023-10-02)

### Fixed

- Adjusted the layout in the Tools panel
- Updated screenshot for home page
- Corpus buttons on Dashboard are now real links, can be opened in new tab

### Added

- Messages from the backend are now kept in frontend code, including Swedish translations
- Added an introduction with screenshot to the README

### Changed

- New Mink logo, and added Göteborgs unversitet logo

## [1.0.0] (2023-09-20)

The frontend is now open to the general public! This version allows users to:

- Create corpora and upload text files
- Run a predefined set of linguistic annotations
- Download results as XML and CSV
- Export results into Korp and Strix

Code changes up until this point are not documented other than in the git commit log.

[unreleased]: https://github.com/spraakbanken/mink-frontend/compare/v1.5.0...HEAD
[1.5.0]: https://github.com/spraakbanken/mink-frontend/compare/v1.4.0...v1.5.0
[1.4.0]: https://github.com/spraakbanken/mink-frontend/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/spraakbanken/mink-frontend/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/spraakbanken/mink-frontend/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.5...v1.1.0
[1.0.5]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/spraakbanken/mink-frontend/releases/tag/v1.0.0
