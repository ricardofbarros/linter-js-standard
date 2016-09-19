module.exports = function (fileContent) {
  var startFencedCodeRegex = /(```\s*js\s*)$/gm
  var stopFencedCodeRegex = /(```\s*)$/gm
  var blocks = []
  var offset = 0

  var splitterRecursive = function () {
    startFencedCodeRegex.lastIndex = offset

    var start = startFencedCodeRegex.exec(fileContent)

    if (start) {
      var contentCutted = fileContent.substring(0, start.index)

      stopFencedCodeRegex.lastIndex = contentCutted.length

      var end = stopFencedCodeRegex.exec(fileContent)

      if (!end) {
        return false
      }

      var content = fileContent.substring(contentCutted.length + start[0].length, end.index).trimRight() + '\n'
      offset = end.index

      blocks.push({
        line: contentCutted.split('\n').length - 1,
        content: content
      })

      return true
    }

    return false
  }

  while (splitterRecursive()) {}

  return blocks
}
