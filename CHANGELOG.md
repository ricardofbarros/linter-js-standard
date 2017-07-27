# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 3.9.1 (2017-05-02)

### Fixed
- [Issue #171](https://github.com/ricardofbarros/linter-js-standard/issues/171)

## 3.9.0 (2017-02-22)

### Fixed
- [Issue #158](https://github.com/ricardofbarros/linter-js-standard/issues/158)
- [Issue #152](https://github.com/ricardofbarros/linter-js-standard/issues/152)

## 3.8.3 (2017-02-22)

### Fixed
- Annoying repeating warnings.

## 3.8.2 (2017-02-21)

### Fixed
- [Issue #163](https://github.com/ricardofbarros/linter-js-standard/issues/163)

## 3.8.1 (2016-01-26)

### Feature
- [Support vue files](https://github.com/ricardofbarros/linter-js-standard/commit/f5a7189447748398a7bc3d8c3a4d6a3b0a909615)

## 3.8.0 (2017-01-19)

### Feature
- [Global support for standard variations](https://github.com/ricardofbarros/linter-js-standard/commit/b863435dbaa7c805d9d33fb2cb595f9f8b3c44c0).

### Fixed
- [Issue #62](https://github.com/ricardofbarros/linter-js-standard/issues/62)

### Removed
- find-root package

## 3.7.0 (2016-11-30)

### Changed
- Dependencies update:
  - :arrow_up: standard@^8

## 3.6.0 (2016-11-04)

### Changed
- Dependencies update:
  - :arrow_up: esprima@^3
  - :arrow_up: babel-eslint@^7
  - :arrow_up: happiness@^7
  - :arrow_up: semistandard@^9

## 3.5.0 (2016-11-03)

### Feature
- [Issue #100](https://github.com/ricardofbarros/linter-js-standard/issues/100)
- [Support eslint env config](https://github.com/ricardofbarros/linter-js-standard/commit/e73321391dbcb64f69434e66caeed75c582de631)
- [Look for linters in deps instead of just devDeps](https://github.com/ricardofbarros/linter-js-standard/commit/3ad0cb21ad5631af6231252f08c2caa4b1f4415a)

### Fixed
- [Markdown splitter is not greedy](https://github.com/ricardofbarros/linter-js-standard/commit/a18bb24b3cd8760f92178f4cd8c93691d3a0549d)
- [Getting file paths from symlinks](https://github.com/ricardofbarros/linter-js-standard/commit/76bcbec32b2b518a43e9d0741bb1d508e0ccde0b)

## 3.4.0 (2016-06-21)

### Fixed
- [Issue #62](https://github.com/ricardofbarros/linter-js-standard/issues/62)

### Removed
- find-root package

## 3.3.0 (2016-04-11)
### Added
- [Uses the linter your package depends on rather than the internal dependency whenever possible.](https://github.com/ricardofbarros/linter-js-standard/pull/101)

### Changed
- Option `checkDevDependencies` default to `true`

## 3.2.0 (2015-09-08)
### Added
- Dependencies:
  - atom-package-deps@^2.0.5

> NOTE: From this version and on `linter-js-standard` doesn't need `linter` installed beforehand.

## 3.1.0 (2015-09-04)
### Changed
- Dependencies update:
  - :arrow_up: standard@5.2.1
  - :arrow_up: babel-eslint@4.1.1

## 3.0.2 (2015-09-03)
### Fixed
- Semistandard stop working after you use standard style
- Linter doesn't lint when `Markdown linting` option is disabled

## 3.0.1 (2015-09-03)
### Added
- Support fenced code lint in markdown files

### Fixed
- Annoying warning message in [issue #37](https://github.com/ricardofbarros/linter-js-standard/issues/37)

### Changed
- Subscription event to cache file package.json settings to `.onDidChangeActivePaneItem`. This solved [issue #37](https://github.com/ricardofbarros/linter-js-standard/issues/37)
- Use the linter's node.js API instead of a `child_process.execFile()` call, making the linter supaaa fast!
Partially suggested in [issue #38](https://github.com/ricardofbarros/linter-js-standard/issues/37).
- Use a static version for the linters instead of `^x.x.x`

## 2.4.0 (2015-08-04)
### Added
- New setting `showEslintRules`: Enable/disable show eslint rule name
  - Feature requested in [issue #39](https://github.com/ricardofbarros/linter-js-standard/issues/39)

## 2.3.0 (2015-08-04)
### Changed
- Dependencies update
  - :arrow_up: standard@^5.0.0
  - :arrow_up: semistandard@^7.0.2

## 2.2.0 (2015-07-24)
### Changed
- Switched from using file path to `stdin`
- Dependencies update
  - :arrow_up: atotm-linter@^3.0.0

### Fixed  
- Fix permanently [issue #30](https://github.com/ricardofbarros/linter-js-standard/issues/30)

## 2.1.0 (2015-07-24)
### Added
- Support global vars in package.json

## 2.0.4 (2015-07-23)
### Fixed
- [Issue #30](https://github.com/ricardofbarros/linter-js-standard/issues/30)

## 2.0.3 (2015-07-22)
### Added
- Warning message

## 2.0.2 (2015-07-22)
### Fixed
- Random errors thrown
  - `no-style` wasn't working

## 2.0.1 (2015-07-22)
### Fixed
- Still showing in `Deprecation Cop` that is needed to migrate to new API.
  - remove key `linter-package` from package.json

## 2.0.0 (2015-07-22)
### Changed
- Transpile code base from coffescript to javascript
- AtomLinter new API migration

## 1.1.0 (2015-07-08)
### Added
- happiness linter

## 1.0.7 (2015-07-08)
### Added
- add `cache: false` to pkgConfig options

### Changed
- Dependencies update
  - :arrow_up: pkg-config@1.1.0

## 1.0.6 (2015-07-03)
### Fixed
- [Issue #17](https://github.com/ricardofbarros/linter-js-standard/issues/17)

## 1.0.5 (2015-07-02)
### Added
- New dependencies
  - esprima
  - esprima-fb
- More 2 custom parsers supported (esprima and esprima-fb)

## 1.0.4 (2015-07-01)
- Reorganize code

## 1.0.3 (2015-07-01)
### Fixed
- When option `checkDevDependencies` was ticked and it didn't find any style on package.json it would throw a random error

## 1.0.2 (2015-07-01)
### Changed
- Documentation

## 1.0.1 (2015-07-01)
### Fixed
- Custom parser `babel-eslint`

## 1.0.0 (2015-07-01)
### Added
- Check project style in package.json `devDependencies`
- Support to custom parser `babel-eslint`
- Honor style settings
- Add keywords to package.json
- New dependencies
  - minimatch
  - pkg-config
  - find-root
  - babel-eslint

### Changed
- Documentation

## 0.3.0 (2015-06-10)
### Changed
- Dependencies major update
  - :arrow_up: standard@4.0.1
  - :arrow_up: semistandard@6.0.0

## 0.2.5 (2015-05-15)
### Fixed
- `path` is not defined
  - Related to a atom issue that was fixed in [v0.199.0](https://github.com/atom/atom/releases/tag/v0.199.0) release.
  > Fixed an issue where fs and path would be accidentally available as global variables


## 0.2.4 (2015-05-13)
### Removed
- `text.html.basic` from grammar scope

## 0.2.3 (2015-05-08)
### Fixed
- [Issue \#7](https://github.com/ricardofbarros/linter-js-standard/issues/7)

## 0.2.2 (2015-05-07)
### Fixed
- Deprecate call to AtomLinter API
  - replace key `activationEvents` to `activationCommands` in package.json

## 0.2.1 (2015-05-04)
### Changed
- Documentation

## 0.2.0 (2015-05-04)
### Added
- semistandard linter

## 0.1.5 (2015-04-19)
### Changed
- Change stream from `stderr` to `stdout`

## 0.1.4 (2015-05-05)
### Added
- `soruce.js.jsx` files to grammarScope

## 0.1.3 (2015-04-03)
### Changed
- Update dependencies
  - :arrow_up: standard@3.3.1

### Fixed
- cwd

## 0.1.2 (2015-04-01)
### Changed
- Documentation

## 0.1.1 (2015-04-01)
### Changed
- Documentation

## 0.1.0 (2015-03-13)
### Added
- standard linter
