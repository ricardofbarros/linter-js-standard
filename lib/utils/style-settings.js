// Dependencies
var findRoot = require('find-root')
var minimatch = require('minimatch')
var pkgConfig = require('pkg-config')
var binPath = require('./bin-path')

module.exports = function checkStyleSettings (filePath) {
  // Default value
  var styleSettings = false

  // Try to get the project's absolute path
  // NOTE: the project's path returned will be
  // from the nearest package.json (direction upward)
  try {
    var projectPath = findRoot(filePath)
  } catch (e) {
    return
  }

  // Get relative path of the filePath
  var relativeFilePath = filePath.replace(projectPath, '').substring(1)

  var options = { cwd: filePath, root: 'standard', cache: false }

  switch (this.styleObj.name) {
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
      throw new Error('Something went wrong. Unknown linter "' + this.styleObj.name + '"')
  }

  if (styleSettings) {
    // Check parser
    if (styleSettings.parser) {
      this.args.push('--parser', styleSettings.parser)
    }

    // If ignore glob patterns are present
    if (styleSettings.ignore) {
      var ignoreGlobPatterns = []
      ignoreGlobPatterns = ignoreGlobPatterns.concat(styleSettings.ignore)

      ignoreGlobPatterns = ignoreGlobPatterns.some(function (pattern) {
        return minimatch(relativeFilePath, pattern)
      })

      // If found something return false
      // telling linter-js-standard that this
      // file should be ignored because
      // the glob pattern was matched
      if (ignoreGlobPatterns) {
        this.styleObj = {
          name: 'no-style',
          execPath: binPath.noStyle
        }
      }
    }

    // global variables option
    if (styleSettings.global) {
      var globalArr = []

      globalArr = globalArr.concat(styleSettings.global)

      globalArr.forEach(function (item) {
        this.args.push('--global', item)
      }.bind(this))
    }
  }
}
