import React, { useState, useEffect } from 'react';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Info, Lock, ArrowLeft } from 'lucide-react';
import queryString from 'query-string';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import logo from '../assets/dslogo.png'

const TestSeriesMcqHome = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigateTo = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProgress, setUserProgress] = useState({
    easy: false,
    medium: false,
  });
  const parsed = queryString.parse(window.location.search);
  const subject = parsed.subject;

  const getFirstName = (fullName) => {
    return fullName.split(' ')[0];
  };

  const quizzesBySubject = {
    mysql: [
      {
        _id: '1',
        quizName: 'Basic Data Analysis',
        type: 'MCQ',
        difficulty: 'Easy',
        description: 'Test your fundamental knowledge of data analysis concepts and techniques.',
      },
      {
        _id: '2',
        quizName: 'Intermediate Database Queries',
        type: 'SQL',
        difficulty: 'Medium',
        description: 'Challenge yourself with complex SQL queries and database management problems.',
      },
      {
        _id: '3',
        quizName: 'Advanced Machine Learning',
        type: 'Python',
        difficulty: 'Hard',
        description: 'Dive deep into advanced machine learning algorithms and implementations.',
      },
    ],
    python: [
      {
        _id: '1',
        quizName: 'Basic Data Analysis',
        type: 'MCQ',
        difficulty: 'Easy',
        description: 'Test your fundamental knowledge of data analysis concepts and techniques.',
      },
      {
        _id: '2',
        quizName: 'Intermediate Database Queries',
        type: 'SQL',
        difficulty: 'Medium',
        description: 'Challenge yourself with complex SQL queries and database management problems.',
      },
      {
        _id: '3',
        quizName: 'Advanced Machine Learning',
        type: 'Python',
        difficulty: 'Hard',
        description: 'Dive deep into advanced machine learning algorithms and implementations.',
      },
    ],
    excel: [
      {
        _id: '1',
        quizName: 'Excel Easy Quiz',
        type: 'MCQ',
        difficulty: 'Easy',
        description: 'Test your fundamental knowledge of data analysis concepts and techniques.',
      },
      {
        _id: '2',
        quizName: 'Excel Medium Quiz',
        type: 'MCQ',
        difficulty: 'Medium',
        description: 'Challenge yourself with complex SQL queries and database management problems.',
      },
      {
        _id: '3',
        quizName: 'Excel Hard Quiz',
        type: 'MCQ',
        difficulty: 'Hard',
        description: 'Dive deep into advanced machine learning algorithms and implementations.',
      },
    ],
    powerbi: [
      {
        _id: '1',
        quizName: 'PowerBI Easy Quiz',
        type: 'MCQ',
        difficulty: 'Easy',
        description: 'Test your fundamental knowledge of data analysis concepts and techniques.',
      },
      {
        _id: '2',
        quizName: 'PowerBI Medium Quiz',
        type: 'SQL',
        difficulty: 'Medium',
        description: 'Challenge yourself with complex SQL queries and database management problems.',
      },
      {
        _id: '3',
        quizName: 'PowerBI Hard Quiz',
        type: 'Python',
        difficulty: 'Hard',
        description: 'Dive deep into advanced machine learning algorithms and implementations.',
      },
    ],
    tableau: [
      {
        _id: '1',
        quizName: 'Tableau Easy Quiz',
        type: 'MCQ',
        difficulty: 'Easy',
        description: 'Test your fundamental knowledge of data analysis concepts and techniques.',
      },
      {
        _id: '2',
        quizName: 'Tableau Medium Quiz',
        type: 'SQL',
        difficulty: 'Medium',
        description: 'Challenge yourself with complex SQL queries and database management problems.',
      },
      {
        _id: '3',
        quizName: 'Tableau Hard Quiz',
        type: 'Python',
        difficulty: 'Hard',
        description: 'Dive deep into advanced machine learning algorithms and implementations.',
      },
    ],
  };




  const selectedQuizzes = quizzesBySubject[subject] || quizzesBySubject.hardcodedQuizzes;


  useEffect(() => {
    const storedProgress = localStorage.getItem('userQuizProgress');
    if (storedProgress) {
      setUserProgress(JSON.parse(storedProgress));
    }
  }, []);

  useEffect(() => {
    validateSubject();
  }, [subject]); // Added subject as a dependency

  


  const validateSubject = () => {
    const validSubjects = ['mysql', 'python', 'tableau', 'excel', 'powerbi'];
    
    if (!subject) {
      showPopup('URL is malformed. Subject is missing.');
      redirectToHomePage();
    } else if (!validSubjects.includes(subject.toLowerCase())) {
      showPopup('URL is malformed. Invalid subject.');
      redirectToHomePage();
    } else if (subject.toLowerCase() === 'mysql' || subject.toLowerCase() === 'python') {
      
      showPopup('Questions will be available soon');
      redirectToHomePage();
    } else {
      //fetchQuizzes();
    }
  };
  

  const showPopup = (message) => {
    alert(message);
  };

  const redirectToHomePage = () => {
    window.top.location.href = 'https://practice.datasenseai.com/';
  };


  const handleStartQuiz = (quizID, quizType, difficulty) => {
    if (!isSignedIn) {
      alert('You need to log in to start the quiz.');
      return;
    }
    //updateUserProgress(difficulty);
    
  
    navigateTo(`/mcq?subject=${subject}&difficulty=${difficulty.toLowerCase()}`);


  };

  function backToHome(){
    window.top.location.href = 'https://practice.datasenseai.com/';
  }

  const isQuizEnabled = (difficulty) => {
    if (difficulty === 'Easy') return true;
    if (difficulty === 'Medium') return userProgress[`${subject}_easy`];
    if (difficulty === 'Hard') return userProgress[`${subject}_easy`] && userProgress[`${subject}_medium`];
    return false;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };



  return (
    <div className={`font-sans min-h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
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
      {/* <h3 className='text-white'>{(subject).toUpperCase()} Questions</h3> */}

        
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
                  <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-white'} md:${isDarkMode ? 'text-white' : 'text-white'}`}>
                    Welcome, {user.firstName}
                  </span>
                  <UserButton afterSignOutUrl={`/quiz-area?subject=${subject}`} />
                </div>
              ) : (
                <SignInButton mode="modal" fallbackRedirectUrl={`/quiz-area?subject=${subject}`} >
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
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedQuizzes.map((quiz) => (
            <div key={quiz._id} className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:scale-105`}>
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 break-words">{quiz.quizName}</h2>
                <div className="flex items-center mb-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">{quiz.type}</span>
                </div>
                <h5 className={`mb-4 text-sm sm:text-base lg:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} line-clamp-3 sm:line-clamp-none break-words`}>
                  {quiz.description}
                </h5>
                <button
                  onClick={() => handleStartQuiz(quiz._id, quiz.type, quiz.difficulty)}
                  className={`w-full font-bold py-2 px-4 rounded transition duration-300 flex items-center justify-center text-sm sm:text-base
                    ${isQuizEnabled(quiz.difficulty)
                      ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
                      : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                  disabled={!isQuizEnabled(quiz.difficulty)}
                >
                  {isQuizEnabled(quiz.difficulty) ? (
                    'Start Quiz'
                  ) : (
                    <>
                      <Lock size={16} className="mr-2" />
                      Locked
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className={`mt-auto py-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className="container mx-auto px-4">
          <div className={`flex items-center justify-center p-4 rounded-lg ${isDarkMode ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
            <Info size={20} className="text-cyan-500 mr-3 flex-shrink-0" />
            <h6 className={`text-center text-xs sm:text-sm md:text-base lg:text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} break-words`}>
              Complete the easy quiz to unlock medium, then hard levels.
            </h6>
          </div>
        </div>
      </footer>
    </div>
  );
};



export default TestSeriesMcqHome;