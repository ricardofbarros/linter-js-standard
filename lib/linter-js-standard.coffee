linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
{findFile, warn} = require "#{linterPath}/lib/utils"
fs = require 'fs'

class LinterJsStandard extends Linter

  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['source.js', 'source.js.jsx', 'source.js.jquery', 'text.html.basic']

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: ['cmd', '--verbose']

  linterName: 'js-standard'

  errorStream: 'stderr'

  # A regex pattern used to extract information from the executable's output.
  regex:
    '^((?!.*?eslint\/undefined.*?)' +
    '((?<file>.*?\\..*?(?=:))' +
    '(:(?<line>[0-9]+):(?<col>[0-9]+):'+
    '(?<message>.+)((?<error>\\(jscs\/parseError\\))|(?<warning>\\(.*\\))))))$'

  regexFlags: 'gm'

  isNodeExecutable: yes

  constructor: (editor) ->
    super(editor)

    atom.config.observe 'linter-js-standard.jsStandardExecutablePath',
      @formatShellCmd

    @cwd = null

  formatShellCmd: (standardPath) =>

    ## If standard path
    # isn't defined return early,
    # try next time
    if typeof standardPath == 'undefined'
      return

    executionPath =
      standardPath + '/cmd.js'

    if fs.existsSync executionPath
      @executablePath = "#{standardPath}"
    else
      throw new Error 'Standard wasn\'t installed properly with linter-js-standard, please re-install the plugin.'


  formatMessage: (match) ->
    type = if match.error
      "E"
    else if match.warning
      "W"
    else
      warn "Regex does not match lint output", match
      ""

    "#{match.message} (#{type})"

destroy: ->
  atom.config.unobserve 'linter-js-standard.jsStandardExecutablePath'

module.exports = LinterJsStandard
