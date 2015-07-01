linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
{findFile, warn} = require "#{linterPath}/lib/utils"
fs = require 'fs'
path = require 'path'
pkgConfig = require 'pkg-config'
binPath = require './bin-path.coffee'
minimatch = require 'minimatch'
findRoot = require 'find-root'

class LinterJsStandard extends Linter

  # The syntax that the linter handles. May be a string or
  # list/tuple of strings. Names should be all lowercase.
  @syntax: ['source.js', 'source.js.jsx', 'source.js.jquery']

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

    # A string, list, tuple or callable that returns a string, list or tuple,
    # containing the command line (with arguments) used to lint.
    @cmd = ['cmd', '--verbose']

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

    styleSettings =
      standard: pkgConfig(null, { cwd: @filePath, root: 'standard' })
      semistandard: pkgConfig(null, { cwd: @filePath, root: 'semistandard' })

    # see if setting checkStyleDevDependencies is true
    # if not fallback to style value to decide which bin
    # we should use
    if config.checkStyleDevDependencies
      devDeps = pkgConfig(null, { cwd: @filePath, root: 'devDependencies' })
      @executablePath = @formatDevDepsExecPath(devDeps, styleSettings)
    else
      if config.style == 'standard'
        @linterName = 'js-standard'
        @executablePath = binPath.standard
      else
        @linterName = 'js-semistandard'
        @executablePath = binPath.semiStandard

    # see if setting honorStyleSettings is true
    if config.honorStyleSettings
      # If linter is standard and parser is present
      # else if linter is semiStandard and parser is present
      if @linterName == 'js-standard' and
      styleSettings.standard and
      styleSettings.standard.parser
        @cmd.push '--parser', styleSettings.standard.parser
      else if @linterName == 'js-standard' and
      styleSettings.semistandard and
      styleSettings.semistandard.parser
        @cmd.push '--parser', styleSettings.semistandard.parser

    # Check if executablePath is defined,
    # if isn't defined it means the file
    # should not be linted
    if @executablePath
      @executablePath += '/cmd.js'

      if !fs.existsSync @executablePath
        throw new Error 'Standard or Semistandard wasn\'t
          installed properly with linter-js-standard,
          please re-install the plugin.'
    else
      # No style path!
      @executablePath = path.resolve(__dirname, 'no-style.js')

  formatDevDepsExecPath: (devDeps, styleSettings) ->
    # Default value
    execPath = false

    # This is the absolute path
    # of the project path relative
    # to the package.json
    projectPath = findRoot(@filePath)

    # Get relative path of the filePath
    relativeFilePath = @filePath.replace(projectPath, '')
    relativeFilePath = relativeFilePath.substring(1)

    if devDeps and (devDeps.standard or devDeps.semistandard)
      if devDeps.standard
        # Set execPath to standard bin
        # and change linter name
        # NOTE: this variable can be changed
        # along the logic flow
        @linterName = 'js-standard'
        execPath = binPath.standard

        # If ignore glob patterns are present
        if styleSettings.standard.ignore
          ignoreGlobPatterns = []
          ignoreGlobPatterns = ignoreGlobPatterns.concat styleSettings.standard.ignore

          testGlobPatterns = ignoreGlobPatterns.some (pattern) ->
            return minimatch(relativeFilePath, pattern)

          if testGlobPatterns
            execPath = false

      else
        # Set execPath to semistandard bin
        # and change linter name
        # NOTE: the execPath variable can be changed
        # along the logic flow
        @linterName = 'js-semistandard'
        execPath = binPath.semiStandard

        # If ignore glob patterns are present
        if styleSettings.semistandard.ignore
          ignoreGlobPatterns = []
          ignoreGlobPatterns = ignoreGlobPatterns.concat styleSettings.semistandard.ignore

          testGlobPatterns = ignoreGlobPatterns.some (pattern) ->
            return minimatch(relativeFilePath, pattern)

          if testGlobPatterns
            execPath = false

    execPath

  formatMessage: (match) ->
    if !match.error && !match.warning
      warn "Regex does not match lint output", match

    ## Return error/warning message
    "#{match.message}"

destroy: ->
  atom.config.unobserve 'linter-js-standard.jsStandardExecutablePath'

module.exports = LinterJsStandard
