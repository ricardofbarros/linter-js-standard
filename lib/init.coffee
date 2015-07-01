path = require 'path'

module.exports =
  config:
    style:
      type: 'string'
      default: 'standard'
      enum: ['standard', 'semi-standard']
    codeStyleDevDependencies:
      type: 'boolean'
      description: 'Check code style on package.json devDependencies'
      default: false
    honorStandardSettings:
      type: 'boolean'
      description: 'Honor standard/semistandard settings on pacakge.json'
      defaukt: true

  activate: ->
    console.log 'linter-js-standard activated'
