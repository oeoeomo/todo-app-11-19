import { randomUUID } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { defineConfig } from "@playwright/test";

const databasePath = join(tmpdir(), `todo-app-e2e-${randomUUID()}.db`);
const databaseUrl = `file:${databasePath}`;

process.env.TODO_E2E_DATABASE_PATH = databasePath;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  globalTeardown: "./tests/global-teardown.ts",
  use: {
    baseURL: "http://127.0.0.1:3100",
    browserName: "chromium",
  },
  webServer: {
    command: "npm run dev -- --hostname 127.0.0.1 --port 3100",
    url: "http://127.0.0.1:3100",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      TODO_PLAYWRIGHT: "1",
      TURSO_DATABASE_URL: databaseUrl,
      TURSO_AUTH_TOKEN: "",
    },
  },
});
