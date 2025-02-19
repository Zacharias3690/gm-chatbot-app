import {Button, Pressable, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {useEffect, useMemo, useState} from "react";
import {generateGuid} from "@/app/helpers/generateGuid";
import {Message, useMessages} from "@/app/hooks/useMessages";
import {io} from "socket.io-client";
import Markdown from "@ronradtke/react-native-markdown-display";
import {SafeAreaProvider} from "react-native-safe-area-context";

export default function Index() {
    const [text, setText] = useState<string>('');
    const {messages, upsertMessage, clearMessages} = useMessages();
    const [chatId, setChatId] = useState<string>();
    const socket = useMemo(() => io('http://10.0.2.2:8080'), []);

    useEffect(() => {
        resetConversation();

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('receive_message', (data: Message) => {
            upsertMessage(data.id, data.content);
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

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
        setText('');
        socket.emit("json", {
            event: 'chatbot_request',
            data: {
                chat_id: chatId,
                query: text
            }
        });
    }

    return (
        <View
            style={{
                flex: 1,
                flexDirection: "column",
                justifyContent: "flex-end",
            }}
        >
            <ScrollView style={{flexGrow: 1}}>
                {messages.map((message) => (
                    <View>
                        <Markdown>{message.content}</Markdown>
                    </View>
                ))}
            </ScrollView>
            <View style={{flexDirection: 'row', margin: 16, marginBottom: 24, alignItems: 'center'}}>
                <TextInput
                    placeholder={"Ask GMBot Anything"}
                    value={text}
                    onChangeText={(value) => setText(value)}
                    defaultValue={text}
                    style={{
                        height: 40,
                        padding: 4,
                        paddingLeft: 8,
                        paddingRight: 0,
                        margin: 12,
                        borderWidth: 1,
                        borderRadius: 10,
                        borderBottomRightRadius:0,
                        borderTopRightRadius: 0,
                        flexGrow: 1
                    }}/>


                <TouchableOpacity
                    onPress={handleSubmit}
                    style={{backgroundColor: "#183A37", alignItems: 'center', padding: 10}}
                >
                    <Text style={{color: "#FFFFFF" }}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
        ;
}
