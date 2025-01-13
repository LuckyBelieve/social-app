import React from "react";
import { useRouter } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import ScreenWrapper from "../components/ScreenWrapper";

const index = () => {
  const router = useRouter();
  return (
    <ScreenWrapper>
      <Text>index</Text>
      <Button title="Welcome" onPress={() => router.push("Welcome")} />
    </ScreenWrapper>
  );
};

export default index;

const styles = StyleSheet.create({});
