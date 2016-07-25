/* global atom */
// Dependencies
var minimatch = require('minimatch')
var pkgConfig = require('pkg-config')

module.exports = function checkStyleSettings (filePath) {
  // Default value
  var styleSettings = false

  // Try to get the project's absolute path
  // NOTE: the project's path returned will be
  // from the nearest package.json (direction upward)
  try {
    var projectPath
    var projectPaths = atom.project.getPaths()
    var projectPathCount = projectPaths.length
    for (var i = 0; i < projectPathCount; i++) {
      if (atom.workspace.getActiveTextEditor().getPath().indexOf(projectPaths[i]) >= 0) {
        projectPath = projectPaths[i]
      }
    }
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

  var options = { cwd: filePath, root: 'standard', cache: false }

  switch (this.style.cmd) {
    case 'standard':
      styleSettings = pkgConfig(null, options)
      break

    case 'semistandard':
      options.root = 'semistandard'
      styleSettings = pkgConfig(null, options)
      break

    case 'happiness':
      options.root = 'happiness'
      styleSettings = pkgConfig(null, options)
      break

    default:
      throw new Error('Something went wrong.')
  }

  if (styleSettings) {
    // Check parser
    if (styleSettings.parser) {
      this.args.parser = styleSettings.parser
    }

    // If ignore glob patterns are present
    if (styleSettings.ignore) {
      var ignoreGlobPatterns = []
      ignoreGlobPatterns = ignoreGlobPatterns.concat(styleSettings.ignore)

      ignoreGlobPatterns = ignoreGlobPatterns.some(function (pattern) {
        return minimatch(relativeFilePath, pattern)
      })

      // If a glob pattern was matched unset the
      // linter, the file needs to be ignored
      if (ignoreGlobPatterns) {
        this.style.cmd = 'no-style'
        return
      }
    }

    styleSettings.global = styleSettings.global || styleSettings.globals

    // global variables option
    if (styleSettings.global) {
      var globalArr = []

      globalArr = globalArr.concat(styleSettings.global)

      globalArr.forEach(function (item) {
        if (!this.args.globals) {
          this.args.globals = []
        }

        this.args.globals.push(item)
      }.bind(this))
    }

    if (styleSettings.env) {
      for (let envKey in styleSettings.env) {
        if (!styleSettings.env.hasOwnProperty(envKey)) {
          continue
        }
        if (!this.args.env) {
          this.args.env = {}
        }
        this.args.env[envKey] = styleSettings.env[envKey]
      }
    }
  }
}
