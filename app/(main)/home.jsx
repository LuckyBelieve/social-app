import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { hp, wp } from "@/helpers/common";
import { supabase } from "@/lib/superbase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import { FlatList } from "react-native";
import Loading from "@/components/Loading";
import { userService } from "@/services/userService";

let limit = 0;
const home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [notificationCount, setNotificationCount] = useState(0);

  const handlePostEvent = async (payload) => {
    console.log(payload);

    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload?.new };

      // get the post user
      let res = await userService(newPost?.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    }
    if (payload.eventType === "DELETE" && payload?.old?.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.filter(
          (post) => post.id !== payload?.old?.id
        );
        return updatedPosts;
      });
    }
    if (payload.eventType === "UPDATE" && payload?.new?.id) {
      setPosts((prevPosts) => {
        let updatedPosts = prevPosts.map((post) => {
          if (post.id === payload.new.id) {
            post.body = payload.new.body;
            post.file = payload.new.body;
          }
          return post;
        });
        return updatedPosts;
      });
    }
  };

  useEffect(() => {
    const postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();
    const notificationChannel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `receiverId=eq.${user?.id}`,
        },
        handleNewNotification
      )
      .subscribe();

    return () => {
      postChannel.unsubscribe();
      notificationChannel.unsubscribe();
    };
  }, []);

  const handleNewNotification = async (payload) => {
    // console.log(got );
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      setNotificationCount((prev) => prev + 1);
    }
  };

  // fetching the posts
  const getPosts = async () => {
    if (!hasMore) return null;
    limit = limit + 3;

    const res = await fetchPosts(limit);

    if (res.success) {
      if (posts.length === res.data.length) setHasMore(false);
      setPosts(res.data);
    }
  };

  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>Link Up</Text>
          <View style={styles.icons}>
            <Pressable
              onPress={() => {
                setNotificationCount(0);
                router.push("/notifications");
              }}
            >
              <Icon
                name={"heart"}
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
              {notificationCount > 0 && (
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{notificationCount}</Text>
                </View>
              )}
            </Pressable>
            <Pressable onPress={() => router.push("/newPost")}>
              <Icon
                name={"plus"}
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
            </Pressable>
            <Pressable onPress={() => router.push("/profile")}>
              <Avatar
                uri={user?.image}
                size={hp(4.3)}
                rounded={theme.radius.sm}
                style={{ borderWidth: 2 }}
              />
            </Pressable>
          </View>
        </View>
        {/* posts */}
        <FlatList
          data={posts}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listStyle}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <PostCard item={item} currentUser={user} router={router} />
          )}
          onEndReached={() => {
            getPosts();
          }}
          onEndReachedThreshold={0}
          ListFooterComponent={
            hasMore ? (
              <View style={{ marginVertical: posts.length === 0 ? 200 : 30 }}>
                <Loading />
              </View>
            ) : (
              <View style={{ marginVertical: 30 }}>
                <Text style={styles.noPosts}>no more posts</Text>
              </View>
            )
          }
        />
      </View>
    </ScreenWrapper>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal:wp(4)
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginHorizontal: wp(4),
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(3.2),
    fontWeight: "700",
  },
  avatarImage: {
    height: hp(4.3),
    width: wp(4.3),
    borderRadius: theme.radius.sm,
    borderCurve: "continuous",
    borderColor: theme.colors.gray,
    borderWidth: 3,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  listStyle: {
    paddingTop: 20,
    paddingHorizontal: wp(4),
  },
  noPosts: {
    fontSize: hp(2),
    textAlign: "center",
    color: theme.colors.text,
  },
  pill: {
    position: "absolute",
    right: -10,
    top: -4,
    height: hp(2.2),
    width: hp(2.2),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.roseLight,
  },
  pillText: {
    color: "white",
    fontSize: hp(1.2),
    fontWeight: "700",
  },
});
