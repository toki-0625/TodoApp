"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/lib/todos/types";
import { fetchTodos } from "@/lib/todos/fetchTodos";
import { addTodo } from "@/lib/todos/addTodo";
import { toggleDone } from "@/lib/todos/toggleDone";
import { updateTitle } from "@/lib/todos/updateTitle";
import { deleteTodo } from "@/lib/todos/deleteTodo";

type MessageType = "success" | "error" | "info" | "";

export const useTodos = (userId: string | null) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>("");

  const sortTodos = (list: Todo[]) => {
    const undone = list.filter((t) => !t.is_done);
    const done = list.filter((t) => t.is_done);
    return [...undone, ...done];
  };

  const clearMessage = () => {
    setMessage("");
    setMessageType("");
  };

  const reload = async () => {
    try {
      const list = await fetchTodos();
      setTodos(sortTodos(list));
    } catch (e) {
      setMessageType("error");
      setMessage("取得失敗：" + (e as Error).message);
    }
  };

  useEffect(() => {
    if (!userId) {
      setTodos([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      await reload();
      setLoading(false);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const create = async (title: string): Promise<boolean> => {
    clearMessage();

    if (!userId) {
      setMessageType("error");
      setMessage("未ログインです（userIdが取れてない）");
      return false;
    }

    const t = title.trim();
    if (!t) {
      setMessageType("info");
      setMessage("タスク名を入力してください");
      return false;
    }
    if (t.length > 100) {
      setMessageType("info");
      setMessage("テキストは100文字以内にしてください");
      return false;
    }

    try {
      await addTodo(userId, t);
      setMessageType("success");
      setMessage("追加成功！");
      await reload();
      return true;
    } catch (e) {
      setMessageType("error");
      setMessage("追加失敗：" + (e as Error).message);
      return false;
    }
  };

  const toggle = async (todo: Todo) => {
    clearMessage();
    try {
      await toggleDone(todo.id, todo.is_done);
      setMessageType("success");
      setMessage(todo.is_done ? "未完了に戻しました" : "完了にしました");
      await reload();
    } catch (e) {
      setMessageType("error");
      setMessage("更新失敗：" + (e as Error).message);
    }
  };

  const edit = async (id: number, title: string) => {
    clearMessage();

    const t = title.trim();
    if (!t) {
      setMessageType("info");
      return setMessage("タスク名が空です");
    }
    if (t.length > 100) {
      setMessageType("info");
      return setMessage("テキストは100文字以内にしてくださいい");
    }

    try {
      await updateTitle(id, t);
      setMessageType("success");
      setMessage("編集OK！");
      await reload();
    } catch (e) {
      setMessageType("error");
      setMessage("編集失敗：" + (e as Error).message);
    }
  };

  const remove = async (id: number) => {
    clearMessage();
    try {
      await deleteTodo(id);
      setMessageType("success");
      setMessage("削除OK！");
      await reload();
    } catch (e) {
      setMessageType("error");
      setMessage("削除失敗：" + (e as Error).message);
    }
  };

  return {
    todos,
    loading,
    message,
    messageType,
    clearMessage,
    create,
    toggle,
    edit,
    remove,
  };
};
