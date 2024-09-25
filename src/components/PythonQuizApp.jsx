import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MonacoEditor from './ResizableMonacoEditor'; 
import queryString from 'query-string';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import Split from 'react-split';
import ReactPlayer from 'react-player';
import { Loader2, Video, X } from 'lucide-react';

const PythonQuizApp = () => {
  const { user, isLoaded } = useUser();


  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userCode, setUserCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userOutput, setUserOutput] = useState(''); // Add state to store user output
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scores, setScores] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
 

  const parsed = queryString.parse(window.location.search);
  const userID = parsed.userID;
  const quizID = parsed.quizID;
  const questionID = parsed.questionID;

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if ( user) {
      setUserInfo({
        email: user.primaryEmailAddress?.emailAddress || 'N/A',
        firstName: user.firstName || 'N/A',
        phone: user.phoneNumbers?.[0]?.phoneNumber || 'N/A'
      });
    }
  }, [ user]);

  
  useEffect(() => {
    if (quizID) {
      const quizCompletionStatus = localStorage.getItem(`quizCompleted_${quizID}`);
      // if (quizCompletionStatus) {
      //   alert('You have already attempted this quiz. Redirecting to live events.');
      //   window.location.href = '/live-events';
      //   return;
      // }

      // If the quiz hasn't been attempted, set it as completed now
      localStorage.setItem(`quizCompleted_${quizID}`, 'true');
      setIsTimerRunning(true);
      setCanSubmit(true);
    }
  }, [quizID]);


  useEffect(() => {
    if (quizID) {
      setIsTimerRunning(true);
      setCanSubmit(true);
    }
  }, [quizID]);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }

    return () => clearInterval(timer);
  }, [isTimerRunning, timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };



  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const openVideoPopup = () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (currentQuestion.video && currentQuestion.video) {
      setCurrentVideoUrl(currentQuestion.video);
      setIsVideoPopupOpen(true);
    } else {
      alert('No video available for this question right now');
    }
  };

  const closeVideoPopup = () => {
    setIsVideoPopupOpen(false);
    setCurrentVideoUrl('');
  };

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        let response;
        
        if (quizID) {
          // Fetch quiz data if quizID is present
          response = await axios.get(`https://server.datasenseai.com/python-quiz/${quizID}/${userID}`);
         
        } else if (questionID) {
          // Fetch question data if questionID is present
          response = await axios.get(`https://server.datasenseai.com/test-series-coding/python/${questionID}`);
        }

        if (response) {
          setQuizData(response.data);
          setUserCode(response.data.questions[currentQuestionIndex].boilerplate_code || '');
        }

      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, [quizID, userID, currentQuestionIndex]);

  const checkAllTestCases = async (userCode, testCases) => {
    // Create a combined code to run all test cases in one API call
    const combinedCode = testCases.map(
      testCase => `print(${testCase.input})`
    ).join('\n');
  
    const fullCode = `${userCode}\n${combinedCode}`;
  
    try {
      const response = await axios.post(
        'https://emkc.org/api/v2/piston/execute',
        {
          language: 'python',
          version: '3.10',
          files: [
            {
              name: 'main.py',
              content: fullCode
            }
          ]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
  
      const outputs = response.data.run.output.split('\n').map(output => output.trim());
  
      // Check each output against the expected output
      for (let i = 0; i < testCases.length; i++) {
        if (outputs[i] !== testCases[i].expected_output) {
          setUserOutput(outputs[i]); // Update user output state with the first failing test case output
          return false;
        }
      }
  
      return true; // All test cases passed
    } catch (error) {
      console.error('Error executing test cases:', error);
      return false;
    }
  };
  

  const handleRunCode = async () => {
    
    
    setShowFeedback(false);
    setFeedback('Running test cases...');
    setIsSubmitting(true);

    const currentQuestion = quizData.questions[currentQuestionIndex];
    const allTestCasesPassed = await checkAllTestCases(userCode, currentQuestion.test_cases);

    if (allTestCasesPassed) {
      setUserOutput('');
      setFeedback('All test cases passed!');
      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: 1
      }));
    } else {
      setFeedback('Some test cases failed.');
      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: 0
      }));
    }

    setShowFeedback(true);
    setIsSubmitting(false);
    
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setUserCode(quizData.questions[index].boilerplate_code || '');
    setFeedback('');
    setShowFeedback(false);
    setShowSolution(false);
  };

  const handleSubmitQuiz = async () => {
    if (!canSubmit || timeRemaining === 0) {
      alert("You can't submit the quiz at this time.");
      return;
    }

    setIsTimerRunning(false);
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const timeTaken = 3600 - timeRemaining; // in seconds

    const uf = {
      quizID: quizID,
      userID: `${userInfo.email}, ${userInfo.firstName}, ${userInfo.phone}`,
      score: totalScore,
      duration: timeTaken
  };

 

    try {
      const response = await fetch('https://server.datasenseai.com/quizadmin/update-scores-coding-python', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(uf),
    });

    if (response.ok) {
      console.log('Score updated successfully!');
  } else {
      console.error('Failed to update score:', response.statusText);
  }
     
     
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  

        

    window.location.href = `/live-events`;
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };

  if (!quizData) return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
      <h5 className="mt-4 text-2xl font-thin text-gray-700">Loading...</h5>
    </div>
  );


  const currentQuestion = quizData.questions[currentQuestionIndex];


  if (isMobile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-md">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Please Use a PC</h2>
          <h5 className="mb-4">This quiz application is designed for larger screens. For the best experience, please use a PC or tablet.</h5>
          <button 
            onClick={() => setIsMobile(false)} 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
       <nav className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} p-4 flex justify-between items-center`}>
        <h1 className="mb-4 text-xl font-bold">Python Coderpad</h1>
        <div className="flex items-center space-x-4">
        {isTimerRunning && (
            <div className="text-lg font-semibold">
              Time remaining: {formatTime(timeRemaining)}
            </div>
          )}
          <button
            onClick={openVideoPopup}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-[#262626] text-white' : 'bg-white text-[#262626]'}`}
          >
            <Video size={24} />
          </button>
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-white text-black' : 'bg-[#262626] text-white'}`}
          >
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
      <Split
        className="flex h-[calc(100vh-4rem)]"
        sizes={[50, 50]}
        minSize={300}
        expandToMin={false}
        gutterSize={15}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        {/* Left side: Question List and Details */}
        <div className="flex flex-col overflow-hidden">
          {/* Question List */}
          <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-gray-200'} p-4 overflow-x-auto`}>
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="text-lg font-bold">Questions</h3>
              {/* <button 
                onClick={toggleSolution} 
                className={`text-sm px-3 py-1 rounded ${isDarkMode ? 'bg-[#262626] hover:bg-gray-600' : 'bg-gray-300 hover:bg-gray-400'}`}
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </button> */}
            </div>
            <ul className="flex space-x-2">
              {quizData.questions.map((question, index) => (
                <li
                  key={index}
                  className={`cursor-pointer py-2 px-4 rounded transition-colors duration-200 ${
                    index === currentQuestionIndex 
                      ? 'bg-cyan-600 text-white' 
                      : isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600' 
                        : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  onClick={() => handleQuestionSelect(index)}
                >
                  {index + 1}
                </li>
              ))}
            </ul>
          </div>

          {/* Question Details */}
          <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'} p-4 flex-grow overflow-y-auto`}>
            <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
              <h3 className="text-xl font-bold mb-2">{currentQuestion.question_text}</h3>
            </div>
            <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-2xl`}>
              <h3 className="text-lg font-bold mb-2">Test Cases</h3>
              <ul className="space-y-2">
                {currentQuestion.test_cases.map((testCase, index) => (
                  <li key={index} className={`p-2 rounded ${isDarkMode ? 'bg-[#2f2c2c]' : 'bg-gray-200'}`}>
                    <strong>Input:</strong> <code className="text-sm">{testCase.input}</code> <br />
                    <strong>Expected Output:</strong> <code className="text-sm">{testCase.expected_output}</code>
                  </li>
                ))}
              </ul>
            </div>
            {showSolution && (
              <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
                <h3 className="text-lg font-bold mb-2">Solution</h3>
                <pre className={`p-2 rounded ${isDarkMode ? 'bg-[#262626]' : 'bg-gray-200'}`}>
                  <code>{currentQuestion.solution}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Code Editor and Results */}
        <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-gray-200'} p-4 flex flex-col`}>
          <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} rounded-t-lg p-2 flex justify-between items-center`}>
            <span className="text-lg font-semibold">Python</span>
            <div className="flex space-x-2">
            <button
            className={`px-3 py-1 rounded text-white ${isSubmitting ? 'bg-gray-500' : 'bg-cyan-600 hover:bg-cyan-700'} focus:outline-none transition-colors duration-200`}
            onClick={handleRunCode}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Running...' : 'Run Code'}
          </button>
          {quizID && timeRemaining > 0 && (
            <button 
              onClick={handleSubmitQuiz}
              className="px-3 py-1 rounded text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
            >
              Submit Quiz
            </button>
          )}
            </div>
          </div>
          <Split
              className="flex-grow h-full" // Add h-full here
              direction="vertical"
              sizes={[70, 30]}
              minSize={100}
              gutterSize={15}
              gutterAlign="center">

          <MonacoEditor
            language="python"
            theme={isDarkMode ? "vs-dark" : "vs-light"}
            value={userCode}
            onChange={setUserCode}
            options={{ fontSize: 16 }}
          />
          <div className={`mt-1 ${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} rounded p-2 flex-grow overflow-y-auto`}>
          <h1 className='text-lg font-semibold'>  Output</h1>
            {showFeedback && (
              <div className={`p-2 rounded mb-2 ${feedback.includes('All test cases passed') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {feedback}
              </div>
            )}
            {userOutput && (
              <div>
                <h3 className="text-lg font-bold mb-2">Your Output:</h3>
                <pre className={`p-2 rounded ${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'}`}>
                  <code>{userOutput}</code>
                </pre>
              </div>
            )}
          </div>
          </Split>
        </div>
      </Split>
       {/* Video Popup */}
       {isVideoPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg relative w-11/12 max-w-4xl">
            <button
              onClick={closeVideoPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              <X size={24} />
            </button>
            <div className="aspect-w-16 aspect-h-9">
            <ReactPlayer
                url={currentVideoUrl}
                width="100%"
                height="100%"
                controls
                playing
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PythonQuizApp;