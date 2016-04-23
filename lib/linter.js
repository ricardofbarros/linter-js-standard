const EventEmitter = require('events')
const util = require('util')

function checkIfTextEditor (paneItem) {
  return (paneItem && typeof paneItem.getGrammar === 'function' && typeof paneItem.getPath === 'function')
}

function Linter (options) {
  // Linter's properties
  this.config = new Map()
  this.scope = options.scope
  this.listening = false
}
util.inherits(Linter, EventEmitter)

Linter.knownLinters = ['standard', 'semi-standard', 'happiness', 'uber-standard']

Linter.prototype.initialize = () => {
  // Start listening to events
  this.startListening()

  // Store linter-js-standard configs
  this.emit('pkg', atom.config.get('linter-js-standard'))

  // And listen for future changes
  atom.config.observe('linter-js-standard', (pkgConfig) => this.emit('pkg', pkgConfig))

  // Store current project standard config
  // NOTE: we find the path of the project from the paneitem
  this.emit('project', atom.workspace.getActivePaneItem())

  // And listen when the the active paneitem changes
  atom.workspace.onDidChangeActivePaneItem( (paneIem) => this.emit('project', paneIem))
}

Linter.prototype.startListening = () => {
  if (this.listening) {
    return
  }
  this.listening = true

  let config = this.config
  let scope = this.scope

  // Events:
  // -----------------
  // pkg - linter-js-standard package configuration
  //
  // project - Project standard/semistandard/etc.. configuration
  // -----------------
  this.on('pkg', (pkgConfig) => {
    config.set('pkg', pkgConfig)
  })

  this.on('project', (paneItem) => {
    // Check if the pane is a file
    if (!checkIfTextEditor(paneItem)) {
      return
    }

    // Get package config
    let pkgConfig = config.get('pkg')

    // Check if this file is inside our grammar scope
    let grammar = paneItem.getGrammar() || { scopeName: null }
    if (scope.indexOf(grammar.scopeName) < 0 || (!pkgConfig.lintMarkdownFiles && grammar.scopeName === 'source.gfm')) {
      return
    }

    let filePath = paneItem.getPath()
    let projectConfig = {
      style: selectStyle(config, filePath),
      opts: {}
    }

    // If setting honorStyleSettings is checked
    // and there is a valid linter
    if (pkgConfig.honorStyleSettings && style && style.cmd !== 'no-style') {
      projectConfig = styleSettings(projectConfig, filePath)
    }

    config.set('project', projectConfig)
  })
}

Linter.prototype.stopListening = () => {
  if (!this.listening) {
    return
  }
  this.listening = false

  // Clean up events
  this.removeAllListeners('pkg')
  this.removeAllListeners('project')
}

Linter.prototype.lint = (textEditor) {
  var fileContent = textEditor.getText()
  var filePath = textEditor.getPath()
  var fileScope = textEditor.getGrammar().scopeName
  var settings = self.cache.get('text-editor')
  var config = self.cache.get('config')

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
      lintPromises.push(generateLintPromise(filePath, block.content, settings, config, block.line))
    })
  } else {
    lintPromises.push(generateLintPromise(filePath, fileContent, settings, config))
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
    })
}

Linter.prototype.provide = () => {
  return {
    name: 'js-standard',
    grammarScopes: this.scope,
    scope: 'file',
    lintOnFly: true,
    lint: this.lint
  }
}
