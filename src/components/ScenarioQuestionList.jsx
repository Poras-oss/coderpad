import React from 'react';
import { CheckCircle } from 'lucide-react';

const QuestionList = ({ questions, currentIndex, setCurrentIndex, selectedAnswers, isDarkMode, isOpen }) => {
  return (
    <div className={`${isOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    } rounded-lg shadow-lg mr-4`}>
      <div className={`p-4 ${isDarkMode ? 'bg-[#262626]' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-4 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Questions
        </h3>
        <ul className="space-y-2">
          {questions.map((question, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`p-4 mb-2 rounded-lg cursor-pointer transition-all ${
                currentIndex === index
                  ? isDarkMode
                    ? 'bg-[#363636] border-cyan-600'
                    : 'bg-cyan-50 border-cyan-500'
                  : isDarkMode
                    ? 'hover:bg-[#363636] border-gray-700'
                    : 'hover:bg-gray-50 border-gray-200'
              } ${
                isDarkMode ? 'text-gray-200' : 'text-gray-700'
              }`}
            >
              <span>Question {index + 1}</span>
              {selectedAnswers[index] && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default QuestionList;

