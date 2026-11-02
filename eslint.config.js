import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

import importPlugin from 'eslint-plugin-import';

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      import: importPlugin
    },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn"],
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            {
              target: "./src/features/city",
              from: "./src/features",
              except: ["./city"],
              message: "Cross-feature imports are not allowed."
            },
            {
              target: "./src/features/statistics",
              from: "./src/features",
              except: ["./statistics"],
              message: "Cross-feature imports are not allowed."
            },
            {
              target: "./src/features/creator",
              from: "./src/features",
              except: ["./creator"],
              message: "Cross-feature imports are not allowed."
            },
            {
              target: "./src/features/settings",
              from: "./src/features",
              except: ["./settings"],
              message: "Cross-feature imports are not allowed."
            }
          ]
        }
      ]
    }
  },
])
