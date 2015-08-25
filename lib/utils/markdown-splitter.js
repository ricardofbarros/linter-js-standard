var startFencedCodeRegex = /(```js[ ]*)$/gm
var stopFencedCodeRegex = /(```[ ]*)$/gm

module.exports = function (fileContent) {
  var blocks = []
  var cursor = 0

  var splitterRecursive = function () {
    var splitContent = fileContent.substring(cursor)
    var start = startFencedCodeRegex.exec(splitContent)

    if (start) {
      var end = stopFencedCodeRegex.exec(splitContent)

      if (!end) {
        return false
      }

      var line = splitContent.substring(0, start.index + start[0].length + 1).split('\n').length - 1
      var content = splitContent.substring(start.index + start[0].length + 1, end.index - 1)

      blocks.push({
        line: line,
        content: content
      })
      cursor = end.index + end[0].length

      return true
    }

    return false
  }

  while (splitterRecursive()) {}

  return blocks
}
