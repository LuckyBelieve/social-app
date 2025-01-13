import { Alert, StyleSheet, Text, View } from "react-native";
import React from "react";
import ScreenWrapper from "../../components/ScreenWrapper";
import BackButton from "../../components/BackButton";
import Button from "../../components/Button";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../lib/superbase";

const home = () => {
  const { setAuth } = useAuth();

  const onLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout", error.message);
    }
  };
  return (
    <ScreenWrapper bg={"white"}>
      <BackButton  router={""}/>
      <Button buttonStyle={""} textStyle={""} title="logout" onpress={onLogout} />
    </ScreenWrapper>
  );
};

export default home;
