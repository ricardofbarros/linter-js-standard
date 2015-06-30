linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
{findFile, warn} = require "#{linterPath}/lib/utils"
fs = require 'fs'
path = require 'path'
pkgConfig = require 'pkg-config'
binPath = require './bin-path.coffee'
minimatch = require 'minimatch'

class LinterJsStandard extends Linter

  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['source.js', 'source.js.jsx', 'source.js.jquery']

  # A string, list, tuple or callable that returns a string, list or tuple,
  # containing the command line (with arguments) used to lint.
  cmd: ['cmd', '--verbose']

  linterName: 'js-standard'

  errorStream: 'stdout'

  # A regex pattern used to extract information from the executable's output.
  regex:
    '^(?<file>.*?\\..*?(?=:))' +
    ':(?<line>[0-9]+):(?<col>[0-9]+):' +
    '((?<message>.*?(?=\\())((?<error>.+undefined.*?)|(?<warning>.*?)))$'

  regexFlags: 'gm'

  isNodeExecutable: yes

  constructor: (editor) ->
    super(editor)

    file = editor?.buffer.file
    @filePath = file?.path

    if !@filePath
      throw new Error 'Couldn\'t get file path'

    atom.config.observe 'linter-js-standard',
      @formatShellCmd

    @cwd = null

  formatShellCmd: (config) =>
    ## If config isn't defined return early,
    ## try next time
    if typeof config == 'undefined'
      return

    if config.codeStyleDevDependencies
      devDeps = pkgConfig(null, { cwd: @filePath, root: 'devDependencies' })
      @executablePath = @formatDevDepsExecPath(devDeps)
    else
      if config.style == 'standard'
        @executablePath = binPath.standard
      else
        @linterName = 'js-semistandard'
        @executablePath = binPath.semiStandard

    # Check if executablePath is defined,
    # if isn't defined it means the file
    # should not be linted
    if @executablePath
      @executablePath += '/cmd.js'

      if !fs.existsSync @executablePath
        throw new Error 'Standard or Semistandard wasn\'t
          installed properly with linter-js-standard,
          please re-install the plugin.'

  formatDevDepsExecPath: (devDeps) ->
    execPath = false

    if devDeps and (devDeps.standard or devDeps.semistandard)
      if devDeps.standard
        # Set path to standard
        # NOTE: this variable can be changed
        # along the logic flow
        execPath = standardPath

        # Get standard property from package.json
        options = { cwd: @filePath, root: 'standard' }
        standardOpts = pkgConfig(null, options) or {}

        # If ignore glob patterns are present
        if standardOpts.ignore
          relativeFilePath = '' ## TODO get relative file path
          ignoreGlobPatterns = []
          ignoreGlobPatterns.concat standardOpts.ignore

          testGlobPatterns = ignoreGlobPatterns.some (pattern) ->
            minimatch relativeFilePath pattern

          if testGlobPatterns
            execPath = false

        # If parser is present
        if standardOpts.parser
          @cmd.push '--parser', standardOpts.parser

      else
        @linterName = 'js-semistandard'
        execPath = semiStandardPath

    execPath

  formatMessage: (match) ->
    if !match.error && !match.warning
      warn "Regex does not match lint output", match

    ## Return error/warning message
    "#{match.message}"

destroy: ->
  atom.config.unobserve 'linter-js-standard.jsStandardExecutablePath'

module.exports = LinterJsStandard
