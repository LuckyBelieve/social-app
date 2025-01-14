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

export const updateUser = async (userId, udateData) => {
  try {
    const { error, data } = await supabase
      .from("users")
      .update(udateData)
      .eq("id", userId);
    if (error) return { success: false, msg: error.message };
    return { success: true };
  } catch (error) {
    console.log("got an error: ", error);
    return { success: false, msg: error.message };
  }
};
