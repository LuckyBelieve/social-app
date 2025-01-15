import { supabase } from "../lib/superbase";
import { uploadFile } from "./imageService";

export const createUpdatePost = async (post) => {
  try {
    if (post?.file && typeof post?.file === "object") {
      let isImage = post?.file?.type === "image";
      let folderName = isImage ? "postImages" : "postVideos";

      //   file upload
      let fileResult = await uploadFile(folderName, post.file.uri, isImage);
      if (fileResult.success) post.file = fileResult.data;
      else return fileResult;
    }

    const { data, error } = await supabase
      .from("posts")
      .upsert(post)
      .select()
      .single();

    if (data && !error) return { success: true, data: data };
  } catch (error) {
    console.log("create Post error: ", error);
    return { success: false, msg: "could not create your post" };
  }
};

export const fetchPosts = async (limit = 10) => {
  try {
    const {data} = await supabase
      .from("posts")
      .select('*,user:users(id,name,image)')
      .order("created_at", { ascending: false })
      .limit(limit);

      if(data) return {success:true,data:data}
  } catch (error) {
    console.log("create Post error: ", error);
    return { success: false, msg: "could not create your post" };
  }
};
