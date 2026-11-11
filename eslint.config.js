// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import n from "eslint-plugin-n";
import vitest from "@vitest/eslint-plugin";

export default [
  js.configs.recommended,

  // All .js files: ESM only
  {
    files: ["**/*.js", "**/*.mjs"],
    languageOptions: {
      sourceType: "module",
      globals: globals.nodeBuiltin, // no require, module, exports, __dirname
    },
    plugins: { n },
    rules: {
      // Relative imports must include the extension: './routes/users.js'
      "n/file-extension-in-import": ["error", "always"],
      // Imported file or package must actually exist
      "n/no-missing-import": "error",
      // Clearer messages than no-undef for CommonJS leftovers
      "no-restricted-syntax": [
        "error",
        {
          selector: "CallExpression[callee.name='require']",
          message: "Use import instead of require() (this project is ESM).",
        },
        {
          selector:
            "MemberExpression[object.name='module'][property.name='exports']",
          message: "Use export / export default instead of module.exports.",
        },
      ],
    },
  },

  // Any file deliberately kept as CommonJS
  {
    files: ["**/*.cjs"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node,
    },
  },

  // Tests
  {
    files: ["tests/**"],
    plugins: { vitest },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
  },
];
