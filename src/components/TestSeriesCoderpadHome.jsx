import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { Video, FileText, Sun, Moon, ChevronDown, ChevronUp } from 'lucide-react';

const difficulties = ['Easy', 'Medium', 'Hard'];

const TestSeriesCoderpadHome = () => {
  const { isAuthenticated, user, loginWithRedirect, logout } = useAuth0();
  const navigateTo = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const parsed = queryString.parse(window.location.search);
  const userID = parsed.userID;
  const subject = parsed.subject;

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const removeQuizTypePrefix = (quizName) => {
    return quizName.replace(/^(sql:|python:|mcq:)\s*/i, '');
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`https://server.datasenseai.com/test-series-coding/${subject}`);
      const formattedQuizzes = response.data.map(quiz => ({
        _id: quiz._id,
        quizName: quiz.question_text,
        difficulty: quiz.difficulty,
        start: new Date().toISOString(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };
  
  const handleStartQuiz = (quizID, userID, quizName) => {
    if (!isAuthenticated) {
      alert('You need to log in to start the quiz.');
      return;
    }
    navigateTo(`/quiz?questionID=${quizID}&userID=${userID}`);
  };

  const determineButtonLabel = (quiz) => {
    const lowerCaseQuizName = quiz.quizName.toLowerCase();
    const now = new Date();
    const startDate = new Date(quiz.start);
    const endDate = new Date(quiz.end);

    if (now < startDate) {
      return 'Register';
    } else if (now >= startDate && now <= endDate) {
      return 'Start';
    } else {
      return lowerCaseQuizName.includes('mcq:') ? 'Results' : 'Ended';
    }
  };

  const determineButtonColor = (quiz) => {
    const lowerCaseQuizName = quiz.quizName.toLowerCase();
    const now = new Date();
    const startDate = new Date(quiz.start);
    const endDate = new Date(quiz.end);

    if (now < startDate) {
      return 'bg-blue-600 hover:bg-blue-700';
    } else if (now >= startDate && now <= endDate) {
      return 'bg-cyan-600 hover:bg-gray-800';
    } else {
      return lowerCaseQuizName.includes('mcq:') ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const filteredQuizzes = selectedDifficulty
    ? quizzes.filter(quiz => quiz.difficulty.toLowerCase() === selectedDifficulty.toLowerCase())
    : quizzes;

  const toggleQuestionExpansion = (quizId) => {
    setExpandedQuestions(prev => ({...prev, [quizId]: !prev[quizId]}));
  };

  const shortenQuestion = (question, maxLength = 50) => {
    if (question.length <= maxLength) return question;
    return question.substring(0, maxLength) + '...';
  };

  return (
    <div className={`font-sans min-h-screen ${isDarkMode ? 'bg-[#262626] text-white' : 'bg-gray-100 text-black'}`}>
      <header className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-cyan-700'} p-2 flex justify-between items-center`}>
        <h1 className="text-3xl text-white">Datasense</h1>
        <div className="flex items-center">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`mr-4 p-2 rounded-full ${isDarkMode ? 'bg-yellow-400 text-[#262626]' : 'bg-[#262626] text-yellow-400'}`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {isAuthenticated ? (
            <div className="flex items-center">
              <span className="mr-4 text-white">Welcome, {user.name}</span>
              <button
                onClick={() => logout({ returnTo: window.location.origin })}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Log Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => loginWithRedirect()}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Log In
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="flex flex-wrap justify-center gap-2 my-6">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
                ${selectedDifficulty === difficulty 
                  ? 'bg-cyan-600 text-white' 
                  : isDarkMode
                    ? 'bg-[#403f3f] text-white border border-gray-600 hover:bg-[#4a4a4a]'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
              onClick={() => setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty)}
            >
              {difficulty}
            </button>
          ))}
        </div>

        <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} shadow-md rounded-lg overflow-x-auto`}>
          <table className="w-full">
            <thead className={isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'}>
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S.No</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Question</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Solution</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
              {filteredQuizzes.map((quiz, index) => (
                <tr key={quiz._id} className={index % 2 === 0 ? (isDarkMode ? 'bg-[#333333]' : 'bg-gray-50') : (isDarkMode ? 'bg-[#403f3f]' : 'bg-white')}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">{index + 1}</td>
                  <td className="px-4 py-4 text-sm font-medium">
                    <div className="flex items-center">
                      <span>{shortenQuestion(removeQuizTypePrefix(quiz.quizName))}</span>
                      <button onClick={() => toggleQuestionExpansion(quiz._id)} className="ml-2">
                        {expandedQuestions[quiz._id] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                    {expandedQuestions[quiz._id] && (
                      <div className="mt-2 text-sm text-gray-500">
                        {removeQuizTypePrefix(quiz.quizName)}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-600">
                        <FileText size={20} />
                      </button>
                      <button className="text-blue-400 hover:text-blue-600">
                        <Video size={20} />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${quiz.difficulty === 'easy' ? 'bg-green-100 text-green-800' : 
                        quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'}`}>
                      {quiz.difficulty || 'Easy'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleStartQuiz(quiz._id, userID, quiz.quizName)}
                      className={`text-white font-bold py-2 px-5 rounded-xl ${determineButtonColor(quiz)}`}
                      disabled={determineButtonLabel(quiz) === 'Ended'}
                    >
                      {determineButtonLabel(quiz)}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default TestSeriesCoderpadHome;