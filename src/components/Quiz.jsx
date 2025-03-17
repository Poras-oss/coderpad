import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import queryString from 'query-string';
import img from '../assets/dslogo1.png'
import img1 from '../assets/bgimg.jpg'
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';



const Quiz = () => {
    const parsed = queryString.parse(window.location.search);
    const userID = parsed.userID;
    const quizID = parsed.quizID;
    const { user } = useUser();
   

    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [userAnswers, setUserAnswers] = useState([]);
    const [score, setScore] = useState(0);
    const [timer, setTimer] = useState(80);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [startTime, setStartTime] = useState(null);
    const [totalScore, setTotalScore] = useState(0);   

    useEffect(() => {
        const parsed = queryString.parse(window.location.search);
        const userID = parsed.userID;
        const quizID = parsed.quizID;
        


        if (!userID || !quizID) {
            alert('User ID or Quiz ID is missing in the URL');
            return;
        }

        // //Check if quiz has already been completed for this quizID
        // const quizCompletionStatus = localStorage.getItem(`quizCompleted_${quizID}`);
        // if (quizCompletionStatus) {
        //     alert('You already attempted this quiz');
        //     window.location.href = '/live-events';
        //     return;
        // }

        const loadQuestions = async () => {
            const response = await fetch('https://server.datasenseai.com/quizadmin/python-mcq-questions/' + quizID + `?clerkId=${user.id}`);
            const data = await response.json();
            setQuestions(data);
            setTotalScore(data.length);
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
        setTimer(120);
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

    const submitQuiz = async () => {
        
        const newAnswers = [...userAnswers];
        newAnswers[currentQuestionIndex] = selectedOption || null;
        setUserAnswers(newAnswers);

        const calculatedScore = newAnswers.reduce((total, userAnswer, index) => {
            return userAnswer && questions[index].options[userAnswer] === questions[index].answer ? total + 1 : total;
        }, 0);

        setScore(calculatedScore);
        setQuizCompleted(true);


        
    // Calculate quiz duration in seconds
        const endTime = new Date();
        const durationInSeconds = Math.round((endTime - startTime) / 1000);

       

        // Prepare data for the API call
        const userInfo = {
            clerkId: user?.id,
            quizID: quizID,
            userID: `${user?.primaryEmailAddress?.emailAddress || 'N/A'}, ${user?.firstName || 'N/A'}, ${user?.phoneNumbers?.[0]?.phoneNumber || 'N/A'}`,
            score: calculatedScore,
            totalScore: totalScore,
            duration: durationInSeconds
        };

          //Check if quiz has already been completed for this quizID
          const quizCompletionStatus = localStorage.getItem(`quizCompleted_${quizID}`);
          if (quizCompletionStatus) {
              alert('You already attempted this quiz');
              window.location.href = '/live-events';
              return;
          }else{

            try {
                const response = await fetch('https://server.datasenseai.com/quizadmin/update-scores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(userInfo),
                });
    
                if (response.ok) {
                    console.log('Score updated successfully!');
                } else {
                    console.error('Failed to update score:', response.statusText);
                }
            } catch (error) {
                console.error('Error updating score:', error.message);
            }
            

          }
  


         // Save quiz completion status for this quizID
         localStorage.setItem(`quizCompleted_${quizID}`, true);

         // Show attempt popup
         showQuizAttemptedPopup();
    };

  



    const resetQuiz = () => {
        // setCurrentQuestionIndex(0);
        // setSelectedOption(null);
        // setUserAnswers([]);
        // setScore(0);
        // setTimer(30);
        // setQuizCompleted(false);

        window.location.href ='/live-events';
        return;
    };

    if (questions.length === 0) {
        return (
            <div className="w-full h-screen flex flex-col items-center justify-center">
                <Loader2 className="w-16 h-16 text-blue-500 animate-spin" />
                <h5 className="mt-4 text-2xl font-thin text-gray-700">Loading...</h5>
            </div>
        );
    }

    if (quizCompleted) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
                        <h1 className="text-3xl font-semibold mb-6 text-gray-800">Quiz Completed</h1>
                        <h3 className="text-2xl mb-6 text-gray-700">
                            Your Score: <span className="font-semibold">{score}</span> / {questions.length}
                        </h3>
                        <div className="mb-6 space-y-4">
                          
                            {questions.map((question, index) => (
                                <div key={index} className="border-b pb-4">
                                    <h2 className="text-lg font-medium mb-2 text-gray-800">{question.question}</h2>
                                    <h5
                                        className={`p-2 rounded ${
                                            userAnswers[index] &&
                                            questions[index].options[userAnswers[index]] === questions[index].answer
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        Your answer: {questions[index].options[userAnswers[index]] || 'Not answered'}
                                    </h5>
                                    <h5 className="p-2 rounded bg-blue-100 text-blue-800 mt-2">
                                        Correct answer: {questions[index].answer}
                                    </h5>
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
                       
                        <span className="text-sm font-semibold text-[#4B5563]
                        ">Time Remaining  {timer}s</span>
                    </div>
                    <div className="bg-gray-800 p-6 rounded-lg mb-6">
                        <h1 className=" text-2xl font-semibold text-white">{questions[currentQuestionIndex].question}</h1>
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
                    <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </span>

                    <div className="flex space-x-2">
                        {/* <button
                            className="bg-cyan-500 text-white px-4 py-2 rounded hover:bg-cyan-600 transition duration-300"
                            onClick={prevQuestion}
                            disabled={currentQuestionIndex === 0}
                        >
                            Back
                        </button> */}

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
                </div>
                <ToastContainer />
            </div>
        );
    };
    
export default Quiz;