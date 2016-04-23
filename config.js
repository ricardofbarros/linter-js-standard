const Linter = require('./lib/linter')

let config = {}

config.style = {
  type: 'string',
  default: 'standard',
  enum: Linter.knownLinters
}

config.checkStyleDevDependencies = {
  type: 'boolean',
  title: 'Check for standard',
  description: 'Only run if standard, semistandard or happiness present in package.json `devDependencies`',
  default: false
}

config.honorStyleSettings = {
  type: 'boolean',
  description: 'Honor code style settings on package.json',
  default: true
}

config.showEslintRules = {
  type: 'boolean',
  description: 'Show the eslint rule name on error/warning\'s message',
  default: false
}

config.lintMarkdownFiles = {
  type: 'boolean',
  description: 'Lint markdown fenced code blocks',
  default: false
}

module.exports = config
