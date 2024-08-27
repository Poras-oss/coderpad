import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { useAuth0 } from '@auth0/auth0-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import queryString from 'query-string';
import img from '../assets/dslogo1.png'
import img1 from '../assets/bgimg.jpg'




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



         // Show attempt popup
         showQuizAttemptedPopup();
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
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Quiz Completed</h1>
                        <p className="text-2xl mb-6 text-gray-700">
                            Your Score: <span className="font-semibold">{score}</span> / {questions.length}
                        </p>
                        <div className="mb-6 space-y-4">
                          
                            {questions.map((question, index) => (
                                <div key={index} className="border-b pb-4">
                                    <h2 className="text-lg font-medium mb-2 text-gray-800">{question.question}</h2>
                                    <p
                                        className={`p-2 rounded ${
                                            userAnswers[index] &&
                                            questions[index].options[userAnswers[index]] === questions[index].answer
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        Your answer: {questions[index].options[userAnswers[index]] || 'Not answered'}
                                    </p>
                                    <p className="p-2 rounded bg-blue-100 text-blue-800 mt-2">
                                        Correct answer: {questions[index].answer}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <button
                            className="bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600 transition duration-300"
                            onClick={resetQuiz}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            );
        }
    
        return (
          <div
                className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundImage: `url(${img1})`, backgroundPosition: 'center', }}
          >
               <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                    <div className="flex justify-between items-center mb-6">
                    <img src={img} alt="Data Sense Logo" className="h-20" />
                        <span className="text-sm text-gray-500">
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </span>
                        <span className="text-sm font-semibold text-[#4B5563]
                        ">Time Remaining  {timer}s</span>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg mb-6">
                        <h1 className=" text-2xl font-semibold text-white">{questions[currentQuestionIndex].question_text}</h1>
                    </div>
                    <div className="space-y-4 mb-8">
                        {Object.entries(questions[currentQuestionIndex].options).map(([key, value]) => (
                            <div
                                key={key}
                                className={`p-3 rounded cursor-pointer transition-colors duration-300
                                    ${selectedOption === key
                                        ? 'bg-cyan-500 text-white'
                                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                onClick={() => selectOption(key)}
                            >
                                {value}
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-end">
                        
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