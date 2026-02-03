import { FC } from "react";
import { MessageAuthor, MessageT } from "@/lib/hooks/useMessages";
import Markdown from "react-native-markdown-display";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
// @ts-expect-error
import SyntaxHighlighter from "react-native-syntax-highlighter";
import {
  atelierDuneDark,
  atelierDuneLight,
  // @ts-expect-error
} from "react-syntax-highlighter/dist/esm/styles/hljs";

const Message: FC<{ message: MessageT }> = ({ message }) => {
  const theme = useColorScheme();
  const textColor = useThemeColor("text");
  const backgroundColor = useThemeColor("messageBackground");

  const markdownRules = {
    fence: (node: any) => {
      // we trim new lines off the end of code blocks because the parser sends an extra one.
      let { content } = node;

      if (
        typeof node.content === "string" &&
        node.content.charAt(node.content.length - 1) === "\n"
      ) {
        content = node.content.substring(0, node.content.length - 1);
      }

      return (
        <SyntaxHighlighter
          language={node.sourceInfo ?? "markdown"}
          style={theme === "dark" ? atelierDuneDark : atelierDuneLight}
          highlighter={"hljs"}
        >
          {content}
        </SyntaxHighlighter>
      );
    },
  };

  return (
    <View
      key={message.id}
      style={{
        ...styles.message,
        backgroundColor:
          message.author == MessageAuthor.AI ? "transparent" : backgroundColor,
        alignSelf:
          message.author == MessageAuthor.Human ? "flex-end" : "flex-start",
      }}
    >
      {message.author === MessageAuthor.Human && (
        <Text style={{ color: textColor }}>{message.content}</Text>
      )}
      {message.author === MessageAuthor.AI && (
        <Markdown
          rules={markdownRules}
          style={{
            ...mdStyles,
            body: {
              ...mdStyles.body,
              color: textColor,
            },
            fence: {
              backgroundColor: backgroundColor,
              color: textColor,
            },
          }}
        >
          {message.content}
        </Markdown>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  message: {
    padding: 16,
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 8,
  },
});

const mdStyles = StyleSheet.create({
  body: {},
  heading1: {
    fontSize: 32,
    fontWeight: "bold",
  },
  heading2: {},
  heading3: {
    fontSize: 20,
    marginBottom: 8,
  },
  heading4: {},
  heading5: {},
  heading6: {},
  paragraph: {
    marginTop: 0,
    marginBottom: 8,
  },
  bullet_list: {
    marginBottom: 16,
  },
  list_item: {
    paddingBottom: 8,
  },
});

export default Message;
