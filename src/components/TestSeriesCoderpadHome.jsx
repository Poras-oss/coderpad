import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { Video, FileText, ChevronDown, X, ArrowLeft } from 'lucide-react';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import ReactPlayer from 'react-player/youtube';
import logo from '../assets/dslogo.png'

const TestSeriesCoderpadHome = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigateTo = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [difficulties, setDifficulties] = useState(['Easy', 'Medium', 'Hard']);

  const parsed = queryString.parse(window.location.search);
  const userID = parsed.userID;
  const subject = parsed.subject;

  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState('');

  const sampleVideoId = '0O0jrTUg3UM';

  useEffect(() => {
    validateSubject();
    checkAndBreakOutOfIframe();
  }, [subject]);

  const openVideoPopup = (quiz) => {
    if (quiz.video) {
      // Extract video ID from YouTube URL
      const videoId = extractYoutubeId(quiz.video);
      if (videoId) {
        setCurrentVideoId(`https://www.youtube.com/watch?v=${videoId}`);
        setIsVideoPopupOpen(true);
      } else {
        console.error('Invalid YouTube URL:', quiz.video);
        alert('Invalid YouTube URL');
      }
    } else {
      console.log('No video available for this quiz');
      alert('Video coming soon...');
    }
  };
  
  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const closeVideoPopup = () => {
    setIsVideoPopupOpen(false);
    setCurrentVideoId('');
  };


  const checkAndBreakOutOfIframe = () => {
    if (window.self !== window.top) {
      // The page is in an iframe
      const currentUrl = window.location.href;
      const storageKey = 'iframeBreakoutAttempt';
      const breakoutAttempt = sessionStorage.getItem(storageKey);

      if (!breakoutAttempt) {
        // Set a flag in sessionStorage to prevent infinite redirects
        sessionStorage.setItem(storageKey, 'true');
        // Break out of the iframe
        window.top.location.href = currentUrl;
      } else {
        // Clear the flag if we've already attempted to break out
        sessionStorage.removeItem(storageKey);
      }
    }
  };

  const normalizeDifficulty = (difficulty) => {
    const normalized = difficulty.toLowerCase();
    if (normalized === 'advance' || normalized === 'advanced') {
      return 'hard';
    }
    return normalized;
  };
  
  const getDifficultyStyle = (difficulty) => {
    const normalizedDifficulty = normalizeDifficulty(difficulty);
    switch (normalizedDifficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
      case 'advance':
        return 'bg-red-100 text-red-800';
      case 'easy-medium':
      case 'medium-easy':
        return 'bg-green-100 text-yellow-800';
      case 'easy-hard':
      case 'hard-easy':
        return 'bg-green-100 text-red-800';
      case 'medium-hard':
      case 'hard-medium':
        return 'bg-yellow-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const updateAvailableDifficulties = (quizzes) => {
    const availableDifficulties = new Set(['Easy', 'Medium']);
    quizzes.forEach(quiz => {
      if (quiz.difficulty === 'hard' || quiz.difficulty === 'advance') {
        availableDifficulties.add('Hard');
      }
    });
    setDifficulties(Array.from(availableDifficulties));
  };
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const validateSubject = () => {
    const validSubjects = ['mysql', 'python', 'tableau', 'excel', 'powerbi'];
    
    if (!subject) {
      showPopup('URL is malformed. Subject is missing.');
      redirectToHomePage();
    } else if (!validSubjects.includes(subject.toLowerCase())) {
      showPopup('URL is malformed. Invalid subject.');
      redirectToHomePage();
    } else if (subject.toLowerCase() == 'excel' || subject.toLowerCase() == 'powerbi'|| subject.toLowerCase() == 'tableau') {
      redirectToScenarioPage(subject.toLowerCase());
    }  else {
      fetchQuizzes();
    }
  };

  const showPopup = (message) => {
    alert(message);
  };

  const redirectToHomePage = () => {
    window.top.location.href = 'https://practice.datasenseai.com/';
  };
  const redirectToScenarioPage = (subject) => {
    window.location.href = '/scenario-area?subject='+subject;
  };

  const removeQuizTypePrefix = (quizName) => {
    return quizName.replace(/^(sql:|python:|mcq:)\s*/i, '');
  };

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get(`https://server.datasenseai.com/test-series-coding/${subject}`);
      const formattedQuizzes = response.data.map(quiz => ({
        _id: quiz._id,
        quizName: quiz.question_text,
        difficulty: quiz.difficulty || quiz.level || 'Easy',
        start: new Date().toISOString(),
        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setQuizzes(formattedQuizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleStartQuiz = (quizID, userID, quizName) => {
    // if (!isSignedIn) {
    //   alert('You need to log in to start the quiz.');
    //   return;
    // }
    
    let route = '/quiz';
    if (subject.toLowerCase() === 'python') {
      route = '/pyQuiz';
    }
    
    navigateTo(`${route}?questionID=${quizID}&userID=${userID}`);
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
      return lowerCaseQuizName.includes('mcq:') ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700';
    }
  };

  const filteredQuizzes = selectedDifficulty
    ? quizzes.filter(quiz => normalizeDifficulty(quiz.difficulty) === selectedDifficulty.toLowerCase())
    : quizzes;

  const toggleQuestionExpansion = (quizId) => {
    setExpandedQuestions(prev => ({...prev, [quizId]: !prev[quizId]}));
  };

  const shortenQuestion = (question, maxLength = 135) => {
    if (question.length <= maxLength) return question;
    return question.substring(0, maxLength) + '...';
  };

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent };
  };

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
      <h3 className='text-white'>{(subject).toUpperCase()} Questions</h3>
        
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
                  <UserButton afterSignOutUrl={`/practice-area?subject=${subject}`} />
                </div>
              ) : (
                <SignInButton mode="modal" fallbackRedirectUrl={`/practice-area?subject=${subject}`} signUpForceRedirectUrl={`/practice-area?subject=${subject}`}  >
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
          {difficulties.map((difficulty) => (
             <button
             key={difficulty}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 flex items-center justify-center
               ${selectedDifficulty === difficulty
                 ? 'bg-cyan-600 text-white'
                 : isDarkMode
                   ? 'bg-[#403f3f] text-white border border-gray-600 hover:bg-[#4a4a4a]'
                   : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100'
               }`}
             onClick={() => setSelectedDifficulty(difficulty === selectedDifficulty ? null : difficulty)}
           >
             <span>{difficulty}</span>
             {selectedDifficulty === difficulty && (
               <X size={16} className="ml-2" />
             )}
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
                    <div dangerouslySetInnerHTML={createMarkup(shortenQuestion(quiz.quizName))} />
                      <button 
                        onClick={() => toggleQuestionExpansion(quiz._id)} 
                        className="ml-2 flex-shrink-0 transition-transform duration-300 ease-in-out"
                        style={{ transform: expandedQuestions[quiz._id] ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <ChevronDown size={16} />
                      </button>
                    </div>
                    <div 
                      className={`mt-2 text-sm text-gray-500 overflow-hidden transition-all duration-500 ease-in-out ${
                        expandedQuestions[quiz._id] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                     <div dangerouslySetInnerHTML={createMarkup(quiz.quizName)} />
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button className="text-blue-400 hover:text-blue-600">
                        <FileText size={20} />
                      </button>
                                      {/* <button 
                    className="text-blue-400 hover:text-blue-600" 
                    onClick={() => openVideoPopup(quiz)}
                  >
                    <Video size={20} />
                  </button> */}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getDifficultyStyle(quiz.difficulty)}`}>
            {quiz.difficulty === 'hard' || quiz.difficulty === 'advance' ? 'Hard' : capitalizeFirstLetter(quiz.difficulty)}
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

               {/* Video Popup */}
           {isVideoPopupOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Solution Video</h2>
        <button 
          onClick={closeVideoPopup}
          className="text-gray-600 hover:text-gray-800 transition-colors duration-200"
        >
          <X size={28} />
        </button>
      </div>
      <div className="relative pt-[56.25%]">
        {currentVideoId ? (
          <ReactPlayer
            url={currentVideoId}
            width="100%"
            height="100%"
            controls
            playing
            className="absolute top-0 left-0"
            onError={(e) => console.error('ReactPlayer error:', e)}
          />
        ) : (
          <p>No video URL available</p>
        )}
      </div>
    </div>
  </div>
)}
          </table>
        </div>
      </main>
    </div>
  );
};

export default TestSeriesCoderpadHome;