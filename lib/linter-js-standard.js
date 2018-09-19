// Dependencies
var path = require('path')
var linter = require('./utils/linter')
var allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction
var markdownSplitter = require('./utils/markdown-splitter')
var htmlSplitter = require('./utils/html-splitter')
var selectStyle = require('./utils/select-style')
var styleSettings = require('./utils/style-settings')

function generateLintPromise (textEditor, filePath, fileContent, settings, lineStart) {
  return allowUnsafeNewFunction(function () {
    return new Promise((resolve, reject) => {
      var boundLinter = linter.bind({
        textEditor: textEditor,
        filePath: filePath,
        lineStart: lineStart || 0
      })

      var workingDirectory = path.dirname(filePath)
      var previousWorkingDirectory = process.cwd()

      process.chdir(workingDirectory)

      settings.style.lintText(fileContent, settings.opts, (err, results) => {
        process.chdir(previousWorkingDirectory)

        if (err) {
          return reject(err)
        }

        resolve(boundLinter(results))
      })
    })
  })
}

module.exports = function (textEditor) {
  var fileContent = textEditor.getText()
  var filePath = textEditor.getPath()
  var fileScope = textEditor.getGrammar().scopeName
  var config = atom.config.get('linter-js-standard')

  var opts = styleSettings.checkStyleSettings(filePath, textEditor)

  opts.filename = filePath

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

  return Promise.all(lintPromises)
    .then(function (values) {
      if (textEditor.getText() !== fileContent) {
        // When the editor’s contents have been modified since we’ve started
        // linting, we can’t be sure that the results are still valid.
        // Therefore, we simply return `null` as not to update the results.
        return null
      }

      var occurrences = []

      values.forEach(function (value) {
        occurrences = occurrences.concat(value)
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
