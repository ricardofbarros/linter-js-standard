// Dependencies
var allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction
var pickStandard = function (style) {
  return allowUnsafeNewFunction(function () {
    switch (style) {
      case 'standard':
        return require('standard')
      case 'happiness':
        return require('happiness')
      default:
        return require('semistandard')
    }
  })
}

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
      return pickStandard('standard')
    }

    // happiness style
    if (devDeps.happiness) {
      return pickStandard('happiness')
    }

    // semistandard style
    return pickStandard('semistandard')
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
    linter = pickStandard('standard')
  } else if (config.style === 'happiness') {
    linter = pickStandard('happiness')
  } else {
    linter = pickStandard('semistandard')
  }

  return linter
}
