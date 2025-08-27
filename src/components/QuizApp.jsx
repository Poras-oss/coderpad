import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MonacoEditor from './ResizableMonacoEditor';
import queryString from 'query-string';
import { useUser } from '@clerk/clerk-react';
import Split from 'react-split';
import { Loader2, Video, X, BookOpen, Play, Pause, RotateCcw, Hash, Menu } from 'lucide-react';
import ReactPlayer from 'react-player';
import Bot from './Bot';

import { Badge } from "./ui/badge";
import SubscriptionDialogue from './SubscriptionDialogue';
import Navbar from './Navbar';
// import '../styles/scrollbar.css';
import { useNotification } from "../notification/NotificationProvider";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';


export default function QuizApp() {
  const { user, isLoaded } = useUser();
  const { showSuccess, showError, showWarning, showInfo } = useNotification()

  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userQueries, setUserQueries] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [saveStatus, setSaveStatus] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [buttonText, setButtonText] = useState('Save Results');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [activeNestedTab, setActiveNestedTab] = useState('expected_output');
  const [totalScore, setTotalScore] = useState(0);

  const [isSubscriptionDialogueOpen, setIsSubscriptionDialogueOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');

  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 60 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scores, setScores] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [userInfo, setUserInfo] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Parse questionID and userID from URL
  const parsed = queryString.parse(location.search);
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

  const [timeInSeconds, setTimeInSeconds] = useState(0);
  const [isStopwatchRunning, setisStopwatchRunning] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarQuestions, setSidebarQuestions] = useState([]);
  const [sidebarPage, setSidebarPage] = useState(1);
  const [sidebarTotalPages, setSidebarTotalPages] = useState(1);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const QUESTIONS_PER_PAGE = 20;

  // Add to the component's state
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const handleDifficultySelect = (difficulty) => {
    // If the clicked difficulty is already selected, deselect it (set to null)
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
    } else {
      // Otherwise, select the new difficulty
      setSelectedDifficulty(difficulty);
    }
    // Reset to the first page whenever a filter changes
    setSidebarPage(1); 
  };

  // Fetch questions for sidebar
  // useEffect(() => {
  //   if (!isSidebarOpen) return;
  //   setSidebarLoading(true);
  //   axios.get('https://server.datasenseai.com/test-series-coding/mysql', {
  //     params: {
  //       page: sidebarPage,
  //       limit: QUESTIONS_PER_PAGE,
  //       difficulty: selectedDifficulty || undefined, // Add this line
  //     },
  //   })
  //     .then((response) => {
  //       setSidebarQuestions(response.data.results || []);
  //       setSidebarTotalPages(response.data.totalPages || 1);
  //     })
  //     .catch(() => setSidebarQuestions([]))
  //     .finally(() => setSidebarLoading(false));
  // }, [isSidebarOpen, sidebarPage, selectedDifficulty]); // Add selectedDifficulty to dependencies

  // Fetch questions for sidebar
  useEffect(() => {
    if (!isSidebarOpen) return;
    setSidebarLoading(true);
    axios.get('https://server.datasenseai.com/test-series-coding/mysql', {
      params: {
        page: sidebarPage,
        limit: QUESTIONS_PER_PAGE,
        // ✅ Corrected parameter name to match the API expectation
        difficulties: selectedDifficulty || undefined, 
      },
    })
      .then((response) => {
        setSidebarQuestions(response.data.results || []);
        setSidebarTotalPages(response.data.totalPages || 1);
      })
      .catch(() => setSidebarQuestions([]))
      .finally(() => setSidebarLoading(false));
  }, [isSidebarOpen, sidebarPage, selectedDifficulty]);

  useEffect(() => {
    if (activeTab === 'discussion') {
      fetchDiscussions();
    }
  }, [activeTab, questionID]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!isLoaded || !user) return;
      if (activeTab === 'submission') {
        try {
          const response = await axios.get(
            `https://server.datasenseai.com/submission-history/get-submissions/${questionID}`,
            { params: { clerkId: user.id } }
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

  //quiz time setter from api response

  useEffect(() => {
    if (quizData?.isTimerEnabled) {
      setTimeRemaining(quizData.quizTime * 60);
    }
  }, [quizData]);

  const openVideoPopup = () => {
    const currentQuestion = quizData.questions[currentQuestionIndex];
    if (currentQuestion.video) {
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
      if (!quizID && !questionID) {
        console.log('No quiz or question ID provided');
        return;
      }

      setLoading(true);

      try {
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
          setTotalScore(response.data.questions.length)
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

        if (error.response) {
          const { status, data } = error.response;

          switch (status) {
            case 401:
              setAuthError(true);
              break;
            case 403:

              if (data.message.includes("requires a")) {
                showWarning(`Upgrade required: ${data.message}`)
              } else if (data.message.includes("reached your limit")) {
                showWarning(`Usage limit: ${data.message}`)
              } else if (data.message.includes("Insufficient fuel")) {
                showError(`Fuel error: ${data.message}`)
              } else {
                showError(data.message)

              }
              break;
            case 404:
              setError('Quiz or question not found');
              break;
            default:
              setError('An error occurred while fetching data');
          }
        } else if (error.request) {
          setError('No response from server. Please check your connection.');
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?.id && (quizID || questionID)) {
      fetchQuizData();
    }

    return () => {
      setQuizData(null);
      setError(null);
      setLoading(false);
    };
  }, [user, quizID, questionID]);

  useEffect(() => {
    if (quizData && quizData.questions) {
      setUserQueries(quizData.questions.map(() => ""));
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
        subject: "mysql"
      });
    } catch (error) {
      console.error('Error saving solved question:', error.message);
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
    }
  };


  const addToStreak = async (clerkId, questionId) => {
    try {
      const response = await axios.post('https://server.datasenseai.com/question-attempt/update-streak', {
        clerkId,
        subjectId: "mysql",
        questionId,
      });
      return response.data; // Return the response if needed elsewhere
    } catch (error) {
      console.error('Error saving streak:', error.response?.data || error.message);
    }
  };

  const creditFuel = async (clerkId) => {
    const difficulty = quizData.questions[currentQuestionIndex].difficulty;
    const response = await axios.post('https://server.datasenseai.com/fuel-engine/credit', {
      clerkId,
      key: 'practice' + difficulty,
    });

    console.log('fuel credit pracictice' + difficulty, response.data);
  };



  const handleTestCode = async () => {
    setIsTesting(true);

    try {
      const response = await axios.get(`https://server.datasenseai.com/execute-sql/query?q=${encodeURIComponent(userQueries[currentQuestionIndex])}`);
      const userAnswer = response.data;

      const expectedOutput = quizData.questions[currentQuestionIndex].expected_output;
      const isCorrect = compareResults(userAnswer, expectedOutput);

      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: isCorrect ? 1 : 0,
      }));

      if (isCorrect) {
        setFeedback({ text: 'Correct!', isCorrect: true });
        saveSolvedQuestion(user.id, questionID);
      } else {
        console.log(userAnswer)
        setFeedback({
          text: 'Incorrect. Please try again.',
          isCorrect: false,
          expected: expectedOutput,
          userAnswer: userAnswer,
        });
      }

      setOutput(userAnswer);

      saveSubmission(user.id, questionID, isCorrect, userQueries[currentQuestionIndex]);


      //Increment the question solving streak
      addToStreak(user.id, questionID);

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
      setFeedback({ text: 'Error testing code', isCorrect: false });
      setOutput('Error executing query' + error);
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

        if (submissions.length == 0 && !isQuizMode) {
          creditFuel(user.id);
        }

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
    } finally {
      setIsRunning(false);
    }
  };

  const compareResults = (userResults, expectedOutput) => {
    if (userResults.error === true) return false;

    const expectedRows = expectedOutput.rows;

    if (userResults.length !== expectedRows.length) {
      return false;
    }

    const expectedRowStrings = expectedRows
      .map(row => JSON.stringify(Object.values(row).sort()))
      .sort();

    const userRowStrings = userResults
      .map(row => JSON.stringify(Object.values(row).sort()))
      .sort();

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
    const userScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const timeTaken = 3600 - timeRemaining; // in seconds

    const uf = {
      clerkId: user?.id,
      quizID: quizID,
      userID: `${userInfo.email || ' '}, ${userInfo.firstName || ' '}, ${userInfo.phone || ' '}`,
      score: userScore,
      totalscore: totalScore,
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
    if (!discussionText.trim()) return;

    try {
      const response = await axios.post('https://server.datasenseai.com/discussion-route/add-discussion', {
        questionCode: questionID,
        username: user.fullName,
        discussionText
      });

      const newComment = {
        discussionText,
        username: user.fullName,
        createdAt: new Date().toISOString(),
      };

      setComments((prevComments) => [...prevComments, newComment]);
      setDiscussionText('');
    } catch (error) {
      console.error(error);
      setError('Failed to add comment');
    }
  };

  function parseDataOverview(inputString) {
    const resultMap = new Map();
    const lines = inputString.split("\n");

    lines.forEach(line => {
      const colonIndex = line.indexOf(":");
      if (colonIndex !== -1) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
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

  // Add a helper function for badge style (copied from TestSeriesCoderpadHome.jsx)
  const getDifficultyStyle = (difficulty) => {
    if (!difficulty) return isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800';
    const normalized = difficulty.toLowerCase();
    if (normalized === 'advance' || normalized === 'advanced') return isDarkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-800';
    if (normalized === 'medium') return isDarkMode ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-100 text-yellow-800';
    if (normalized === 'easy') return isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-800';
    return isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800';
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
    <div className={`font-sans min-h-screen ${isDarkMode ? 'bg-[#262626] text-white' : 'bg-white text-black'}`}>
      {/* Restore Navbar at the top */}
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      {/* Sidebar overlay and sidebar */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-all"
            onClick={() => setIsSidebarOpen(false)}
          />
          <aside
            className={`fixed top-0 left-0 z-50 h-full w-80 max-w-full shadow-lg flex flex-col ${isDarkMode ? 'bg-[#232323] text-white' : 'bg-white text-black'}`}
            style={{ minWidth: 320 }}
          >
            <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h2 className="text-lg font-bold">All Questions</h2>
              <button
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Close sidebar"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X size={22} />
              </button>
            </div>

            {/* Add the difficulty slicer here */}
            {/* <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
              {['Easy', 'Medium', 'Advanced'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultySelect(difficulty.toLowerCase())}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    selectedDifficulty === difficulty.toLowerCase()
                      ? difficulty.toLowerCase() === 'easy'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : difficulty.toLowerCase() === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                      : isDarkMode
                      ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div> */}

            <div className={`flex items-center justify-around p-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {['Easy', 'Medium', 'Advanced'].map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => handleDifficultySelect(difficulty.toLowerCase())}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out w-full mx-1 ${
                    selectedDifficulty === difficulty.toLowerCase()
                      ? difficulty.toLowerCase() === 'easy'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 shadow-md'
                        : difficulty.toLowerCase() === 'medium'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 shadow-md'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 shadow-md'
                      : isDarkMode
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-2">
              {sidebarLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="animate-spin h-6 w-6 text-cyan-600" />
                </div>
              ) : sidebarQuestions.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">No questions found.</div>
              ) : (
                // <ul>
                //   {sidebarQuestions.map((q, idx) => (
                //     <li
                //       key={q._id}
                //       className={`mb-2 p-2 rounded cursor-pointer ${isDarkMode ? 'hover:bg-cyan-900' : 'hover:bg-cyan-100'} ${currentQuestion && q._id === currentQuestion._id ? (isDarkMode ? 'bg-cyan-800 font-bold' : 'bg-cyan-200 font-bold') : ''}`}
                //       onClick={async () => {
                //         if (q._id !== questionID) {
                //           // Update the URL to the new questionID, preserving userID
                //           navigate(`/quiz?questionID=${q._id}${userID ? `&userID=${userID}` : ''}`);
                //         }
                //         setIsSidebarOpen(false);
                //       }}
                //     >
                //       <div className="flex items-center justify-between">
                //         <div className="font-medium text-sm">{q.title || q.question_text?.slice(0, 60) || 'Untitled Question'}</div>
                //         {q.difficulty && (
                //           <span className={`ml-2 px-2 py-0.5 rounded text-xs font-semibold ${getDifficultyStyle(q.difficulty)}`}>{q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}</span>
                //         )}
                //       </div>
                //       <div className={`text-xs ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>{q.id ? q.id.toUpperCase() : ''}</div>
                //     </li>
                //   ))}
                // </ul>

                <ul>
                  {sidebarQuestions.map((q, idx) => {
                    // Calculate the sequential question number
                    const questionNumber = (sidebarPage - 1) * QUESTIONS_PER_PAGE + idx + 1;
                    return (
                      <li
                        key={q._id}
                        className={`p-3 rounded cursor-pointer flex items-start justify-between ${isDarkMode ? 'hover:bg-cyan-900' : 'hover:bg-cyan-100'} ${currentQuestion && q._id === currentQuestion._id ? (isDarkMode ? 'bg-cyan-800 font-bold' : 'bg-cyan-200 font-bold') : ''}`}
                        onClick={async () => {
                          if (q._id !== questionID) {
                            navigate(`/quiz?questionID=${q._id}${userID ? `&userID=${userID}` : ''}`);
                          }
                          setIsSidebarOpen(false);
                        }}
                      >
                        <div className="flex items-start gap-3 flex-1">
                          <span className={`text-sm font-mono mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {questionNumber}.
                          </span>
                          <span className="font-medium text-sm">
                            {q.title || q.question_text?.slice(0, 60) || 'Untitled Question'}
                          </span>
                        </div>
                        {q.difficulty && (
                          <span className={`ml-4 px-2 py-0.5 rounded text-xs font-semibold shrink-0 ${getDifficultyStyle(q.difficulty)}`}>
                            {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
            <div className={`p-2 flex items-center justify-between ${isDarkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
              <button
                className={`px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSidebarPage(p => Math.max(1, p - 1))}
                disabled={sidebarPage === 1}
              >
                Prev
              </button>
              <span className="text-xs">Page {sidebarPage} of {sidebarTotalPages}</span>
              <button
                className={`px-3 py-1 rounded disabled:opacity-50 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-700'}`}
                onClick={() => setSidebarPage(p => Math.min(sidebarTotalPages, p + 1))}
                disabled={sidebarPage === sidebarTotalPages}
              >
                Next
              </button>
            </div>
          </aside>
        </>
      )}
      {/* Blur main content when sidebar is open */}
      <div className={isSidebarOpen ? 'filter blur-sm pointer-events-none select-none' : ''}>
        {/* Header with menu button */}
        <div className={`${isDarkMode ? 'bg-[rgb(64,63,63)]' : 'bg-gray-200'} p-4 flex justify-between items-center shadow-sm`}>
          <div className="flex items-center gap-2">
            {/* This condition ensures the Menu button only shows for practice questions, not in a quiz. */}
            {questionID && (
              <button
                className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                aria-label="Open sidebar"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu size={24} />
              </button>
            )}
            <h1 className="text-xl font-bold">SQL Coderpad</h1>
          </div>
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
                    {!isStopwatchRunning ? <Play size={16} /> : <Pause size={16} />}
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
          </div>
        </div>

        <Split
          className={`flex h-[calc(100vh-8rem)] split-wrapper ${isDarkMode ? 'dark' : ''}`}
          sizes={[50, 50]}
          minSize={300}
          expandToMin={false}
          gutterSize={4} // Reduced from 10 to 4 for a sleeker look
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          style={{
            // Add inline styles for the split container
            '--gutter-bg': isDarkMode ? '#60a5fa' : '#4a5568',
            '--gutter-hover': isDarkMode ? '#3b82f6' : '#60a5fa',
          }}
          gutter={(index, direction) => {
            const gutter = document.createElement('div');
            gutter.className = `gutter gutter-${direction}`;
            // Add inline styles for the gutter
            Object.assign(gutter.style, {
              position: 'relative',
              backgroundColor: 'transparent',
              cursor: 'col-resize',
            });

            // Add the visual indicator
            const indicator = document.createElement('div');
            Object.assign(indicator.style, {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '4px',
              height: '50px',
              borderRadius: '3px',
              backgroundColor: 'var(--gutter-bg)',
              opacity: '0.5',
              transition: 'opacity 0.2s, background-color 0.2s',
            });

            // Add hover effect
            gutter.addEventListener('mouseenter', () => {
              indicator.style.opacity = '0.8';
              indicator.style.backgroundColor = 'var(--gutter-hover)';
            });
            gutter.addEventListener('mouseleave', () => {
              indicator.style.opacity = '0.5';
              indicator.style.backgroundColor = 'var(--gutter-bg)';
            });

            gutter.appendChild(indicator);
            return gutter;
          }}
        >
          <div className="flex flex-col overflow-hidden">
            {quizID && (
              <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} px-4 h-1/8 relative`}>
                <div 
                  className="overflow-x-auto whitespace-nowrap py-2 scrollbar-thin 
                             scrollbar-track-gray-200 scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 
                             dark:scrollbar-track-gray-700 dark:scrollbar-thumb-gray-500 dark:hover:scrollbar-thumb-gray-400"
                >
                  <ul className="flex flex-nowrap gap-4">
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

            <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} p-4 flex`}>
              {(isQuizMode ? ['Question', 'Tables'] : ['Question', 'Tables', 'Discussion', 'Solution', 'Submission', 'AI Help']).map((tab) => (
                <button
                  key={tab}
                  className={`py-2 px-4 ${activeTab === tab.toLowerCase() ? 'border-b-2 border-teal-500' : ''}`}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} p-4 flex-grow overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-400 hover:scrollbar-thumb-gray-500 dark:scrollbar-thumb-gray-600 dark:hover:scrollbar-thumb-gray-500`}>              {activeTab === 'question' && (
                <>
                  <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
                    {currentQuestion.id && (
                      <div className={`question-heading flex items-center p-4 mb-6 ${isDarkMode ? ' bg-[#262626]' : ' bg-white'
                        }`}>
                        <Hash className={`mr-2 h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'
                          }`} />
                        <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                          {currentQuestion.id.toUpperCase()}. {currentQuestion.title}
                        </h2>
                      </div>
                    )}
                    {currentQuestion.scenario && (
                      <div
                        className="scenario-text mb-4 text-md"
                        dangerouslySetInnerHTML={{ __html: currentQuestion.scenario.replace(/\n/g, '<br>') }}
                      />
                    )}
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
                   
                    {(currentQuestion.common_mistakes || currentQuestion.interview_probability || currentQuestion.ideal_time || currentQuestion.roles) && (
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
                               {/* Show Year if available */}
                                {currentQuestion.year && (
                                <tr>
                                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}>
                                  Year
                                  </td>
                                  <td className={`px-6 py-4 whitespace-normal text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}>
                                  {currentQuestion.year}
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
                                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'
                                      }`}
                                  >
                                    Sub topics
                                  </td>
                                  <td
                                    className={`px-6 py-4 whitespace-normal text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'
                                      }`}
                                  >
                                    <div className="flex flex-wrap gap-2">
                                      {currentQuestion.subtopics &&
                                        currentQuestion.subtopics.map((subtopic, subIndex) => (
                                          <Badge
                                            key={subIndex}
                                            variant="secondary"
                                            className={`flex items-center ${isDarkMode
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
                  </div>
                  <div className="tabs-container">
                    <div className="flex space-x-4 border-b mb-4">
                      <button
                        className={`py-2 px-4 ${activeNestedTab === 'expected_output'
                            ? 'border-b-2 border-blue-500 text-black-500'
                            : 'text-gray-500'
                          }`}
                        onClick={() => setActiveNestedTab('expected_output')}
                      >
                        Expected Answer
                      </button>
                      {currentQuestion.table_data &&
                        currentQuestion.table_data.map((table, tableIndex) => (
                          <button
                            key={tableIndex}
                            className={`py-2 px-4 ${activeNestedTab === table.table_name
                                ? 'border-b-2 border-blue-500 text-black-500'
                                : 'text-gray-500'
                              }`}
                            onClick={() => setActiveNestedTab(table.table_name)}
                          >
                            {table.table_name}
                          </button>
                        ))}
                    </div>
                    {activeNestedTab === 'expected_output' && currentQuestion.expected_output && (
                      <div>
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
                    {currentQuestion.table_data &&
                      currentQuestion.table_data.map((table, tableIndex) =>
                        activeNestedTab === table.table_name ? (
                          <div key={tableIndex} className="mb-4">
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
                    <div className={`relative rounded-lg p-4 mb-4 shadow-md h-[460px] overflow-hidden ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
                      }`}>
                      <div className="absolute inset-0 backdrop-filter backdrop-blur-md bg-opacity-50 bg-gray-200 dark:bg-gray-700 dark:bg-opacity-50"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <h2 className={`text-4xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-800'
                          }`}>
                          Coming Soon
                        </h2>
                      </div>
                      <div className="relative z-10 opacity-50">
                        <Bot size={24} className={isDarkMode ? 'text-white' : 'text-gray-900'} />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

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
              gutterAlign="center"
              style={{
                '--gutter-bg': isDarkMode ? '#60a5fa' : '#4a5568',
                '--gutter-hover': isDarkMode ? '#3b82f6' : '#60a5fa',
              }}
              gutter={(index, direction) => {
                const gutter = document.createElement('div');
                gutter.className = `gutter gutter-${direction}`;
                Object.assign(gutter.style, {
                  position: 'relative',
                  backgroundColor: 'transparent',
                  cursor: 'row-resize', // For vertical split, use row-resize
                  height: '10px',
                  width: '100%',
                  zIndex: 10,
                });

                const indicator = document.createElement('div');
                Object.assign(indicator.style, {
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '50px',
                  height: '4px',
                  borderRadius: '3px',
                  backgroundColor: 'var(--gutter-bg)',
                  opacity: '0.5',
                  transition: 'opacity 0.2s, background-color 0.2s',
                });

                gutter.addEventListener('mouseenter', () => {
                  indicator.style.opacity = '0.8';
                  indicator.style.backgroundColor = 'var(--gutter-hover)';
                });
                gutter.addEventListener('mouseleave', () => {
                  indicator.style.opacity = '0.5';
                  indicator.style.backgroundColor = 'var(--gutter-bg)';
                });

                gutter.appendChild(indicator);
                return gutter;
              }}
            >
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
                <div className={`mt-4 ${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded p-4 flex-grow overflow-y-auto max-h-[300px]`}>
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
                          <div className="text-red-600 bg-white-50 border border-grey-400 rounded-md p-4">
                            <p>{output.message}</p>
                            <p><strong>Details:</strong> {output.details}</p>
                            <p><strong>Error Code:</strong> {output.code}</p>
                          </div>
                        ) : Array.isArray(output) && output.length > 0 ? (
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
    </div>
  );
}