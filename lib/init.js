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
      description: 'Check code style on package.json devDependencies',
      default: false
    }
  },
  activate: function () {
    return console.log('linter-js-standard activated')
  },
  provideLinter: require('./linter-js-standard')
}
