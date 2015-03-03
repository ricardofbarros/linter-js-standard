linter-js-standard
=========================

This linter plugin for [Linter](https://github.com/AtomLinter/Linter) provides an interface for error/warning messages from [standard](https://github.com/feross/standard).

## Installation
Linter package must be installed in order to use this plugin. If Linter is not installed, please follow the instructions [here](https://github.com/AtomLinter/Linter).

### Plugin installation
```
$ apm install linter-js-standard
```

## Known issues

### OSX
If you have your environment variables in `.bash_profile` or `.bashrc` like me and you launch Atom from the GUI it doesn't load environment variables, unless you launch it from the terminal. This is a known [issue](https://github.com/atom/atom-shell/issues/550).

A workaround for this issue is to edit Atom init script and set "dynamically" `$PATH` variable.
To do so go: `Atom` -> `Open Your Init Script` and paste the following code:

```coffeescript
sys = require('sys')
exec = require('child_process').exec;

exec "source ~/.bash_profile && echo $PATH", (err, stdout) ->
  process.env.PATH = stdout.replace '\n', ''
```
