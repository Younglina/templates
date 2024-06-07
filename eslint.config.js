import antfu from '@antfu/eslint-config'

export default antfu(
  {
    ignores: [
      '**/public',
      '**/node_modules',
      '**/src/assets',
    ],
    unocss: true,
  },
)