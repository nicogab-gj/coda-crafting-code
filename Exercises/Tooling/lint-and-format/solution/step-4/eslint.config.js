import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier/flat'
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
  {
    plugins: { '@stylistic': stylistic },
    rules: { '@stylistic/quotes': ['error', 'double'] },
  },
  // Must stay last: turns off every rule that fights with Prettier (incl. @stylistic/quotes above)
  eslintConfigPrettier,
)
