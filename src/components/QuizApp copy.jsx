import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import MonacoEditor from './ResizableMonacoEditor';
import queryString from 'query-string';
// import { useUser } from '@clerk/clerk-react';
import { useUser, UserButton } from "@clerk/clerk-react";
import Split from 'react-split';
import { Loader2, Video, X, BookOpen, Play, Pause, RotateCcw, Hash, Menu, CheckCircle2, XCircle, Send, Sun, Moon, LayoutDashboard, ChevronLeft, ChevronRight, FileText, Table2, MessageSquare, KeyRound, History, Sparkles, ThumbsUp, ThumbsDown, Share2, Link, Briefcase, ChevronUp, ChevronDown, Clock, Timer, MessageCircle, Gauge, Calendar, NotebookText, Building2 } from 'lucide-react';
import ReactPlayer from 'react-player';
import Bot from './Bot';

import { Badge } from "./ui/badge";
import SubscriptionDialogue from './SubscriptionDialogue';
import Navbar from './Navbar';
import { useNotification } from "../notification/NotificationProvider";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import logo from "../assets/coderpadLogo.png";


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

  const [timeRemaining, setTimeRemaining] = useState(45 * 60); // 45 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [scores, setScores] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [userInfo, setUserInfo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // MODIFICATION: State for premium feature popup
  const [isPremiumPopupOpen, setIsPremiumPopupOpen] = useState(false);
  const [premiumFeatureName, setPremiumFeatureName] = useState('');

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
  const [isStopwatchRunning, setIsStopwatchRunning] = useState(false);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarQuestions, setSidebarQuestions] = useState([]);
  const [sidebarPage, setSidebarPage] = useState(1);
  const [sidebarTotalPages, setSidebarTotalPages] = useState(1);
  const [sidebarLoading, setSidebarLoading] = useState(false);
  const QUESTIONS_PER_PAGE = 20;

  const [questionList, setQuestionList] = useState([]);
  const [currentQuestionNavIndex, setCurrentQuestionNavIndex] = useState(-1);
  const [questionFeedback, setQuestionFeedback] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);
  const sharePopupRef = useRef(null);


  const [selectedDifficulty, setSelectedDifficulty] = useState(null);

  const [isFolded, setIsFolded] = useState(false);

  const [verticalFoldState, setVerticalFoldState] = useState('none'); // Can be 'none', 'editor_folded', or 'console_folded'
  
  const [isTimerPopupOpen, setIsTimerPopupOpen] = useState(false);
  const [timerMode, setTimerMode] = useState('stopwatch'); // 'stopwatch' or 'timer'
  const [activeTimer, setActiveTimer] = useState('none'); // 'none', 'stopwatch', or 'timer'
  const [countdownSeconds, setCountdownSeconds] = useState(15 * 60);
  const [isCountdownRunning, setIsCountdownRunning] = useState(false);
  const timerPopupRef = useRef(null);


  useEffect(() => {
    const updateCount = () => {
        const min = 387;
        const max = 2999;
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        setOnlineCount(count);
    };
    updateCount();
    const intervalId = setInterval(updateCount, 3000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
        if (sharePopupRef.current && !sharePopupRef.current.contains(event.target)) {
            setIsSharePopupOpen(false);
        }
        if (timerPopupRef.current && !timerPopupRef.current.contains(event.target)) {
            setIsTimerPopupOpen(false);
        }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSharePopupOpen, isTimerPopupOpen]);

  const handleShareClick = (platform) => {
    const url = window.location.href;
    const title = quizData?.questions?.[currentQuestionIndex]?.title || "Check out this SQL question!";
    let shareUrl = '';

    switch (platform) {
        case 'facebook':
            shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
            break;
        case 'linkedin':
            shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`;
            window.open(shareUrl, '_blank', 'noopener,noreferrer');
            break;
        case 'copy':
            navigator.clipboard.writeText(url).then(() => {
                showSuccess("Link copied to clipboard!");
            }).catch(err => {
                showError("Failed to copy link.");
                console.error('Could not copy text: ', err);
            });
            break;
        default:
            return;
    }
    setIsSharePopupOpen(false); 
  };


  const handleDifficultySelect = (difficulty) => {
    if (selectedDifficulty === difficulty) {
      setSelectedDifficulty(null);
    } else {
      setSelectedDifficulty(difficulty);
    }
    setSidebarPage(1);
  };

  useEffect(() => {
    const fetchQuestionList = async () => {
      try {
        const response = await axios.get('https://server.datasenseai.com/test-series-coding/mysql', {
          params: { limit: 1000 }
        });
        if (response.data && Array.isArray(response.data.results)) {
          setQuestionList(response.data.results);
        }
      } catch (err) {
        console.error("Failed to fetch the question list for navigation:", err);
      }
    };
    fetchQuestionList();
  }, []);

  useEffect(() => {
    if (questionList.length > 0 && questionID) {
      const index = questionList.findIndex(q => q._id === questionID);
      setCurrentQuestionNavIndex(index);
    }
  }, [questionList, questionID]);

  const handleNavigation = (offset) => {
    if (currentQuestionNavIndex !== -1) {
      const newIndex = currentQuestionNavIndex + offset;
      if (newIndex >= 0 && newIndex < questionList.length) {
        const targetQuestionId = questionList[newIndex]._id;
        navigate(`/quiz?questionID=${targetQuestionId}${userID ? `&userID=${userID}` : ''}`);
      }
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
      console.error('Error saving submission history:', error);
    }
  };

  const addToStreak = async (clerkId, questionId) => {
    try {
      const response = await axios.post('https://server.datasenseai.com/question-attempt/update-streak', {
        clerkId,
        subjectId: "mysql",
        questionId,
      });
      return response.data;
    } catch (error) {
      console.error('Error saving streak:', error.response?.data || error.message);
    }
  };

  const creditFuel = async (clerkId) => {
    if (!quizData?.questions?.[currentQuestionIndex]) return;
    try {
      const difficulty = quizData.questions[currentQuestionIndex].difficulty;
      const response = await axios.post('https://server.datasenseai.com/fuel-engine/credit', {
        clerkId,
        key: 'practice' + difficulty,
      });
      console.log('fuel credit practice' + difficulty, response.data);
    } catch (error) {
      console.error('Error crediting fuel:', error);
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
    if (!isSidebarOpen) return;
    setSidebarLoading(true);
    axios.get('https://server.datasenseai.com/test-series-coding/mysql', {
      params: {
        page: sidebarPage,
        limit: QUESTIONS_PER_PAGE,
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
  }, [activeTab, questionID, isLoaded, user]);

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
          setIsQuizMode(false);
          response = await axios.get(`${baseUrl}/test-series-coding/mysql/${questionID}`, {
            params: { clerkId: user.id }
          });
        }

        if (response?.data) {
          setTotalScore(response.data.questions.length)
          setQuizData(response.data);
          setFeedback('');
          setOutput(null);
          setQuestionFeedback(null);
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
              setError('Authentication required. Please log in again.');
              break;
            case 403:
              if (data.message?.includes("requires a")) {
                showWarning(`Upgrade required: ${data.message}`);
              } else if (data.message?.includes("reached your limit")) {
                showWarning(`Usage limit: ${data.message}`);
              } else if (data.message?.includes("Insufficient fuel")) {
                showError(`Fuel error: ${data.message}`);
              } else {
                showError(data.message || 'Access denied');
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
      setLoading(true);
    };
  }, [user, quizID, questionID]);

  useEffect(() => {
    if (quizData && quizData.questions) {
      setUserQueries(quizData.questions.map(() => ""));
    }
  }, [quizData]);

  const getRelativeTime = (timestamp) => {
    const now = new Date();
    const submissionDate = new Date(timestamp);
    const diffInSeconds = Math.floor((now - submissionDate) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInSeconds < 60) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return submissionDate.toLocaleDateString();
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setFeedback('');
    try {
      const response = await axios.get(`https://server.datasenseai.com/execute-sql/query?q=${encodeURIComponent(userQueries[currentQuestionIndex])}`);
      const userAnswer = response.data;

      const expectedOutput = quizData.questions[currentQuestionIndex].expected_output;
      const isCorrect = compareResults(userAnswer, expectedOutput);

      if (quizID) {
        setScores(prevScores => ({
          ...prevScores,
          [currentQuestionIndex]: isCorrect ? 1 : 0
        }));
      }

      if (isCorrect) {
        setFeedback({
          text: 'Correct! Now submit the question',
          isCorrect: true,
          userAnswer: userAnswer
        });

        if (submissions.length === 0 && !isQuizMode && user?.id) {
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

      setOutput(userAnswer);
    } catch (error) {
      setOutput({ error: true, message: error.response?.data?.error || 'An error occurred while executing the query.' });
      setFeedback({ text: 'Your query is incorrect', isCorrect: false });
    } finally {
      setIsRunning(false);
    }
  };

  const handleTestCode = async () => {
    setIsTesting(true);
    setFeedback('');

    try {
      const response = await axios.get(`https://server.datasenseai.com/execute-sql/query?q=${encodeURIComponent(userQueries[currentQuestionIndex])}`);
      const userAnswer = response.data;
      setOutput(userAnswer);

      const expectedOutput = quizData.questions[currentQuestionIndex].expected_output;
      const isCorrect = compareResults(userAnswer, expectedOutput);

      if (quizID) {
        setScores(prevScores => ({
          ...prevScores,
          [currentQuestionIndex]: isCorrect ? 1 : 0,
        }));
      }

      if (isCorrect) {
        setFeedback({ text: 'Congratulations! Your solution is correct.', isCorrect: true });
        if (questionID && user?.id) {
          saveSolvedQuestion(user.id, questionID);
        }
        if (submissions.length === 0 && !isQuizMode && user?.id) {
          creditFuel(user.id);
        }
      } else {
        setFeedback({
          text: 'Incorrect. Your output does not match the expected result.',
          isCorrect: false,
          expected: expectedOutput,
          userAnswer: userAnswer,
        });
      }

      if (questionID && user?.id) {
        saveSubmission(user.id, questionID, isCorrect, userQueries[currentQuestionIndex]);
        addToStreak(user.id, questionID);

        setSubmissions(prevSubmissions => [
          ...prevSubmissions,
          {
            questionId: questionID,
            isCorrect,
            submittedCode: userQueries[currentQuestionIndex],
            submittedAt: new Date(),
          },
        ]);
      }

    } catch (error) {
      setOutput({ error: true, message: error.response?.data?.error || 'An error occurred during submission.' });
      setFeedback({ text: 'Your code could not be executed. Please check for syntax errors.', isCorrect: false });
    } finally {
      setIsTesting(false);
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
    setOutput(null);
  };

  const handleSubmitQuiz = async (isAutomatic = false) => {
    if (!isAutomatic && (!canSubmit || isSubmitting)) {
      alert("You can't submit the quiz at this time.");
      return;
    }
    setIsTimerRunning(false);
    setIsSubmitting(true);
    const userScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
    const timeTaken = (quizData?.quizTime ? quizData.quizTime * 60 : 3600) - timeRemaining;

    const uf = {
      clerkId: user?.id,
      quizID: quizID,
      userID: `${userInfo.email || ' '}, ${userInfo.firstName || ' '}, ${userInfo.phone || ' '}`,
      score: userScore,
      totalscore: totalScore,
      duration: timeTaken
    };

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
    } finally {
      setIsSubmitting(false);
    }

    alert("The quiz is submitted");
    window.location.href = `/live-events`;
  };

  const fetchDiscussions = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://server.datasenseai.com/discussion-route/get-discussions/${questionID}`);
      setComments(response.data.comments || []);
    } catch (error) {
      setError('Failed to load discussions');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscussionSubmit = async () => {
    if (!discussionText.trim() || !user) return;
    try {
      await axios.post('https://server.datasenseai.com/discussion-route/add-discussion', {
        questionCode: questionID,
        username: user.fullName,
        discussionText
      });
      fetchDiscussions();
      setDiscussionText('');
    } catch (error) {
      setError('Failed to add comment');
    }
  };

  const handleBackToHome = () => {
    window.location.href = "https://practice.datasenseai.com";
  };

  useEffect(() => {
    let interval = null;
    if (isStopwatchRunning) {
      interval = setInterval(() => setTimeInSeconds(prev => prev + 1), 1000);
    }
    return () => clearInterval(interval);
  }, [isStopwatchRunning]);

  useEffect(() => {
      let interval = null;
      if (isCountdownRunning && countdownSeconds > 0) {
          interval = setInterval(() => {
              setCountdownSeconds(prev => prev - 1);
          }, 1000);
      } else if (isCountdownRunning && countdownSeconds === 0) {
          setIsCountdownRunning(false);
          showInfo("Time's up!");
          setActiveTimer('none'); 
      }
      return () => clearInterval(interval);
  }, [isCountdownRunning, countdownSeconds]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStartTimerOrStopwatch = () => {
      if (timerMode === 'stopwatch') {
          setActiveTimer('stopwatch');
          setIsStopwatchRunning(true);
      } else {
          setActiveTimer('timer');
          setIsCountdownRunning(true);
      }
      setIsTimerPopupOpen(false);
  };

  const handleTogglePlayPause = () => {
    if (activeTimer === 'stopwatch') {
      setIsStopwatchRunning(!isStopwatchRunning);
    } else if (activeTimer === 'timer') {
      setIsCountdownRunning(!isCountdownRunning);
    }
  };

  const handleReset = () => {
    if (activeTimer === 'stopwatch') {
        setIsStopwatchRunning(false);
        setTimeInSeconds(0);
    } else if (activeTimer === 'timer') {
        setIsCountdownRunning(false);
        setCountdownSeconds(15 * 60);
    }
    setActiveTimer('none');
  };


  const getDifficultyStyle = (difficulty) => {
    if (!difficulty) return isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800';
    const normalized = difficulty.toLowerCase();
    if (normalized === 'advance' || normalized === 'advanced') return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    if (normalized === 'medium') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (normalized === 'easy') return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    return 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
  };

  if (loading) return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1e1e1e]">
      <Loader2 className="w-16 h-16 text-teal-500 animate-spin" />
      <h5 className="mt-4 text-2xl font-light text-gray-600 dark:text-gray-400">Loading Problem...</h5>
    </div>
  );

  if (error) return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-[#1e1e1e]">
      <XCircle className="w-16 h-16 text-red-500" />
      <h5 className="mt-4 text-2xl font-light text-red-600 dark:text-red-400">{error}</h5>
    </div>
  );

  const currentQuestion = quizData?.questions[currentQuestionIndex];
  if (!currentQuestion) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 backdrop-blur-md">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Desktop Experience Recommended</h2>
          <h5 className="mb-4">This coding environment is best experienced on a larger screen. Please use a PC or tablet.</h5>
          <button
            onClick={() => setIsMobile(false)}
            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 transition duration-300"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    );
  }

  const gutter = (index, direction) => {
    const gutterElement = document.createElement('div');
    // MODIFICATION: Updated gutter color for dark mode
    gutterElement.className = `bg-gray-200 dark:bg-[#585858] hover:bg-teal-500 dark:hover:bg-teal-400 transition-colors duration-200 ${direction === 'horizontal' ? 'cursor-col-resize' : 'cursor-row-resize'}`;
    return gutterElement;
  };

  const tabs = isQuizMode ? ['Question', 'Tables'] : ['Question', 'Tables', 'Discussion', 'Solution', 'Submission', 'AI Help'];

  return (
    // MODIFICATION: Updated main background color for dark mode
    <div className={`font-sans h-screen overflow-hidden flex flex-col ${isDarkMode ? 'dark bg-[#1e1e1e] text-gray-300' : 'bg-gray-50 text-gray-800'}`}>
      {/* MODIFICATION: Updated header background and border colors for dark mode */}
      <header className="flex-shrink-0 h-12 flex items-center justify-between px-4 border-b border-gray-200 dark:border-[#333333] bg-white dark:bg-[#0F0F0F]">
        <div className="flex items-center gap-4">
          <img
            className="w-18 h-12 cursor-pointer logo-flip"
            src={logo}
            alt="logo"
            onClick={handleBackToHome} />
          {questionID && (
            <button
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Open sidebar"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
          )}
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">SQL Coderpad</h1>

          {questionID && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => handleNavigation(-1)}
                disabled={currentQuestionNavIndex <= 0}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous Question"
                title="Previous Question"
              >
                <ChevronLeft size={25} />
              </button>
              <button
                onClick={() => handleNavigation(1)}
                disabled={currentQuestionNavIndex === -1 || currentQuestionNavIndex >= questionList.length - 1}
                className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next Question"
                title="Next Question"
              >
                <ChevronRight size={25} />
              </button>
            </div>
          )}
          
        </div>
        <div className="flex items-center space-x-4">
          <button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 "
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </button>
          <a
            href="https://dashboard.datasenseai.com/practice-dashboard"
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <LayoutDashboard className="h-4 w-4" />
          </a>
          {isTimerRunning && (
            <div className="text-sm font-medium bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md">
              Time: {formatTime(timeRemaining)}
            </div>
          )}
          
          {questionID && (
            <div className="relative">
              {activeTimer === 'none' ? (
                <button
                  onClick={() => setIsTimerPopupOpen(prev => !prev)}
                  className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                  title="Open Timer/Stopwatch"
                >
                  <Clock size={20} className="text-orange-500" />
                </button>
              ) : (
                <div className="flex items-center space-x-2 text-sm">
                  <div className="font-mono bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-md w-24 text-center">
                    {activeTimer === 'stopwatch' ? formatTime(timeInSeconds) : formatTime(countdownSeconds)}
                  </div>
                  <button onClick={handleTogglePlayPause} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    { (activeTimer === 'stopwatch' && isStopwatchRunning) || (activeTimer === 'timer' && isCountdownRunning) ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button onClick={handleReset} className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700">
                    <RotateCcw size={16} />
                  </button>
                </div>
              )}

              {isTimerPopupOpen && (
                <div 
                  ref={timerPopupRef} 
                  // MODIFICATION: Updated popup background and border color for dark mode
                  className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-[#252526] rounded-lg shadow-xl border border-gray-200 dark:border-[#333333] p-4 z-50"
                >
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <button
                      onClick={() => setTimerMode('stopwatch')}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 border-2 ${
                          timerMode === 'stopwatch' 
                          ? 'bg-blue-50 dark:bg-blue-900/50 border-blue-500' 
                          // MODIFICATION: Updated button background color for dark mode
                          : 'bg-gray-100 dark:bg-[#333333] border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Timer size={28} className="text-blue-500 mb-2" />
                      <span className="text-sm font-semibold">Stopwatch</span>
                    </button>
                    <button
                      onClick={() => setTimerMode('timer')}
                      className={`p-3 rounded-lg flex flex-col items-center justify-center text-center transition-all duration-200 border-2 ${
                        timerMode === 'timer' 
                        ? 'bg-orange-50 dark:bg-orange-900/50 border-orange-500' 
                        // MODIFICATION: Updated button background color for dark mode
                        : 'bg-gray-100 dark:bg-[#333333] border-transparent hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Clock size={28} className="text-orange-500 mb-2" />
                      <span className="text-sm font-semibold">Timer</span>
                    </button>
                  </div>

                  {timerMode === 'timer' && (
                    <div className="mb-4 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Set a countdown duration:</p>
                      <div className="flex justify-center gap-2">
                        {[15, 30, 60].map(min => (
                          <button
                            key={min}
                            onClick={() => setCountdownSeconds(min * 60)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                              countdownSeconds === min * 60
                              ? 'bg-teal-500 text-white'
                              // MODIFICATION: Updated button background color for dark mode
                              : 'bg-gray-200 dark:bg-[#333333] hover:bg-gray-300 dark:hover:bg-gray-500'
                            }`}
                          >
                            {min} min
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleStartTimerOrStopwatch}
                    className="w-full bg-gray-900 text-white dark:bg-gray-100 dark:text-black font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
                  >
                    <Play size={16} />
                    Start {timerMode === 'stopwatch' ? 'Stopwatch' : 'Timer'}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* MODIFICATION: Updated Video button to trigger premium popup */}
          <button
            onClick={() => {
              setPremiumFeatureName('Video Solution');
              setIsPremiumPopupOpen(true);
            }}
            className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Video size={20} />
          </button>

          {quizID && (
            <button
              onClick={() => handleSubmitQuiz(false)}
              disabled={!canSubmit}
              className="px-4 py-1.5 text-sm rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50"
            >
              Submit Quiz
            </button>
          )}
          <UserButton />
        </div>
      </header>
      
      <main className="flex-grow min-h-0">
            <Split
                className="flex h-full"
                sizes={isFolded ? [5, 95] : [45, 55]}
                minSize={isFolded ? 60 : 400}
                gutterSize={isFolded ? 0 : 4}
                gutter={gutter}
                direction="horizontal"
            >
                {/* MODIFICATION: Updated left panel background color for dark mode */}
                <div className="flex flex-col overflow-hidden bg-white dark:bg-[#262626]">
                    {isFolded ? (
                        <div className="flex flex-col items-center py-4 space-y-4 h-full">
                            <button
                                onClick={() => setIsFolded(false)}
                                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-900"
                                title="Unfold Panel"
                            >
                                <ChevronRight size={20} />
                            </button>
                            <nav className="flex flex-col space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab}
                                        title={tab}
                                        className={`p-3 rounded-md transition-colors ${
                                            activeTab === tab.toLowerCase()
                                                ? 'bg-teal-100 dark:bg-teal-800 text-teal-600 dark:text-teal-300'
                                                : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                        // MODIFICATION: Updated AI Help tab to trigger premium popup
                                        onClick={() => {
                                            if (tab === 'AI Help') {
                                                setPremiumFeatureName('AI Help');
                                                setIsPremiumPopupOpen(true);
                                            } else {
                                                setActiveTab(tab.toLowerCase());
                                                setIsFolded(false);
                                            }
                                        }}
                                    >
                                        {tab === 'Question' && <FileText size={20} />}
                                        {tab === 'Tables' && <Table2 size={20} />}
                                        {tab === 'Discussion' && <MessageSquare size={20} />}
                                        {tab === 'Solution' && <KeyRound size={20} />}
                                        {tab === 'Submission' && <History size={20} />}
                                        {tab === 'AI Help' && <Sparkles size={20} />}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    ) : (
                        <>
                            {quizID && quizData?.questions && (
                                <div className="flex-shrink-0 px-2 py-2 border-b border-gray-200 dark:border-[#333333]">
                                    {/* Add overflow container */}
                                    <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                        {/* Force single line with nowrap and add padding for scrollbar */}
                                        <div className="flex flex-nowrap gap-2 pb-2">
                                            {quizData.questions.map((_, index) => (
                                                <button
                                                    key={index}
                                                    className={`flex-shrink-0 h-8 w-8 text-sm rounded-md flex items-center justify-center transition-colors ${
                                                        index === currentQuestionNavIndex
                                                            ? 'bg-teal-500 text-white font-semibold shadow-md'
                                                            : 'bg-gray-100 dark:bg-[#252526] hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                                                    }`}
                                                    onClick={() => handleQuestionSelect(index)}
                                                >
                                                    {index + 1}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {/* MODIFICATION: Updated tabs border color for dark mode */}
                            <div className="flex-shrink-0 px-4 border-b border-gray-200 dark:border-[#333333] flex justify-between items-center">
                                <nav className="flex space-x-4">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab}
                                            className={`py-2 px-1 text-sm font-medium transition-colors ${
                                                activeTab === tab.toLowerCase()
                                                    ? 'border-b-2 border-teal-500 text-gray-900 dark:text-white'
                                                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                            }`}
                                            // MODIFICATION: Updated AI Help tab to trigger premium popup
                                            onClick={() => {
                                                if (tab === 'AI Help') {
                                                    setPremiumFeatureName('AI Help');
                                                    setIsPremiumPopupOpen(true);
                                                } else {
                                                    setActiveTab(tab.toLowerCase());
                                                }
                                            }}
                                        >
                                            <span className="flex items-center gap-2">
                                            {tab === 'Question' && <FileText className="h-5 w-5 text-[#14B8A6]" />}
                                            {tab === 'Tables' && <Table2 className="h-5 w-5 text-[#8E7128]" />}
                                            {tab === 'Discussion' && <MessageSquare className="h-5 w-5 text-[#28598E]" />}
                                            {tab === 'Solution' && <KeyRound className="h-5 w-5 text-[#02B128]" />}
                                            {tab === 'Submission' && <History className="h-5 w-5 text-[#28598E]" />}
                                            {tab === 'AI Help' && <Sparkles className="h-4 w-4 text-[#007BFF]" />}
                                            {tab}
                                            </span>
                                        </button>
                                    ))}
                                </nav>
                                <button
                                    onClick={() => setIsFolded(true)}
                                    className="p-2 -mr-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                    title="Fold Panel"
                                >
                                    <ChevronLeft size={20} />
                                </button>
                            </div>

                            <div className="flex-grow p-5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-900 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                {activeTab === 'question' && (
                                    <article className="prose prose-sm dark:prose-invert max-w-none">
                                      {questionID && (
                                        <div>
                                            <h2 className="text-xl font-bold text-gray-900 dark:text-white m-0">
                                                {currentQuestion.id?.toUpperCase()}. {currentQuestion.title}
                                            </h2>
                                            
                                            <div className="mt-3 mb-4 flex flex-wrap items-center gap-2">
                                                {currentQuestion.difficulty && (
                                                    <span className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full capitalize ${getDifficultyStyle(currentQuestion.difficulty)}`}>
                                                        <Gauge className="h-3 w-3" />
                                                        {currentQuestion.difficulty}
                                                    </span>
                                                )}
                                                {currentQuestion.subtopics && currentQuestion.subtopics.length > 0 && (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full capitalize bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                                      <NotebookText className="h-3 w-3" />
                                                      {currentQuestion.subtopics.join(', ')}
                                                    </span>
                                                )}
                                                {currentQuestion.ideal_time && (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full capitalize bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                      <Timer className="h-3 w-3" />
                                                      {currentQuestion.ideal_time}
                                                    </span>
                                                )}
                                                {currentQuestion.company && currentQuestion.company.map((company, compIndex) => (
                                                  <span key={compIndex} className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full capitalize bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                                                    {/* <Briefcase className="h-3 w-3" /> */}
                                                    <Building2 className="h-3 w-3" />
                                                    {company}
                                                  </span>
                                                ))}
                                                {currentQuestion.year && (
                                                    <span className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full capitalize bg-[#f8caaa] text-[#F97316] dark:bg-[#f8caaa] dark:text-[#F97316]">
                                                      <Calendar className="h-3 w-3" />
                                                      {currentQuestion.year}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                      )}

                                        {currentQuestion.scenario && <div dangerouslySetInnerHTML={{ __html: currentQuestion.scenario.replace(/\n/g, '<br>') }} />}
                                        {/* MODIFICATION: Updated background color for dark mode */}
                                        <div className="mt-4 p-4 border-l-4 border-teal-500 bg-gray-50 dark:bg-[#252526]/50 rounded-r-md">
                                            <div dangerouslySetInnerHTML={{ __html: currentQuestion.question_text.replace(/\n/g, '<br>') }} />
                                        </div>

                                        {currentQuestion['data-overview'] && (
                                            <div className="mt-6">
                                                <h4 className="text-lg font-semibold mb-3">Data Overview</h4>
                                                {/* MODIFICATION: Updated table border color for dark mode */}
                                                <div className="border border-gray-200 dark:border-[#333333] rounded-md overflow-hidden">
                                                    <table className="w-full text-sm">
                                                        {/* MODIFICATION: Updated table divider color for dark mode */}
                                                        <tbody className="divide-y divide-gray-200 dark:divide-[#333333]">
                                                            {(() => {
                                                                const parsedData = parseDataOverview(currentQuestion['data-overview']);
                                                                return Array.from(parsedData.entries()).map(([key, value], rowIndex) => (
                                                                    <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-gray-50 dark:bg-[#252526]' : 'bg-white dark:bg-[#1e1e1e]'}>
                                                                        <td
                                                                          className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-900'}`}
                                                                          dangerouslySetInnerHTML={{ __html: key }}
                                                                        ></td>
                                                                        <td
                                                                          className={`px-4 py-3 whitespace-normal text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
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

                                        {(currentQuestion.common_mistakes || currentQuestion.interview_probability || currentQuestion.ideal_time || currentQuestion.roles || currentQuestion.subtopics) && (
                                            <div className="mt-6">
                                                <h4 className="text-lg font-semibold mb-3">Additional Information</h4>
                                                <div className="border border-gray-200 dark:border-[#333333] rounded-md overflow-hidden">
                                                    <table className="w-full text-sm">
                                                        <tbody className="divide-y divide-gray-200 dark:divide-[#333333]">
                                                            {currentQuestion.common_mistakes && (
                                                                <tr className="bg-white dark:bg-[#1e1e1e]">
                                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                                        Common Mistakes
                                                                    </td>
                                                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                                        {currentQuestion.common_mistakes}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            {currentQuestion.interview_probability && (
                                                                <tr className="bg-gray-50 dark:bg-[#252526]">
                                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                                        Interview Probability
                                                                    </td>
                                                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                                        {currentQuestion.interview_probability}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            {/* Show Year if available */}
                                                            {currentQuestion.year && (
                                                                <tr className="bg-gray-50 dark:bg-[#252526]">
                                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                                        Year
                                                                    </td>
                                                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                                        {currentQuestion.year}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            {currentQuestion.ideal_time && (
                                                                <tr className="bg-white dark:bg-[#1e1e1e]">
                                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                                        Ideal Time
                                                                    </td>
                                                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                                        {currentQuestion.ideal_time}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            {currentQuestion.roles && (
                                                                <tr className="bg-gray-50 dark:bg-[#252526]">
                                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                                        Job Roles
                                                                    </td>
                                                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                                        {currentQuestion.roles}
                                                                    </td>
                                                                </tr>
                                                            )}
                                                            {currentQuestion.subtopics && (
                                                                <tr className="bg-white dark:bg-[#1e1e1e]">
                                                                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-gray-100">
                                                                        Sub Topics
                                                                    </td>
                                                                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                                                                        <div className="flex flex-wrap gap-2">
                                                                            {currentQuestion.subtopics.map((subtopic, subIndex) => (
                                                                                <Badge
                                                                                    key={subIndex}
                                                                                    variant="secondary"
                                                                                    className="flex items-center bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
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
                                    </article>
                                )}
                                {activeTab === 'tables' && (
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-bold mb-4">Tables</h3>
                                        <div className="mb-4 text-gray-600 dark:text-gray-400">
                                            <p className="text-sm italic mb-4">Note: Only the top 10 rows of each table are displayed except Expected Answer</p>
                                        </div>
                                        <div className="tabs-container">
                                            <div className="flex space-x-4 border-b mb-4 overflow-x-auto">
                                                <button
                                                    className={`py-2 px-4 whitespace-nowrap ${activeNestedTab === 'expected_output'
                                                        ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400'
                                                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                    }`}
                                                    onClick={() => setActiveNestedTab('expected_output')}
                                                >
                                                    Expected Answer
                                                </button>
                                                {currentQuestion.table_data &&
                                                    currentQuestion.table_data.map((table, tableIndex) => (
                                                        <button
                                                            key={tableIndex}
                                                            className={`py-2 px-4 whitespace-nowrap ${activeNestedTab === table.table_name
                                                                ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400'
                                                                : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                                                            }`}
                                                            onClick={() => setActiveNestedTab(table.table_name)}
                                                        >
                                                            {table.table_name}
                                                        </button>
                                                    ))}
                                            </div>
                                            
                                            {activeNestedTab === 'expected_output' && currentQuestion.expected_output && (
                                                <div className="overflow-auto border border-gray-200 dark:border-[#333333] rounded-md">
                                                    <table className="w-full text-sm">
                                                        <thead className="bg-gray-100 dark:bg-[#252526]">
                                                            <tr>
                                                                {currentQuestion.expected_output.columns.map((column, columnIndex) => (
                                                                    <th
                                                                        key={columnIndex}
                                                                        className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300"
                                                                    >
                                                                        {column}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-gray-200 dark:divide-[#333333]">
                                                            {currentQuestion.expected_output.rows.map((row, rowIndex) => (
                                                                <tr key={rowIndex}>
                                                                    {row.map((value, cellIndex) => (
                                                                        <td key={cellIndex} className="px-4 py-2 whitespace-nowrap">
                                                                            {String(value)}
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
                                                        <div key={tableIndex} className="overflow-auto border border-gray-200 dark:border-[#333333] rounded-md">
                                                            <table className="w-full text-sm">
                                                                <thead className="bg-gray-100 dark:bg-[#252526]">
                                                                    <tr>
                                                                        {table.columns.map((column, columnIndex) => (
                                                                            <th key={columnIndex} className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">
                                                                                {column}
                                                                            </th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-gray-200 dark:divide-[#333333]">
                                                                    {table.rows.slice(0, 10).map((row, rowIndex) => (
                                                                        <tr key={rowIndex}>
                                                                            {row.map((cell, cellIndex) => (
                                                                                <td key={cellIndex} className="px-4 py-2 whitespace-nowrap">
                                                                                    {typeof cell === 'object' ? JSON.stringify(cell) : String(cell)}
                                                                                </td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    ) : null
                                                )}
                                        </div>
                                    </div>
                                )}

                                {!isQuizMode && (
                                    <>
                                        {activeTab === 'discussion' && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold mb-4">Discussion</h3>
                                                {loading ? (
                                                    <p>Loading discussions...</p>
                                                ) : error ? (
                                                    <p className="text-red-500">{error}</p>
                                                ) : comments.length === 0 ? (
                                                    <p className="text-gray-500">No discussions yet. Be the first to comment!</p>
                                                ) : (
                                                    <div className="mb-4 max-h-60 overflow-y-auto space-y-2">
                                                        {comments.slice().reverse().map((comment, index) => (
                                                            <div key={index} className="p-3 rounded-md border border-gray-200 dark:border-[#333333] bg-gray-50 dark:bg-[#252526]">
                                                                <p className="font-semibold text-gray-900 dark:text-white">{comment.username}:</p>
                                                                <p className="text-gray-700 dark:text-gray-300 mt-1">{comment.discussionText}</p>
                                                                <p className="text-sm text-gray-500 mt-2">{new Date(comment.createdAt).toLocaleString()}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className="space-y-2">
                                                    <textarea
                                                        className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#333333] text-gray-900 dark:text-white"
                                                        rows="3"
                                                        placeholder="Add to the discussion..."
                                                        value={discussionText}
                                                        onChange={(e) => setDiscussionText(e.target.value)}
                                                    />
                                                    <button
                                                        className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
                                                        onClick={handleDiscussionSubmit}
                                                        disabled={!discussionText.trim()}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'solution' && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold mb-4">Solution</h3>
                                                <div className="bg-gray-100 dark:bg-[#252526] rounded-md p-4">
                                                    <pre className="text-sm overflow-x-auto">
                                                        <code>{currentQuestion.solution || 'Solution not available for this question.'}</code>
                                                    </pre>
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'submission' && (
                                            <div className="space-y-4">
                                                <h3 className="text-lg font-bold mb-4">Submissions</h3>
                                                {submissions.length > 0 ? (
                                                    <div className="space-y-3">
                                                        {submissions.slice().reverse().map((submission, index) => (
                                                            <div key={index} className="p-4 rounded-md border border-gray-200 dark:border-[#333333] bg-gray-50 dark:bg-[#252526]">
                                                                <div className="flex justify-between items-center mb-2">
                                                                    <span className={`font-semibold ${submission.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                                                        {submission.isCorrect ? 'Correct' : 'Incorrect'}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">
                                                                        {getRelativeTime(submission.submittedAt)}
                                                                    </span>
                                                                </div>
                                                                <pre className="bg-gray-100 dark:bg-[#1e1e1e] p-3 rounded text-sm overflow-x-auto">
                                                                    {submission.submittedCode}
                                                                </pre>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500">No submissions yet.</p>
                                                )}
                                            </div>
                                        )}

                                        {activeTab === 'ai help' && (
                                            <div className="space-y-4">
                                                <div className="relative rounded-lg p-8 text-center bg-gray-50 dark:bg-[#252526]">
                                                    <div className="absolute inset-0 backdrop-filter backdrop-blur-md bg-opacity-50"></div>
                                                    <div className="relative z-10">
                                                        <Bot size={48} className="mx-auto mb-4 text-gray-400" />
                                                        <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                                            AI Help Coming Soon
                                                        </h2>
                                                        <p className="text-gray-500 mt-2">We're working on bringing you AI-powered assistance for solving coding problems.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                            
                            <div className="flex-shrink-0 flex items-center justify-between mb-1 mt-1 pl-3 pr-3 border-t border-gray-200 dark:border-[#333333]">
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setQuestionFeedback(questionFeedback === 'like' ? null : 'like')}
                                        className={`p-2 rounded-md flex items-center space-x-2 transition-colors ${
                                            questionFeedback === 'like' 
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' 
                                            : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                        aria-label="Like this question"
                                    >
                                        <ThumbsUp size={18} />
                                    </button>
                                    <button
                                        onClick={() => setQuestionFeedback(questionFeedback === 'dislike' ? null : 'dislike')}
                                        className={`p-2 rounded-md flex items-center space-x-2 transition-colors ${
                                            questionFeedback === 'dislike' 
                                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' 
                                            : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                        aria-label="Dislike this question"
                                    >
                                        <ThumbsDown size={18} />
                                    </button>
                                    {/* MODIFICATION: Added onClick to open discussion tab */}
                                    <button 
                                      onClick={() => setActiveTab('discussion')}
                                      className='p-2 rounded-md flex items-center space-x-2 transition-colors text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'
                                      aria-label="Open discussion tab"
                                    >
                                      <MessageCircle size={18} />
                                    </button>

                                    <div className="w-[1px] h-6 bg-gray-200 dark:bg-[#333333] mx-1"></div>

                                    <div className="relative">
                                        <button
                                            onClick={() => setIsSharePopupOpen(prev => !prev)}
                                            className="p-2 rounded-md flex items-center space-x-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                                            aria-label="Share question"
                                        >
                                            <Share2 size={18} />
                                        </button>

                                        {isSharePopupOpen && (
                                            <div 
                                                ref={sharePopupRef}
                                                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 p-2 rounded-lg shadow-lg bg-white dark:bg-[#252526] border border-gray-200 dark:border-[#333333] flex items-center space-x-2 z-30"
                                            >
                                                <button onClick={() => handleShareClick('copy')} title="Copy link" className="p-2 rounded-full bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-800 dark:text-white">
                                                    <Link size={16} />
                                                </button>
                                                <button onClick={() => handleShareClick('facebook')} title="Share on Facebook" className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#1877F2] text-white font-bold text-lg hover:opacity-90">
                                                    f
                                                </button>
                                                <button onClick={() => handleShareClick('linkedin')} title="Share on LinkedIn" className="h-8 w-8 flex items-center justify-center rounded-lg bg-[#0A66C2] text-white font-bold text-base hover:opacity-90">
                                                    in
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 text-sm text-gray-900 dark:text-white font-medium">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <span>{onlineCount.toLocaleString()} Online</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-col overflow-hidden">
                    <Split
                        className="flex flex-col h-full"
                        direction="vertical"
                        sizes={
                            verticalFoldState === 'editor_folded' ? [0, 100] :
                            verticalFoldState === 'console_folded' ? [100, 0] :
                            [65, 35]
                        }
                        minSize={verticalFoldState !== 'none' ? 40 : 100}
                        gutterSize={verticalFoldState !== 'none' ? 0 : 4}
                        gutter={gutter}
                    >
                        {/* MODIFICATION: Updated editor background color */}
                        <div className="relative overflow-hidden bg-[#1e1e1e] flex-grow">
                            {/* MODIFICATION: Updated editor header background */}
                            <div className="absolute top-0 left-0 w-full h-10 bg-gray-100 dark:bg-[#333333] flex justify-between items-center px-4 z-10">
                                <span className="font-medium text-sm text-gray-800 dark:text-gray-300">MySQL Editor</span>
                                <button
                                    onClick={() => setVerticalFoldState(
                                        verticalFoldState === 'editor_folded' ? 'none' : 'editor_folded'
                                    )}
                                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                    title={verticalFoldState === 'editor_folded' ? "Expand Editor" : "Collapse Editor"}
                                >
                                    {verticalFoldState === 'editor_folded' ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                                </button>
                            </div>
                            <div className="pt-10 h-full">
                                <MonacoEditor
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
                                        automaticLayout: true,
                                    }}
                                />
                            </div>
                            {verticalFoldState !== 'editor_folded' && (
                                <div className="absolute bottom-0 right-0 z-20 flex items-center justify-end space-x-3 p-3">
                                    <button
                                        className="px-4 py-1.5 text-sm font-medium rounded-md bg-white dark:bg-gray-600 dark:hover:bg-gray-500 border border-gray-300 dark:border-gray-500 hover:bg-gray-50 flex items-center gap-2"
                                        onClick={handleRunCode}
                                        disabled={isRunning || isTesting}
                                    >
                                        {isRunning ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                                        Run Code
                                    </button>
                                    <button
                                        className="px-4 py-1.5 text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 flex items-center gap-2"
                                        onClick={handleTestCode}
                                        disabled={isRunning || isTesting}
                                    >
                                        {isTesting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                        Submit
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* MODIFICATION: Updated output panel background */}
                        <div className="flex flex-col bg-white dark:bg-[#1e1e1e] overflow-hidden h-full">
                            {/* MODIFICATION: Updated output header background */}
                            <div className="flex-shrink-0 h-10 bg-gray-100 dark:bg-[#333333] flex justify-between items-center px-4">
                                <span className="font-medium text-sm text-gray-800 dark:text-gray-300">Output</span>
                                <button
                                    onClick={() => setVerticalFoldState(
                                        verticalFoldState === 'console_folded' ? 'none' : 'console_folded'
                                    )}
                                    className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                                    title={verticalFoldState === 'console_folded' ? "Expand Console" : "Collapse Console"}
                                >
                                    {verticalFoldState === 'console_folded' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                </button>
                            </div>
                           <div className="flex-grow p-4 overflow-y-auto">
                                {!feedback && !output && <div className="text-gray-500 text-sm">Run code or submit to see results here.</div>}
                                {feedback && (
                                    <div className={`flex items-start gap-3 mb-4 p-3 rounded-md text-sm ${
                                        feedback.isCorrect
                                            ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                                            : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                                    }`}>
                                        {feedback.isCorrect ? <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" /> : <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
                                        <span>{feedback.text}</span>
                                    </div>
                                )}
                                {output && (
                                    <div>
                                        <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-300">Query Result:</h4>
                                        <div className="overflow-auto border border-gray-200 dark:border-[#333333] rounded-md">
                                        {output.error ? (
                                             <div className="p-4 text-red-500 font-mono text-sm bg-red-50 dark:bg-red-900/10">{output.message}</div>
                                        ) : Array.isArray(output) && output.length > 0 ? (
                                            <table className="w-full text-sm">
                                                <thead className="bg-gray-100 dark:bg-[#252526]">
                                                    <tr>
                                                        {Object.keys(output[0]).map((header) => (
                                                            <th key={header} className="px-4 py-2 text-left font-medium text-gray-700 dark:text-gray-300">{header}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody className='divide-y divide-gray-200 dark:divide-[#333333]'>
                                                    {output.map((row, rowIndex) => (
                                                        <tr key={rowIndex}>
                                                            {Object.values(row).map((cell, cellIndex) => (
                                                                <td key={cellIndex} className="px-4 py-2 whitespace-nowrap">{String(cell)}</td>
                                                            ))}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        ) : <p className="p-4 text-gray-500">Query executed, but returned no results.</p>
                                        }
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Split>
                </div>
            </Split>
        </main>
        
        {isSidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm transition-all"
              onClick={() => setIsSidebarOpen(false)}
            />
            <aside
              className={`fixed top-0 left-0 z-50 h-full w-80 max-w-full shadow-lg flex flex-col ${isDarkMode ? 'bg-[#1e1e1e] text-white' : 'bg-white text-black'}`}
              style={{ minWidth: 320 }}
            >
              <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-[#333333]' : 'border-gray-200'}`}>
                <h2 className="text-lg font-bold">All Questions</h2>
                <button
                  className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
                  aria-label="Close sidebar"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X size={22} />
                </button>
              </div>

              <div className={`flex items-center justify-around p-2 border-b ${isDarkMode ? 'border-[#333333]' : 'border-gray-200'}`}>
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
                  <ul>
                    {sidebarQuestions.map((q, idx) => {
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
              
              <div className={`p-2 flex items-center justify-between ${isDarkMode ? 'border-t border-[#333333]' : 'border-t border-gray-200'}`}>
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
        
        {isVideoPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-[#252526] p-4 rounded-lg shadow-lg relative w-11/12 max-w-4xl">
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

        {/* MODIFICATION: Added Premium Feature Popup */}
        {isPremiumPopupOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-[#252526] p-6 rounded-lg shadow-xl relative w-11/12 max-w-md text-center">
              <button
                onClick={() => setIsPremiumPopupOpen(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
                <KeyRound className="h-6 w-6 text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Premium Feature</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                The <span className="font-semibold text-teal-500">{premiumFeatureName}</span> feature is coming soon! Subscribe to be the first to know.
              </p>
              <button
                disabled
                className="w-full bg-teal-500 text-white font-semibold py-2.5 px-4 rounded-lg opacity-50 cursor-not-allowed"
              >
                Subscribe
              </button>
            </div>
          </div>
        )}
    </div>
  );
}