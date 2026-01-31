import { supabase } from "@/lib/supabaseClient";

export const toggleDone = async (id: number, isDone: boolean) => {
  const { error } = await supabase
    .from("todos")
    .update({ is_done: !isDone })
    .eq("id", id);

  if (error) throw new Error(error.message);
};
