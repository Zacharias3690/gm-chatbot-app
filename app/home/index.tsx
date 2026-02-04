import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { generateGuid } from "@/lib/helpers/generateGuid";
import { MessageT, MessageAuthor, useMessages } from "@/lib/hooks/useMessages";
import { io } from "socket.io-client";
import ThemedButton from "@/lib/components/common/ThemedButton";
import Message from "@/lib/components/Message/Message";
import ThemedTextInput from "@/lib/components/common/ThemedTextInput";
import { Stack } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { HeaderTitle } from "@react-navigation/elements";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import Toast from "react-native-toast-message";
import { usePdfUpload } from "@/lib/hooks/usePdfUpload";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  ChatbotStatus,
  getRandomStatusMessage,
  isVisibleStatus,
  type StatusT,
} from "@/lib/constants/Status";

type PendingRequest = {
  id: string;
  query: string;
  chatId: string;
  timestamp: number;
} | null;

const REQUEST_TIMEOUT_MS = 60000; // 60 seconds

function Home() {
  const [text, setText] = useState<string>("");
  const { messages, upsertMessage, clearMessages } = useMessages();
  const [chatId, setChatId] = useState<string>();
  const [pendingRequest, setPendingRequest] = useState<PendingRequest>(null);
  const pendingRequestRef = useRef<PendingRequest>(null);
  const socket = useMemo(
    () =>
      // Server
      io("ws://64.23.133.29", { transports: ["websocket"], query: { b64: 1 } }),

    // Localhost
    // io("ws://5174-207-96-67-71.ngrok-free.app", {
    //   transports: ["websocket"],
    //   query: { b64: 1 },
    // }),
    []
  );
  const scrollView = useRef<ScrollView>(null);
  const headerText = useThemeColor("headerText");
  const headerBackgroundColor = useThemeColor("headerBackground");
  const messageBackground = useThemeColor("messageBackground");
  const [isConnected, setConnected] = useState(false);
  const [status, setStatus] = useState<ChatbotStatus | null>(null);
  const { uploadPdf } = usePdfUpload();
  const insets = useSafeAreaInsets();
  const statusMessage = useMemo(() => {
    return status ? getRandomStatusMessage(status) : null;
  }, [status]);

  // Keep ref in sync for use in socket handlers
  useEffect(() => {
    pendingRequestRef.current = pendingRequest;
  }, [pendingRequest]);

  const retryPendingRequest = useCallback(() => {
    const pending = pendingRequestRef.current;
    if (!pending) return;

    const elapsed = Date.now() - pending.timestamp;
    if (elapsed < REQUEST_TIMEOUT_MS) {
      console.log("Retrying pending request:", pending.id);
      socket.emit("json", {
        event: "chatbot_request",
        request_id: pending.id,
        data: {
          chat_id: pending.chatId,
          query: pending.query,
        },
      });
    } else {
      // Request timed out, clear it
      setPendingRequest(null);
      setStatus(null);
    }
  }, [socket]);

  useEffect(() => {
    resetConversation();

    socket.on("connect", () => {
      console.log("Connected to server");
      setConnected(true);
      // Retry pending request on reconnect
      retryPendingRequest();
    });

    socket.on("request_acknowledged", (data: { request_id: string }) => {
      console.log("Request acknowledged:", data.request_id);
    });

    socket.on("receive_message", (data: MessageT) => {
      upsertMessage(data.id, data.content, MessageAuthor.AI);
      scrollView.current?.scrollToEnd();
    });

    socket.on("receive_status", (data: StatusT) => {
      console.log("Received status", data);
      setStatus(data.status);
    });

    socket.on("request_complete", (data: { request_id: string }) => {
      console.log("Request complete:", data.request_id);
      setPendingRequest(null);
      setStatus(null);
    });

    socket.on(
      "request_error",
      (data: { request_id: string; error: string }) => {
        console.error("Request error:", data.error);
        setPendingRequest(null);
        setStatus(null);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.error,
        });
      }
    );

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      setConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.log("Error connecting to server", err);
      setConnected(false);
    });

    return () => {
      socket.disconnect();
      socket.removeAllListeners();
    };
  }, []);

  function resetConversation() {
    setChatId(generateGuid());
    clearMessages();
    setText("");
  }

  function handleSubmit() {
    const requestId = generateGuid();
    const request: PendingRequest = {
      id: requestId,
      query: text,
      chatId: chatId!,
      timestamp: Date.now(),
    };

    setPendingRequest(request);
    upsertMessage(generateGuid(), text, MessageAuthor.Human);
    scrollView.current?.scrollToEnd();
    socket.emit("json", {
      event: "chatbot_request",
      request_id: requestId,
      data: {
        chat_id: chatId,
        query: text,
      },
    });
    setText("");
  }

  async function handlePdfUpload() {
    await uploadPdf({
      onStart: (filename) => {
        Toast.show({
          type: "info",
          text1: "Uploading PDF",
          text2: filename,
        });
      },
      onSuccess: (filename) => {
        Toast.show({
          type: "success",
          text1: "Upload Complete",
          text2: filename,
        });
      },
      onError: (error) => {
        Toast.show({
          type: "error",
          text1: "Upload Failed",
          text2: error,
        });
      },
    });
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={insets.top + 16}
      style={{
        flex: 1,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: messageBackground,
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <Stack.Screen
        options={{
          headerTitle: "",
          headerStyle: { backgroundColor: headerBackgroundColor },
          headerLeft: () => {
            return (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <HeaderTitle style={{ color: headerText }}>
                  Game Master
                </HeaderTitle>
                <View
                  style={{
                    width: 12,
                    height: 12,
                    marginLeft: 8,
                    backgroundColor: isConnected ? "green" : "red",
                    borderRadius: 6,
                  }}
                />
              </View>
            );
          },
          headerRight: () => (
            <Feather.Button
              name={"edit"}
              backgroundColor={"transparent"}
              onPressOut={resetConversation}
            />
          ),
        }}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingTop: 16,
          paddingBottom: 16,
        }}
        ref={scrollView}
      >
        {messages.map((message) => (
          <Message
            key={message.id}
            message={{
              id: message.id,
              content: message.content,
              author: message.author,
            }}
          />
        ))}

        {status && isVisibleStatus(status) && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
              paddingVertical: 8,
              gap: 8,
              marginBottom: 16,
            }}
          >
            <ActivityIndicator size="small" color="#888" />
            <Text
              style={{
                color: "#888",
                fontStyle: "italic",
                fontSize: 14,
              }}
            >
              {statusMessage}
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          padding: 16,
          paddingBottom: Math.max(24, insets.bottom + 8),
          backgroundColor: messageBackground,
        }}
      >
        <ThemedTextInput
          placeholder={"Ask the Game Master a question..."}
          value={text}
          onChangeText={(value) => setText(value)}
          multiline={true}
          numberOfLines={6}
          onSubmitEditing={handleSubmit}
        />

        <View style={{ flexDirection: "row", gap: 8 }}>
          <ThemedButton onPress={handlePdfUpload}>
            <Feather name="file" size={20} />
          </ThemedButton>
          <ThemedButton onPress={handleSubmit}>Send</ThemedButton>
        </View>
      </View>

      <Toast />
    </KeyboardAvoidingView>
  );
}

export default Home;
