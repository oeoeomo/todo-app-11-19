"use server";

import { revalidatePath } from "next/cache";
import {
  insertTodo,
  removeTodo,
  renameTodo,
  setTodoCompleted,
} from "@/lib/todos";

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

export async function editTodo(
  formData: FormData,
): Promise<TodoFormState> {
  const id = Number(formData.get("id"));
  const title = formData.get("title");

  if (!Number.isSafeInteger(id) || id < 1) {
    return { error: "할 일을 찾을 수 없어요." };
  }
  if (typeof title !== "string" || !title.trim()) {
    return { error: "할 일 제목을 입력해 주세요." };
  }

  try {
    await renameTodo(id, title.trim());
    revalidatePath("/");
    return { error: null };
  } catch {
    return { error: "수정하지 못했어요. 잠시 후 다시 시도해 주세요." };
  }
}

export async function deleteTodo(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id < 1) return;

  await removeTodo(id);
  revalidatePath("/");
}
