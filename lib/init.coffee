path = require 'path'

module.exports =
  config:
    style:
      type: 'string'
      default: 'standard'
      enum: ['standard', 'semi-standard']

  activate: ->
    console.log 'linter-js-standard activatedd'
