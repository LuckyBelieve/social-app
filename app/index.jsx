import React from "react";
import { View } from "react-native";
import Loading from "../components/Loading";

const index = () => {
  return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <Loading/>
    </View>
  );
};

export default index;
