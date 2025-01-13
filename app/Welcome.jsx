import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../components/ScreenWrapper";
import { StatusBar } from "expo-status-bar";
import { theme } from "../constants/theme";
import { hp, wp } from "../helpers/common";
import Button from "../components/Button";

const Welcome = () => {
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
            buttonStyle={{marginHorizontal:wp(3)}}
            onpress={()=>{}}
            />
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
  title:{
    color:theme.colors.text,
    fontSize:hp(4),
    textAlign:"center",
    fontWeight:theme.fonts.extraBold
  },
  puncline:{
    color:theme.colors.text,
    fontSize:hp(1.7),
    textAlign:"center",
    paddingHorizontal:wp(10),
  },
  footer:{
    gap:30,
    width:wp(100),
  }
});
