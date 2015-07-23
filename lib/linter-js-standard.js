/* global atom */

// Dependencies
var helpers = require('atom-linter')
var linter = require('./utils/linter')

module.exports = function () {
  var self = this

  return {
    grammarScopes: self.scope,
    scope: 'file',
    lintOnFly: true,
    regex:
      '^(?<file>.*?\\..*?(?=:))' +
      ':(?<line>[0-9]+):(?<col>[0-9]+):' +
      '((?<message>.*?(?=\\())((?<error>.+undefined.*?)|(?<warning>.*?)))$',
    lint: function (textEditor) {
      var filePath = textEditor.getPath()
      var fileContent = textEditor.getText()
      var settings = self.cache.get(filePath)

      // Sane check
      if (!settings || !settings.args || !settings.styleObj) {
        atom.notifications.addWarning('Something went wrong internally.', {
          detail: 'No sweat, just re-open this file and this annoying warning shouldn\'t appear anymore',
          dismissable: true
         })

        return []
      }

      var args = settings.args.filter(function () { return true })
      var bindedLinter = linter.bind({
        regex: this.regex,
        file: {
          path: filePath,
          content: fileContent
        }
      })

      return helpers.execNode(settings.styleObj.execPath, args)
      .then(bindedLinter)
      .catch(function (err) {
        atom.notifications.addError('Couldn\'t execute linter bin', {
          detail: err.message,
          dismissable: true
        })
      })
    }
  }
}
