/* global atom */

// Dependencies
var CompositeDisposable = require('atom').CompositeDisposable
var selectStyle = require('./utils/select-style')
var styleSettings = require('./utils/style-settings')

module.exports = {
  config: {
    style: {
      type: 'string',
      default: 'standard',
      enum: ['standard', 'semi-standard', 'happiness']
    },
    checkStyleDevDependencies: {
      type: 'boolean',
      description: 'Check code style on package.json devDependencies',
      default: false
    },
    honorStyleSettings: {
      type: 'boolean',
      description: 'Honor code style settings on package.json',
      default: false
    }
  },
  cache: new Map(),
  subscriptions: {},
  scope: ['source.js', 'source.js.jsx', 'source.js.jquery'],
  activate: function () {
    var self = this
    var config = atom.config.get('linter-js-standard')
    this.cache.set('config', config)

    // On startup some panes may be open
    // we need to store their settings
    var files = atom.workspace.getTextEditors()
    files.forEach(function (textEditor) {
      // Check if this file is inside our grammar scope
      var grammar = textEditor.getGrammar()
      if (self.scope.indexOf(grammar.scopeName) < 0) {
        return
      }

      // Cache it!
      self.__cacheFileSettings(config, textEditor)
    })

    // Create some subscriptions
    this.subscriptions = new CompositeDisposable()

    // on file open
    this.subscriptions.add(atom.workspace.onDidAddTextEditor(function (event) {
      // Check if this file is inside our grammar scope
      var grammar = event.textEditor.getGrammar()
      if (self.scope.indexOf(grammar.scopeName) < 0) {
        return
      }

      // Get config
      var config
      if (self.cache.has('config')) {
        config = self.cache.get('config')
      } else {
        // If config is not cached yet
        // get it and cache it
        config = atom.config.get('linter-js-standard')
        self.cache.set('config', config)
      }

      self.__cacheFileSettings(config, event.textEditor)
    }))

    // on package settings change
    this.subscriptions.add(atom.config.observe('linter-js-standard', function (config) {
      // Cache config
      self.cache.set('config', config)
    }))
  },

  deactivate: function () {
    this.subscriptions.dispose()
  },

  __cacheFileSettings: function (config, textEditor) {
    var filePath = textEditor.getPath()
    var styleObj = selectStyle(config, filePath)
    var args = ['--verbose']

    // If setting honorStyleSettings is checked
    // and there is a valid linter
    if (config.honorStyleSettings && styleObj.name !== 'no-style') {
      // This function may modify the following variables:
      // - args
      // - styleObj
      styleSettings.call({ args: args, styleObj: styleObj }, filePath)
    }

    // Cache style settings and args of some file
    this.cache.set(filePath, { styleObj: styleObj, args: args })
  },
  provideLinter: require('./linter-js-standard')
}
