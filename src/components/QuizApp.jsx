import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MonacoEditor from './ResizableMonacoEditor' 
import queryString from 'query-string';
import {useAuth0} from '@auth0/auth0-react'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import Split from 'react-split';
import { Loader2, Video, X } from 'lucide-react';
import ReactPlayer from 'react-player';

export default function QuizApp()  {
  const { user, isLoaded } = useUser();

  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userQuery, setUserQuery] = useState('');
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



  useEffect(() => {
    if (activeTab === 'discussion') {
      // Fetch discussions for the question
      fetchDiscussions();
    }
  }, [activeTab, questionID]);
 

  useEffect(() => {
    const fetchSubmissions = async () => {
      // if (!isLoaded || !user) return; // Ensure the user data is loaded
      if (activeTab === 'submission') {
        try {
          const response = await axios.get(
            `https://server.datasenseai.com/submission-history/get-submissions/${questionID}`,
            { params: { clerkId: 'user_2moFbI77buL8zq6lnCBQBGXGLlK'} } // Use user.id as clerkId
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
          response = await axios.get(`https://server.datasenseai.com/sql-quiz/${quizID}/${userID}`);
        } else if (questionID) {
          response = await axios.get(`https://server.datasenseai.com/test-series-coding/mysql/${questionID}`);
        }

        if (response) {
          setQuizData(response.data);
        }

      } catch (error) {
        console.error('Error fetching quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);


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



  const handleTestCode = async () => {
    setIsTesting(true);
    try {
      const response = await axios.get(`https://server.datasenseai.com/execute-sql/query?q=${encodeURIComponent(userQuery)}`);
      const userAnswer = response.data;
  
      const expectedOutput = quizData.questions[currentQuestionIndex].expected_output;
      const isCorrect = compareResults(userAnswer, expectedOutput);

      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: isCorrect ? 1 : 0
      }));
  
      if (isCorrect) {
        setFeedback({ text: 'Correct!', isCorrect: true });
      } else {
        setFeedback({
          text: 'Incorrect. Please try again.',
          isCorrect: false,
          expected: expectedOutput,
          userAnswer: userAnswer
        });
      }
  
      setOutput(userAnswer);

      await axios.post('https://server.datasenseai.com/submission-history/save-submission', {
        clerkId: 'user_2moFbI77buL8zq6lnCBQBGXGLlK',  // Assuming `userClerkId` is available in the component
        questionId: questionID,
        isCorrect,
        submittedCode: userQuery // Code the user submitted
      });

      setSubmissions(prevSubmissions => [
        ...prevSubmissions,
        {
          questionId: questionID,
          isCorrect,
          submittedCode: userQuery,
          submittedAt: new Date(),
        },
      ]);





    } catch (error) {
      setFeedback({ text: 'Error testing code', isCorrect: false });
      setOutput('Error executing query');
    } finally {
      setIsTesting(false);
    }

 

  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      const response = await axios.get(`https://server.datasenseai.com/execute-sql/query?q=${encodeURIComponent(userQuery)}`);
      const userAnswer = response.data;
  
      const expectedOutput = quizData.questions[currentQuestionIndex].expected_output;
      const isCorrect = compareResults(userAnswer, expectedOutput);
  
      setScores(prevScores => ({
        ...prevScores,
        [currentQuestionIndex]: isCorrect ? 1 : 0
      }));

      if (isCorrect) {
        // setFeedback({ text: 'Correct!', isCorrect: true, userAnswer: userAnswer });
      } else {
        setFeedback({
          isCorrect: false,
          expected: expectedOutput.map(row => Object.values(row).join(', ')).join(' | '),
          userAnswer: Array.isArray(userAnswer) 
            ? userAnswer.map(row => Object.values(row).join(', ')).join(' | ')
            : 'No data returned'
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
    if (userResults.length !== expectedOutput.length) {
      return false;
    }
  
    const expectedString = JSON.stringify(expectedOutput.map(row => Object.values(row)));
    const userResultString = JSON.stringify(userResults.map(row => Object.values(row)));

    return userResultString === expectedString;
  };
  
  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setFeedback('');  
    setShowFeedback(false);
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
          username: 'sample_username', // Replace with actual user info from Clerk
          discussionText
        });
         // If "No discussions found" placeholder is currently displayed, remove it
      

         
           // Add the new comment to the comments array with default fields
           const newComment = {
             discussionText,
             username: 'CurrentUsername', // Replace with the actual username
             createdAt: new Date().toISOString(), // Use the current date and time
           };
     
           setComments((prevComments) => [...prevComments, newComment]);
           setDiscussionText(''); // Clear the input field
         
      } catch (error) {
        console.error(error);
        setError('Failed to add comment');
      }
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

          {/* Tabs */}
          <div className={`flex ${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} px-4`}>
            {['Question', 'Tables' ,'Discussion', 'Solution', 'Submission', 'AI Help'].map((tab) => <button
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
                  <div 
                    className="question-text"
                    dangerouslySetInnerHTML={{ __html: currentQuestion.question_text.replace(/\n/g, '<br>') }}
                  />
                  </div>
              </>
            )}

{activeTab === 'tables' && (
              <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
                <h3 className="text-lg font-bold mb-2">Tables</h3>
                {currentQuestion.table_data && currentQuestion.table_data.map((table, tableIndex) => (
                  <div key={tableIndex} className="mb-4">
                    <h4 className="text-md font-semibold mb-2">{table.table_name}</h4>
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
                          {table.rows.slice(0,10).map((row, rowIndex) => (
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
                       <h3 className="text-lg font-bold mb-2">Expected Answer</h3>
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
                      {currentQuestion.expected_output.slice(0,10).map((row, rowIndex) => (
                        <tr key={rowIndex} >
                          {row.map((value, cellIndex) => (
                            <td key={cellIndex} className="px-6 py-4 whitespace-nowrap text-sm">{value}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                    </div>
                  </div>
                ))}
              </div>
              
            )}
           
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
        {comments.map((comment, index) => (
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
      className="mt-2 bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:bg-teal-300"
      onClick={handleDiscussionSubmit}
      disabled={!discussionText.trim()}
    >
      Send
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
              <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-lg p-4 mb-4 shadow-md`}>
                <h3 className="text-lg font-bold mb-4">AI Help</h3>
                <p>AI: To solve this SQL problem, consider the following steps:</p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Identify the tables you need to query from.</li>
                  <li>Determine which columns you need to select.</li>
                  <li>If you need data from multiple tables, use appropriate JOINs.</li>
                  <li>Apply filtering conditions using the WHERE clause.</li>
                  <li>If you need to group data, use GROUP BY and potentially HAVING for group-level filtering.</li>
                  <li>Order your results using ORDER BY if necessary.</li>
                  <li>Use LIMIT if you need to restrict the number of rows returned.</li>
                </ol>
              </div>
            )}
          </div>
        </div>
        {/* Right side: Code Editor and Results */}
        <div className={`${isDarkMode ? 'bg-[#403f3f]' : 'bg-gray-200'} px-4 flex flex-col`}>
          <div className={`${isDarkMode ? 'bg-[#262626]' : 'bg-white'} rounded-t-lg p-2`}>
            <span className="font-semibold">SQL</span>
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
              value={userQuery}
              onChange={setUserQuery}
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
                {quizID && timeRemaining > 0 && (
                  <button 
                    onClick={handleSubmitQuiz}
                    className="px-3 py-1 rounded text-white bg-teal-500 hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
                  >
                    Submit Quiz
                  </button>
                )}
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
                    <div className='font-semibold'>OUTPUT</div>
                    <div className="overflow-x-auto">
                      {Array.isArray(output) && output.length > 0 ? (
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