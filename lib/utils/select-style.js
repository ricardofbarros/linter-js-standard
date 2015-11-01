// Dependencies
var allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction
var pickStandard = function (style) {
  return allowUnsafeNewFunction(function () {
    switch (style) {
      case 'standard':
        return require('standard')
      case 'happiness':
        return require('happiness')
      case 'uber-standard':
        return require('uber-standard')
      default:
        return require('semistandard')
    }
  })
}

var pkgConfig = require('pkg-config')
var intersection = require('lodash.intersection')

function getStyleThroughDevDeps (filePath) {
  // This will get the devDependencies
  // from the nearest package.json
  var options = { cwd: filePath, root: 'devDependencies', cache: false }
  var devDeps = pkgConfig(null, options)

  // Check if there are linters defined in
  // package.json devDependencies
  var knownLinters = ['standard', 'semistandard', 'happiness', 'uber-standard']
  var foundLinters = intersection(Object.keys(devDeps), knownLinters)
  var hasKnownLinter = Boolean(foundLinters.length)
  if (devDeps && hasKnownLinter) {
    // standard style
    if (devDeps.standard) {
      return pickStandard('standard')
    }

    // happiness style
    if (devDeps.happiness) {
      return pickStandard('happiness')
    }

    // uber-standard
    if (devDeps['uber-standard']) {
      return pickStandard('uber-standard')
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

  function getLinterFromStyle (style) {
    if (style === 'standard') {
      return pickStandard('standard')
    }
    if (style === 'happiness') {
      return pickStandard('happiness')
    }
    if (style === 'uber-standard') {
      return pickStandard('uber-standard')
    }
    return pickStandard('semistandard')
  }

  // fallback to style select value to decide which style
  // we should use
  return getLinterFromStyle(config.style)
}
