import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { useAuth0 } from '@auth0/auth0-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import queryString from 'query-string';
import img from '../assets/dslogo1.png'
import img1 from '../assets/bgimg.jpg'

import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';


const McqTestSeries = () => {
    const { loginWithPopup, loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();

   

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(80);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [difficulty, setDifficulty] = useState(null);
    const [subject, setSubject] = useState(null);

    useEffect(() => {
        const parsed = queryString.parse(window.location.search);
        const userID = parsed.userID;
        const quizID = parsed.quizID;
        const subject = parsed.subject;
        const difficulty = parsed.difficulty;
        setDifficulty(difficulty);
        setSubject(subject);
        


        const loadQuestions = async () => {
            const response = await fetch('https://server.datasenseai.com/test-series-mcq/' + subject +'/'+difficulty);
            const data = await response.json();
            setQuestions(data);
            setStartTime(new Date()); 
        };
        loadQuestions();
    }, []);

    useEffect(() => {
        if (questions.length > 0 && !quizCompleted) {
            const timerInterval = setInterval(() => {
                setTimer(prevTimer => {
                    if (prevTimer <= 1) {
                        clearInterval(timerInterval);
                        handleTimeUp();
                        return 80;
                    }
                    return prevTimer - 1;
                });
            }, 1000);
            return () => clearInterval(timerInterval);
        }
    }, [currentQuestionIndex, questions, quizCompleted]);

    const handleTimeUp = () => {
        if (currentQuestionIndex < questions.length - 1) {
            nextQuestion();
        } else {
            submitQuiz();
        }
    };

    const loadQuestion = () => {
        setSelectedOption(null);
        setTimer(80);
    };

    useEffect(() => {
        if (questions.length > 0) {
            loadQuestion();
        }
    }, [currentQuestionIndex, questions]);

    const selectOption = (optionKey) => {
        setSelectedOption(optionKey);
    };

    const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
            setSelectedOption(userAnswers[currentQuestionIndex - 1] || null);
        }
    };

    const nextQuestion = () => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = selectedOption || null;
        setUserAnswers(newAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(userAnswers[currentQuestionIndex + 1] || null);
        }
    };

    const updateUserProgress = (subject, difficulty) => {
        const progressKey = `${subject}_${difficulty.toLowerCase()}`;
        const userProgress = JSON.parse(localStorage.getItem('userQuizProgress')) || {};
        const newProgress = { ...userProgress, [progressKey]: true };
        localStorage.setItem('userQuizProgress', JSON.stringify(newProgress));
    };

    const submitQuiz = async () => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = selectedOption || null;
        setUserAnswers(newAnswers);
        updateUserProgress(subject, difficulty);
        const calculatedScore = newAnswers.reduce((total, userAnswer, index) => {
            return userAnswer && questions[index].options[userAnswer] === questions[index].answer ? total + 1 : total;
        }, 0);

      

        setScore(calculatedScore);
        setQuizCompleted(true);

    };



    const resetQuiz = () => {
        // A complete flag will sent back to home with subject and difficulty level
        window.location.href ='/quiz-area?subject=' + subject + '&difficulty=' + difficulty;
        return;
    };

    if (questions.length === 0) {
        return <div className='animate-ping w-full h-screen flex items-center justify-center text-7xl font-thin'>STARTING....</div>;
    }

    if (quizCompleted) {
        return (
            <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                  <div className="bg-blue-600 px-3 sm:px-6 py-3 sm:py-4">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center">Quiz Completed</h1>
                  </div>
                  <div className="p-3 sm:p-6">
                    <div className="mb-4 sm:mb-6 text-center">
                      <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
                        Your Score:
                      </p>
                      <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mt-2">
                        {score} / {questions.length}
                      </p>
                      <p className="text-base sm:text-lg md:text-xl text-gray-600 mt-2">
                        {((score / questions.length) * 100).toFixed(2)}% Correct
                      </p>
                    </div>
                    <div className="space-y-4 sm:space-y-6">
                      {questions.map((question, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer && question.options[userAnswer] === question.answer;
                        
                        return (
                          <div key={index} className="border-b border-gray-200 pb-3 sm:pb-4">
                            <h2 className="text-sm sm:text-base md:text-lg font-medium text-gray-800 mb-2">
                              Question {index + 1}: {question.question_text}
                            </h2>
                            <div className="pl-2 sm:pl-4 border-l-2 sm:border-l-4 border-gray-300">
                              <div className="flex items-start text-sm sm:text-base mb-1">
                                {isCorrect ? (
                                  <CheckCircle className="text-green-500 mr-2 flex-shrink-0 mt-1" size={18} />
                                ) : (
                                  <XCircle className="text-red-500 mr-2 flex-shrink-0 mt-1" size={18} />
                                )}
                                <span className={`${isCorrect ? "text-green-700" : "text-red-700"} break-words`}>
                                  Your answer: {question.options[userAnswer] || "Not answered"}
                                </span>
                              </div>
                              {!isCorrect && (
                                <div className="flex items-start text-sm sm:text-base mt-1">
                                  <CheckCircle className="text-blue-500 mr-2 flex-shrink-0 mt-1" size={18} />
                                  <span className="text-blue-700 break-words">Correct answer: {question.correct_answer}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      className="mt-6 sm:mt-8 w-full bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center text-sm sm:text-base"
                      onClick={resetQuiz}
                    >
                      <ArrowLeft className="mr-2" size={18} />
                      Go Back to Quiz Area
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
          
          
        };
    
        return (
            <div
              className="min-h-screen flex items-center justify-center p-4"
              style={{ backgroundImage: `url(${img1})`, backgroundPosition: 'center' }}
            >
              <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl relative flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <img src={img} alt="Data Sense Logo" className="h-20" />
                    <span className="text-sm font-semibold text-[#4B5563]">{timer}s</span>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h1 className="text-2xl font-semibold text-white">
                      {questions[currentQuestionIndex].question_text}
                    </h1>
                  </div>
                  <div className="space-y-4 mb-8">
                    {Object.entries(questions[currentQuestionIndex].options).map(([key, value]) => (
                      <div
                        key={key}
                        className={`p-3 rounded cursor-pointer transition-colors duration-300 ${
                          selectedOption === key
                            ? 'bg-cyan-500 text-white'
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        onClick={() => selectOption(key)}
                      >
                        {value}
                      </div>
                    ))}
                  </div>
                </div>
          
                {/* Flex container for bottom elements */}
                <div className="flex justify-between items-center">
                  {/* Position the question text at the bottom left */}
                  <span className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
          
                  {currentQuestionIndex === questions.length - 1 ? (
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                      onClick={submitQuiz}
                    >
                      Submit
                    </button>
                  ) : (
                    <button
                      className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition duration-300"
                      onClick={nextQuestion}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
              <ToastContainer />
            </div>
          );
    };
    
export default McqTestSeries;