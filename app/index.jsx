import React from "react";
import { View } from "react-native";
import Loading from "../components/Loading";
import ScreenWrapper from "../components/ScreenWrapper";

const index = () => {
  return (
    <ScreenWrapper bg={"white"}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Loading />
      </View>
    </ScreenWrapper>
  );
};

export default index;
