import pluginJs from "@eslint/js";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: ["dist", "node_modules", "package.json", "yarn.lock"],
  },
  { files: ["src/**/*.{js,mjs,cjs,ts}", "test/**/*.{js,mjs,cjs,ts}"] },
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: {
      "prettier/prettier": [
        "error",
        {
          endOfLine: "auto",
        },
      ],
    },
  },
  { languageOptions: { globals: globals.node } },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
];
