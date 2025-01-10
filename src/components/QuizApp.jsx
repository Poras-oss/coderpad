import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MonacoEditor from './ResizableMonacoEditor' 
import queryString from 'query-string';
import {useAuth0} from '@auth0/auth0-react'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import Split from 'react-split';
import { Loader2, Video, X, BookOpen, Play, Pause, RotateCcw, Hash  } from 'lucide-react';
import ReactPlayer from 'react-player';
import Bot from './Bot';
import { Badge } from "./ui/badge"
import SubscriptionDialogue from './SubscriptionDialogue';

export default function QuizApp()  {
  const { user, isLoaded } = useUser();

  // console.log( 'userinfo -> '+ user.emailAddress+' '+user.username+' '+user.clerkId )

  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userQueries, setUserQueries] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [buttonText, setButtonText] = useState('Save Results');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [activeNestedTab, setActiveNestedTab] = useState('expected_output');

  //Subscription states
  const [isSubscriptionDialogueOpen, setIsSubscriptionDialogueOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');


  const [timeRemaining, setTimeRemaining] = useState(60 * 60); // 60 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scores, setScores] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [userInfo, setUserInfo] = useState('');

  const parsed = queryString.parse(window.location.search);
  const userID = parsed.userID;
  const quizID = parsed.quizID;
  const questionID = parsed.questionID;
  const [discussionText, setDiscussionText] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  const [isMobile, setIsMobile] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [activeTab, setActiveTab] = useState('question');
  const [isQuizMode, setIsQuizMode] = useState(false);

    // Stopwatch timer for practicing question
    const [timeInSeconds, setTimeInSeconds] = useState(0);
    const [isStopwatchRunning, setisStopwatchRunning] = useState(false);



  useEffect(() => {
    if (activeTab === 'discussion') {
      // Fetch discussions for the question
      fetchDiscussions();
    }
  }, [activeTab, questionID]);
 

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!isLoaded || !user) return; // Ensure the user data is loaded
      if (activeTab === 'submission') {
        try {
          const response = await axios.get(
            `https://server.datasenseai.com/submission-history/get-submissions/${questionID}`,
            { params: { clerkId: user.id} } // Use user.id as clerkId
          );
          setSubmissions(response.data.submissions);
        } catch (error) {
          console.error('Error fetching submissions:', error);
        }
      }
    };

    fetchSubmissions();
  }, [activeTab, questionID, isLoaded]);

  useEffect(() => {
    if (user) {
      setUserInfo({
        email: user.primaryEmailAddress?.emailAddress || 'N/A',
        firstName: user.firstName || 'N/A',
        phone: user.phoneNumbers?.[0]?.phoneNumber || 'N/A'
      });
    }
  }, [user]);

  useEffect(() => {
    if (quizID) {
      const quizCompletionStatus = localStorage.getItem(`quizCompleted_${quizID}`);
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
      handleSubmitQuiz(true);
    }

    return () => clearInterval(timer);
  }, [isTimerRunning, timeRemaining]);

  // const formatTime = (seconds) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  // };

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
      // Don't proceed if neither quizID nor questionID is available
      if (!quizID && !questionID) {
        console.log('No quiz or question ID provided');
        return;
      }
  
      // Set loading state
      setLoading(true);
  
      try {
        // Wait for user to be loaded
        if (!user?.id) {
          console.log('Waiting for user data...');
          return;
        }
  
        const baseUrl = 'https://server.datasenseai.com';
        let response;
  
        if (quizID) {
          setIsQuizMode(true);
          response = await axios.get(`${baseUrl}/sql-quiz/${quizID}/${user.id}`, {
            params: { clerkId: user.id }
          });
        } else {
          response = await axios.get(`${baseUrl}/test-series-coding/mysql/${questionID}`, {
            params: { clerkId: user.id }
          });
        }
  
        if (response?.data) {
          setQuizData(response.data);
        }
  
      } catch (error) {
        console.error('Error details:', {
          message: error.message,
          user: user?.id || 'undefined',
          quizID,
          questionID,
          responseData: error.response?.data
        });
  
        // Handle different types of errors
        if (error.response) {
          const { status, data } = error.response;
          
          switch (status) {
            case 401:
              setAuthError(true);
              break;
            case 403:
              if (data.message === 'User not subscribed') {
                setSubscriptionStatus('not_premium');
                alert(`You're not a premium user`)
                // setIsSubscriptionDialogueOpen(true);
              } else if (data.message === 'Subscription expired') {
                setSubscriptionStatus('Subscription expired');
                alert('expired')
                // setIsSubscriptionDialogueOpen(true);
              }
              break;
            case 404:
              setError('Quiz or question not found');
              break;
            default:
              setError('An error occurred while fetching data');
          }
        } else if (error.request) {
          // Request was made but no response received
          setError('No response from server. Please check your connection.');
        } else {
          // Something else went wrong
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
  
    // Only run if we have required data
    if (user?.id && (quizID || questionID)) {
      fetchQuizData();
    }
  
    // Cleanup function
    return () => {
      setQuizData(null);
      setError(null);
      setLoading(false);
    };
  }, [user, quizID, questionID]); // Add all dependencies

  useEffect(() => {
    if (quizData && quizData.questions) {
      setUserQueries(quizData.questions.map(() => "")); // Initialize empty queries for each question
    }
  }, [quizData]);

  const handleCloseSubscriptionDialogue = () => {
    setIsSubscriptionDialogueOpen(false);
  };

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const submissionDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - submissionDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
  
    if (diffInSeconds < 60) {
      return 'just now';
    } else if (diffInMinutes === 1) {
      return '1 minute ago';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours === 1) {
      return '1 hour ago';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return 'yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return submissionDate.toLocaleDateString();
    }
  };

  const saveSolvedQuestion = async (clerkId, questionId) => {
    try {
      await axios.post('https://server.datasenseai.com/question-attempt/add-solved', {
        clerkId,
        questionId,
      });
    } catch (error) {
      console.error('Error saving solved question:', error.message);
      // Optionally show non-blocking notifications
    }
  };

  const saveSubmission = async (clerkId, questionId, isCorrect, submittedCode) => {
    try {
      await axios.post('https://server.datasenseai.com/submission-history/save-submission', {
        clerkId,
        questionId,
        isCorrect,
        submittedCode,
      });
    } catch (error) {
      console.error('Error saving submission history:', error.message);
      // Optionally show non-blocking notifications
    }
  };
  


  const handleTestCode = async () => {
    setIsTesting(true);
  
    try {
      // Execute user query
      const response = await axios.get(`https://server.datasenseai.com/execute-sql/query?q=${encodeURIComponent(userQueries[currentQuestionIndex])}`);
      const userAnswer = response.data;
  
      const expectedOutput = quizData.questions[currentQuestionIndex].expected_output;
      const isCorrect = compareResults(userAnswer, expectedOutput);
  
      // Update scores
      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: isCorrect ? 1 : 0,
      }));
  
      // Provide feedback to the user
      if (isCorrect) {
        setFeedback({ text: 'Correct!', isCorrect: true });
        saveSolvedQuestion(user.id, questionID); // Save solved question in the background
      } else {
        console.log(userAnswer)
        setFeedback({
          text: 'Incorrect. Please try again.',
          isCorrect: false,
          expected: expectedOutput,
          userAnswer: userAnswer,
        });
      }
  
      // Set output
      setOutput(userAnswer);
  
      // Save submission in the background
      saveSubmission(user.id, questionID, isCorrect, userQueries[currentQuestionIndex]);
  
      // Add to submissions history
      setSubmissions(prevSubmissions => [
        ...prevSubmissions,
        {
          questionId: questionID,
          isCorrect,
          submittedCode: userQueries[currentQuestionIndex],
          submittedAt: new Date(),
        },
      ]);
    } catch (error) {
      // Handle query execution errors
      setFeedback({ text: 'Error testing code', isCorrect: false });
      setOutput('Error executing query'+error);
    } finally {
      setIsTesting(false);
    }
  };
  

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await axios.get(`https://server.datasenseai.com/execute-sql/query?q=${encodeURIComponent(userQueries[currentQuestionIndex])}`);
      const userAnswer = response.data;
  
      const expectedOutput = quizData.questions[currentQuestionIndex].expected_output;
      const isCorrect = compareResults(userAnswer, expectedOutput);
  
      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: isCorrect ? 1 : 0
      }));

      if (isCorrect) {
        setFeedback({ text: 'Correct! now submit the question', isCorrect: true, userAnswer: userAnswer });
        
      } else {
        setFeedback({
          text: 'Incorrect. Please try again.',
          isCorrect: false,
          expected: expectedOutput,
          userAnswer: userAnswer,
        });
      }
  
      setShowFeedback(true);
      setOutput(userAnswer);


    } catch (error) {
      setFeedback('Your query is incorrect');
      setShowFeedback(true);
      // setOutput(userAnswer);
    } finally {
      setIsRunning(false);
    }
  };
  
  const compareResults = (userResults, expectedOutput) => {
    // Handle error case
    if (userResults.error === true) return false;
  
    // Get the rows from expected output
    const expectedRows = expectedOutput.rows;
  
    // Early return if lengths don't match
    if (userResults.length !== expectedRows.length) {
      return false;
    }
  
    // Convert both result sets to arrays of stringified sorted values
    const expectedRowStrings = expectedRows
      .map(row => JSON.stringify(Object.values(row).sort()))
      .sort();
    
    const userRowStrings = userResults
      .map(row => JSON.stringify(Object.values(row).sort()))
      .sort();
  
    // Compare the sorted string arrays
    for (let i = 0; i < expectedRowStrings.length; i++) {
      if (expectedRowStrings[i] !== userRowStrings[i]) {
        return false;
      }
    }
  
    return true;
  };
  
  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setFeedback('');  
    setShowFeedback(false);
  };

  const handleSubmitQuiz = async (isAutomatic = false) => {
    if (!isAutomatic && (!canSubmit || isSubmitting)) {
      alert("You can't submit the quiz at this time.");
      return;
    }
    setIsTimerRunning(false);
    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const timeTaken = 3600 - timeRemaining; // in seconds

    const uf = {
      quizID: quizID,
      userID: `${userInfo.email || ' '}, ${userInfo.firstName || ' '}, ${userInfo.phone || ' '}`,
      score: totalScore,
      duration: timeTaken
    };

    console.log(JSON.stringify(uf));

    try {
      const response = await fetch('https://server.datasenseai.com/quizadmin/update-scores-coding-sql', {
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

    alert("The quiz is submitted");
    
    window.location.href = `/live-events`;
  };

  
    const fetchDiscussions = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`https://server.datasenseai.com/discussion-route/get-discussions/${questionID}`);
       // Check if the response contains the "No discussions found" message
    if (response.data.message === "No discussions found for this question") {
      setComments([{ text: "No discussions found for this question", isPlaceholder: true }]);
    } else {
      setComments(response.data.comments || []);
    }
  } catch (error) {
    setError('Failed to load discussions');
  } finally {
    setLoading(false);
  }
    
    };

 
  
    const handleDiscussionSubmit = async () => {
      if (!discussionText.trim()) return; // Prevent empty submissions
  
      try {
        const response = await axios.post('https://server.datasenseai.com/discussion-route/add-discussion', {
          questionCode: questionID,
          username: user.fullName, // Replace with actual user info from Clerk
          discussionText
        });
         // If "No discussions found" placeholder is currently displayed, remove it
      

         
           // Add the new comment to the comments array with default fields
           const newComment = {
             discussionText,
             username: user.fullName, // Replace with the actual username
             createdAt: new Date().toISOString(), // Use the current date and time
           };
     
           setComments((prevComments) => [...prevComments, newComment]);
           setDiscussionText(''); // Clear the input field
         
      } catch (error) {
        console.error(error);
        setError('Failed to add comment');
      }
    };


    function parseDataOverview(inputString) {
      const resultMap = new Map();
  
      // Split the input string by new lines
      const lines = inputString.split("\n");
  
      // Iterate over each line to extract key-value pairs
      lines.forEach(line => {
          const colonIndex = line.indexOf(":"); // Find the colon index
          if (colonIndex !== -1) {
              // Extract key (trim whitespace) and value (trim whitespace)
              const key = line.slice(0, colonIndex).trim();
              const value = line.slice(colonIndex + 1).trim();
  
              // Add key-value pair to the map
              resultMap.set(key, value);
          }
      });
  
      return resultMap;
  }

    useEffect(() => {
      let interval = null;
      
      if (isStopwatchRunning) {
        interval = setInterval(() => {
          setTimeInSeconds(prev => prev + 1);
        }, 1000);
      }
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }, [isStopwatchRunning]);
    
    const formatTime = (totalSeconds) => {
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    const handleStart = () => setisStopwatchRunning(true);
    const handlePause = () => setisStopwatchRunning(false);
    const handleReset = () => {
      setisStopwatchRunning(false);
      setTimeInSeconds(0);
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#262626] text-white' : 'bg-white text-black'}`}>
      
     
      <nav className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} p-4 flex justify-between items-center`}>
        <h1 className="mb-4 text-xl font-bold">SQL Coderpad</h1>
        <div className="flex items-center space-x-4">

          {isTimerRunning && (
            <div className="text-lg font-semibold">
              Time remaining: {formatTime(timeRemaining)}
            </div>
          )}

{questionID && (
        <>
        <div className="text-lg font-mono">
        {formatTime(timeInSeconds)}
      </div>
         <div className="flex items-center space-x-1">
         <button
           onClick={!isStopwatchRunning ? handleStart : handlePause}
           className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
           aria-label={!isStopwatchRunning ? "Start timer" : "Pause timer"}
         >
           {!isStopwatchRunning ? (
             <Play size={16} />
           ) : (
             <Pause size={16} />
           )}
         </button>
         
         <button
           onClick={handleReset}
           className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
           aria-label="Reset timer"
         >
           <RotateCcw size={16} />
         </button>
       </div>
       </>
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
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
      >
        {/* Left side: Question List and Details */}

        <div className="flex flex-col overflow-hidden">
          {/* Question List */}
         {quizID && (
           <div className={`flex gap-10 ${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} px-4 h-1/8 relative`}>
           <div className="overflow-x-auto whitespace-nowrap scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 hover:scrollbar-thumb-gray-500">
             <ul className="flex flex-nowrap gap-4 py-2">
               {quizData.questions.map((question, index) => (
                 <li
                   key={index}
                   className={`cursor-pointer py-2 px-4 rounded border ${
                     index === currentQuestionIndex
                       ? 'bg-teal-500 text-white'
                       : isDarkMode
                       ? 'bg-[#262626] text-white hover:bg-gray-600'
                       : 'bg-gray-300 text-gray-900 hover:bg-gray-400'
                   }`}
                   onClick={() => handleQuestionSelect(index)}
                 >
                   {index + 1}
                 </li>
               ))}
             </ul>
           </div>
         </div>
         )}

          

          {/* Tabs */}
          <div className={`flex ${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} px-4`}>
            {(isQuizMode ? ['Question', 'Tables'] : ['Question', 'Tables' ,'Discussion', 'Solution', 'Submission', 'AI Help']).map((tab) => <button
                key={tab}
                className={`py-2 px-4 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-teal-500' : ''}`}
                onClick={() => setActiveTab(tab.toLowerCase())}
              >
                {tab}
              </button>
            )}
          </div>
  
          {/* Question Details */}
          <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-100'} p-4 flex-grow overflow-y-auto`}>
          {activeTab === 'question' && (
  <>
    <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
    {currentQuestion.id && (
      <div className={`question-heading flex items-center p-4 mb-6 border-b ${
        isDarkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
      }`}>
        <Hash className={`mr-2 h-5 w-5 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <h2 className={`text-xl font-bold ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          {currentQuestion.id.toUpperCase()}. {currentQuestion.title}
        </h2>
      </div>
    )}
      {/* Render scenario if it exists */}
      {currentQuestion.scenario && (
        <div 
          className="scenario-text mb-4 text-md"
          dangerouslySetInnerHTML={{ __html: currentQuestion.scenario.replace(/\n/g, '<br>') }}
        />
      )}

        {/* Render question text with single teal vertical line */}
        <div className="mb-6 mt-6">
        <div className="flex">
          <div className={`w-1 mr-4 ${isDarkMode ? 'bg-teal-500' : 'bg-teal-600'}`}></div>
          <div 
            className="question-text flex-1 p-4"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question_text.replace(/\n/g, '<br>') }}
          />
        </div>
      </div>

{currentQuestion['data-overview'] && (
  <div className="mt-6">
    {/* <h4 className="text-md font-semibold mb-2">Data Overview</h4> */}
    <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <tbody className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
          {(() => {
            const parsedData = parseDataOverview(currentQuestion['data-overview']);
            return Array.from(parsedData.entries()).map(([key, value], rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 1 ? (isDarkMode ? 'bg-gray-900' : 'bg-gray-50') : ''}>
                <td 
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
                  dangerouslySetInnerHTML={{ __html: key }}
                ></td>
                <td 
                  className={`px-6 py-4 whitespace-normal text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
                  dangerouslySetInnerHTML={{
                    __html: typeof value === 'object' ? JSON.stringify(value) : value,
                  }}
                ></td>
              </tr>
            ));
          })()}
        </tbody>
      </table>
    </div>
  </div>
)}

    

      {/* New section: Additional Information with table-like layout */}
      {(currentQuestion.common_mistakes || currentQuestion.interview_probability || currentQuestion.ideal_time ||  currentQuestion.roles) && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Additional Information</h4>
          <div className={`border rounded-lg overflow-hidden ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className={isDarkMode ? 'bg-gray-800' : 'bg-white'}>
                {currentQuestion.common_mistakes && (
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      Common Mistakes
                    </td>
                    <td className={`px-6 py-4 whitespace-normal text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {currentQuestion.common_mistakes}
                    </td>
                  </tr>
                )}
                {currentQuestion.interview_probability && (
                  <tr className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      Interview Probability
                    </td>
                    <td className={`px-6 py-4 whitespace-normal text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {currentQuestion.interview_probability}
                    </td>
                  </tr>
                )}
                {currentQuestion.ideal_time && (
                  <tr>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      Ideal Time
                    </td>
                    <td className={`px-6 py-4 whitespace-normal text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {currentQuestion.ideal_time}
                    </td>
                  </tr>
                )}

{currentQuestion.roles && (
                  <tr className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                      Job Roles
                    </td>
                    <td className={`px-6 py-4 whitespace-normal text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                      {currentQuestion.roles}
                    </td>
                  </tr>
                )}

{currentQuestion.subtopics && (
  <tr className={isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}>
    <td
      className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
        isDarkMode ? 'text-gray-300' : 'text-gray-900'
      }`}
    >
      Sub topics
    </td>
    <td
      className={`px-6 py-4 whitespace-normal text-sm ${
        isDarkMode ? 'text-gray-300' : 'text-gray-500'
      }`}
    >
      <div className="flex flex-wrap gap-2">
        {currentQuestion.subtopics &&
          currentQuestion.subtopics.map((subtopic, subIndex) => (
            <Badge
              key={subIndex}
              variant="secondary"
              className={`flex items-center ${
                isDarkMode
                  ? 'bg-blue-900 text-blue-200'
                  : 'bg-blue-100 text-blue-700'
              }`}
            >
              <BookOpen className="h-3 w-3 mr-1" />
              {subtopic}
            </Badge>
          ))}
      </div>
    </td>
  </tr>
)}

              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  </>
)}


{activeTab === 'tables' && (
  <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
    <h3 className="text-lg font-bold mb-2">Tables</h3>
    <div className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
      <p className="text-sm italic mb-2">Note: Only the top 10 rows of each table are displayed except Expected Answer</p>
      {/* <p className="text-sm">
        These tables provide a snapshot of the data. For a more comprehensive view or to analyze specific data points, 
        please use the search and filter options available in the main interface.
      </p> */}
    </div>

    {/* State for Active Nested Tab */}
    <div className="tabs-container">
      <div className="flex space-x-4 border-b mb-4">
        {/* Default Tab for Expected Answer */}
        <button
          className={`py-2 px-4 ${
            activeNestedTab === 'expected_output'
              ? 'border-b-2 border-blue-500 text-black-500'
              : 'text-gray-500'
          }`}
          onClick={() => setActiveNestedTab('expected_output')}
        >
          Expected Answer
        </button>

        {/* Dynamic Tabs for Tables */}
        {currentQuestion.table_data &&
          currentQuestion.table_data.map((table, tableIndex) => (
            <button
              key={tableIndex}
              className={`py-2 px-4 ${
                activeNestedTab === table.table_name
                  ? 'border-b-2 border-blue-500 text-black-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveNestedTab(table.table_name)}
            >
              {table.table_name}
            </button>
          ))}
      </div>

      {/* Render Content Based on Active Tab */}
      {activeNestedTab === 'expected_output' && currentQuestion.expected_output && (
        <div>
          {/* <h3 className="text-lg font-bold mb-2">Expected Answer</h3> */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
              <tr>
                {currentQuestion.expected_output.columns.map((column, columnIndex) => (
                  <th
                    key={columnIndex}
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className={isDarkMode ? 'bg-gray-800' : 'bg-white divide-y divide-gray-200'}>
              {currentQuestion.expected_output.rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((value, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Render Selected Table */}
      {currentQuestion.table_data &&
        currentQuestion.table_data.map((table, tableIndex) =>
          activeNestedTab === table.table_name ? (
            <div key={tableIndex} className="mb-4">
              {/* <h4 className="text-md font-semibold mb-2">{table.table_name}</h4> */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className={isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}>
                    <tr>
                      {table.columns.map((column, columnIndex) => (
                        <th key={columnIndex} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className={isDarkMode ? 'bg-gray-800' : 'bg-white divide-y divide-gray-200'}>
                    {table.rows.slice(0, 10).map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">
                            {typeof cell === 'object' ? JSON.stringify(cell) : cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null
        )}
    </div>
  </div>
)}



            {!isQuizMode && (
              <>
          
           
           {activeTab === 'discussion' && (
  <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
    <h3 className="text-lg font-bold mb-4">Discussion</h3>

    {loading ? (
      <p>Loading discussions...</p>
    ) : error ? (
      <p className="text-red-500">{error}</p>
    ) : comments.length === 0 ? (
      <p>{comments[0]?.isPlaceholder ? comments[0].text : "No discussions yet. Be the first to comment!"}</p>
    ) : (
      <div className="mb-4 max-h-60 overflow-y-auto space-y-2">
        {comments.slice().reverse().map((comment, index) => (
          <div key={index} className="p-2 rounded-md border border-gray-300">
            <p className="font-semibold">{comment.username}:</p>
            <p className={`${isDarkMode ? 'text-gray-300' : 'text-gray-800'}`}>{comment.discussionText}</p>
            <p className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    )}

    <textarea
      className={`w-full p-2 rounded ${isDarkMode ? 'bg-[#403f3f] text-white' : 'bg-gray-100 text-black'}`}
      rows="3"
      placeholder="Add to the discussion..."
      value={discussionText}
      onChange={(e) => setDiscussionText(e.target.value)}
    ></textarea>
    <button
      className="mt-2 bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-600 "
      onClick={handleDiscussionSubmit}
      disabled={!discussionText.trim()}
    >
      Submit
    </button>
  </div>
)}

            {activeTab === 'solution' && (
              <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
                <h3 className="text-lg font-bold mb-2">Solution</h3>
                <pre className={`p-2 rounded ${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'}`}>
                  <code>{currentQuestion.solution || 'Solution not available for this question.'}</code>
                </pre>
              </div>
            )}
         {activeTab === 'submission' && (
      <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
        <h3 className="text-lg font-bold mb-4">Submissions</h3>

        {submissions.length > 0 ? (
          submissions.slice().reverse().map((submission, index) => (
            <div key={index} className="mb-4 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className={`font-semibold ${submission.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                  {submission.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                {getRelativeTime(submission.submittedAt)}
                </span>
              </div>
              <pre className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-100'} p-3 rounded overflow-x-auto`}>
                {submission.submittedCode}
              </pre>
            </div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No submissions yet.</p>
        )}
      </div>
    )}

{activeTab === 'ai help' && (
      <div className={`relative rounded-lg p-4 mb-4 shadow-md h-[460px] overflow-hidden ${
        isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
      }`}>
        {/* Glass effect overlay */}
        <div className="absolute inset-0 backdrop-filter backdrop-blur-md bg-opacity-50 bg-gray-200 dark:bg-gray-700 dark:bg-opacity-50"></div>
        
        {/* Coming Soon text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className={`text-4xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            Coming Soon
          </h2>
        </div>
        
        {/* Existing content (blurred behind the overlay) */}
        <div className="relative z-10 opacity-50">
          <Bot size={24} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
        </div>
      </div>
    )}
              </>
            )}


          </div>
        </div>
        {/* Right side: Code Editor and Results */}
        <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} px-4 flex flex-col`}>
          <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-t-lg p-2 flex justify-between items-center`}>
            <span className="font-semibold">MySQL</span>
            <div className="flex space-x-2">
        
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
            className="flex-grow h-full"
            direction="vertical"
            sizes={[70, 30]}
            minSize={100}
            gutterSize={10}
            gutterAlign="center">
  
            <MonacoEditor
              width="auto"
              height="auto"
              language="sql"
              theme={isDarkMode ? "vs-dark" : "light"}
              value={userQueries[currentQuestionIndex]}
              onChange={(value) => {
                const newQueries = [...userQueries];
                newQueries[currentQuestionIndex] = value || '';
                setUserQueries(newQueries);
              }}
              options={{
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                fontSize: 14,
              }}
            />
            <div className="flex flex-col">
              <div className="flex mt-2 space-x-2">
                <button
                  className={`flex-1 ${isRunning ? 'bg-teal-500' : 'bg-teal-600'} text-white px-4 py-2 rounded hover:bg-teal-700 focus:outline-none flex items-center justify-center`}
                  onClick={handleRunCode}
                  disabled={isRunning || isTesting}
                >
                  {isRunning ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Running...
                    </>
                  ) : 'Run Code'}
                </button>
             
                <button
                  className={`flex-1 ${isTesting ? 'bg-blue-500' : 'bg-blue-600'} text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none flex items-center justify-center`}
                  onClick={handleTestCode}
                  disabled={isRunning || isTesting}
                >
                  {isTesting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Testing...
                    </>
                  ) : 'Submit Code'}
                </button>
              </div>
              <div className={`mt-4 ${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded p-4 flex-grow overflow-y-auto`}>
                {feedback && (
                  <div className={`mb-4 p-2 rounded ${feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {feedback.text}
                  </div>
                )}
    {output !== null && (
  <div className="mt-2 flex flex-col space-y-4">
    <div className="font-semibold">OUTPUT</div>
    <div className="overflow-x-auto">
      {output.error ? (
        // Handle error output
        <div className="text-red-600 bg-white-50 border border-grey-400 rounded-md p-4">
          {/* <p className="font-bold"><u>Error-</u></p> */}
          <p>{output.message}</p>
          <p><strong>Details:</strong> {output.details}</p>
          <p><strong>Error Code:</strong> {output.code}</p>
        </div>
      ) : Array.isArray(output) && output.length > 0 ? (
        // Handle table output
        <table className="w-full border-collapse">
          <thead>
            <tr className={isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'}>
              {Object.keys(output[0]).map((header, index) => (
                <th key={index} className="border px-4 py-2">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {output.map((row, rowIndex) => (
              <tr key={rowIndex} className={isDarkMode ? 'bg-[#262626]' : 'bg-gray-50'}>
                {Object.values(row).map((cell, cellIndex) => (
                  <td key={cellIndex} className="border px-4 py-2 whitespace-nowrap">
                    {typeof cell === 'object' ? JSON.stringify(cell) : cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // Handle simple string output
        <p>{output}</p>
      )}
    </div>
  </div>
)}



              </div>
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
}