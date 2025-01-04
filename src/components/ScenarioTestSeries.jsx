import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import queryString from 'query-string';
import { FaSun, FaMoon, FaBars, FaTimes } from 'react-icons/fa';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { ArrowLeft, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import TopicGrid from './TopicGrid'
import logo from '../assets/dslogo.png'


const ScenarioTestSeries = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [difficulty, setDifficulty] = useState(null);
      const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [subject, setSubject] = useState(null);

     const [isDarkMode, setIsDarkMode] = useState(false);
    const topics = {
      beginner: [
        { name: 'Basic Concepts', questionCount: 10, duration: 20, progress: 30 },
        { name: 'Fundamentals', questionCount: 15, duration: 30, progress: 0 },
        { name: 'Introduction', questionCount: 12, duration: 25, progress: 50 },
      ],
      intermediate: [
        { name: 'Advanced Concepts', questionCount: 20, duration: 40, progress: 50 },
        { name: 'Problem Solving', questionCount: 18, duration: 35, progress: 20 },
        { name: 'Practical Applications', questionCount: 22, duration: 45, progress: 10 },
      ],
      advanced: [
        { name: 'Expert Level', questionCount: 25, duration: 50, progress: 10 },
        { name: 'Complex Problems', questionCount: 22, duration: 45, progress: 5 },
        { name: 'Research Topics', questionCount: 20, duration: 40, progress: 0 },
      ],
    };


    useEffect(() => {
      if (isLoaded && isSignedIn) {
          const parsed = queryString.parse(window.location.search);
          const subject = parsed.subject;
          const difficulty = parsed.difficulty;
          setSubject(subject);
          setDifficulty(difficulty);
          // loadQuestions(subject, difficulty);
      }
  }, [isLoaded, isSignedIn]);


  function backToHome(){
    window.top.location.href = 'https://practice.datasenseai.com/';
  }



  if (!isSignedIn) {
    return (
        <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100">
           
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                <h4 className="mb-6">Please sign in to access the Test Series.</h4>
                <SignInButton mode="modal" redirectUrl={window.location.href}>
                    <button className="bg-oxford-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
                        Sign In
                    </button>
                </SignInButton>
            </div>
        </div>
    );
}

    


    
    return (
    
        <div className={`min-h-screen  ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
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
      <div className="py-8">
        <div className="container mx-auto px-4">
          <TopicGrid subject={subject} topics={topics} darkmode={isDarkMode} />
        </div>
      </div>
    </div>
      );
    };

export default ScenarioTestSeries;