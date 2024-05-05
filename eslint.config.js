import configs from '@digitallinguistics/eslint-config'
import globals from 'globals'

const projectConfig = { languageOptions: { globals: { ...globals.nodeBuiltin } } }

const testConfig = {
  files:           [`**/*.test.*`],
  languageOptions: {
    globals: {
      cy:       true,
      describe: true,
      it:       true,
    },
  },
}

export default [
  ...configs,
  projectConfig,
  testConfig,
]
