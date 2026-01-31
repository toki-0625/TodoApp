import { supabase } from "@/lib/supabaseClient";
import { Todo } from "./types";

export const fetchTodos = async (): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Todo[];
};
