import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["dist", "node_modules", ".vscode"] },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh
    },
    rules: {
      // React Rules - made less strict
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true }
      ],

      // Import/Export Rules - more lenient
      "no-unused-vars": "off", // Let TypeScript handle this
      "@typescript-eslint/no-unused-vars": "off", // Completely disabled

      // Type rules - disabled for development
      "@typescript-eslint/no-explicit-any": "off", // Disabled
      "@typescript-eslint/no-non-null-assertion": "off", // Disabled

      // General Code Quality - relaxed
      "no-console": "off", // Allow all console methods
      "no-debugger": "warn",
      "no-alert": "off", // Allow alert, confirm, prompt
      "no-var": "error",
      "prefer-const": "warn", // Reduced from error
      "prefer-template": "off", // Disabled
      "object-shorthand": "off", // Disabled
      "no-duplicate-imports": "warn", // Reduced from error
      "no-undef": "warn", // Reduced from error

      // Performance - disabled
      "react-hooks/exhaustive-deps": "off" // Disabled
    }
  }
);