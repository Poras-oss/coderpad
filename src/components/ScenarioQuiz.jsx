import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Moon, Sun, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

const ScenarioQuiz = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const difficulty = searchParams.get('difficulty');
  const subtopic = searchParams.get('subtopic');
  const subject = searchParams.get('subject');

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch(
        `https://server.datasenseai.com/test-series-scenario/${subject}`
        // `https://server.datasenseai.com/test-series-scenario/${subject}?difficulty=${difficulty}&subtopic=${subtopic}`
      );
      const data = await response.json();
      setQuestions(data);
      console.log(data)


    };

    fetchQuestions();
  }, [searchParams, subject, difficulty, subtopic]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer) => {
    setSelectedAnswers(prev => ({...prev, [currentIndex]: answer}));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmit = () => {
    const calculatedScore = questions.reduce((acc, question, index) => {
      return selectedAnswers[index] === question.correct_answer ? acc + 1 : acc;
    }, 0);
    setScore(calculatedScore);
    setIsQuizCompleted(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsQuizCompleted(false);
    setTimeLeft(totalTime);
  };

  if (!currentQuestion && !isQuizCompleted) return null;

  return (
    <div className="min-h-screen">
      <div className={`min-h-screen ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800' 
          : 'bg-gradient-to-br from-cyan-100 via-white to-cyan-200'
      }`}>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigate(-1)}
              className={`flex items-center hover:text-gray-900 ${
                isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600'
              }`}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-200 text-gray-800'
              }`}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
          
          <div className={`rounded-lg shadow-lg overflow-hidden ${
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            {!isQuizCompleted ? (
              <>
                <div className={`p-6 border-b ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <h2 className={`text-xl font-bold ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Question {currentIndex + 1}/{questions.length}
                  </h2>
                </div>
                <div className="flex flex-col md:flex-row">
                  {/* Left Pane - Question */}
                  <div className={`w-full md:w-1/2 p-6 border-b md:border-b-0 md:border-r ${
                    isDarkMode 
                      ? 'border-gray-700 bg-gray-800' 
                      : 'border-gray-200 bg-white'
                  }`}>
                    {currentQuestion.scenario && (
                      <div className={`border p-4 rounded-lg mb-4 shadow-inner ${
                        isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                      }`}>
                        <h5 className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>
                          {currentQuestion.scenario}
                        </h5>
                      </div>
                    )}
                    
                    <div className="prose max-w-none">
                      <h4 className={`text-lg ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        {currentQuestion.question_text}
                      </h4>
                    </div>

                    {currentQuestion.image && (
                      <div className="mt-4">
                        <img 
                          src={currentQuestion.image} 
                          alt="Question illustration"
                          className="max-w-full rounded-lg shadow-md"
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Pane - Options */}
                  <div className={`w-full md:w-1/2 p-6 ${
                    isDarkMode ? 'bg-gray-800' : 'bg-white'
                  }`}>
                    <div className="space-y-4">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          onClick={() => handleAnswer(option)}
                          className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            selectedAnswers[currentIndex] === option
                              ? isDarkMode 
                                ? 'border-cyan-400 bg-cyan-900'
                                : 'border-cyan-600 bg-cyan-50'
                              : isDarkMode
                                ? 'border-gray-600 hover:border-gray-500'
                                : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${
                              selectedAnswers[currentIndex] === option
                                ? isDarkMode
                                  ? 'border-cyan-400 bg-cyan-400'
                                  : 'border-cyan-600 bg-cyan-600'
                                : isDarkMode
                                  ? 'border-gray-500'
                                  : 'border-gray-300'
                            }`}>
                              {selectedAnswers[currentIndex] === option && (
                                <div className="w-2 h-2 rounded-full bg-white" />
                              )}
                            </div>
                            <span className={isDarkMode ? 'text-gray-200' : 'text-gray-700'}>
                              {option}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-8 flex justify-between">
                      <button
                        onClick={handlePrevious}
                        disabled={currentIndex === 0}
                        className={`flex items-center px-4 py-2 disabled:opacity-50 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Previous
                      </button>

                      <button
                        onClick={handleNext}
                        className={`flex items-center px-4 py-2 text-white rounded ${
                          isDarkMode 
                            ? 'bg-cyan-700 hover:bg-cyan-600' 
                            : 'bg-cyan-600 hover:bg-cyan-700'
                        }`}
                      >
                        {currentIndex === questions.length - 1 ? 'Submit' : 'Next'}
                        {currentIndex !== questions.length - 1 && (
                          <ArrowRight className="w-4 h-4 ml-2" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6">
                <h2 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Quiz Summary
                </h2>
                <h5 className={`text-lg mb-6 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Your Score: {score} out of {questions.length} ({((score / questions.length) * 100).toFixed(2)}%)
                </h5>
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div key={index} className={`border-b pb-4 ${
                      isDarkMode ? 'border-gray-700' : 'border-gray-200'
                    }`}>
                      <h3 className={`text-lg font-semibold mb-2 ${
                        isDarkMode ? 'text-gray-200' : 'text-gray-800'
                      }`}>
                        Question {index + 1}:
                      </h3>
                      <h5 className={`mb-2 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {question.question_text}
                      </h5>
                      <div className="flex items-center mb-1">
                        <span className={`font-medium mr-2 ${
                          isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          Your answer:
                        </span>
                        {selectedAnswers[index] === question.correct_answer ? (
                          <CheckCircle className="w-5 h-5 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500 mr-1" />
                        )}
                        <span className={selectedAnswers[index] === question.correct_answer 
                          ? isDarkMode ? 'text-green-400' : 'text-green-600'
                          : isDarkMode ? 'text-red-400' : 'text-red-600'
                        }>
                          {selectedAnswers[index]}
                        </span>
                      </div>
                      {selectedAnswers[index] !== question.correct_answer && (
                        <div className="flex items-center">
                          <span className={`font-medium mr-2 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            Correct answer:
                          </span>
                          <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>
                            {question.correct_answer}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => navigate(-1)}
                    className={`flex items-center px-4 py-2 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:text-white' 
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Menu
                  </button>
                  <button
                    onClick={restartQuiz}
                    className={`flex items-center px-4 py-2 text-white rounded ${
                      isDarkMode 
                        ? 'bg-cyan-700 hover:bg-cyan-600' 
                        : 'bg-cyan-600 hover:bg-cyan-700'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Restart Quiz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioQuiz;