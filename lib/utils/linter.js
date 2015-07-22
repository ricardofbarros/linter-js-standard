// Dependencies
var XRegExp = require('xregexp').XRegExp

function getRange (content, match, baseReduction) {
  var colEnd, colStart, line

  line = 0
  if (match.line) {
    line = parseInt(match.line - baseReduction, 10)
  }

  colStart = 0
  if (match.col) {
    colStart = parseInt(match.col - baseReduction, 10)
  }

  colEnd = colStart + 1
  if (content instanceof Array && content.length > 0) {
    colEnd = content[line].length
  }

  return [[line, colStart], [line, colEnd]]
}

module.exports = function (output) {
  var self = this
  output = output.split(/\r?\n/)
  var content = this.file.content.split(/\r?\n/)
  var regex = new XRegExp(this.regex)
  var occurrences = []

  output.forEach(function (line) {
    var match = XRegExp.exec(line, regex)

    var saneCheck = (!match || (!match.error && !match.warning) || !match.file || !match.message)
    if (saneCheck) {
      return
    }

    occurrences.push({
      type: match.error ? 'Error' : 'Warning',
      text: match.message,
      filePath: self.file.path,
      range: getRange(content, match, 1)
    })
  })

  return occurrences
}
