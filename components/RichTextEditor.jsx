import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { theme } from "../constants/theme";

const RichTextEditor = ({ editorRef, onchange }) => {
  return (
    <View style={{ minHeight: 285 }}>
      <RichToolbar
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.insertOrderedList,
          actions.setStrikethrough,
          actions.removeFormat,
          actions.blockquote,
          actions.alignCenter,
          actions.alignLeft,
          actions.alignRight,
          actions.code,
          actions.line,
          actions.heading1,
          actions.heading4,
        ]}
        iconMap={{
          [actions.heading1]: ({ tintColor }) => (
            <Text style={{ color: tintColor, fontWeight: 500 }}>H1</Text>
          ),
          [actions.heading4]: ({ tintColor }) => (
            <Text style={{ color: tintColor, fontWeight: 500 }}>H4</Text>
          ),
        }}
        style={styles.richBar}
        selectedIconTint={theme.colors.primaryDark}
        flatContainerStyle={styles.listStyles}
        editor={editorRef}
        disabled={false}
      />
      <RichEditor
        ref={editorRef}
        containerStyle={styles.rich}
        editorStyle={styles.contentStyle}
        placeholder="What's on your mind!"
      />
      <RichEditor />
    </View>
  );
};

export default RichTextEditor;

const styles = StyleSheet.create({
  richBar: {
    borderTopLeftRadius: theme.radius.xl,
    borderTopRightRadius: theme.radius.xl,
    backgroundColor: theme.colors.gray,
  },
  rich: {
    minHeight: 240,
    flex: 1,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: theme.radius.xl,
    borderBottomRightRadius: theme.radius.xl,
    borderColor: theme.colors.gray,
    padding: 5,
  },
  contentStyle: {
    color: theme.colors.textDark,
    placeholderColor: "gray",
  },
  flatStyle: {
    paddingHorizontal: 8,
    gap: 3,
  },
});
