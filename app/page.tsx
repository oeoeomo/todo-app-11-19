import { Suspense } from "react";
import { io } from "next/cache";
import { TodoBoard } from "@/app/todo-board";
import { listTodos } from "@/lib/todos";

async function TodoContent() {
  await io();

  const result = await listTodos()
    .then((todos) => ({ todos, ok: true as const }))
    .catch(() => ({ todos: null, ok: false as const }));

  if (!result.ok) {
    return (
      <p className="storage-error" role="alert">
        목록을 불러오지 못했어요. 서버의 Turso 연결 설정을 확인해 주세요.
      </p>
    );
  }

  return <TodoBoard todos={result.todos} />;
}

export default function Home() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <div aria-hidden="true" className="brand-mark">
          ✓
        </div>
        <span className="eyebrow">나만의 작은 체크리스트</span>
        <h1>오늘의 할 일</h1>
        <p>하나씩 적고, 하나씩 해내요.</p>
      </header>
      <Suspense
        fallback={<div className="todo-card loading-state">목록을 불러오는 중…</div>}
      >
        <TodoContent />
      </Suspense>
      <footer className="page-footer">천천히 해도 괜찮아요.</footer>
    </main>
  );
}
