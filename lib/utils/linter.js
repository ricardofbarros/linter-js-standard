const getRuleURI = require('eslint-rule-documentation')
const generateRange = require('atom-linter').generateRange

function getRange (textEditor, line, col, endLine, endCol, src, lineStart) {
  line = typeof line !== 'undefined' ? parseInt((line - 1) + lineStart, 10) : 0
  col = typeof col !== 'undefined' ? parseInt(col - 1, 10) : 0
  endLine = typeof endLine !== 'undefined' ? parseInt((endLine - 1) + lineStart, 10) : null
  endCol = typeof endCol !== 'undefined' ? parseInt(endCol - 1, 10) : null
  src = src || ''
  src = src.substring(0, col)

  if (endLine && endCol) {
    return [[line, col], [endLine, endCol]]
  }

  try {
    return generateRange(textEditor, line, col)
  } catch (err) {
    // If generateRange() fails, the text editor’s contents have most likely
    // changed in the meantime. In that case, we simply return a one-character
    // range since the results won’t be used anyway.
    return [[line, col], [line, col + 1]]
  }
}

module.exports = function (err, output) {
  if (err) {
    return this.deferred.reject(err)
  }

  var self = this
  var config = atom.config.get('linter-js-standard')
  var msgs = output.results[0].messages
  var occurrences = []

  msgs.forEach(function (msg) {
    if (config.showEslintRules) {
      msg.message += ' (' + msg.ruleId + ')'
    }

    const linterMessage = {
      severity: msg.severity === 2 ? 'error' : 'warning',
      excerpt: msg.message,
      location: {
        file: self.filePath,
        position: getRange(
          self.textEditor,
          msg.line,
          msg.column,
          msg.endLine,
          msg.endColumn,
          msg.source,
          self.lineStart
        )
      }
    }

    if (msg.ruleId) {
      linterMessage.url = getRuleURI(msg.ruleId).url
    }

    occurrences.push(linterMessage)
  })

  return this.deferred.resolve(occurrences)
}
