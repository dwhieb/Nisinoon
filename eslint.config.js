import globals   from 'globals'
import js        from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin-js'

export default [
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@stylistic/js': stylistic,
    },
    rules: {
      semi: [
        `error`,
        `never`,
      ],
      "semi-spacing": `error`,
      "semi-style": `error`,
    },
  },
]