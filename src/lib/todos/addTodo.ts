import { supabase } from "@/lib/supabaseClient";

export const addTodo = async (userId: string, title: string) => {
  const { error } = await supabase.from("todos").insert({
    user_id: userId,
    title,
  });
  if (error) throw new Error(error.message);
};
