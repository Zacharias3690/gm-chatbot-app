import {atom, useAtomValue, useSetAtom} from "jotai";
import {Map,List} from 'immutable';

export interface Message {
    id: string;
    content: string;
}

const messageIdsAtom = atom<List<string>>(List<string>());
const messageDataAtom = atom<Map<string, Message>>(Map<string, Message>());
const upsertMessageAtom = atom(null, (get, set, messageId: string, content: string) => {
    const messageData = get(messageDataAtom);
    const messageIds = get(messageIdsAtom);

    if(!messageData.has(messageId)) {
        set(messageIdsAtom, messageIds.push(messageId));
    }

    set(messageDataAtom, messageData.set(messageId, {
        id: messageId,
        content
    }));
});
const clearMessagesAtom = atom(null, (_, set) => {
    set(messageIdsAtom, List());
    set(messageDataAtom, Map());
})
const messagesAtom = atom<List<Message>>((get) => {
    const messageIds = get(messageIdsAtom);
    const messageData = get(messageDataAtom);

    return messageIds
        .map((id: string) => messageData.get(id))
        .filter((item) => item != null);
})


export const useMessages = () => {
    const messages = useAtomValue(messagesAtom);
    const upsertMessage = useSetAtom(upsertMessageAtom);
    const clearMessages = useSetAtom(clearMessagesAtom);

    return {
        messages,
        upsertMessage,
        clearMessages
    }
}