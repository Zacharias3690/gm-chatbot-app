import {atom, useAtomValue, useSetAtom} from "jotai";
import {Map, List} from 'immutable';

export interface MessageT {
    id: string;
    content: string;
    author: MessageAuthor;
}

export enum MessageAuthor {
    Human = 'Human',
    AI = 'AI'
}

const messageIdsAtom = atom<List<string>>(List<string>(["db468ca4-04f2-4810-908c-e6ba2a797de4", "2e800c2f-0b26-4325-83d1-9e5164ef5926"]));
const messageDataAtom = atom<Map<string, MessageT>>(Map<string, MessageT>({
    "db468ca4-04f2-4810-908c-e6ba2a797de4": {
        "id": "db468ca4-04f2-4810-908c-e6ba2a797de4",
        "content": "Scythe",
        "author": MessageAuthor.Human,
    },
    "2e800c2f-0b26-4325-83d1-9e5164ef5926": {
        "author": MessageAuthor.AI,
        "content": "**Scythe** is a popular board game designed by Jamey Stegmaier and published by Stonemaier Games. It is set in an alternate-history 1920s Europe, where players take on the roles of leaders of different factions vying for control of the land and resources following the aftermath of a great war.\n\n### Theme\nIn Scythe, players are immersed in a world filled with steampunk elements, featuring gigantic mechs, resources to manage, and a beautifully illustrated game board. Each faction has its own unique abilities and starting positions, which adds to the game's strategic depth.\n\n### Mechanics\n- **Asymmetrical Factions**: Each player belongs to a different faction with unique strengths, weaknesses, and special abilities, which encourages varied strategies.\n- **Action Selection**: Players choose actions from a player board that allows for a combination of resource management, movement, combat, and building.\n- **Resource Management**: Players collect various resources like wood, metal, oil, and food, which are essential for deploying mechs, constructing buildings, and achieving objectives.\n- **Combat**: Combat can occur between players, but it is not the primary focus of the game. Combat is resolved through a combination of power and combat cards and can be a significant aspect of player interaction.\n- **Mech Customization**: Players can build and deploy mechs that provide different abilities, enhancing their strategies and options.\n- **Objectives and Star Achievements**: Players earn stars by completing various objectives, such as winning battles, upgrading their faction, or gaining control of territories, which ultimately determine the winner.\n\n### Victory Conditions\nThe game ends when a player achieves a certain number of stars, and the winner is determined by who has the most coins, which are obtained through various means such as gaining control of territories, winning battles, or completing objectives.\n\nOverall, Scythe combines economic development with strategic warfare, allowing for a mix of conflict and cooperation, making it a favorite among strategy board game enthusiasts.",
        "id": "2e800c2f-0b26-4325-83d1-9e5164ef5926"
    }
}));
const upsertMessageAtom = atom(null, (get, set, messageId: string, content: string, author: MessageAuthor = MessageAuthor.AI) => {
    const messageData = get(messageDataAtom);
    const messageIds = get(messageIdsAtom);

    if (!messageData.has(messageId)) {
        set(messageIdsAtom, messageIds.push(messageId));
    }

    set(messageDataAtom, messageData.set(messageId, {
        id: messageId,
        content,
        author
    }));
});
const clearMessagesAtom = atom(null, (_, set) => {
    set(messageIdsAtom, List());
    set(messageDataAtom, Map());
})
const messagesAtom = atom<List<MessageT>>((get) => {
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

export default useMessages;