import {SafeAreaView, ScrollView, View} from "react-native";
import {useEffect, useMemo, useRef, useState} from "react";
import {generateGuid} from "@/app/helpers/generateGuid";
import {MessageT, MessageAuthor, useMessages} from "@/app/hooks/useMessages";
import {io} from "socket.io-client";
import ThemedButton from "@/app/components/common/ThemedButton";
import Message from "@/app/components/Message/Message";
import ThemedTextInput from "@/app/components/common/ThemedTextInput";
import {Stack} from "expo-router";
import Feather from '@expo/vector-icons/Feather'

function Home() {
    const [text, setText] = useState<string>('');
    const {messages, upsertMessage, clearMessages} = useMessages();
    const [chatId, setChatId] = useState<string>();
    const socket = useMemo(() => io('ws://35.193.110.152'), []);
    const scrollView = useRef<ScrollView>(null);

    useEffect(() => {
        resetConversation();

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('receive_message', (data: MessageT) => {
            upsertMessage(data.id, data.content, MessageAuthor.AI);
            scrollView.current?.scrollToEnd();
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        socket.on('connect_error', (err) => {
            console.log('Error connecting to server', err);
        })

        return () => {
            socket.disconnect();
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
                    title: "GameMaster Bot",
                    headerRight: () => (
                        <Feather.Button
                            name={"edit"}
                            backgroundColor={'transparent'}
                            onPress={() => {resetConversation()}}/>
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

                <ThemedButton onPress={handleSubmit}>Send</ThemedButton>
            </View>
        </SafeAreaView>
    );
}

export default Home;