// Dependencies
var CompositeDisposable = require('atom').CompositeDisposable
var selectStyle = require('./utils/select-style')
var styleSettings = require('./utils/style-settings')

module.exports = {
  config: {
    style: {
      type: 'string',
      default: styleSettings.defaultStyle,
      enum: styleSettings.styleOptions
    },
    checkStyleDevDependencies: {
      type: 'boolean',
      title: 'Check for standard',
      description: 'Only run if standard, semistandard or happiness present in package.json `devDependencies`',
      default: false
    },
    checkForEslintConfig: {
      type: 'boolean',
      title: 'Disable if the project uses ESLint',
      description: 'Do not run if the project has configured ESLint',
      default: true
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
    },
    lintHtmlFiles: {
      type: 'boolean',
      description: 'Lint html-embedded script blocks',
      default: false
    }
  },
  cache: new Map(),
  subscriptions: {},
  scope: ['source.js', 'source.js.jsx', 'source.js.jquery', 'source.gfm', 'source.vue'],
  activate: function () {
    var self = this

    // Install linter-js-standard dependencies
    require('atom-package-deps')
    .install('linter-js-standard')
    .then(function () {
      var storeSettings = function (textEditor) {
        var config = atom.config.get('linter-js-standard')

        // Check if this file is inside our grammar scope
        var grammar = textEditor.getGrammar() || { scopeName: null }

        // Check if this file is inside any kind of html scope (such as text.html.basic among others)
        if (config.lintHtmlFiles && /^text.html/.test(grammar.scopeName)) {
          self.scope.push(grammar.scopeName)
        }

        if (!config.lintHtmlFiles && /^text.html/.test(grammar.scopeName)) {
          return
        }

        if (self.scope.indexOf(grammar.scopeName) < 0 || (!config.lintMarkdownFiles && grammar.scopeName === 'source.gfm')) {
          return
        }

        // Cache text editor
        self.__cacheTextEditor(textEditor)
      }

      self.subscriptions = new CompositeDisposable()

      self.subscriptions.add(atom.workspace.observeTextEditors(storeSettings))
    })
  },

  deactivate: function () {
    this.subscriptions.dispose()
  },

  __cacheTextEditor: function (textEditor) {
    var filePath = textEditor.getPath()
    var config = atom.config.get('linter-js-standard')

    var opts = config.honorStyleSettings ? styleSettings.checkStyleSettings(filePath, textEditor) : {}

    var style = selectStyle(filePath, {
      style: opts.style || config.style,
      checkStyleDevDependencies: config.checkStyleDevDependencies,
      checkForEslintConfig: config.checkForEslintConfig
    })

    // Cache style settings and args of some file
    this.cache.set('text-editor', { style: style, opts: opts })
  },

  provideLinter: require('./linter-js-standard')
}
