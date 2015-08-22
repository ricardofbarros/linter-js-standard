// Dependencies
var linter = require('./utils/linter')
var allowUnsafeNewFunction = require('loophole').allowUnsafeNewFunction
var Q = require('q')

module.exports = function () {
  var self = this

  return {
    grammarScopes: self.scope,
    scope: 'file',
    lintOnFly: true,
    lint: function (textEditor) {
      var fileContent = textEditor.getText()
      var filePath = textEditor.getPath()
      var settings = self.cache.get('text-editor')
      var config = self.cache.get('config')

      if (this.grammarScopes.indexOf(textEditor.getGrammar().scopeName) < 0) {
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
      if (typeof settings.style.lintText !== 'function') {
        return []
      }

      return allowUnsafeNewFunction(function () {
        var deferred = Q.defer()
        var boundLinter = linter.bind({
          filePath: filePath,
          config: config,
          deferred: deferred
        })

        settings.style.lintText(fileContent, settings.opts, boundLinter)

        return deferred.promise
      })
    }
  }
}
