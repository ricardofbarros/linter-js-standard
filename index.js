const atomPkgDeps = require('atom-package-deps')
let config = require('./config')
let Linter = require('./lib/linter')

const scope = [
  'source.js',
  'source.js.jsx',
  'source.js.jquery',
  'source.gfm'
]

let linter = new Linter({
  scope
})

module.exports = {
  config,
  scope,
  deactivate: linter.stopListening,
  provideLinter: linter.provider,
  activate: () => {
    // Check if linter is listening to new events
    // if it isn't start listen to
    if (!linter.listening) {
      linter.startListening()
    }

    // Install linter-js-standard dependencies
    // then run linter initialize fn
    atomPkgDeps.install('linter-js-standard')
      .then(linter.initialize)
  }
}
