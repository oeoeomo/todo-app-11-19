import { rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export default async function globalTeardown() {
  const databasePath = process.env.TODO_E2E_DATABASE_PATH;
  const testDatabasePrefix = join(tmpdir(), "todo-app-e2e-");

  if (!databasePath?.startsWith(testDatabasePrefix)) return;

  await Promise.all(
    ["", "-journal", "-wal", "-shm"].map((suffix) =>
      rm(`${databasePath}${suffix}`, { force: true }),
    ),
  );
}
