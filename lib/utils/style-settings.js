/* global atom */
var minimatch = require('minimatch')
var pkgConfig = require('pkg-config')
var fs = require('fs')

var styleOptions = [
  'standard',
  'semistandard',
  'happiness',
  'uber-standard'
]

function checkStyleSettings (filePath) {
  var settings = {}

  // Try to get the project's absolute path
  // NOTE: the project's path returned will be
  // from the nearest package.json (direction upward)
  try {
    var activeTextEditorPath = fs.realpathSync(atom.workspace.getActiveTextEditor().getPath())
    var projectPaths = atom.project.getPaths()
    var projectPath = projectPaths.find((p) => activeTextEditorPath.indexOf(fs.realpathSync(p)) >= 0)
    if (!projectPath) {
      return atom.notifications.addWarning('Could not get the file path.', {
        detail: 'No sweat, just save this file and this annoying warning shouldn\'t appear anymore',
        dismissable: true
      })
    }
  } catch (e) {
    console.error('Could not get project path', e)
    return
  }

  // Get relative path of the filePath
  var relativeFilePath = filePath.replace(projectPath, '').substring(1)

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
    if (styleSettings.ignore) {
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
      settings.env = {}
      Object.keys(styleSettings.env).forEach(function (key) {
        settings.env[key] = styleSettings.env[key]
      })
    }
  }

  return settings
}

module.exports = {
  defaultStyle: styleOptions[0],
  styleOptions: styleOptions,
  checkStyleSettings: checkStyleSettings
}
