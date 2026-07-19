import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),

      // Allow server-only modules to be tested in Vitest
      "server-only": path.resolve(
        __dirname,
        "./tests/mocks/server-only.ts"
      ),
    },
  },

  assetsInclude: [
    "**/*.wasm",
    "**/*.wasm?module",
  ],

  test: {
    globals: true,
    environment: "node",

    include: [
      "tests/**/*.test.ts",
      "src/**/*.test.ts",
    ],
  },
});
