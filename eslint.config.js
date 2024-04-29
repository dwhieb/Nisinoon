import configs from '@digitallinguistics/eslint-config'
import globals from 'globals'

const projectConfig = { languageOptions: { globals: { ...globals.nodeBuiltin } } }

export default [...configs, projectConfig]
