linterPath = atom.packages.getLoadedPackage("linter").path
Linter = require "#{linterPath}/lib/linter"
{findFile, warn} = require "#{linterPath}/lib/utils"
fs = require 'fs'
path = require 'path'

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

    standardPath = path.join __dirname,
      '..',
      'node_modules',
      'standard',
      'bin'
    semiStandardPath = path.join __dirname,
      '..',
      'node_modules',
      'semistandard',
      'bin'

    if config.codeStyleDevDependencies
      projectPath = atom.project.getPaths()
      filePath = @filePath

      projectPath = projectPath.filter (path) ->
        regex = new RegExp('^' + path)
        return regex.test(filePath)

      projectPath = projectPath[0]

    else
      if config.style == 'standard'
        @executablePath = standardPath
      else
        @linterName = 'js-semistandard'
        @executablePath = semiStandardPath

      @executablePath += '/cmd.js'

    if !fs.existsSync @executablePath
      throw new Error 'Standard or Semistandard wasn\'t
        installed properly with linter-js-standard,
        please re-install the plugin.'


  formatMessage: (match) ->
    if !match.error && !match.warning
      warn "Regex does not match lint output", match

    ## Dunno why I need to do this
    ## but if I dont it doesnt show a message
    "#{match.message}"

destroy: ->
  atom.config.unobserve 'linter-js-standard.jsStandardExecutablePath'

module.exports = LinterJsStandard
