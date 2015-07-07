path = require 'path'

module.exports =
  standard: path.join __dirname,
    '..',
    'node_modules',
    'standard',
    'bin'

  semiStandard: path.join __dirname,
    '..',
    'node_modules',
    'semistandard',
    'bin'

  happiness: path.join __dirname,
    '..',
    'node_modules',
    'happiness',
    'bin'
