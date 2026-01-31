import { supabase } from "@/lib/supabaseClient";

export const updateTitle = async (id: number, title: string) => {
  const { error } = await supabase.from("todos").update({ title }).eq("id", id);
  if (error) throw new Error(error.message);
};
