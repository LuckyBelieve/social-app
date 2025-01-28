import { supabase } from "../lib/superbase";

export const createNotification = async (notification) => {
  try {
    const { data } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();

    if (data) return { success: true, data: data };
  } catch (error) {
    console.log("Like error: ", error);
    return { success: false, msg: "could add the post like" };
  }
};

export const fetchNotifications = async (receiverId) => {
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `*,
          sender: senderId(id,name,image)
          `
      )
      .eq("receiverId", receiverId)
      .order("created_at", { ascending: false });

    if (error) {
      console.log(error);
    }

    if (data) return { success: true, data: data };
  } catch (error) {
    console.log("get notifications error: ", error);
    return { success: false, msg: "could not get your post" };
  }
};
