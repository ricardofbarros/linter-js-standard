// Dependencies
var linter = require('./utils/linter')
var allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction
var markdownSplitter = require('./utils/markdown-splitter')
var htmlSplitter = require('./utils/html-splitter')
var selectStyle = require('./utils/select-style')
var styleSettings = require('./utils/style-settings')
var Q = require('q')

function generateLintPromise (textEditor, filePath, fileContent, settings, lineStart) {
  return allowUnsafeNewFunction(function () {
    var deferred = Q.defer()
    var boundLinter = linter.bind({
      textEditor: textEditor,
      filePath: filePath,
      deferred: deferred,
      lineStart: lineStart || 0
    })

    settings.style.lintText(fileContent, settings.opts, boundLinter)

    return deferred.promise
  })
}

module.exports = function (textEditor) {
  var fileContent = textEditor.getText()
  var filePath = textEditor.getPath()
  var fileScope = textEditor.getGrammar().scopeName
  var config = atom.config.get('linter-js-standard')

  var opts = config.honorStyleSettings ? styleSettings.checkStyleSettings(filePath, textEditor) : {}

  var style = selectStyle(filePath, {
    style: opts.style || config.style,
    checkStyleDevDependencies: config.checkStyleDevDependencies,
    checkForEslintConfig: config.checkForEslintConfig
  })

  var settings = { style, opts }

  if (!config.lintHtmlFiles && /^text\.html/.test(fileScope)) {
    return []
  }

  if (!config.lintMarkdownFiles && fileScope === 'source.gfm') {
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
      lintPromises.push(generateLintPromise(textEditor, filePath, block.content, settings, block.line))
    })
  } else if (/^text\.html/.test(fileScope)) {
    var scriptCodeBlocks = htmlSplitter(fileContent)
    scriptCodeBlocks.forEach(function (block) {
      lintPromises.push(generateLintPromise(textEditor, filePath, block.content, settings, block.line))
    })
  } else {
    lintPromises.push(generateLintPromise(textEditor, filePath, fileContent, settings))
  }

  return Q.allSettled(lintPromises)
    .then(function (results) {
      if (textEditor.getText() !== fileContent) {
        // When the editor’s contents have been modified since we’ve started
        // linting, we can’t be sure that the results are still valid.
        // Therefore, we simply return `null` as not to update the results.
        return null
      }

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
