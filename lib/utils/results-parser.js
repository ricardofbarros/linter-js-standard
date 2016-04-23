function getRange (line, col, src, lineStart) {
  line = typeof line !== 'undefined' ? parseInt((line - 1) + lineStart, 10) : 0
  col = typeof col !== 'undefined' ? parseInt(col - 1, 10) : 0
  src = src || ''
  src = src.substring(0, col)

  return [[line, col - src.trim().length], [line, col]]
}

module.exports = function (err, output) {
  if (err) {
    return this.deferred.reject(err)
  }

  var self = this
  var msgs = output.results[0].messages
  var occurrences = []

  msgs.forEach(function (msg) {
    if (self.config.showEslintRules) {
      msg.message += ' (' + msg.ruleId + ')'
    }

    occurrences.push({
      type: msg.fatal ? 'Error' : 'Warning',
      text: msg.message,
      filePath: self.filePath,
      range: getRange(msg.line, msg.column, msg.source, self.lineStart)
    })
  })

  return this.deferred.resolve(occurrences)
}
