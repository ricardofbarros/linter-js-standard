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

    # see if setting checkStyleDevDependencies is true
    # if not fallback to style value to decide which bin
    # we should use
    if config.checkStyleDevDependencies
      @checkDevDeps()
    else
      if config.style == 'standard'
        @linterName = 'js-standard'
        @executablePath = binPath.standard
      else
        @linterName = 'js-semistandard'
        @executablePath = binPath.semiStandard

    # see if setting honorStyleSettings is true
    if config.honorStyleSettings
      @checkStyleSettings()

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

  checkDevDeps: () ->
    # This get devDependencies property
    # from the nearest package.json
    devDeps = pkgConfig(null, { cwd: @filePath, root: 'devDependencies' })

    if devDeps and (devDeps.standard or devDeps.semistandard)
      if devDeps.standard
        # Set execPath to standard bin
        # and change linter name
        @linterName = 'js-standard'
        @executablePath = binPath.standard

      else
        # Set execPath to semistandard bin
        # and change linter name
        @linterName = 'js-semistandard'
        @executablePath = binPath.semiStandard
    else
      @executablePath = false

  checkStyleSettings: () ->
    # Default value
    styleSettings = false

    # This is the absolute path
    # of the project path relative
    # to the package.json
    try
      projectPath = findRoot(@filePath)
    catch
      return

    # Get relative path of the filePath
    relativeFilePath = @filePath.replace(projectPath, '')
    relativeFilePath = relativeFilePath.substring(1)

    if @linterName == 'js-standard'
      styleSettings = pkgConfig(null, { cwd: @filePath, root: 'standard' })
    else if @linterName == 'js-semistandard'
      styleSettings = pkgConfig(null, { cwd: @filePath, root: 'semistandard' })

    if styleSettings
      # Check parser
      if styleSettings.parser
        @cmd.push '--parser', styleSettings.parser

      # If ignore glob patterns are present
      if styleSettings.ignore
        ignoreGlobPatterns = []
        ignoreGlobPatterns = ignoreGlobPatterns.concat styleSettings.ignore

        testGlobPatterns = ignoreGlobPatterns.some (pattern) ->
          return minimatch(relativeFilePath, pattern)

        if testGlobPatterns
          @executablePath = false

  formatMessage: (match) ->
    if !match.error && !match.warning
      warn "Regex does not match lint output", match

    ## Return error/warning message
    "#{match.message}"

destroy: ->
  atom.config.unobserve 'linter-js-standard.jsStandardExecutablePath'

module.exports = LinterJsStandard
