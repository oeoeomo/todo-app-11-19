import "server-only";
import { createClient } from "@libsql/client";

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

type Client = ReturnType<typeof createClient>;

let client: Client | undefined;
let schemaReady: Promise<void> | undefined;

function getClient() {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url) throw new Error("TURSO_DATABASE_URL is required.");
  if (!url.startsWith("file:") && !authToken) {
    throw new Error("TURSO_AUTH_TOKEN is required.");
  }

  client = createClient({ url, ...(authToken ? { authToken } : {}) });
  return client;
}

async function withDatabase<T>(query: (database: Client) => Promise<T>) {
  try {
    const database = getClient();
    schemaReady ??= database
      .execute(`
        CREATE TABLE IF NOT EXISTS todos (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          completed INTEGER NOT NULL DEFAULT 0,
          created_at INTEGER NOT NULL
        )
      `)
      .then(() => undefined);

    try {
      await schemaReady;
    } catch {
      schemaReady = undefined;
      throw new Error("Todo storage is unavailable.");
    }

    return await query(database);
  } catch {
    throw new Error("Todo storage is unavailable.");
  }
}

export async function listTodos(): Promise<Todo[]> {
  return withDatabase(async (database) => {
    const result = await database.execute(
      "SELECT id, title, completed FROM todos ORDER BY created_at DESC, id DESC",
    );

    return result.rows.map((row) => ({
      id: Number(row.id),
      title: String(row.title),
      completed: Number(row.completed) === 1,
    }));
  });
}

export async function insertTodo(title: string) {
  return withDatabase(async (database) => {
    await database.execute({
      sql: "INSERT INTO todos (title, created_at) VALUES (?, ?)",
      args: [title, Date.now()],
    });
  });
}

export async function setTodoCompleted(id: number, completed: boolean) {
  return withDatabase(async (database) => {
    await database.execute({
      sql: "UPDATE todos SET completed = ? WHERE id = ?",
      args: [completed ? 1 : 0, id],
    });
  });
}
