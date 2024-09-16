import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import logo from '../assets/dslogo.png'


const skills = ['Excel', 'SQL', 'Python', 'PowerBI', 'Tableau'];

import { Video, FileText, ChevronDown, X, ArrowLeft } from 'lucide-react';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';


const DataSkillsDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigateTo = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const parsed = queryString.parse(window.location.search);
  const userID = parsed.userID;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const removeQuizTypePrefix = (quizName) => {
    return quizName.replace(/^(sql:|python:|mcq:)\s*/i, '');
  };

  const getQuizType = (quizName) => {
    const lowerCaseQuizName = quizName.toLowerCase();
    if (lowerCaseQuizName.startsWith('sql:')) return 'SQL';
    if (lowerCaseQuizName.startsWith('python:')) return 'Python';
    if (lowerCaseQuizName.startsWith('mcq:')) return 'MCQ';
    return 'Unknown';
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('https://server.datasenseai.com/quiz/quizzes');
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };
  
  const handleStartQuiz = (quizID, userID, quizName) => {
   /* if (!isSignedIn) {
      alert('You need to log in to start the quiz.');
      return;
    } */
  
    const lowerCaseQuizName = quizName.toLowerCase();
  
    if (lowerCaseQuizName.includes('sql:')) {
      navigateTo(`/quiz?quizID=${quizID}&userID=${userID}`);
    } else if (lowerCaseQuizName.includes('python:')) {
      navigateTo(`/pyQuiz?quizID=${quizID}&userID=${userID}`);
    } else if (lowerCaseQuizName.includes('mcq:')) {
      navigateTo(`/mcqQuiz?quizID=${quizID}&userID=${userID}`);
    } else {
      alert('Unknown quiz type.');
    }
  };

  const handleRegisterQuiz = async (quizID, userID) => {
    if (!isSignedIn) {
      alert('You need to log in to register for the quiz.');
      return;
    }
    try {
      const response = await axios.post('https://server.datasenseai.com/sql-quiz/register', {
        userID: userID,
        quizID: quizID,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log('Quiz registration successful:', response.data);
      alert('Quiz registration successful');
    } catch (error) {
      console.error('Error registering quiz:', error);
      alert('Failed to register for quiz');
    }
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
       return 'Results';
    }
  };

  const handleQuizResults = (quizID, userID, quizName) => {
    if (!isSignedIn) {
      alert('You need to log in to get the results.');
      return;
    }
    //Adding navigation to leaderboard screen here
    navigateTo(`/leaderboard?quizID=${quizID}&userID=${userID}&quizName=${quizName}`);
  }

  function backToHome(){
    window.top.location.href = 'https://practice.datasenseai.com';
  }



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
       return 'bg-green-600 hover:bg-green-700';
    }
  };

  const filteredQuizzes = selectedSkill
    ? quizzes.filter(quiz => quiz.quizName.toLowerCase().includes(selectedSkill.toLowerCase()))
    : quizzes;

  return (
    <div className={`font-sans min-h-screen ${isDarkMode ? 'bg-[#262626] text-white' : 'bg-gray-100 text-black'}`}>
    <header className={`p-4 ${isDarkMode ? 'bg-oxford-blue text-white' : 'bg-oxford-blue text-gray-800'}`}>
      <div className="container mx-auto flex justify-between items-center relative">
        
      <div className="flex items-center">
  <button
    onClick={backToHome}
    className="mr-2 text-white hover:text-gray-300 transition-colors duration-200"
    aria-label="Go back"
  >
    <ArrowLeft size={24} />
  </button>
  <img 
    className="h-12 w-auto cursor-pointer"
    src={logo}
    alt="Datasense"
    onClick={backToHome}
  />
</div>
   
        
        <div className="md:hidden z-20">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 text-white"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex absolute md:relative top-full left-0 right-0 md:top-auto ${isDarkMode ? 'bg-gray-800' : 'bg-gray-800'} md:bg-transparent z-10 flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 p-4 md:p-0`}>
          <ul className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full md:w-auto">
            <li>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-full ${isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-800 text-yellow-400'}`}
                aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {isDarkMode ? <FaSun /> : <FaMoon />}
              </button>
            </li>
            <li className="w-full md:w-auto">
              {isLoaded && isSignedIn ? (
                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
                 <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-white'} md:${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Welcome, {user.firstName}
                  </span>
                  <UserButton afterSignOutUrl={`/live-events`} />
                </div>
              ) : (
                <SignInButton mode="modal" fallbackRedirectUrl={`/live-events`} signUpForceRedirectUrl={`/live-events`}  >
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 text-sm w-full md:w-auto">
                  Log In
                </button>
              </SignInButton>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main className="container mx-auto p-4">
      <div className="flex flex-wrap justify-center gap-2 my-6">
        {skills.map((skill) => (
          <button
            key={skill}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 
              ${selectedSkill === skill 
                ? 'bg-cyan-600 text-white' 
                : isDarkMode
                  ? 'bg-[#403f3f] text-white border border-gray-600 hover:bg-[#4a4a4a]'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
            onClick={() => setSelectedSkill(skill === selectedSkill ? null : skill)}
          >
            {skill}
          </button>
        ))}
      </div>

      <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} shadow-md rounded-lg overflow-x-auto`}>
        <table className="w-full">
          <thead className={isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'}>
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difficulty</th> */}
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} divide-y ${isDarkMode ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {filteredQuizzes.map((quiz, index) => (
              <tr key={quiz._id} className={index % 2 === 0 ? (isDarkMode ? 'bg-[#333333]' : 'bg-gray-50') : (isDarkMode ? 'bg-[#403f3f]' : 'bg-white')}>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  {getQuizType(quiz.quizName)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  {removeQuizTypePrefix(quiz.quizName)}
                </td>
           
                {/* <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${quiz.difficulty ? 
                      (quiz.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : 
                      quiz.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800') 
                      : 'bg-green-100 text-green-800'}`}>
                    {quiz.difficulty || 'Easy'}
                  </span>
                </td> */}
                <td className="px-4 py-4 whitespace-nowrap">
                <button
                    onClick={() => {
                      if (determineButtonLabel(quiz) === 'Register') {
                        handleRegisterQuiz(quiz._id, userID);
                      } else if (determineButtonLabel(quiz) === 'Start') {
                        handleStartQuiz(quiz._id, userID, quiz.quizName);
                      } else if (determineButtonLabel(quiz) === 'Results') {
                        handleQuizResults(quiz._id, userID, quiz.quizName);
                      }
                    }}
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

export default DataSkillsDashboard;