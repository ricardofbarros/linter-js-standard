linter-js-standard
=========================

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface for error/warning messages from [standard](https://github.com/feross/standard) or [semistandard](https://github.com/Flet/semistandard).

![demo](https://cloud.githubusercontent.com/assets/6867996/8457085/4bd7575e-2007-11e5-9762-e3f942b78232.gif)

## Installation
Linter package must be installed in order to use this plugin. If Linter is not installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

### Plugin installation
```
$ apm install linter-js-standard
```

## Features
- Support `standard` and `semistandard` styles.
- Support ignore glob patterns in package.json.
- Support custom parsers in package.json.

Custom parsers currently supported:
- esprima
- esprima-fb
- babel-eslint

> Note: If a custom parser is missing from this list please make a PR by adding the missing parser to package.json dependencies.

## Settings

### checkStyleDevDependencies (default: false)
Check code style in package.json `devDependencies`. If a valid style is not found it won't lint.

> Note: This will use the nearest package.json.

### honorStyleSettings (default: true)
Honors style settings defined in package.json.

Current style settings supported:
- `ignore`
- `parser`

> Note: This will use the nearest package.json.

### style (default: standard)
Switch between standard and semistandard styles.
If `checkStyleDevDependencies` is true this setting will be **ignored**.

## License
MIT
