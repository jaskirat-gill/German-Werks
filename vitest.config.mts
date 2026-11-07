import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["tests/**/*.spec.ts"],
    env: {
      DATABASE_URL: "mongodb://127.0.0.1:27017/germanwerks_test",
      PAYLOAD_SECRET: "test-secret",
      STRIPE_WEBHOOK_SECRET: "whsec_test",
    },
    fileParallelism: false,
    testTimeout: 30000,
  },
});
