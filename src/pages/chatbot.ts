// Define the structure for each conversational pair
interface QAPair {
  keywords: string[];
  response: string;
}

// Array of all predefined questions and answers
// You can easily add 30-40 more pairs here.
const conversationMatrix: QAPair[] = [
  // Greetings
  {
    keywords: ["hello", "hi", "hey", "greetings"],
    response: "Hello there! I'm the DataSense AI. How can I help you navigate the arena today?",
  },
  // Practice Questions
  {
    keywords: ["practice", "questions", "problem", "solve"],
    response: "You can find over 3000+ challenges by clicking the 'Practice Questions' button. Happy coding!",
  },
  // Live Tests
  {
    keywords: ["live test", "live quiz", "compete", "challenge"],
    response: "Ready for a real-time challenge? Click 'Join Live Tests' to compete with others!",
  },
  // Mock Tests
  {
    keywords: ["mock test", "mock quiz", "exam"],
    response: "The 'Mock Tests' feature is currently under development. It will be available very soon!",
  },
  // Custom Tests
  {
    keywords: ["custom test", "assessment"],
    response: "You can create a personalized test by clicking the 'Custom Test' button to focus on specific skills.",
  },
  // Gaming Arena
  {
    keywords: ["game", "gaming", "arena"],
    response: "Enter the Gaming Arena by clicking the 'Scan to Enter' fingerprint scanners for a more interactive experience!",
  },
  // SQL Help
  {
    keywords: ["sql", "database", "query"],
    response: "This arena is the perfect place to master SQL. You can start with 'Practice Questions' or check out our 'Resources' in the top navigation.",
  },
  // Python Help
  {
    keywords: ["python"],
    response: "While our main focus here is SQL, we have dedicated Python practice areas as well. You can find them in the main practice section.",
  },
  // About the AI
  {
    keywords: ["who are you", "what are you", "your name"],
    response: "I am the DataSense AI Assistant, your guide in this digital frontier. I'm here to help you on your path to data mastery.",
  },
  // Help & Support
  {
    keywords: ["help", "support", "stuck"],
    response: "If you need assistance, check the 'Our Resources' dropdown in the navigation or contact us via the social links (click the bell icon).",
  },
  // Farewell
  {
    keywords: ["bye", "goodbye", "see you"],
    response: "Farewell! May your queries be fast and your data clean. Come back anytime!",
  },
];

// This is the main function that will be exported
export const getChatbotResponse = (userInput: string): string => {
  const lowercasedInput = userInput.toLowerCase();

  // Find the first matching response in our matrix
  for (const pair of conversationMatrix) {
    // Check if any keyword in the pair is present in the user's input
    if (pair.keywords.some(keyword => lowercasedInput.includes(keyword))) {
      return pair.response;
    }
  }

  // If no match is found, return a default response
  return "I'm sorry, I don't have information on that. Could you try rephrasing? You can ask me about practice, live tests, or the gaming arena.";
};