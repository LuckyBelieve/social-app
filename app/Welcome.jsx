import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import Button from "../components/Button";
import { useRouter } from "expo-router";

const Welcome = () => {
    const router = useRouter();
  return (
    <ScreenWrapper bg={"white"}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* welcome Image */}
        <Image
          source={require("../assets/images/welcome.png")}
          alt="welcomeImage"
          resizeMode="contain"
          style={styles.welcomeImage}
        />
        {/* title */}
        <View style={{ gap: 20 }}>
          <Text style={styles.title}>Link Up</Text>
          <Text style={styles.puncline}>
            Where every thoughts finds a home and every image tells a story
          </Text>
        </View>
        {/* footer */}
        <View style={styles.footer}>
          <Button
            title="Get Started"
            buttonStyle={{ marginHorizontal: wp(3) }}
            onpress={() => router.push("signUp")}
          />
          <View style={styles.bottomTextContainer}>
            <Text style={styles.loginText}>Already have an account?</Text>
            <Pressable onPress={() => router.push("login")}>
              <Text
                style={[
                  styles.loginText,
                  {
                    color: theme.colors.primaryDark,
                    fontWeight: theme.fonts.semibold,
                  },
                ]}
              >
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",
    paddingHorizontal: wp(4),
  },
  welcomeImage: {
    width: wp(100),
    height: hp(30),
    alignSelf: "center",
  },
  title: {
    color: theme.colors.text,
    fontSize: hp(4),
    textAlign: "center",
    fontWeight: theme.fonts.extraBold,
  },
  puncline: {
    color: theme.colors.text,
    fontSize: hp(1.7),
    textAlign: "center",
    paddingHorizontal: wp(10),
  },
  footer: {
    gap: 30,
    width: wp(100),
  },
  bottomTextContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  loginText: {
    textAlign: "center",
    color: theme.colors.text,
    fontSize: hp(1.6),
  },
});
