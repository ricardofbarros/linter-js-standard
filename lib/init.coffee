path = require 'path'

module.exports =
  config:
    style:
      type: 'string'
      default: 'standard'
      enum: ['standard', 'semi-standard', 'happiness']
    checkStyleDevDependencies:
      type: 'boolean'
      description: 'Check code style on package.json devDependencies'
      default: false
    honorStyleSettings:
      type: 'boolean'
      description: 'Honor standard/semistandard settings on pacakge.json'
      default: true

  activate: ->
    console.log 'linter-js-standard activated'
