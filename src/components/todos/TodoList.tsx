"use client";

import { Todo } from "@/lib/todos/types";
import TodoItem from "./TodoItem";

type Props = {
  todos: Todo[];
  loading: boolean;
  onToggle: (todo: Todo) => Promise<void> | void;
  onEdit: (id: number, title: string) => Promise<void> | void;
  onDelete: (todo: Todo) => Promise<void> | void;
};

export default function TodoList({ todos, loading, onToggle, onEdit, onDelete }: Props) {
  if (loading) return <p className="mt-3">読み込み中...</p>;
  if (todos.length === 0) return <p className="mt-3">進行中のタスクはありません</p>;

  return (
    <ul className="mt-3 space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
