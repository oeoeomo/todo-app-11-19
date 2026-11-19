"use client";

import { useActionState, useState } from "react";
import { addTodo, toggleTodo, type TodoFormState } from "@/app/actions";
import type { Todo } from "@/lib/todos";

const initialState: TodoFormState = { error: null };
type Filter = "all" | "active" | "completed";

export function TodoBoard({ todos }: { todos: Todo[] }) {
  const [state, formAction, pending] = useActionState(addTodo, initialState);
  const [filter, setFilter] = useState<Filter>("all");
  const visibleTodos = todos.filter((todo) =>
    filter === "all" ? true : todo.completed === (filter === "completed"),
  );
  const filters: { key: Filter; label: string; count: number }[] = [
    { key: "all", label: "전체", count: todos.length },
    {
      key: "active",
      label: "진행 중",
      count: todos.filter((todo) => !todo.completed).length,
    },
    {
      key: "completed",
      label: "완료",
      count: todos.filter((todo) => todo.completed).length,
    },
  ];

  return (
    <section className="todo-card">
      <form action={formAction} className="add-form">
        <label className="visually-hidden" htmlFor="new-todo">
          새 할 일
        </label>
        <input
          autoComplete="off"
          id="new-todo"
          maxLength={200}
          name="title"
          placeholder="예: 장보기"
          type="text"
        />
        <button className="add-button" disabled={pending} type="submit">
          추가
        </button>
      </form>
      <p aria-live="polite" className="form-message" role="alert">
        {state.error}
      </p>

      <div aria-label="상태 필터" className="filters" role="group">
        {filters.map(({ key, label, count }) => (
          <button
            aria-pressed={filter === key}
            className="filter-button"
            key={key}
            onClick={() => setFilter(key)}
            type="button"
          >
            {label} <span aria-hidden="true">{count}</span>
          </button>
        ))}
      </div>

      {visibleTodos.length ? (
        <ul aria-label="할 일 목록" className="todo-list">
          {visibleTodos.map((todo) => (
            <li className="todo-row" key={todo.id}>
              <form action={toggleTodo} className="todo-toggle">
                <input name="id" type="hidden" value={todo.id} />
                <label className="todo-label">
                  <input
                    aria-label={todo.completed ? "완료 취소" : "완료 처리"}
                    className="todo-checkbox"
                    defaultChecked={todo.completed}
                    name="completed"
                    onChange={(event) => event.currentTarget.form?.requestSubmit()}
                    type="checkbox"
                    value="true"
                  />
                  <span className={todo.completed ? "todo-copy is-completed" : "todo-copy"}>
                    {todo.title}
                  </span>
                </label>
              </form>
            </li>
          ))}
        </ul>
      ) : (
        <div className="empty-state">
          <span aria-hidden="true" className="empty-mark">
            ✓
          </span>
          <p>{todos.length ? "표시할 할 일이 없어요" : "아직 할 일이 없어요"}</p>
          <span>
            {todos.length ? "다른 상태를 선택해 보세요." : "작은 일부터 하나 적어볼까요?"}
          </span>
        </div>
      )}
    </section>
  );
}
