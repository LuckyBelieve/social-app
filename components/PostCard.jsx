import {
  Alert,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { theme } from "@/constants/theme";
import { hp, stripHtmlTags, wp } from "@/helpers/common";
import Avatar from "./Avatar";
import moment from "moment";
import Icon from "@/assets/icons";
import RenderHtml from "react-native-render-html";
import { Image } from "expo-image";
import { downloadFile, getSupabaseUrl } from "@/services/imageService";
import { useVideoPlayer, VideoView } from "expo-video";
import { createPostLike, removePostLike } from "@/services/postService";
import Loading from "./Loading";

const textStyle = {
  color: theme.colors.dark,
  fontSize: hp(1.75),
};

const tagStyle = {
  div: textStyle,
  p: textStyle,
  ol: textStyle,
  h1: {
    color: theme.colors.dark,
  },
  h4: {
    color: theme.colors.dark,
  },
};

const PostCard = ({
  item,
  currentUser,
  router,
  hasShadow = true,
  showMoreIcon = true,
  showDelete = false,
  onDelete,
  onEdit,
}) => {
  const player = useVideoPlayer(getSupabaseUrl(item?.file));

  const openPostDetails = () => {
    if (!showMoreIcon) return null;
    router.push({ pathname: "postDetails", params: { postId: item?.id } });
  };

  const createdAt = moment(item.created_at).format("MMM D");
  const [likes, setLikes] = useState([]);
  const [shareLoading, setShareLoading] = useState(false);

  useEffect(() => {
    setLikes(item?.postLikes);
  }, []);

  // liking and unliking the post

  const onLike = async () => {
    if (liked) {
      let updatedLikes = likes?.filter(
        (like) => like.userId !== currentUser.id
      );

      setLikes([...updatedLikes]);

      const res = await removePostLike(item.id, currentUser.id);
      console.log("removedLike: ", res);
      if (!res.success) {
        Alert.alert("Post", "something went wrong!");
      }
    } else {
      let data = {
        userId: currentUser?.id,
        postId: item?.id,
      };
      setLikes([...likes, data]);
      const res = await createPostLike(data);
      console.log("postLike: ", res);
      if (!res.success) {
        Alert.alert("Post", "something went wrong!");
      }
    }
  };

  const liked = likes?.filter((like) => like?.userId === currentUser?.id)[0]
    ? true
    : false;

  // sharing the posts
  const onShare = async () => {
    let content = { message: stripHtmlTags(item.body), url: "" };
    if (item?.file) {
      setShareLoading(true);
      let url = await downloadFile(getSupabaseUrl(item?.file).uri);
      setShareLoading(false);
      content.url = url;
    }

    Share.share(content);
  };

  // deleting the post alert
  const handleDeletePost = () => {
    Alert.alert("Confirm", "Are you sure you to delete this post", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: () => onDelete(item),
        style: "destructive",
      },
    ]);
  };

  return (
    <View style={[styles.container, hasShadow && styles.shadowStyles]}>
      <View style={styles.header}>
        {/* user info */}
        <View style={styles.userInfo}>
          <Avatar
            size={hp(4.5)}
            uri={item?.user?.image}
            rounded={theme.radius.md}
          />
          <View style={{ gap: 2 }}>
            <Text style={styles.username}>{item?.user?.name}</Text>
            <Text style={styles.postTime}>{createdAt}</Text>
          </View>
        </View>
        {showMoreIcon && (
          <TouchableOpacity onPress={openPostDetails}>
            <Icon
              name={"threeDotsHorizontal"}
              strokeWidth={3}
              color={theme.colors.text}
            />
          </TouchableOpacity>
        )}
        {showDelete && currentUser.id === item.userId && (
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => onEdit(item)}>
              <Icon name={"edit"} strokeWidth={2.5} color={theme.colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePost}>
              <Icon
                name={"delete"}
                strokeWidth={2.5}
                color={theme.colors.rose}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* post and media */}
      <View style={styles.content}>
        <View style={styles.postBody}>
          {item?.body && (
            <RenderHtml
              contentWidth={wp(100)}
              source={{ html: item?.body }}
              tagsStyles={tagStyle}
            />
          )}
        </View>
        {/* post image */}
        {item?.file && item.file.includes("postImages") && (
          <Image
            source={getSupabaseUrl(item?.file)}
            transition={100}
            style={styles.postMedia}
            contentFit="cover"
          />
        )}
        {/* post video */}
        {item.file && item.file.includes("postVideos") && (
          <VideoView
            style={[styles.postMedia, { height: hp(30) }]}
            player={player}
            contentFit="cover"
            allowsFullscreen
            allowsPictureInPicture
            nativeControls={true}
          />
        )}
      </View>
      {/* like comment and share */}
      <View style={styles.footer}>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={onLike}>
            <Icon
              name={"heart"}
              size={24}
              fill={liked ? theme.colors.rose : "transparent"}
              color={liked ? theme.colors.rose : theme.colors.textLight}
            />
          </TouchableOpacity>
          <Text style={styles.count}>{likes.length}</Text>
        </View>
        <View style={styles.footerButton}>
          <TouchableOpacity onPress={openPostDetails}>
            <Icon name={"comment"} size={24} color={theme.colors.textLight} />
          </TouchableOpacity>
          <Text style={styles.count}>{item?.comments[0]?.count}</Text>
        </View>
        <View style={styles.footerButton}>
          {shareLoading ? (
            <Loading size="small" />
          ) : (
            <TouchableOpacity onPress={onShare}>
              <Icon name={"share"} size={24} color={theme.colors.textLight} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginBottom: 15,
    borderRadius: theme.radius.xl * 1.1,
    borderCurve: "continuous",
    padding: 10,
    paddingVertical: 12,
    backgroundColor: "white",
    borderWidth: 0.5,
    borderColor: theme.colors.gray,
    shadowColor: "#000",
  },
  shadowStyles: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  username: {
    fontSize: hp(1.7),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  postTime: {
    fontSize: hp(1.5),
    color: theme.colors.textDark,
    fontWeight: theme.fonts.medium,
  },
  content: {
    gap: 10,
  },
  postMedia: {
    height: hp(40),
    width: "100%",
    borderRadius: theme.radius.xl,
    borderCurve: "continuous",
  },
  postBody: {
    marginLeft: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  footerButton: {
    marginLeft: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },
  count: {
    fontSize: hp(1.8),
    color: theme.colors.text,
  },
});
