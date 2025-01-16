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
    const { data } = await supabase
      .from("posts")
      .select("*,user:users(id,name,image),postLikes (*),comments (count)")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (data) return { success: true, data: data };
  } catch (error) {
    console.log("create Post error: ", error);
    return { success: false, msg: "could not create your post" };
  }
};

export const createPostLike = async (postLike) => {
  try {
    const { data } = await supabase
      .from("postLikes")
      .insert(postLike)
      .select()
      .single();

    if (data) return { success: true, data: data };
  } catch (error) {
    console.log("Like error: ", error);
    return { success: false, msg: "could add the post like" };
  }
};

export const removePostLike = async (postId, userId) => {
  try {
    const { error } = await supabase
      .from("postLikes")
      .delete()
      .eq("userId", userId)
      .eq("postId", postId);

    if (!error) return { success: true };
  } catch (error) {
    console.log("Like error: ", error);
    return { success: false, msg: "could not remove the post like" };
  }
};

// getting a single post

export const fetchSinglePosts = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select(
        "*,user:users(id,name,image),postLikes (*),comments (*, user: users(id,name,image))"
      )
      .eq("id", postId)
      .order("created_at", { ascending: false, referencedTable: "comments" })
      .single();

    if (error) {
      console.log(error);
    }

    if (data) return { success: true, data: data };
  } catch (error) {
    console.log("get Post error: ", error);
    return { success: false, msg: "could not get your post" };
  }
};

// comment creation
export const createComment = async (comment) => {
  try {
    const { data } = await supabase
      .from("comments")
      .insert(comment)
      .select()
      .single();

    if (data) return { success: true, data: data };
  } catch (error) {
    console.log("Like error: ", error);
    return { success: false, msg: "could not create the post comment" };
  }
};

// comment deletion

export const removeComment = async (commentId) => {
  try {
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId)

    if (!error) return { success: true };
  } catch (error) {
    console.log("Like error: ", error);
    return { success: false, msg: "could not delete comment" };
  }
};
