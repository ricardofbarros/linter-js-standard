// Dependencies
var CompositeDisposable = require('atom').CompositeDisposable
var selectStyle = require('./utils/select-style')
var styleSettings = require('./utils/style-settings')
var fix = require('./fix')

module.exports = {
  config: {
    style: {
      type: 'string',
      default: 'standard',
      enum: ['standard', 'semi-standard', 'happiness', 'uber-standard']
    },
    formatOnSave: {
      type: 'boolean',
      description: 'Works only with standard-engine v5.0.0 and above',
      default: false
    },
    checkStyleDevDependencies: {
      type: 'boolean',
      title: 'Check for standard',
      description: 'Only run if standard, semistandard or happiness present in package.json `devDependencies`',
      default: false
    },
    honorStyleSettings: {
      type: 'boolean',
      description: 'Honor code style settings on package.json',
      default: true
    },
    showEslintRules: {
      type: 'boolean',
      description: 'Show the eslint rule name on error/warning\'s message',
      default: false
    },
    lintMarkdownFiles: {
      type: 'boolean',
      description: 'Lint markdown fenced code blocks',
      default: false
    }
  },
  cache: new Map(),
  subscriptions: {},
  scope: ['source.js', 'source.js.jsx', 'source.js.jquery', 'source.gfm'],
  activate: function () {
    var self = this

    // Install linter-js-standard dependencies
    require('atom-package-deps')
    .install('linter-js-standard')
    .then(function () {
      var config = atom.config.get('linter-js-standard')
      self.cache.set('config', config)

      var storeSettings = function (paneItem) {
        // Check if the pane is a file
        if (!self.__checkIfTextEditor(paneItem)) {
          return
        }

        // Get config
        var config = self.cache.get('config')

        // Check if this file is inside our grammar scope
        var grammar = paneItem.getGrammar() || { scopeName: null }
        if (self.scope.indexOf(grammar.scopeName) < 0 || (!config.lintMarkdownFiles && grammar.scopeName === 'source.gfm')) {
          return
        }

        // Cache active pane
        self.__cacheTextEditor(config, paneItem)
      }

      // On startup get active pane
      // check if it's a text editor
      // if it is cache it's settings
      var paneItem = atom.workspace.getActivePaneItem()
      storeSettings(paneItem)

      // Create some subscriptions
      self.subscriptions = new CompositeDisposable()

      self.subscriptions.add(atom.workspace.onDidChangeActivePaneItem(storeSettings))

      // on package settings change
      self.subscriptions.add(atom.config.observe('linter-js-standard', function (config) {
        // Cache config
        self.cache.set('config', config)
      }))
      self.editorObserver = atom.workspace.observeTextEditors(function (editor) {
        editor.getBuffer().onWillSave(function () {
          var path = editor.getPath()
          if (!path) return

          if (!editor.getBuffer().isModified()) return

          var formatOnSave = atom.config.get('linter-js-standard.formatOnSave', {scope: editor.getRootScopeDescriptor()})
          if (!formatOnSave) return
          var settings = self.cache.get('text-editor')
          fix(path, settings, config)
        })
      })
    })
  },

  deactivate: function () {
    this.subscriptions.dispose()
  },

  __cacheTextEditor: function (config, textEditor) {
    var filePath = textEditor.getPath()
    var style = selectStyle(config, filePath)
    var opts = {}

    // If setting honorStyleSettings is checked
    // and there is a valid linter
    if (config.honorStyleSettings && style && style.cmd !== 'no-style') {
      // This function may modify the following variables:
      // - opts
      // - style
      styleSettings.call({ args: opts, style: style }, filePath)
    }

    // Cache style settings and args of some file
    this.cache.set('text-editor', { style: style, opts: opts })
  },

  __checkIfTextEditor: function (paneItem) {
    return (paneItem && typeof paneItem.getGrammar === 'function' && typeof paneItem.getPath === 'function')
  },

  provideLinter: require('./linter-js-standard')
}
