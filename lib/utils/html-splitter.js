module.exports = function (fileContent) {
  var startScriptCodeRegex = /(<script[^>]*>)$/gm
  var stopScriptCodeRegex = /(<\/script>)$/gm
  var blocks = []
  var offset = 0

  var splitterRecursive = function () {
    startScriptCodeRegex.lastIndex = offset

    var start = startScriptCodeRegex.exec(fileContent)

    if (start) {
      var contentCutted = fileContent.substring(0, start.index)

      stopScriptCodeRegex.lastIndex = contentCutted.length

      var end = stopScriptCodeRegex.exec(fileContent)

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
