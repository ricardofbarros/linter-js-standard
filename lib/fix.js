var linter = require('./utils/linter')
var Q = require('q')

module.exports = function (path, settings, config) {
  var deferred = Q.defer()
  var boundLinter = linter.bind({
    filePath: path,
    config: config,
    deferred: deferred,
    lineStart: 0
  })
  settings.opts.fix = true
  settings.style.lintFiles(path, settings.opts, boundLinter)
}
