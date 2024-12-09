import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const cn = (...classes) => classes.filter(Boolean).join(' ');

const Button = ({ children, className, ...props }) => (
  <button
    className={cn(
      "px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-offset-2",
      className
    )}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className, isDarkMode, ...props }) => (
  <input
    className={cn(
      "px-3 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
      isDarkMode
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
      className
    )}
    {...props}
  />
);

export const ChatInterface = ({ isDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('/api/chat', { message: input });
      const assistantMessage = { role: 'assistant', content: response.data.message };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = { role: 'assistant', content: 'Sorry, there was an error processing your request.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col h-full",
      isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
    )}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center h-full space-y-4"
            >
              <p className={cn(
                "text-lg text-center",
                isDarkMode ? "text-gray-300" : "text-gray-500"
              )}>
                What would you like to know?
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button className={cn(
                  isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                )}>Generate Summary</Button>
                <Button className={cn(
                  isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                )}>Training Style</Button>
                <Button className={cn(
                  isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-gray-800"
                )}>Experience Level</Button>
              </div>
            </motion.div>
          )}

          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={cn(
                "flex w-full sm:w-max max-w-full sm:max-w-[80%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
                message.role === 'user'
                  ? "ml-auto bg-blue-500 text-white"
                  : isDarkMode
                    ? "bg-gray-700 text-gray-100"
                    : "bg-gray-200 text-gray-900"
              )}
            >
              {message.content}
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
              "flex gap-2 w-max rounded-lg px-3 py-2 text-sm",
              isDarkMode ? "bg-gray-700" : "bg-gray-200"
            )}
          >
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className={cn(
                "w-2 h-2 rounded-full",
                isDarkMode ? "bg-gray-400" : "bg-gray-600"
              )}
            />
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
              className={cn(
                "w-2 h-2 rounded-full",
                isDarkMode ? "bg-gray-400" : "bg-gray-600"
              )}
            />
            <motion.span
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
              className={cn(
                "w-2 h-2 rounded-full",
                isDarkMode ? "bg-gray-400" : "bg-gray-600"
              )}
            />
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className={cn(
        "border-t p-4",
        isDarkMode ? "border-gray-700" : "border-gray-200"
      )}>
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            type="text"
            placeholder="Ask me anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
            isDarkMode={isDarkMode}
          />
          <Button 
            type="submit" 
            disabled={isLoading} 
            className={cn(
              "text-white",
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-500 hover:bg-blue-600"
            )}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
};

