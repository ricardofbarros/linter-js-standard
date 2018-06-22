/** @babel */

// Dependencies
import { CompositeDisposable } from 'atom'
import deprecateConfig from './utils/deprecate-config'

const scope = ['javascript', 'source.js', 'source.js.jsx', 'source.js.jquery', 'source.gfm', 'source.vue']

export const config = {
  style: {
    type: 'string',
    title: 'Default style',
    description: 'Default global style when none is installed locally.',
    default: 'standard',
    enum: [
      { value: 'standard', description: 'JavaScript Standard Style (standard)' },
      { value: 'semistandard', description: 'JavaScript Semi-Standard Style (semistandard)' },
      { value: 'happiness', description: 'JavaScript Happiness Style (happiness)' }
    ],
    order: 1
  },
  checkStyleDevDependencies: {
    type: 'boolean',
    title: 'Only lint if installed locally',
    description: 'Only lint if `standard` (or one of the other styles) is installed as a dependency.',
    default: false,
    order: 2
  },
  showEslintRules: {
    type: 'boolean',
    title: 'Show ESLint rule ID',
    description: 'Show ESLint’s rule ID in the message description.',
    default: false,
    order: 3
  },
  checkForEslintConfig: {
    type: 'boolean',
    title: 'Skip if ESLint is installed locally',
    description: 'Skip linting if ESLint is installed locally.',
    default: true,
    order: 4
  },
  lintHtmlFiles: {
    type: 'boolean',
    title: 'Lint HTML documents',
    description: 'Lint JavaScript code within `<script>` tags in HTML documents.',
    default: false,
    order: 5
  },
  lintMarkdownFiles: {
    type: 'boolean',
    title: 'Lint Markdown documents',
    description: 'Lint JavaScript code blocks within Markdown documents.',
    default: false,
    order: 6
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

  deprecateConfig()
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
