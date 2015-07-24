# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
