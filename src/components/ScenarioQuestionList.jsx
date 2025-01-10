import React from 'react';
import { CheckCircle } from 'lucide-react';

const QuestionList = ({ questions, currentIndex, setCurrentIndex, selectedAnswers, isDarkMode, isOpen }) => {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-lg mr-4`}>
      <div className="p-4">
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Questions
        </h3>
        <ul className="space-y-2">
          {questions.map((question, index) => (
            <li
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`cursor-pointer p-2 rounded-md flex items-center justify-between ${
                currentIndex === index
                  ? isDarkMode
                    ? 'bg-gray-700 text-white'
                    : 'bg-cyan-100 text-cyan-800'
                  : isDarkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>Question {index + 1}</span>
              {selectedAnswers[index] && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionList;

