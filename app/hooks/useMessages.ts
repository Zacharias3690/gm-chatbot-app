import { atom, useAtomValue, useSetAtom } from "jotai";
import { Map, List } from "immutable";
import { useMemo } from "react";

export interface MessageT {
  id: string;
  content: string;
  author: MessageAuthor;
}

export enum MessageAuthor {
  Human = "Human",
  AI = "AI",
}

const messageIdsAtom = atom<List<string>>(List<string>([]));
const messageDataAtom = atom<Map<string, MessageT>>(Map<string, MessageT>());
const upsertMessageAtom = atom(
  null,
  (
    get,
    set,
    messageId: string,
    content: string,
    author: MessageAuthor = MessageAuthor.AI
  ) => {
    const messageData = get(messageDataAtom);
    const messageIds = get(messageIdsAtom);

    if (!messageData.has(messageId)) {
      set(messageIdsAtom, messageIds.push(messageId));
    }

    set(
      messageDataAtom,
      messageData.set(messageId, {
        id: messageId,
        content,
        author,
      })
    );
  }
);
const clearMessagesAtom = atom(null, (_, set) => {
  set(messageIdsAtom, List());
  set(messageDataAtom, Map());
});
const messagesAtom = atom<List<MessageT>>((get) => {
  const messageIds = get(messageIdsAtom);
  const messageData = get(messageDataAtom);

  return messageIds
    .map((id: string) => messageData.get(id))
    .filter((item) => item != null);
});

export const useMessages = () => {
  const messages = useAtomValue(messagesAtom);
  const upsertMessage = useSetAtom(upsertMessageAtom);
  const clearMessages = useSetAtom(clearMessagesAtom);

  return {
    messages,
    upsertMessage,
    clearMessages,
  };
};

export default useMessages;
