import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  // Input: OpenAPI spec
  input: "./openapi.yaml",

  // Output: Generated code directory
  output: {
    path: "./src/api",
    format: "prettier",
  },

  // Plugins
  plugins: [
    // Generate TypeScript types
    "@hey-api/typescript",

    // Generate SDK client (functions for tree-shaking)
    {
      name: "@hey-api/sdk",
      asClass: false,
      operationId: true,
    },

    // Generate Zod schemas for runtime validation
    {
      name: "zod",
      export: true,
    },

    // Generate TanStack Query hooks
    {
      name: "@tanstack/react-query",
      queryOptions: true,
      mutationOptions: true,
    },
  ],
});
