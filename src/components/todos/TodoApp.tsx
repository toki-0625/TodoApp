"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useTodos } from "@/hooks/useTodos";
import TodoForm from "./TodoForm";
import TodoList from "./TodoList";
import { Todo } from "@/lib/todos/types";

export default function TodoApp() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id ?? null;

      if (!mounted) return;

      if (!uid) {
        setUserId(null);
        setAuthChecked(true);
        router.replace("/login");
        return;
      }

      setUserId(uid);
      setAuthChecked(true);
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user?.id ?? null;

      if (!mounted) return;

      if (!uid) {
        setUserId(null);
        router.replace("/login");
        return;
      }

      setUserId(uid);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { todos, loading, message, messageType, clearMessage, create, toggle, edit, remove } =
    useTodos(authChecked ? userId : null);

  const stats = useMemo(() => {
    const total = todos.length;
    const done = todos.filter((t) => t.is_done).length;
    return { total, done };
  }, [todos]);

  const onDelete = async (todo: Todo) => {
    clearMessage();
    const ok = window.confirm(`このタスクを削除しますか？\n\n${todo.title}`);
    if (!ok) return;
    await remove(todo.id);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const messageClass =
    messageType === "success"
      ? "border-green-200 bg-green-50 text-green-800"
      : messageType === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-gray-200 bg-gray-50 text-gray-700";

  if (!authChecked) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-gray-700">認証確認中...</p>
        </div>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen p-6">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm text-gray-700">ログイン画面へ移動中...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Todo</h1>
            <p className="text-sm text-gray-600 mt-1">
              完了 {stats.done} / 合計 {stats.total}
            </p>
          </div>

          <button
            className="inline-flex h-10 items-center justify-center rounded-md border bg-white px-4 text-sm font-medium
                       text-gray-800 hover:bg-gray-100 whitespace-nowrap"
            onClick={logout}
          >
            ログアウト
          </button>
        </header>

        <section className="mt-6 rounded-xl border bg-white p-4 shadow-sm">
          <TodoForm onAdd={create} />

          {message && (
            <div className={`mt-3 flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm ${messageClass}`}>
              <span>{message}</span>
              <button className="underline hover:text-gray-900 whitespace-nowrap" onClick={clearMessage}>
                消す
              </button>
            </div>
          )}

          <div className="my-6 border-t" />

          <h2 className="text-sm font-semibold text-gray-800">タスク一覧</h2>

          <TodoList
            todos={todos}
            loading={loading}
            onToggle={toggle}
            onEdit={edit}
            onDelete={onDelete}
          />
        </section>
      </div>
    </main>
  );
}
