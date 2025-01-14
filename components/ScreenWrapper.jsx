import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { StatusBar } from "expo-status-bar";

const ScreenWrapper = ({children,bg}) => {
  return (
    <SafeAreaView style={{flex:1,backgroundColor:bg}}>
      <StatusBar style='dark'/>
      {children}
    </SafeAreaView>
  )
}

export default ScreenWrapper