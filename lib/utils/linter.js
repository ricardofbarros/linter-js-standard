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

module.exports = function (err, output) {
  if (err) {
    return this.deferred.reject(err)
  }

  var self = this
  var content = this.file.content.split(/\r?\n/)
  var msgs = output.results[0].messages
  var occurrences = []

  msgs.forEach(function (msg) {
    occurrences.push({
      type: msg.fatal ? 'Error' : 'Warning',
      text: msg.message,
      filePath: self.file.path,
      range: getRange(content, {line: msg.line, col: msg.column}, 1)
    })
  })

  return this.deferred.resolve(occurrences)
}
