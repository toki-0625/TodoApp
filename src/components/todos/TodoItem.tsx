"use client";

import { useState } from "react";
import { Todo } from "@/lib/todos/types";

type Props = {
  todo: Todo;
  onToggle: (todo: Todo) => Promise<void> | void;
  onEdit: (id: number, title: string) => Promise<void> | void;
  onDelete: (todo: Todo) => Promise<void> | void;
};

export default function TodoItem({ todo, onToggle, onEdit, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [editingTitle, setEditingTitle] = useState(todo.title);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (saving) return;
    setSaving(true);
    try {
      await onEdit(todo.id, editingTitle);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setEditing(false);
    setEditingTitle(todo.title);
  };

  const cardBase = "rounded-lg border p-3 shadow-sm transition-all duration-200";
  const cardDone = "bg-gray-50 border-gray-200 opacity-90";
  const cardUndone = "bg-white border-gray-200";
  const cardEditing = "ring-2 ring-gray-300 bg-gray-50";

  const btnBase =
    "inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium whitespace-nowrap " +
    "disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <li className={`${cardBase} ${editing ? cardEditing : todo.is_done ? cardDone : cardUndone}`}>
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={todo.is_done}
          onChange={() => onToggle(todo)}
          className="h-4 w-4"
        />

        {editing ? (
          <input
            className="h-9 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900
                       placeholder:text-gray-400
                       focus:outline-none focus:ring-2 focus:ring-gray-300"
            value={editingTitle}
            onChange={(e) => setEditingTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") save();
              if (e.key === "Escape") cancel();
            }}
          />
        ) : (
          <span className={"w-full text-sm " + (todo.is_done ? "text-gray-500 line-through" : "text-gray-900")}>
            {todo.title}
          </span>
        )}

        {editing ? (
          <div className="flex gap-2">
            <button
              className={btnBase + " bg-gray-900 text-white border-gray-900 hover:bg-gray-800"}
              onClick={save}
              disabled={saving}
            >
              {saving ? "保存中" : "保存"}
            </button>
            <button className={btnBase + " bg-white text-gray-700 hover:bg-gray-100"} onClick={cancel} disabled={saving}>
              取消
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className={btnBase + " bg-white text-gray-700 hover:bg-gray-100 min-w-[64px]"}
              onClick={() => setEditing(true)}
            >
              編集
            </button>

            <button
              className={
                btnBase +
                " border-red-200 bg-red-50 text-red-700 hover:bg-red-100 min-w-[64px]"
              }
              onClick={() => onDelete(todo)}
            >
              削除
            </button>
          </div>
        )}
      </div>
    </li>
  );
}
