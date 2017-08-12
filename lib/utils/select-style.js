var allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction
var pkgConfig = require('pkg-config')
var detectEslintConfig = require('detect-eslint-config')
var dirname = require('path').dirname
var styleSettings = require('./style-settings')

function noStyle () {
  return { cmd: 'no-style' }
}

function requireWithLocalOverride (moduleName, dir) {
  try {
    return module.constructor._load(moduleName, {
      paths: module.constructor._nodeModulePaths(dir)
    })
  } catch (err) {
    return require(moduleName)
  }
}

var pickStandard = function (style, filePath) {
  var dir = dirname(filePath)
  return allowUnsafeNewFunction(function () {
    return requireWithLocalOverride(style, dir)
  })
}

function getStyleThroughDevDeps (filePath, style) {
  // Get the dependencies from the nearest package.json
  function pkgOpts (root) { return { cwd: filePath, root: root, cache: false } }
  var devDeps = pkgConfig(null, pkgOpts('devDependencies')) || {}
  var prodDeps = pkgConfig(null, pkgOpts('dependencies')) || {}

  var options = styleSettings.styleOptions

  if (style === 'no-style') {
    return noStyle()
  }

  // Include style if not one of known linters
  if (options.indexOf(style) === -1) options.push(style)

  // If one of the known linters is found as a dependency, use it
  var useLinter = options.filter(function (linter) {
    return devDeps[linter] || prodDeps[linter]
  })[0]

  return useLinter ? pickStandard(useLinter, filePath) : noStyle()
}

module.exports = function selectStyle (filePath, options) {
  // Return early if the project uses ESLint
  if (options.checkForEslintConfig && detectEslintConfig(filePath)) {
    return noStyle()
  }

  // See if it should get style from the package.json
  if (options.checkStyleDevDependencies) {
    return getStyleThroughDevDeps(filePath, options.style)
  }

  // Fallback to style value to decide which style we should use
  var shouldStyle = options.style && options.style !== 'no-style'
  return shouldStyle ? pickStandard(options.style, filePath) : noStyle()
}
