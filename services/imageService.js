import * as Filesystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import { supabase } from "@/lib/superbase";
import { supabaseUrl } from "@/constants";

export const getUserImageSrc = (imagePath) => {
  if (imagePath) {
    return getSupabaseUrl(imagePath);
  } else {
    return require("../assets/images/defaultUser.png");
  }
};

export const getSupabaseUrl = (filePath) => {
  return {
    uri: `${supabaseUrl}/storage/v1/object/public/uploads/${filePath}`,
  };
};

export const uploadFile = async (folderName, fileUrl, isImage = true) => {
  try {
    let filename = getFilePath(folderName, isImage);
    const fileBase64 = await Filesystem.readAsStringAsync(fileUrl, {
      encoding: Filesystem.EncodingType.Base64,
    });
    let imageData = decode(fileBase64);

    let { data, error } = await supabase.storage
      .from("uploads")
      .upload(filename, imageData, {
        cacheControl: "3600",
        upsert: false,
        contentType: isImage ? "/image/*" : "/video/*",
      });
    if (data && !error) return { success: true, data: data.path };
  } catch (error) {
    return { success: false, msg: "could not upload media" };
  }
};

export const getFilePath = (folderName, isImage) => {
  return `/${folderName}/${new Date().getTime()}${isImage ? ".png" : ".mp4"}`;
};
