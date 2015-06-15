path = require 'path'

module.exports =
  config:
    style:
      type: 'string'
      default: 'standard'
      enum: ['standard', 'semi-standard']
    codeStyleDevDependencies:
      type: 'boolean'
      description: 'Check code style on devDependencies'
      default: false

  activate: ->
    console.log 'linter-js-standard activated'
