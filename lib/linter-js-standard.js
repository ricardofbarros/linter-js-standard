// Dependencies
var linter = require('./utils/linter')
var allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction
var markdownSplitter = require('./utils/markdown-splitter')
var htmlSplitter = require('./utils/html-splitter')
var Q = require('q')

function generateLintPromise (filePath, fileContent, settings, lineStart) {
  return allowUnsafeNewFunction(function () {
    var deferred = Q.defer()
    var boundLinter = linter.bind({
      filePath: filePath,
      deferred: deferred,
      lineStart: lineStart || 0
    })

    settings.style.lintText(fileContent, settings.opts, boundLinter)

    return deferred.promise
  })
}

module.exports = function () {
  var self = this

  return {
    name: 'js-standard',
    grammarScopes: self.scope,
    scope: 'file',
    lintsOnChange: true,
    lint: function (textEditor) {
      var fileContent = textEditor.getText()
      var filePath = textEditor.getPath()
      var fileScope = textEditor.getGrammar().scopeName
      var settings = self.cache.get('text-editor')
      var config = atom.config.get('linter-js-standard')

      if (!config.lintHtmlFiles && /^text\.html/.test(fileScope)) {
        return []
      }

      if (this.grammarScopes.indexOf(fileScope) < 0 || (!config.lintMarkdownFiles && fileScope === 'source.gfm')) {
        return []
      }

      // Sane check
      if (!settings || !settings.opts || !settings.style) {
        atom.notifications.addWarning('Something went wrong internally.', {
          detail: 'No sweat, just re-open this file and this annoying warning shouldn\'t appear anymore',
          dismissable: true
        })

        return []
      }

      // No style selected
      if (settings.style.cmd === 'no-style' || typeof settings.style.lintText !== 'function') {
        return []
      }

      var lintPromises = []
      if (fileScope === 'source.gfm') {
        var fencedCodeBlocks = markdownSplitter(fileContent)
        fencedCodeBlocks.forEach(function (block) {
          lintPromises.push(generateLintPromise(filePath, block.content, settings, block.line))
        })
      } else if (/^text\.html/.test(fileScope)) {
        var scriptCodeBlocks = htmlSplitter(fileContent)
        scriptCodeBlocks.forEach(function (block) {
          lintPromises.push(generateLintPromise(filePath, block.content, settings, block.line))
        })
      } else {
        lintPromises.push(generateLintPromise(filePath, fileContent, settings))
      }

      return Q.allSettled(lintPromises)
        .then(function (results) {
          var occurrences = []

          results.forEach(function (result) {
            if (result.state === 'rejected') {
              throw result.reason
            }

            occurrences = occurrences.concat(result.value)
          })

          return occurrences
        })
        .catch(function (err) {
          atom.notifications.addError('Something bad happened', {
            detail: err.message,
            dismissable: true
          })

          return null
        })
    }
  }
}
