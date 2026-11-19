"use server";

import { revalidatePath } from "next/cache";
import { insertTodo, setTodoCompleted } from "@/lib/todos";

export type TodoFormState = {
  error: string | null;
};

export async function addTodo(
  _previousState: TodoFormState,
  formData: FormData,
): Promise<TodoFormState> {
  const title = formData.get("title");

  if (typeof title !== "string" || !title.trim()) {
    return { error: "할 일 제목을 입력해 주세요." };
  }

  try {
    await insertTodo(title.trim());
    revalidatePath("/");
    return { error: null };
  } catch {
    return { error: "저장하지 못했어요. 잠시 후 다시 시도해 주세요." };
  }
}

export async function toggleTodo(formData: FormData) {
  const id = Number(formData.get("id"));
  const completed = formData.get("completed") === "true";

  if (!Number.isSafeInteger(id) || id < 1) return;

  await setTodoCompleted(id, completed);
  revalidatePath("/");
}
