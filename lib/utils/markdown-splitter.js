module.exports = function (fileContent) {
  var startFencedCodeRegex = /(```js[ ]*)$/gm
  var stopFencedCodeRegex = /(```[ ]*)$/gm
  var blocks = []
  var lineTracker = 1

  var splitterRecursive = function () {
    var start = startFencedCodeRegex.exec(fileContent)

    if (start) {
      var contentCutted = fileContent.substring(0, start.index)
      fileContent = fileContent.substring(start.index)
      var end = stopFencedCodeRegex.exec(fileContent)

      if (!end) {
        return false
      }

      lineTracker += contentCutted.split('\n').length - 1

      var line = lineTracker
      var content = fileContent.substring(start[0].length + 1, end.index - 1)

      blocks.push({
        line: line,
        content: content
      })

      return true
    }

    return false
  }

  while (splitterRecursive()) {}

  return blocks
}
