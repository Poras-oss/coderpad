import React, { useState, useEffect, useRef, useCallback  } from 'react';
import axios from 'axios';
import MonacoEditor from './ResizableMonacoEditor'; 
import queryString from 'query-string';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import Split from 'react-split';
import ReactPlayer from 'react-player';
import { Loader2, Video, X, Play, Pause, RotateCcw  } from 'lucide-react';

const PythonQuizApp = () => {
  const { user, isLoaded } = useUser();

  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userCodes, setUserCodes] = useState({});
  const userCodesRef = useRef({});
  const [feedback, setFeedback] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userOutput, setUserOutput] = useState('');
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(60 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scores, setScores] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState('question');
  const [discussionText, setDiscussionText] = useState('');
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [isQuizMode, setIsQuizMode] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  // Stopwatch timer for practicing question
  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const parsed = queryString.parse(window.location.search);
  const userID = parsed.userID;
  const quizID = parsed.quizID;
  const questionID = parsed.questionID;

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
    if (activeTab === 'discussion') {
      // Fetch discussions for the question
      fetchDiscussions();
    }
  }, [activeTab, questionID]);

  useEffect(() => {
    if (quizID) {
      localStorage.setItem(`quizCompleted_${quizID}`, 'true');
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

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const fetchQuizData = useCallback(async () => {
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
        response = await axios.get(`${baseUrl}/python-quiz/${quizID}/${userID}`);
      } else {
        response = await axios.get(`${baseUrl}/test-series-coding/python/${questionID}`, {
          params: { clerkId: user.id }
        });
      }
  
      if (response?.data) {
        setTotalScore(response.data.questions.length)
        setQuizData(response.data);
        const initialUserCodes = {};
        response.data.questions.forEach((question, index) => {
          initialUserCodes[index] = question.boilerplate_code || '';
        });
        setUserCodes(initialUserCodes);
        userCodesRef.current = initialUserCodes;
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
              alert(`You're not a premium user`);
              // setIsSubscriptionDialogueOpen(true);
            } else if (data.message === 'Subscription expired') {
              setSubscriptionStatus('Subscription expired');
              alert('expired');
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
  }, [quizID, userID, questionID, user]);
  
  useEffect(() => {
    if (user?.id && (quizID || questionID)) {
      fetchQuizData();
    }
  
    // Cleanup function
    return () => {
      setQuizData(null);
      setError(null);
      setLoading(false);
      setUserCodes({});
      userCodesRef.current = {};
    };
  }, [fetchQuizData, user, quizID, questionID]);



  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!isLoaded || !user) return;
      if (activeTab === 'submission') {
        try {
          const response = await axios.get(
            `https://server.datasenseai.com/submission-history/get-submissions/${questionID}`,
            { params: { clerkId: user.id} } // Use user.id as clerkId
          );
          setSubmissions(response.data.submissions);
          console.log(response);
        } catch (error) {
          console.error('Error fetching submissions:', error);
        }
      }
    };

    fetchSubmissions();
  }, [activeTab, questionID, isLoaded]);

  // const formatTime = (seconds) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = seconds % 60;
  //   return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  // };

  
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

  const checkAllTestCases = async (userCode, testCases) => {
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
          files: [{ name: 'main.py', content: fullCode }]
        },
        { headers: { 'Content-Type': 'application/json' } }
      );
      const outputs = response.data.run.output.split('\n').map(output => output.trim());
      for (let i = 0; i < testCases.length; i++) {
        if (outputs[i] !== testCases[i].expected_output) {
          setUserOutput(outputs[i]);
          return false;
        }
      }


      return true;
    
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
    const allTestCasesPassed = await checkAllTestCases(userCodes[currentQuestionIndex], currentQuestion.test_cases);
    if (allTestCasesPassed) {
      // setUserOutput('');
      setFeedback('All test cases passed! Now submit the question');
      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: 1
      }));
      if(submissions.length == 0 && !isQuizMode){
        creditFuel(user.id);
      }
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

  const addToStreak = async (clerkId, questionId) => {
      try {
          const response = await axios.post('https://server.datasenseai.com/question-attempt/update-streak', {
              clerkId,
              subjectId: "python",
              questionId,
          });
  
          return response.data; // Return the response if needed elsewhere
      } catch (error) {
          console.error('Error saving streak:', error.response?.data || error.message);
      }
  };

  const handleTestCode = async () => {
    setShowFeedback(false);
    setFeedback('Running test cases...');
    setIsTesting(true);
    const currentQuestion = quizData.questions[currentQuestionIndex];
    const allTestCasesPassed = await checkAllTestCases(userCodes[currentQuestionIndex], currentQuestion.test_cases);
    if (allTestCasesPassed) {
      setUserOutput('');
      setFeedback('Correct answer!');
      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: 1
      }));
      saveSolvedQuestion(user.id, questionID);
    } else {
      setFeedback('Some test cases failed.');
      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: 0
      }));
    }
    setShowFeedback(true);
    setIsTesting(false);

    saveSubmission(user.id, questionID, allTestCasesPassed, userCodes[currentQuestionIndex]);
    
    //Increment the question solving streak
    addToStreak(user.id, questionID);

    setSubmissions(prevSubmissions => [
      ...prevSubmissions,
      {
        questionId: questionID,
        isCorrect: allTestCasesPassed,
        submittedCode: userCodes[currentQuestionIndex],
        submittedAt: new Date(),
      },
    ]);
  };

    const creditFuel = async (clerkId) => {
        const difficulty = quizData.questions[currentQuestionIndex].difficulty;
        const response = await axios.post('https://server.datasenseai.com/fuel-engine/credit', {
            clerkId,
            key: 'practice'+difficulty,
        });
  
        console.log('fuel credit pracictice'+difficulty, response.data);
    };
  

  const handleQuestionSelect = useCallback((index) => {
    setCurrentQuestionIndex(index);
    setFeedback('');
    setShowFeedback(false);
    setShowSolution(false);
    setUserOutput('');
  }, []);

  const handleSubmitQuiz = async (isAutomatic = false) => {
    if (!isAutomatic && (!canSubmit || isSubmitting)) {
      alert("You can't submit the quiz at this time.");
      return;
    }
    setIsTimerRunning(false);
    const userScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const timeTaken = 3600 - timeRemaining;
    const uf = {
      clerkId: user?.id,
      quizID: quizID,
      userID: `${userInfo.email}, ${userInfo.firstName}, ${userInfo.phone}`,
      score: userScore,
      totalscore: totalScore,
      duration: timeTaken
    };
    try {
      const response = await fetch('https://server.datasenseai.com/quizadmin/update-scores-coding-python', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleSolution = () => {
    setShowSolution(!showSolution);
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

       console.log(response);
    

       
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

  useEffect(() => {
    let interval = null;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeInSeconds(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);
  
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
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
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <nav className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} p-4 flex justify-between items-center`}>
        <h1 className="mb-4 text-xl font-bold">Python Coderpad</h1>
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
           onClick={!isRunning ? handleStart : handlePause}
           className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
           aria-label={!isRunning ? "Start timer" : "Pause timer"}
         >
           {!isRunning ? (
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
            onClick={toggleDarkMode}
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
          <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-gray-200'} p-4 overflow-x-auto`}>
            <div className="flex items-center space-x-4 mb-2">
              <h3 className="text-lg font-bold">Questions</h3>
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

          {/* Tabs */}
          <div className={`flex ${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} px-4`}>

          {(isQuizMode ? ['Question'] : ['Question', 'Discussion', 'Solution', 'Submission', 'AI Help']).map((tab) => (
  <button
    key={tab}
    className={`py-2 px-4 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-cyan-500' : ''}`}
    onClick={() => setActiveTab(tab.toLowerCase())}
  >
    {tab}
  </button>
))}

          </div>

          {/* Question Details */}
          <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-gray-100'} p-4 flex-grow overflow-y-auto`}>
            {activeTab === 'question' && (
              <>
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
              </>
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
              <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
                <h3 className="text-lg font-bold mb-2">Solution</h3>
                <pre className={`p-2 rounded ${isDarkMode ? 'bg-[#2f2c2c]' : 'bg-gray-200'}`}>
                  <code>{currentQuestion.solution || 'Solution not available'}</code>
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
        <div className={`rounded-lg p-4 mb-4 shadow-md h-[460px] ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
          <Bot isDarkMode={isDarkMode} />
        </div>
      )}
            </>
            )}
          </div>
          
        </div>

        {/* Right side: Code Editor and Results */}
        <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-gray-200'} p-4 flex flex-col`}>
          <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} rounded-t-lg p-2 flex justify-between items-center`}>
            <span className="text-lg font-semibold">Python</span>
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
              language="python"
              theme={isDarkMode ? "vs-dark" : "vs-light"}
              value={userCodes[currentQuestionIndex] || ''}
              onChange={(newValue) => {
                setUserCodes(prevCodes => ({
                  ...prevCodes,
                  [currentQuestionIndex]: newValue
                }));
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
                  className={`flex-1 ${isSubmitting ? 'bg-teal-500' : 'bg-teal-600'} text-white px-4 py-2 rounded hover:bg-teal-700 focus:outline-none flex items-center justify-center`}
                  onClick={handleRunCode}
                  disabled={isSubmitting || isTesting}
                >
                  {isSubmitting ? (
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
                  disabled={isSubmitting || isTesting}
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
            <div className={`mt-1 ${isDarkMode ? 'bg-[#403f3f]' : 'bg-white'} rounded p-2 flex-grow overflow-y-auto`}>
              <h1 className='text-lg font-semibold'>Output</h1>
              {showFeedback && (
                <div className={`p-2 rounded mb-2 ${feedback.includes('Correct answer!') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {feedback}
                </div>
              )}
              {userOutput && (
                <div>
                  <h3 className="text-lg font-bold mb-2">Your Output:</h3>
                  <pre className={`p-2 rounded ${isDarkMode ? 'bg-[#2f2c2c]' : 'bg-gray-200'}`}>
                    <code>{userOutput}</code>
                  </pre>
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
};

export default PythonQuizApp;