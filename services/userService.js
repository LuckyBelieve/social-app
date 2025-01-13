import { supabase } from "../lib/superbase";

export const userService = async (userId) => {
  try {
    const { data } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();
    return { success: true, data };
  } catch (error) {
    console.log("got an error: ", error);
    return { success: false, msg: error.message };
  }
};
