# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## 4.2.0 (2018-01-02)

The change in [v4.1.0](#410-2017-11-19) turned out to be backwards-incompatible. Therefore, v4.2.0 reverts this change. It will be added back in the next major release.

### Removed
- `filename` is no longer passed to `lintText()` ([`2d71917`](https://github.com/ricardofbarros/linter-js-standard/commit/2d719175a161ec28a2e5cc3822e81dc580e36d1a), [#214](https://github.com/ricardofbarros/linter-js-standard/issues/214))

## 4.1.0 (2017-11-19)

### Added
- `filename` is now passed to `lintText()` which is required by some linters and ESLint plugins ([`64e11fd`](https://github.com/ricardofbarros/linter-js-standard/commit/64e11fd2b71f3d43f029ca34c6f743fa2a876cef), [#213](https://github.com/ricardofbarros/linter-js-standard/pull/213), [#212](https://github.com/ricardofbarros/linter-js-standard/issues/212))

## 4.0.3 (2017-11-09)

### Fixed
- `envs` not being recognized in `package.json` ([`7f4cda6`](https://github.com/ricardofbarros/linter-js-standard/commit/7f4cda6c52350b23d152fea3c81d059fe92a69cf))
- `envs` not being recognized when specified as an object ([`0f1a5ab`](https://github.com/ricardofbarros/linter-js-standard/commit/0f1a5abdcbe1c5fcc8af0d89249d778098933b3d), [#209](https://github.com/ricardofbarros/linter-js-standard/issues/209))

## 4.0.2 (2017-09-16)

### Fixed
- Errors when the editor’s contents were modified while the linter was running ([`2d6af60`](https://github.com/ricardofbarros/linter-js-standard/commit/2d6af609103c690fa82c063604f49b14b48ac4cd), [`05f787f`](https://github.com/ricardofbarros/linter-js-standard/commit/05f787fc6a60ba62116900307e8109cb499d1aef), [#200](https://github.com/ricardofbarros/linter-js-standard/issues/200))
- Not ignoring whole directories when specified in `standard.ignore` in `package.json` (switched to [ignore](https://github.com/kaelzhang/node-ignore), [`f7481f5`](https://github.com/ricardofbarros/linter-js-standard/commit/f7481f5a89093ee983f2d11cc24dd9b6648533b0)) ([#206](https://github.com/ricardofbarros/linter-js-standard/issues/206))
- Other ignore-related fixes (see [Why another ignore?](https://github.com/kaelzhang/node-ignore/blob/3.3.5/README.md#why-another-ignore)) (switched to [ignore](https://github.com/kaelzhang/node-ignore), [`f7481f5`](https://github.com/ricardofbarros/linter-js-standard/commit/f7481f5a89093ee983f2d11cc24dd9b6648533b0))

## 4.0.1 (2017-09-09)

### Fixed
- ~~Errors when the editor’s contents were modified while the linter was running ([`2d6af60`](https://github.com/ricardofbarros/linter-js-standard/commit/2d6af609103c690fa82c063604f49b14b48ac4cd), [#200](https://github.com/ricardofbarros/linter-js-standard/issues/200))~~ Did not actually fix the issue, see [#200 (comment)](https://github.com/ricardofbarros/linter-js-standard/issues/200#issuecomment-328751526)

## 4.0.0 (2017-08-27)

### Added
- Link to ESLint rule documentation ([`77d728d`](https://github.com/ricardofbarros/linter-js-standard/commit/77d728de48200d3c6c5a73958898ac7df5fd46b8), [#181](https://github.com/ricardofbarros/linter-js-standard/pull/181))
- Setting to disable linter if the project already uses ESLint ([`7444f86`](https://github.com/ricardofbarros/linter-js-standard/commit/7444f86b6f738af5831b00949255432294d7981e), [#197](https://github.com/ricardofbarros/linter-js-standard/pull/197), [#194](https://github.com/ricardofbarros/linter-js-standard/issues/194))
- Show an error notification when installation of linter fails (updated [atom-package-deps](https://github.com/steelbrain/package-deps) to v4, [`6baf9d1`](https://github.com/ricardofbarros/linter-js-standard/commit/6baf9d1992acf48dc0440c4caa5553a5a36cf5e9))

### Changed
- Convert all warnings to errors (making linter-js-standard more consistent with standard itself) ([`9fc542c`](https://github.com/ricardofbarros/linter-js-standard/commit/9fc542c1449d1c4f57befee130227e0bb81f435b))
- Considerably improved range highlighting ([`24e76ae`](https://github.com/ricardofbarros/linter-js-standard/commit/24e76aed136435117489fe56519e76041ceb5952), [`e5d31dc`](https://github.com/ricardofbarros/linter-js-standard/commit/e5d31dc0b80139c0eee210bad517aa89394c12cb), [#74](https://github.com/ricardofbarros/linter-js-standard/issues/74))
- Slightly improved settings’ titles and descriptions ([`cd3b121`](https://github.com/ricardofbarros/linter-js-standard/commit/cd3b121ae02f8f6fe0d320266903c55b7265ff56), [`ac98c09`](https://github.com/ricardofbarros/linter-js-standard/commit/ac98c0996e750cd51e2a005475265d47ad3e4326))
- Prompt before installing the linter dependency (updated [atom-package-deps](https://github.com/steelbrain/package-deps) to v4, [`6baf9d1`](https://github.com/ricardofbarros/linter-js-standard/commit/6baf9d1992acf48dc0440c4caa5553a5a36cf5e9))
- Bumped minimum required Atom version to v1.14.0 ([`8522c0c`](https://github.com/ricardofbarros/linter-js-standard/commit/8522c0cf5cc63092ecfbf04d8692675467ffa2e7))
- Bumped required Linter version to v2 ([`be7b9e9`](https://github.com/ricardofbarros/linter-js-standard/commit/be7b9e97966d846baf2077b8e4eb6728517fac99), [`c7b2213`](https://github.com/ricardofbarros/linter-js-standard/commit/c7b22130fa3a95921dd33ef3248890bb55654114))
- Updated the bundled `standard` to v10 ([`53ede59`](https://github.com/ricardofbarros/linter-js-standard/commit/53ede59e34ab8223404ca8c95bd4568bc3c0ccc8))
- Updated the bundled `semistandard` to v11 ([`f610c1d`](https://github.com/ricardofbarros/linter-js-standard/commit/f610c1de8fce62dcfb13d0d96cc1ff479948072b))
- Updated the bundled `happiness` to v10 ([`ca413a2`](https://github.com/ricardofbarros/linter-js-standard/commit/ca413a2b106809830ccdc1de9195190c011a0cbb))

### Removed
- Support for [Esprima-FB](https://github.com/facebookarchive/esprima) ([`cc42217`](https://github.com/ricardofbarros/linter-js-standard/commit/cc4221746c1085232b18431f142a9638bc33e557))

### Fixed
- Issues when installing linter on newer Atom versions (updated [atom-package-deps](https://github.com/steelbrain/package-deps) to v4, [`6baf9d1`](https://github.com/ricardofbarros/linter-js-standard/commit/6baf9d1992acf48dc0440c4caa5553a5a36cf5e9)) ([#187](https://github.com/ricardofbarros/linter-js-standard/issues/187))
- Re-use last messages if linter throws an error (avoids “Linter Result must be an Array” error) ([`32e8b75`](https://github.com/ricardofbarros/linter-js-standard/commit/32e8b7507b53eb56abc71e999892de813dd560c2))

## 3.9.3 (2017-07-29)

### Fixed
- Linting with [standard-flow](https://github.com/Gozala/standard-flow) when it is not locally installed ([`edb3127`](https://github.com/ricardofbarros/linter-js-standard/commit/edb3127b2a199a41f9ddae8c56018322b7191eb8), [#166](https://github.com/ricardofbarros/linter-js-standard/issues/166))

## 3.9.2 (2017-07-28)

### Fixed
- Uncaught `TypeError` when switching back to a file which has been deleted in the background ([`3c9ad13`](https://github.com/ricardofbarros/linter-js-standard/commit/3c9ad13f88853f2f804e9c2f76de011871eb3e60), [#168](https://github.com/ricardofbarros/linter-js-standard/issues/168))
- “Something went wrong” warning upon opening a file for the first time after opening a new window ([`e51f30b`](https://github.com/ricardofbarros/linter-js-standard/commit/e51f30bedba39d028431f0ac71bb4f7aed6db5cf), [#179](https://github.com/ricardofbarros/linter-js-standard/issues/179))

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
