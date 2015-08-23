// Dependencies
var allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction
var standard = allowUnsafeNewFunction(function () {
  return require('standard')
})
var semistandard = allowUnsafeNewFunction(function () {
  return require('semistandard')
})
var happiness = allowUnsafeNewFunction(function () {
  return require('happiness')
})
var fs = require('fs')
var pkgConfig = require('pkg-config')

function getStyleThroughDevDeps (filePath) {
  // This will get the devDependencies
  // from the nearest package.json
  var options = { cwd: filePath, root: 'devDependencies', cache: false }
  var devDeps = pkgConfig(null, options)

  // Check if there are linters defined in
  // package.json devDependencies
  if (devDeps && (devDeps.standard || devDeps.semistandard || devDeps.happiness)) {
    // standard style
    if (devDeps.standard) {
      return standard
    }

    // happiness style
    if (devDeps.happiness) {
      return happiness
    }

    // semistandard style
    return semistandard
  }

  // no style
  return {
    cmd: 'no-style'
  }
}

module.exports = function selectStyle (config, filePath) {
  // see if setting 'checkStyleDevDependencies' is true
  // if true get style from the package.json
  if (config.checkStyleDevDependencies) {
    return getStyleThroughDevDeps(filePath)
  }

  // fallback to style select value to decide which style
  // we should use
  var linter
  if (config.style === 'standard') {
    linter = standard
  } else if (config.style === 'happiness') {
    linter = happiness
  } else {
    linter = semistandard
  }

  return linter
}
