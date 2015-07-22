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
      var args = settings.args.filter(function () { return true })

      return helpers.execNode(settings.styleObj.execPath, args).then(linter.bind({
        regex: this.regex,
        file: {
          path: filePath,
          content: fileContent
        }
      }))
    }
  }
}
