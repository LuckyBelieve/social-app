import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  createComment,
  fetchSinglePosts,
  removeComment,
} from "../../services/postService";
import { hp, wp } from "../../helpers/common";
import { theme } from "../../constants/theme";
import PostCard from "../../components/PostCard";
import { useAuth } from "../../context/AuthContext";
import Loading from "../../components/Loading";
import Input from "../../components/Input";
import ScreenWrapper from "../../components/ScreenWrapper";
import Icon from "../../assets/icons";
import CommentItem from "../../components/CommentItem";
import { userService } from "../../services/userService";
import { supabase } from "../../lib/superbase";

const PostDetails = () => {
  const { user } = useAuth();
  const { postId } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const router = useRouter();

  const inputRef = useRef(null);
  const commentRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [sendLoading, setSendLoading] = useState(false);

  const handleNewCommentEvent = async (payload) => {
    console.log("got new comment", payload);
    if (payload.eventType === "INSERT" && payload?.new) {
      let newComment = { ...payload.new, user: {} };
      let res = await userService(newComment.userId);
      newComment = { ...newComment, user: res.success ? res.data : {} };
      setPost((prev) => {
        return {
          ...prev,
          comments: prev.comments
            ? [newComment, ...prev.comments]
            : [newComment],
        };
      });
    }
  };

  useEffect(() => {
    const commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewCommentEvent
      )
      .subscribe();

    getPostDetails();

    return () => {
      commentChannel.unsubscribe();
    };
  }, []);

  const getPostDetails = async () => {
    const res = await fetchSinglePosts(postId);
    if (res.success) setPost(res.data);
    setLoading(false);
  };

  //   creating a comment
  const onNewComment = async () => {
    if (!commentRef.current) return null;
    let data = {
      userId: user?.id,
      postId: post?.id,
      text: commentRef.current,
    };
    // create comment
    setSendLoading(true);
    const res = await createComment(data);
    setSendLoading(false);
    if (res.success) {
      inputRef?.current?.clear();
      commentRef.current = "";
    } else {
      Alert.alert("Comment", res.msg);
    }
  };

  // deleting a comment
  const onDeleteComment = async (comment) => {
    let res = await removeComment(comment?.id);
    if (res.success) {
      setPost((prevPost) => {
        let updatedPost = { ...prevPost };
        updatedPost.comments = updatedPost.comments.filter(
          (c) => c.id !== comment.id
        );
        return updatedPost;
      });
    } else {
      Alert.alert("deleting about");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <Loading />
      </View>
    );
  }
  if (!post) {
    return (
      <View
        style={[
          styles.center,
          { justifyContent: "flex-start", marginTop: 100 },
        ]}
      >
        <Text style={styles.notFound}>Post not found!</Text>
      </View>
    );
  }
  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        >
          {
            <PostCard
              item={{ ...post, comments: [{ count: post?.comments?.length }] }}
              currentUser={user}
              router={router}
              hasShadow={false}
              showMoreIcon={false}
            />
          }
          {/* comment section */}
          <View style={styles.inputContainer}>
            <Input
              inputRef={inputRef}
              onChangeText={(value) => (commentRef.current = value)}
              placeholder="what's your comment on this ..."
              placeholderTextColor={theme.colors.textLight}
              containerStyle={{
                flex: 1,
                height: hp(6.2),
                borderRadius: theme.radius.xl,
              }}
            />
            {sendLoading ? (
              <View style={styles.loading}>
                <Loading size="small" />
              </View>
            ) : (
              <TouchableOpacity style={styles.sendIcon} onPress={onNewComment}>
                <Icon name={"send"} color={theme.colors.primaryDark} />
              </TouchableOpacity>
            )}
          </View>
          {/* comment list */}
          <View style={{ marginVertical: 15, gap: 17 }}>
            {post?.comments?.map((comment, idx) => (
              <CommentItem
                key={idx}
                item={comment}
                canDelete={
                  user?.id == comment?.userId || user?.id == post?.userId
                }
                onDelete={onDeleteComment}
              />
            ))}
            {post.comments.length === 0 && (
              <Text style={{ color: theme.colors.text, marginLeft: 5 }}>
                Be first to comment !
              </Text>
            )}
          </View>
        </ScrollView>
      </View>
    </ScreenWrapper>
  );
};

export default PostDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingVertical: wp(7),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  list: {
    paddingHorizontal: wp(4),
  },
  sendIcon: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.8,
    borderColor: theme.colors.primary,
    borderRadius: theme.radius.lg,
    borderCurve: "continuous",
    height: hp(5.8),
    width: hp(5.8),
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  notFound: {
    fontSize: hp(2.5),
    color: theme.colors.text,
    fontWeight: theme.fonts.medium,
  },
  loading: {
    height: hp(5.8),
    width: hp(5.8),
    justifyContent: "center",
    alignItems: "center",
    transform: [{ scale: 1.3 }],
  },
});
