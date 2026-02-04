export interface StatusT {
  status: ChatbotStatus;
}

export enum ChatbotStatus {
  THINKING = "THINKING",
  SEARCHING = "SEARCHING",
  RESPONDING = "RESPONDING",
  COMPLETED = "COMPLETED",
}

// Board game themed status messages
const ThinkingMessages: string[] = [
  "Rolling the dice...",
  "Consulting the rulebook...",
  "Planning my next move...",
  "Drawing a strategy card...",
  "Calculating victory points...",
  "Pondering the board state...",
  "Weighing my options...",
  "Shuffling through possibilities...",
  "Analyzing the game state...",
  "Preparing my turn...",
];

const SearchingMessages: string[] = [
  "Rolling for Knowledge...",
  "Searching the dungeon...",
  "Exploring the map...",
  "Drawing from the deck...",
  "Checking the reference cards...",
  "Scouring the archives...",
  "Flipping through the rulebook...",
  "Raiding the library...",
  "Questing for answers...",
  "Investigating the clues...",
];

// Get a random status message for a given status type
export const getRandomStatusMessage = (
  status: ChatbotStatus
): string | null => {
  const getRandomItem = (arr: string[]): string => {
    return arr[Math.floor(Math.random() * arr.length)];
  };

  switch (status) {
    case ChatbotStatus.THINKING:
      return getRandomItem(ThinkingMessages);
    case ChatbotStatus.SEARCHING:
      return getRandomItem(SearchingMessages);
    default:
      return null;
  }
};

// Helper to check if status should be shown in UI
export const isVisibleStatus = (status: ChatbotStatus | null): boolean => {
  return (
    status === ChatbotStatus.THINKING || status === ChatbotStatus.SEARCHING
  );
};
