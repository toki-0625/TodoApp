import { supabase } from "@/lib/supabaseClient";

export const deleteTodo = async (id: number) => {
  const { error } = await supabase.from("todos").delete().eq("id", id);
  if (error) throw new Error(error.message);
};
