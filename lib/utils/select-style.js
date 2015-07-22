// Dependencies
var binPath = require('./bin-path')
var fs = require('fs')
var pkgConfig = require('pkg-config')

function checkDevDeps (filePath) {
  // This get devDependencies property
  // from the nearest package.json
  var options = { cwd: filePath, root: 'devDependencies', cache: false }
  var devDeps = pkgConfig(null, options)

  // Check if there are linters defined in
  // package.json devDependencies
  if (devDeps && (devDeps.standard || devDeps.semistandard || devDeps.happiness)) {
    // standard style
    if (devDeps.standard) {
      return {
        linterName: 'standard',
        executablePath: binPath.standard
      }
    }

    // happiness style
    if (devDeps.happiness) {
      return {
        linterName: 'happiness',
        executablePath: binPath.happiness
      }
    }

    // semistandard style
    return {
      linterName: 'semistandard',
      executablePath: binPath.semiStandard
    }
  }

  // fallback
  return {
    linterName: false,
    executablePath: false
  }
}

module.exports = function selectStyle (config, filePath) {
  // Default values
  var linterName = false
  var executablePath = false

  // see if setting 'checkStyleDevDependencies' is true
  // if not fallback to style value to decide which bin
  // we should use
  if (config.checkStyleDevDependencies) {
    var devDeps = checkDevDeps(filePath)

    linterName = devDeps.linterName ? devDeps.linterName : linterName
    executablePath = devDeps.executablePath ? devDeps.executablePath : executablePath
  } else {
    if (config.style === 'standard') {
      linterName = 'standard'
      executablePath = binPath.standard
    } else if (config.style === 'happiness') {
      linterName = 'happiness'
      executablePath = binPath.happiness
    } else {
      linterName = 'semistandard'
      executablePath = binPath.semiStandard
    }
  }

  // Sane check
  if (executablePath && !fs.existsSync(executablePath)) {
    throw new Error('Standard or Semistandard wasn\'t ' +
      'installed properly with linter-js-standard, ' +
      'please re-install the plugin.')
  }

  return {
    name: linterName,
    execPath: executablePath
  }
}
