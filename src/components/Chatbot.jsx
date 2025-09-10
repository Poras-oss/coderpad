import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Bot, User, Loader2, MessageCircle, Copy, Code } from 'lucide-react';

const Chatbot = ({ questionText, dataOverview, expectedAnswer, isDarkMode, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Try to load chat history from localStorage if chatId is provided
    if (chatId) {
      const saved = localStorage.getItem(`chatHistory_${chatId}`);
      if (saved) {
        setMessages(JSON.parse(saved));
        return;
      }
    }
    // Otherwise, initialize with welcome message
    setMessages([{
      role: 'assistant',
      content: 'Hello! I\'m here to help you with your questions. Feel free to ask me anything!'
    }]);
  }, [chatId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      // Could add a toast notification here
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const formatMessage = (content) => {
    // Split content into paragraphs and code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        // This is a code block
        const code = part.slice(3, -3).trim();
        const lines = code.split('\n');
        const language = lines[0].toLowerCase();
        const codeContent = lines.slice(1).join('\n') || lines[0];
        
        return (
          <div key={index} className={`my-3 rounded-lg border ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-gray-50 border-gray-200'
          }`}>
            <div className={`flex items-center justify-between px-3 py-2 border-b ${
              isDarkMode ? 'border-gray-600' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-2">
                <Code className="w-4 h-4" />
                <span className="text-sm font-medium">{language}</span>
              </div>
              <button
                onClick={() => copyToClipboard(codeContent)}
                className={`p-1 rounded hover:bg-opacity-80 ${
                  isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
                title="Copy code"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <pre className={`p-3 overflow-x-auto text-sm ${
              isDarkMode ? 'text-gray-300' : 'text-gray-800'
            }`}>
              <code>{codeContent}</code>
            </pre>
          </div>
        );
      } else {
        // Regular text - split by double newlines for paragraphs
        const paragraphs = part.split('\n\n').filter(p => p.trim());
        return paragraphs.map((paragraph, pIndex) => (
          <p key={`${index}-${pIndex}`} className="mb-2 last:mb-0">
            {paragraph.trim()}
          </p>
        ));
      }
    });
  };

  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    const newMessages = [...messages, { role: 'user', content: userInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);

    try {
      // Prepare context from conversation history
      const contextMessages = [
        {
          "role": "system",
          "content": `You are a helpful and concise assistant. Provide clear, brief answers unless asked for detailed explanations. Format code properly and focus on practical solutions.
          
          Context Information:
          Question: ${questionText}
          Data Overview: ${dataOverview}
          Expected Answer: ${JSON.stringify(expectedAnswer)}
          
          Instructions:
          - Provide brief and concise responses unless the user specifically asks for a detailed explanation
          - If providing SQL queries or code, format them clearly with proper syntax, dont provide solution directly unless asked
          - Focus on directly answering what the user asked
          - Break down complex concepts into simple, digestible parts
          - Use bullet points or numbered lists sparingly, only when they truly improve clarity
          - If the user asks about SQL queries, provide the query and a brief explanation of what it does
          - Keep explanations practical and actionable
          - Maintain context from previous messages in this conversation`
        }
      ];

      // Add conversation history (excluding system messages and welcome message)
      const conversationHistory = newMessages.filter(msg => 
        !(msg.role === 'assistant' && msg.content === 'Hello! I\'m here to help you with your questions. Feel free to ask me anything!')
      );

      // Convert our message format to OpenAI format
      conversationHistory.forEach(msg => {
        contextMessages.push({
          role: msg.role,
          content: msg.content
        });
      });

      const response = await axios({
        method: 'POST',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          messages: contextMessages,
          model: "llama-3.3-70b-versatile",
          max_tokens: 1024,
          temperature: 0.7
        }
      });

      const botMessage = response.data.choices[0].message.content;
      const finalMessages = [...newMessages, { role: 'assistant', content: botMessage }];
      setMessages(finalMessages);
      
      // Save to localStorage
      if (chatId) {
        localStorage.setItem(`chatHistory_${chatId}`, JSON.stringify(finalMessages));
      }
    } catch (error) {
      console.error('Error fetching from Groq API:', error);
      console.error('Error response:', error.response?.data);
      
      let errorMessage = 'Sorry, I am having trouble connecting to the server. Please try again later.';
      
      if (error.response?.data?.error?.message) {
        errorMessage = `Error: ${error.response.data.error.message}`;
      } else if (!process.env.REACT_APP_GROQ_API_KEY) {
        errorMessage = 'API key is missing. Please check your environment variables.';
      }
      
      const errorMessages = [...newMessages, { role: 'assistant', content: errorMessage }];
      setMessages(errorMessages);
      
      // Save error state to localStorage too
      if (chatId) {
        localStorage.setItem(`chatHistory_${chatId}`, JSON.stringify(errorMessages));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    const welcomeMessage = [{
      role: 'assistant',
      content: 'Hello! I\'m here to help you with your questions. Feel free to ask me anything!'
    }];
    
    setMessages(welcomeMessage);
    
    // Remove from localStorage
    if (chatId) {
      localStorage.removeItem(`chatHistory_${chatId}`);
    }
  };

  return (
    <div className={`flex flex-col h-full max-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'
    } transition-all duration-300`}>
      
      {/* Header */}
      <div className={`px-6 py-4 border-b ${
        isDarkMode 
          ? 'bg-gray-800/90 border-gray-700 backdrop-blur-sm' 
          : 'bg-white/90 border-gray-200 backdrop-blur-sm'
      } shadow-sm`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
            } shadow-lg`}>
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className={`font-semibold text-lg ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>
                AI Assistant
              </h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Always here to help
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className={`px-3 py-1 text-sm rounded-lg transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">        
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-3 ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          } animate-fadeIn`}>
            {msg.role === 'assistant' && (
              <div className={`flex-shrink-0 p-2 rounded-full ${
                isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
              } shadow-md mt-1`}>
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}
            
            <div className={`max-w-xs lg:max-w-md xl:max-w-2xl px-4 py-3 rounded-2xl shadow-sm ${
              msg.role === 'user'
                ? isDarkMode
                  ? 'bg-blue-600 text-white shadow-blue-600/20'
                  : 'bg-blue-500 text-white shadow-blue-500/20'
                : isDarkMode
                  ? 'bg-gray-700/80 text-gray-100 border border-gray-600/50 backdrop-blur-sm'
                  : 'bg-white/80 text-gray-900 border border-gray-200/50 backdrop-blur-sm shadow-gray-200/50'
            } ${
              msg.role === 'user' 
                ? 'rounded-br-md shadow-lg' 
                : 'rounded-bl-md shadow-md'
            } transition-all duration-200 hover:shadow-lg`}>
              <div className="text-sm leading-relaxed">
                {msg.role === 'assistant' ? formatMessage(msg.content) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
            
            {msg.role === 'user' && (
              <div className={`flex-shrink-0 p-2 rounded-full ${
                isDarkMode ? 'bg-gray-600' : 'bg-gray-400'
              } shadow-md mt-1`}>
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3 animate-fadeIn">
            <div className={`flex-shrink-0 p-2 rounded-full ${
              isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
            } shadow-md mt-1`}>
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className={`px-4 py-3 rounded-2xl rounded-bl-md shadow-md ${
              isDarkMode
                ? 'bg-gray-700/80 border border-gray-600/50 backdrop-blur-sm'
                : 'bg-white/80 border border-gray-200/50 backdrop-blur-sm'
            }`}>
              <div className="flex items-center space-x-2">
                <Loader2 className={`w-4 h-4 animate-spin ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`} />
                <span className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Thinking...
                </span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-6 border-t ${
        isDarkMode 
          ? 'bg-gray-800/50 border-gray-700 backdrop-blur-sm' 
          : 'bg-white/50 border-gray-200 backdrop-blur-sm'
      }`}>
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              rows="1"
              className={`w-full px-4 py-3 rounded-2xl resize-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                isDarkMode 
                  ? 'bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500' 
                  : 'bg-white text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-blue-500 shadow-sm'
              }`}
              style={{ minHeight: '48px', maxHeight: '120px' }}
              disabled={isLoading}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
            className={`p-3 rounded-2xl transition-all duration-200 shadow-lg ${
              isLoading || !userInput.trim()
                ? isDarkMode 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isDarkMode
                  ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-95 shadow-blue-600/25'
                  : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95 shadow-blue-500/25'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Chatbot;