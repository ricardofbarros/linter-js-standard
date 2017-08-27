/** @babel */

// Dependencies
import { CompositeDisposable } from 'atom'
import styleSettings from './utils/style-settings'

const scope = ['source.js', 'source.js.jsx', 'source.js.jquery', 'source.gfm', 'source.vue']

export const config = {
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
    title: 'Show ESLint Rules',
    description: 'Show the ESLint rule name on error/warning\'s message',
    default: false
  },
  lintMarkdownFiles: {
    type: 'boolean',
    description: 'Lint markdown fenced code blocks',
    default: false
  },
  lintHtmlFiles: {
    type: 'boolean',
    title: 'Lint HTML Files',
    description: 'Lint HTML-embedded script blocks',
    default: false
  }
}

export async function activate () {
  // Install linter-js-standard dependencies
  await require('atom-package-deps').install('linter-js-standard')

  this.subscriptions = new CompositeDisposable()

  this.subscriptions.add(atom.workspace.observeTextEditors(textEditor => {
    const config = atom.config.get('linter-js-standard')

    const grammar = textEditor.getGrammar() || { scopeName: null }

    // Check if this file is inside any kind of html scope (such as text.html.basic among others)
    if (config.lintHtmlFiles && /^text.html/.test(grammar.scopeName)) {
      scope.push(grammar.scopeName)
    }
  }))
}

export function deactivate () {
  this.subscriptions.dispose()
}

export const provideLinter = () => ({
  name: 'js-standard',
  grammarScopes: scope,
  scope: 'file',
  lintsOnChange: true,
  lint: require('./linter-js-standard')
})
