import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import queryString from 'query-string';
import img from '../assets/dslogo1.png'
import img1 from '../assets/bgimg.jpg'
import { ArrowLeft, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';


const ScenarioTestSeries = () => {
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
    const [isQuizEnabled, setIsQuizEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userProgress, setUserProgress] = useState({});
    const [shuffledOptions, setShuffledOptions] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);

    useEffect(() => {
        const parsed = queryString.parse(window.location.search);
        const userID = parsed.userID;
        const quizID = parsed.quizID;
        const subject = parsed.subject;
        const difficulty = parsed.difficulty;
        setDifficulty(difficulty);
        setSubject(subject);

        // const storedProgress = JSON.parse(localStorage.getItem('userQuizProgress')) || {};
        // setUserProgress(storedProgress);
        
        // const quizEnabled = checkQuizEnabled(difficulty, subject, storedProgress);
        // setIsQuizEnabled(quizEnabled);

    loadQuestions(subject);
    }, []);

    // const checkQuizEnabled = (difficulty, subject, progress) => {
    //     if (difficulty.toLowerCase() === 'easy') return true;
    //     if (difficulty.toLowerCase() === 'medium') return progress[`${subject}_easy`] === true;
    //     if (difficulty.toLowerCase() === 'hard') return progress[`${subject}_easy`] === true && progress[`${subject}_medium`] === true;
    //     return false;
    // };

    const currentQuestion = questions[currentQuestionIndex];

    const shuffleArray = (array) => {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    };

    const loadQuestions = async (subject, difficulty) => {
        try {
            const response = await fetch(`https://server.datasenseai.com/test-series-scenario/${subject}`);
            if (!response.ok) {
                throw new Error('Failed to fetch questions');
            }
            const data = await response.json();
            const questionsWithShuffledOptions = data.map(question => ({
                ...question,
                shuffledOptions: shuffleArray(Object.entries(question.options))
            }));
            setQuestions(questionsWithShuffledOptions);
            setShuffledOptions(questionsWithShuffledOptions[0].shuffledOptions);
            setStartTime(new Date());
            setIsLoading(false);
        } catch (error) {
            console.error('Error loading questions:', error);
            toast.error('Failed to load questions. Please try again.');
            setIsQuizEnabled(false);
            setIsLoading(false);
        }
    };

    // useEffect(() => {
    //     if (questions.length > 0 && !quizCompleted) {
    //         const timerInterval = setInterval(() => {
    //             setTimer(prevTimer => {
    //                 if (prevTimer <= 1) {
    //                     clearInterval(timerInterval);
    //                     handleTimeUp();
    //                     return 80;
    //                 }
    //                 return prevTimer - 1;
    //             });
    //         }, 1000);
    //         return () => clearInterval(timerInterval);
    //     }
    // }, [currentQuestionIndex, questions, quizCompleted]);

    // const handleTimeUp = () => {
    //     if (currentQuestionIndex < questions.length - 1) {
    //         nextQuestion();
    //     } else {
    //         submitQuiz();
    //     }
    // };

    const selectOption = (optionKey) => {
        setSelectedOption(optionKey);
    };

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setShowFeedback(true);
      };
    
      const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
          setSelectedOption(null);
          setShowFeedback(false);
        }
      };
    
      const prevQuestion = () => {
        if (currentQuestionIndex > 0) {
          setCurrentQuestionIndex(currentQuestionIndex - 1);
          setSelectedOption(null);
          setShowFeedback(false);
        }
      };

    // const updateUserProgress = (subject, difficulty) => {
    //     const progressKey = `${subject}_${difficulty.toLowerCase()}`;
    //     const currentProgress = JSON.parse(localStorage.getItem('userQuizProgress')) || {};
    //     const newProgress = { ...currentProgress, [progressKey]: true };
    //     localStorage.setItem('userQuizProgress', JSON.stringify(newProgress));
    //     console.log('User progress updated');
    // };

    const submitQuiz = () => {
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = selectedOption || null;
        setUserAnswers(newAnswers);
        const calculatedScore = newAnswers.reduce((total, userAnswer, index) => {
            return userAnswer && questions[index].options[userAnswer] === questions[index].correct_answer ? total + 1 : total;
        }, 0);

        setScore(calculatedScore);
        setQuizCompleted(true);

        const percentage = ((calculatedScore / questions.length) * 100).toFixed(2);
        if (percentage >= 70) {
            updateUserProgress(subject, difficulty);
        }
    };

    const resetQuiz = () => {
        window.location.href = `/`;
    };

    if (isLoading) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <h5 className="mt-4 text-2xl font-thin text-gray-700">Loading...</h5>
            </div>
        );
    }

    // if (!isQuizEnabled && difficulty.toLowerCase() !== 'easy') {
    //     return (
    //         <div className="min-h-screen flex items-center justify-center p-4">
    //             <div className="bg-white p-8 rounded-lg shadow-md">
    //                 <h1 className="text-2xl font-bold mb-4">Quiz Not Available</h1>
    //                 <p>You need to score at least 70% in the previous difficulty level to attempt this quiz.</p>
    //                 <button
    //                     className="mt-4 bg-oxford-blue text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
    //                     onClick={resetQuiz}
    //                 >
    //                     Go Back to Quiz Area
    //                 </button>
    //             </div>
    //         </div>
    //     );
    // }

    if (quizCompleted) {
        return (
            <div className="min-h-screen bg-gray-100 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                        <div className="bg-oxford-blue px-3 sm:px-6 py-3 sm:py-4">
                            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white text-center">Quiz Completed</h1>
                        </div>
                        <div className="p-3 sm:p-6">
                            <div className="mb-4 sm:mb-6 text-center">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800">
                                    Your Score:
                                </h2>
                                <h4 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-600 mt-2">
                                    {score} / {questions.length}
                                </h4>
                                <h5 className="text-base sm:text-lg md:text-xl text-gray-600 mt-2">
                                    {((score / questions.length) * 100).toFixed(2)}% Correct
                                </h5>
                            </div>
                            <div className="space-y-4 sm:space-y-6">
                                {questions.map((question, index) => {
                                    const userAnswer = userAnswers[index];
                                    const isCorrect = userAnswer && question.options[userAnswer] === question.correct_answer;
                                    
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
                                className="mt-6 sm:mt-8 w-full bg-oxford-blue text-white py-2 sm:py-3 px-4 rounded-md hover:bg-blue-700 transition duration-300 flex items-center justify-center text-sm sm:text-base"
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
    }


    
    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-oxford-blue p-6 text-white">
              <h1 className="text-xl font-semibold mb-2">
                Question {currentQuestionIndex + 1} of {questions.length}
              </h1>
              <h4 className="text-sm">{currentQuestion.scenario}</h4>
            </div>
            <div className="p-6">
              <h2 className="text-lg font-medium text-gray-800 mb-4">
                {currentQuestion.question_text}
              </h2>
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded cursor-pointer transition-colors duration-300 ${
                      selectedOption === option
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option}
                  </div>
                ))}
              </div>
              {showFeedback && (
                <div className="mt-4 p-3 rounded bg-gray-50">
                  {selectedOption === currentQuestion.correct_answer ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="mr-2" size={18} />
                      <span>Correct!</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center text-red-600 mb-2">
                        <XCircle className="mr-2" size={18} />
                        <span>Incorrect. You selected: {selectedOption}</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="mr-2" size={18} />
                        <span>Correct answer: {currentQuestion.correct_answer}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
              <button
                className="flex items-center text-gray-600 hover:text-gray-800"
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="mr-1" size={18} />
                Back
              </button>
              
              {currentQuestionIndex === questions.length - 1 ? (
                            <button
                                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300"
                                onClick={submitQuiz}
                            >
                                Submit
                            </button>
                        ) : (
                          <button
                className="flex items-center text-gray-600 hover:text-gray-800"
                onClick={nextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
                <ArrowRight className="ml-1" size={18} />
              </button>
                        )}
              
            </div>
          </div>
        </div>
      );
    };

export default ScenarioTestSeries;