/* global atom */
var minimatch = require('minimatch')
var pkgConfig = require('pkg-config')
var fs = require('fs')

var styleOptions = [
  'standard',
  'semistandard',
  'standard-flow',
  'happiness',
  'uber-standard'
]

function checkStyleSettings (filePath) {
  var settings = {}
  var projectPath = null

  // Try to get the project's absolute path
  // NOTE: the project's path returned will be
  // from the nearest package.json (direction upward)
  try {
    var activePane = atom.workspace.getActiveTextEditor()

    if (!activePane || !activePane.getPath) {
      settings.style = 'no-style'
      return settings
    }

    var activePanePath = activePane.getPath()

    if (!activePanePath) {
      settings.style = 'no-style'
      return settings
    }

    try {
      activePanePath = fs.realpathSync(activePanePath)
    } catch (e) {
      if (e.code !== 'ENOENT') throw e
    }

    var projectPaths = atom.project.getPaths()

    projectPath = projectPaths.find((p) => activePanePath.indexOf(fs.realpathSync(p)) >= 0)
  } catch (e) {
    console.error('Could not get project path', e)
    return
  }

  var relativeFilePath = false

  if (projectPath) {
    // Get relative path of the filePath
    relativeFilePath = filePath.replace(projectPath, '').substring(1)
  }

  // Get options for standard
  var styleSettings

  function pkgOpts (root) { return { cwd: filePath, root: root, cache: false } }

  styleOptions.forEach(function (style) {
    var config = pkgConfig(null, pkgOpts(style))
    if (config && !styleSettings) styleSettings = config
  })

  if (styleSettings) {
    // Check parser
    if (styleSettings.parser) {
      settings.parser = styleSettings.parser
    }

    // Check for alternate linter
    if (styleSettings.linter) {
      settings.style = styleSettings.linter
    }

    // If ignore glob patterns are present
    if (styleSettings.ignore && relativeFilePath) {
      var ignoreGlobPatterns = []
      ignoreGlobPatterns = ignoreGlobPatterns.concat(styleSettings.ignore)

      ignoreGlobPatterns = ignoreGlobPatterns.some(function (pattern) {
        return minimatch(relativeFilePath, pattern)
      })

      // If a glob pattern was matched, do not lint the file
      if (ignoreGlobPatterns) {
        settings.style = 'no-style'
        return settings
      }
    }

    styleSettings.global = styleSettings.global || styleSettings.globals

    // global variables option
    if (styleSettings.global) {
      settings.globals = [].concat(styleSettings.global || [])
    }

    if (styleSettings.env) {
      settings.env = [].concat(styleSettings.env || [])
    }
  }

  return settings
}

module.exports = {
  defaultStyle: styleOptions[0],
  styleOptions: styleOptions,
  checkStyleSettings: checkStyleSettings
}
