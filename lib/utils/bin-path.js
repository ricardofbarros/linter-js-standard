// Dependencies
var path = require('path')

// Generate absolute paths
// to styles packages
function pathToModule (style) {
  return path.join(__dirname,
    '..',
    'node_modules',
    style,
    'bin',
    'cmd.js'
  )
}

module.exports = {
  standard: pathToModule('standard'),
  semiStandard: pathToModule('semistandard'),
  happiness: pathToModule('happiness'),
  noStyle: path.join(__dirname, 'no-style.js')
}
