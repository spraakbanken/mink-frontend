# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

As this project is a user-facing application, the places in the semantic versioning number `MAJOR`.`MINOR`.`PATCH` are redefined as follows:

- `MAJOR` denotes changes that are expected to significantly disrupt the flow of a returning user with some experience of the application, _or_ that significantly affects the development workflow
- `MINOR` denotes changes that may affect the user experience _or_ the development workflow
- `PATCH` denotes changes that are insignificant to the user experience or the develpment workflow

## [Unreleased]

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

[unreleased]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.5...HEAD
[1.0.5]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.4...v1.0.5
[1.0.4]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/spraakbanken/mink-frontend/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/spraakbanken/mink-frontend/releases/tag/v1.0.0
