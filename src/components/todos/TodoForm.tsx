"use client";

import { useState } from "react";

type Props = {
  onAdd: (title: string) => Promise<boolean> | boolean;
};

export default function TodoForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const ok = await onAdd(title);
      if (ok) setTitle("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-2">
      <div className="flex items-center gap-3">
        <input
          className="h-11 flex-1 rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-900
                     placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-gray-300"
          placeholder="タスクを入力"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleAdd();
          }}
        />

        <button
          className="inline-flex h-11 items-center justify-center rounded-md
                     bg-gray-900 px-5 text-sm font-medium text-white
                     whitespace-nowrap min-w-[88px]
                     hover:bg-gray-800 active:bg-gray-900
                     disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
          onClick={handleAdd}
          disabled={submitting}
        >
          {submitting ? "追加中..." : "追加"}
        </button>
      </div>
    </div>
  );
}
