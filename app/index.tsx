import {SafeAreaView, ScrollView, View, Text} from "react-native";
import {useEffect, useMemo, useRef, useState} from "react";
import {generateGuid} from "@/app/helpers/generateGuid";
import {MessageT, MessageAuthor, useMessages} from "@/app/hooks/useMessages";
import {io} from "socket.io-client";
import ThemedButton from "@/app/components/common/ThemedButton";
import Message from "@/app/components/Message/Message";
import ThemedTextInput from "@/app/components/common/ThemedTextInput";
import {Stack} from "expo-router";
import Feather from '@expo/vector-icons/Feather'
import {Header, HeaderTitle} from "@react-navigation/elements";
import {set} from "immutable";
import {useThemeColor} from "@/app/hooks/useThemeColor";
import Toast from 'react-native-toast-message';
import {usePdfUpload} from "@/app/hooks/usePdfUpload";

function Home() {
    const [text, setText] = useState<string>('');
    const {messages, upsertMessage, clearMessages} = useMessages();
    const [chatId, setChatId] = useState<string>();
    const socket = useMemo(() => io('ws://64.23.133.29', { transports: ['websocket'], query: { b64: 1 } }), []);
    const scrollView = useRef<ScrollView>(null);
    const headerText = useThemeColor('headerText');
    const [isConnected, setConnected] = useState(false);
    const { uploadPdf } = usePdfUpload();

    useEffect(() => {
        resetConversation();

        socket.on('connect', () => {
            console.log('Connected to server');
            setConnected(true);
        });

        socket.on('receive_message', (data: MessageT) => {
            upsertMessage(data.id, data.content, MessageAuthor.AI);
            scrollView.current?.scrollToEnd();
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
            setConnected(false);
        });

        socket.on('connect_error', (err) => {
            console.log('Error connecting to server', err);
            setConnected(false);
        })

        return () => {
            socket.disconnect();
            socket.removeAllListeners();
        }
    }, []);

    function resetConversation() {
        setChatId(generateGuid());
        clearMessages();
        setText('');
    }

    function handleSubmit() {
        upsertMessage(generateGuid(), text, MessageAuthor.Human)
        scrollView.current?.scrollToEnd()
        socket.emit("json", {
            event: 'chatbot_request',
            data: {
                chat_id: chatId,
                query: text
            }
        });
        setText('');
    }

    async function handlePdfUpload() {
        await uploadPdf({
            onStart: (filename) => {
                Toast.show({
                    type: 'info',
                    text1: 'Uploading PDF',
                    text2: filename,
                });
            },
            onSuccess: (filename) => {
                Toast.show({
                    type: 'success',
                    text1: 'Upload Complete',
                    text2: filename,
                });
            },
            onError: (error) => {
                Toast.show({
                    type: 'error',
                    text1: 'Upload Failed',
                    text2: error,
                });
            }
        });
    }

    return (
        <SafeAreaView
            style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-end",
            }}
        >
            <Stack.Screen
                name="home"
                options={{
                    headerTitle: () => {
                        return (
                            <View style={{ flexDirection: 'row', alignItems: 'center'}}>
                                <HeaderTitle style={{color: headerText}}>Game Master</HeaderTitle>
                                <View style={{
                                    width: 12,
                                    height: 12,
                                    marginLeft: 8,
                                    backgroundColor: isConnected ? 'green' : 'red',
                                    borderRadius: '50%'
                                }}/>
                            </View>
                        )
                    },
                    headerRight: () => (
                        <Feather.Button
                            name={"edit"}
                            backgroundColor={'transparent'}
                            onPressOut={resetConversation}/>
                    )
                }}
            />
            <ScrollView style={{flexGrow: 1, paddingTop: 16, paddingBottom: 16}} ref={scrollView}>
                {messages.map((message) => (
                    <Message key={message.id} message={message} />
                ))}
            </ScrollView>
            <View style={{flexDirection: 'row', margin: 16, marginBottom: 24, alignItems: 'center'}}>
                <ThemedTextInput
                    placeholder={"Ask GMBot Anything"}
                    value={text}
                    onChangeText={(value) => setText(value)}
                    onSubmitEditing={handleSubmit}/>

                <View style={{flexDirection: 'row', gap: 8}}>
                    <ThemedButton onPress={handlePdfUpload}>
                        <Feather name="file" size={20} />
                    </ThemedButton>
                    <ThemedButton onPress={handleSubmit}>Send</ThemedButton>
                </View>
            </View>
            <Toast />
        </SafeAreaView>
    );
}

export default Home;