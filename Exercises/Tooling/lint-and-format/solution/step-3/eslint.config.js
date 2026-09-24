import js from '@eslint/js'
import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint'

export default defineConfig(
  { ignores: ['solution/**'] },
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      eqeqeq: 'error',
      'no-console': 'warn',
    },
  },
)
