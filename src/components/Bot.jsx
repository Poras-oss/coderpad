import React from 'react';
import { ChatInterface } from './ChatInterface';

const Bot = ({ isDarkMode }) => {
  return (
    <div className="h-full w-full">
      <ChatInterface isDarkMode={isDarkMode} />
    </div>
  );
};

export default Bot;

