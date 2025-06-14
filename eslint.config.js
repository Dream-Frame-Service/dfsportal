import js from "@eslint/js";
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
      globals: {
        // Browser globals
        console: "readonly",
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        fetch: "readonly",
        setTimeout: "readonly",
        clearTimeout: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        FormData: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        File: "readonly",
        Blob: "readonly",
        FileReader: "readonly",
        Image: "readonly",
        HTMLElement: "readonly",
        HTMLCanvasElement: "readonly",
        HTMLImageElement: "readonly",
        HTMLVideoElement: "readonly",
        HTMLInputElement: "readonly",
        HTMLDivElement: "readonly",
        HTMLButtonElement: "readonly",
        HTMLAnchorElement: "readonly",
        HTMLSpanElement: "readonly",
        HTMLParagraphElement: "readonly",
        HTMLHeadingElement: "readonly",
        HTMLTableElement: "readonly",
        HTMLTableSectionElement: "readonly",
        HTMLTableRowElement: "readonly",
        HTMLTableCellElement: "readonly",
        HTMLTableCaptionElement: "readonly",
        HTMLTextAreaElement: "readonly",
        HTMLOListElement: "readonly",
        HTMLUListElement: "readonly",
        HTMLLIElement: "readonly",
        Element: "readonly",
        Node: "readonly",
        MediaStream: "readonly",
        Response: "readonly",
        Request: "readonly",
        RequestInit: "readonly",
        RequestInfo: "readonly",
        btoa: "readonly",
        atob: "readonly",
        IntersectionObserver: "readonly",
        MutationObserver: "readonly",
        PerformanceNavigationTiming: "readonly",
        PerformanceResourceTiming: "readonly",
        PerformanceMark: "readonly",
        PerformanceMeasure: "readonly",
        performance: "readonly",
        Notification: "readonly",
        Event: "readonly",
        EventTarget: "readonly",
        MouseEvent: "readonly",
        KeyboardEvent: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",

        // TypeScript/React globals
        JSX: "readonly",

        // Node.js globals
        process: "readonly",
        Buffer: "readonly",
        global: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        require: "readonly",
        module: "readonly",
        exports: "readonly",
        NodeJS: "readonly",

        // React global
        React: "readonly",

        // Custom project globals
        ENV_URL: "readonly",
        ENV_ANON_KEY: "readonly",
        config: "readonly"
      }
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
      "@typescript-eslint/no-require-imports": "off", // Allow require imports

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
      "no-duplicate-imports": "off", // Disabled to avoid conflicts
      "no-undef": "warn", // Reduced from error

      // Performance - disabled
      "react-hooks/exhaustive-deps": "off" // Disabled
    }
  }
);