import antfu from '@antfu/eslint-config'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat()
export default antfu(
  {
    vue: true,
    formatters: {
      css: true,
      html: true,
      markdown: 'prettier',
    },
    ignores: [
      '**/public',
      '**/node_modules',
      '**/src/assets',
    ],
    unocss: true,
    rules: {
      'no-console': 'off',
    },
  },
  ...compat.config({
    extends: [
      './.eslintrc-auto-import.json',
    ],
  }),
)
