import { node } from "@liuli-util/vite-plugin-node";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [node()],
  build: {
    target: "node20",
    outDir: "./dist",
    lib: {
      entry: "./src/index.ts",
      formats: ["es", "cjs"],
      fileName: (format, entryName) => {
        if (format === "es") {
          return `${entryName}.js`;
        }
        return `${entryName}.${format}.js`;
      },
    },
  },
});
