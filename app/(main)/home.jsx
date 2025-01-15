import Icon from "@/assets/icons";
import Avatar from "@/components/Avatar";
import { theme } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { hp, wp } from "@/helpers/common";
import { supabase } from "@/lib/superbase";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";
import { fetchPosts } from "@/services/postService";
import PostCard from "@/components/PostCard";
import { FlatList } from "react-native";

let limit = 0;
const home = () => {
  const { setAuth, user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  // fetching the posts
  const getPosts = async () => {
    limit = limit + 10;
    console.log("limit:", limit);

    const res = await fetchPosts(limit);
    
    if (res.success) setPosts(res.data);
  };
  
  return (
    <ScreenWrapper bg={"white"}>
      <View style={styles.container}>
        {/* header */}
        <View style={styles.header}>
          <Text style={styles.title}>Link Up</Text>
          <View style={styles.icons}>
            <Pressable onPress={() => router.push("/notifications")}>
              <Icon
                name={"heart"}
                size={hp(3.2)}
                strokeWidth={2}
                color={theme.colors.text}
              />
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
