import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, Loader2, Copy, Code } from 'lucide-react';
import logo from "../assets/coderpadLogo.png";

const Chatbot = ({ questionText, dataOverview, expectedAnswer, isDarkMode, chatId, user }) => {
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
    if (chatId) {
      const saved = localStorage.getItem(`chatHistory_${chatId}`);
      if (saved) {
        setMessages(JSON.parse(saved));
        return;
      }
    }
    setMessages([{
      role: 'assistant',
      content: 'Hello! I\'m here to help you with your questions. Feel free to ask me anything!'
    }]);
  }, [chatId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  };

  const formatMessage = (content) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('```') && part.endsWith('```')) {
        const code = part.slice(3, -3).trim();
        const lines = code.split('\n');
        const language = lines.length > 1 ? lines[0].toLowerCase() : 'sql';
        const codeContent = lines.length > 1 ? lines.slice(1).join('\n') : lines[0];
        
        return (
          <div key={index} className={`my-2 rounded-lg border ${
            isDarkMode 
              ? 'bg-[#1e1e1e] border-[#333333]' 
              : 'bg-gray-100 border-gray-200'
          }`}>
            <div className={`flex items-center justify-between px-3 py-1.5 border-b ${
              isDarkMode ? 'border-[#333333]' : 'border-gray-200'
            }`}>
              <div className="flex items-center space-x-2 text-xs">
                <Code className="w-4 h-4" />
                <span>{language}</span>
              </div>
              <button
                onClick={() => copyToClipboard(codeContent)}
                className={`p-1 rounded ${
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
      const contextMessages = [
        {
          "role": "system",
          "content": `You are a helpful and concise assistant for an SQL learning platform.
          Context Information:
          Question: ${questionText}
          Data Overview: ${dataOverview}
          Expected Answer: ${JSON.stringify(expectedAnswer)}
          Instructions:
          - Provide brief and concise responses.
          - If providing SQL queries, format them in a markdown code block.
          - Do not provide the final solution query directly unless explicitly asked. Guide the user instead.
          - Focus on directly answering the user's question.
          - Maintain context from previous messages in this conversation.`
        }
      ];

      const conversationHistory = newMessages.filter(msg => 
        !(msg.role === 'assistant' && msg.content.includes('Hello! I\'m here to help'))
      );

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
        },
        data: {
          messages: contextMessages,
          // highlight-start
          model: "llama-3.3-70b-versatile", // Reverted to your original model
          // highlight-end
          max_tokens: 1024,
          temperature: 0.7
        }
      });

      const botMessage = response.data.choices[0].message.content;
      const finalMessages = [...newMessages, { role: 'assistant', content: botMessage }];
      setMessages(finalMessages);
      
      if (chatId) {
        localStorage.setItem(`chatHistory_${chatId}`, JSON.stringify(finalMessages));
      }
    } catch (error) {
      console.error('Error fetching from Groq API:', error);
      
      let errorMessage = 'Sorry, I am having trouble connecting. Please try again later.';
      if (error.response?.data?.error?.message) {
        errorMessage = `Error: ${error.response.data.error.message}`;
      }
      
      const errorMessages = [...newMessages, { role: 'assistant', content: errorMessage }];
      setMessages(errorMessages);
      
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
    if (chatId) {
      localStorage.removeItem(`chatHistory_${chatId}`);
    }
  };

  return (
    <div className={`flex flex-col h-full ${
      isDarkMode ? 'bg-[#262626]' : 'bg-white'
    }`}>
      
      {/* Header */}
      <div className={`px-4 py-2 border-b ${
        isDarkMode ? 'border-[#333333]' : 'border-gray-200'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* <div className="p-1.5 rounded-md bg-blue-600"> */}
              {/* <Bot className="w-5 h-5 text-white" /> */}
              <img src={logo} alt="logo" className='w-10 h-10'/>
            {/* </div> */}
            <div>
              <h2 className={`font-semibold text-base ${
                isDarkMode ? 'text-gray-200' : 'text-gray-800'
              }`}>
                SQL Genie
              </h2>
              <p className={`text-xs ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                From Query to Clarity - Magically
              </p>
            </div>
          </div>
          <button
            onClick={clearChat}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400/50 scrollbar-track-transparent">        
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start space-x-3 ${
            msg.role === 'user' ? 'justify-end' : 'justify-start'
          } animate-fadeIn`}>
            {msg.role === 'assistant' && (
              <img src={logo} alt="logo" className='w-6 h-6'/>
            )}
            
            <div className={`max-w-xs lg:max-w-md xl:max-w-2xl px-4 py-2.5 rounded-lg ${
              msg.role === 'user'
                ? isDarkMode
                  ? 'bg-teal-800 text-white'
                  : 'bg-teal-600 text-white'
                : isDarkMode
                  ? 'bg-[#333333] text-gray-300'
                  : 'bg-gray-100 text-gray-800'
            }`}>
              <div className="text-sm leading-relaxed">
                {msg.role === 'assistant' ? formatMessage(msg.content) : (
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                )}
              </div>
            </div>
            
            {msg.role === 'user' && (
              <img 
                src={user?.imageUrl || user?.profileImageUrl} 
                alt="User" 
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-start space-x-3 animate-fadeIn">
            {/* <div className={`flex-shrink-0 p-1.5 rounded-md bg-blue-600 mt-1`}> */}
               {/* <Bot className="w-5 h-5 text-white" /> */}
               <img src={logo} alt="logo" className='w-6 h-6'/>
            {/* </div> */}
            <div className={`px-4 py-3 rounded-lg ${
              isDarkMode ? 'bg-[#333333]' : 'bg-gray-100'
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
      <div className={`p-4 border-t ${
        isDarkMode ? 'border-[#333333]' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message here..."
              className={`w-full px-4 py-2 rounded-lg transition-all duration-200 focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                isDarkMode 
                  ? 'bg-[#333333] text-white placeholder-gray-400 border border-gray-600 focus:border-teal-500' 
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500 border border-gray-300 focus:border-teal-500'
              }`}
              disabled={isLoading}
            />
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={isLoading || !userInput.trim()}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              isLoading || !userInput.trim()
                ? 'bg-gray-500 text-gray-400 cursor-not-allowed'
                : 'bg-teal-600 text-white hover:bg-teal-700 active:scale-95'
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