/* global atom */
// Dependencies
var helpers = require('atom-linter')
var linter = require('./util/linter')
var selectStyle = require('./util/select-style')

module.exports = function () {
  return {
    grammarScopes: ['source.js', 'source.js.jsx', 'source.js.jquery'],
    scope: 'file',
    lintOnFly: true,
    regex:
      '^(?<file>.*?\\..*?(?=:))' +
      ':(?<line>[0-9]+):(?<col>[0-9]+):' +
      '((?<message>.*?(?=\\())((?<error>.+undefined.*?)|(?<warning>.*?)))$',
    lint: function (textEditor) {
      var config = atom.config.get('linter-js-standard')
      var filePath = textEditor.getPath()
      var fileContent = textEditor.getText()
      var bin = selectStyle(config)

      return helpers.execNode(bin, ['--verbose', filePath]).then(linter.bind({
        regex: this.regex,
        file: {
          path: filePath,
          content: fileContent
        }
      }))
    }
  }
}
