import configs from '@digitallinguistics/eslint-config'
import globals from 'globals'

const projectConfig = {
  languageOptions: { globals: { ...globals.nodeBuiltin } },
  // These 4 rules can be removed once dlx/eslint-config is updated.
  rules:           {
    indent:                     [`error`, 2, { MemberExpression: 0 }],
    'newline-per-chained-call': [`error`, { ignoreChainWithDepth: 3 }],
    'no-use-before-define':     [`warn`, {
      classes:   false,
      functions: false,
    }],
    'object-curly-newline': [`error`, {
      consistent:    true,
      minProperties: 4,
    }],
  },
}

const testConfig = {
  files:           [`**/*.test.*`],
  languageOptions: {
    globals: {
      cy:       true,
      describe: true,
      expect:   true,
      it:       true,
    },
  },
}

export default [
  ...configs,
  projectConfig,
  testConfig,
]
