import React, { useState, useEffect } from "react";
import axios from "axios";
import queryString from "query-string";
import { useNavigate } from "react-router-dom";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import logo from "../assets/logo.png";
import { Loader2, Moon, Sun } from "lucide-react";
import { Button } from "./ui/button";
import QuizInstructionsDialog from "./QuizInstructionsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogCancel,
} from "./ui/alert-dialog";
import Navbar from "./Navbar"; // Add this import

const skills = ["Excel", "SQL", "Python", "PowerBI", "Tableau"];

import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaFileAlt,
  FaVideo,
} from "react-icons/fa";

const DataSkillsDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigateTo = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const parsed = queryString.parse(window.location.search);
  const userID = parsed.userID;
  const [isLoading, setIsLoading] = useState(true);
  const [quizType, setQuizType] = useState("");

  const [showInstructions, setShowInstructions] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const removeQuizTypePrefix = (quizName) => {
    return quizName.replace(/^(sql:|python:|mcq:)\s*/i, "");
  };

  const getQuizType = (quizName) => {
    const lowerCaseQuizName = quizName.toLowerCase();
    if (lowerCaseQuizName.startsWith("sql:")) return "SQL";
    if (lowerCaseQuizName.startsWith("python:")) return "Python";
    if (lowerCaseQuizName.startsWith("mcq:")) return "MCQ";
    return "Unknown";
  };

  const fetchQuizzes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        "https://server.datasenseai.com/quiz/quizzes"
      );
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  <QuizInstructionsDialog
    isOpen={showInstructions}
    onClose={() => setShowInstructions(false)}
    onProceed={() => {
      setShowInstructions(false);
      pendingNavigation && pendingNavigation();
    }}
    quizType={quizType}
  />;

  const handleStartQuiz = (quizID, userID, quizName) => {
    if (!isSignedIn) {
      alert("You need to log in to start the quiz.");
      return;
    }

    const lowerCaseQuizName = quizName.toLowerCase();
    let quizType;
    let navigationPath;

    if (lowerCaseQuizName.includes("sql:")) {
      quizType = "sql";
      navigationPath = `/quiz?quizID=${quizID}&userID=${userID}`;
    } else if (lowerCaseQuizName.includes("python:")) {
      quizType = "python";
      navigationPath = `/pyQuiz?quizID=${quizID}&userID=${userID}`;
    } else if (lowerCaseQuizName.includes("mcq:")) {
      quizType = "mcq";
      navigationPath = `/mcqQuiz?quizID=${quizID}&userID=${userID}`;
    } else {
      alert("Unknown quiz type.");
      return;
    }
    setQuizType(quizType);
    // navigateTo(navigationPath);
    setShowInstructions(true);
    setPendingNavigation(() => () => navigateTo(navigationPath));
  };
  // Function to handle Text Solution
  const handleTextSolution = (quizId) => {
    const quiz = filteredQuizzes.find((q) => q._id === quizId);

    if (quiz?.textSolution) {
      window.open(quiz.textSolution, "_blank");
    } else {
      alert("Text Solution not available.");
    }
  };

  // Function to handle Video Solution
  const handleVideoSolution = (quizId) => {
    const quiz = filteredQuizzes.find((q) => q._id === quizId);

    if (quiz?.videoSolution) {
      window.open(quiz.videoSolution, "_blank");
    } else {
      alert("Video Solution not available.");
    }
  };

  const handleQuizResults = (quizID, userID, quizName) => {
    if (!isSignedIn) {
      alert("You need to log in to get the results.");
      return;
    }
    navigateTo(
      `/leaderboard?quizID=${quizID}&userID=${userID}&quizName=${quizName}`
    );
  };

  function backToHome() {
    window.top.location.href = "https://practice.datasenseai.com";
  }

  const filteredQuizzes = selectedSkill
    ? quizzes.filter((quiz) =>
        quiz.quizName.toLowerCase().includes(selectedSkill.toLowerCase())
      )
    : quizzes;

  return (
    <div
      className={`font-sans min-h-screen ${
        isDarkMode ? "bg-[#262626] text-white" : "bg-gray-100 text-black"
      }`}
    >
      <AlertDialog open={showInstructions} onOpenChange={setShowInstructions}>
        <AlertDialogContent className="max-w-md bg-white dark:bg-gray-800 shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-white">
              Quiz Instructions
            </AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-4 text-gray-700 dark:text-gray-300">
              {quizType === "sql" &&
                "This SQL quiz will test your knowledge of database queries. Make sure to:" +
                  "\n\n• Write standard SQL syntax" +
                  "\n• Test your queries before submitting" +
                  "\n• Pay attention to the required output format"}
              {quizType === "python" &&
                "This Python programming quiz will test your coding skills. Remember to:" +
                  "\n\n• Follow Python PEP 8 style guidelines" +
                  "\n• Handle edge cases" +
                  "\n• Use appropriate data structures"}
              {quizType === "mcq" &&
                "This multiple choice quiz will test your knowledge. Please note:" +
                  "\n\n• Read all options carefully" +
                  "\n• Only one answer is correct" +
                  "\n• You cannot change your answer after submission"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="space-x-2">
            <AlertDialogCancel className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowInstructions(false);
                pendingNavigation && pendingNavigation();
              }}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              Start Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Navbar 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode}
        isLoaded={isLoaded}
        isSignedIn={isSignedIn}
        user={user}
        backToHome={backToHome}
      />

      <main className="container mx-auto p-4">
        <div className="flex flex-wrap justify-center gap-2 my-6">
          {skills.map((skill) => (
            <button
              key={skill}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200 
                ${
                  selectedSkill === skill
                    ? "bg-cyan-600 text-white"
                    : isDarkMode
                    ? "bg-[#403f3f] text-white border border-gray-600 hover:bg-[#4a4a4a]"
                    : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-100"
                }`}
              onClick={() =>
                setSelectedSkill(skill === selectedSkill ? null : skill)
              }
            >
              {skill}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
            <p className="mt-4 text-lg font-medium">Loading quizzes...</p>
          </div>
        ) : (
          <div
            className={`${
              isDarkMode ? "bg-[#403f3f]" : "bg-white"
            } shadow-md rounded-lg overflow-x-auto`}
          >
            <table className="w-full">
              <thead className={isDarkMode ? "bg-[#403f3f]" : "bg-white"}>
                <tr>
                  <th className="px-4 py-3 text-left text-xl font-bold text-gray-500 uppercase tracking-wider">
                    Topic
                  </th>
                  <th className="px-4 py-3 text-left text-xl font-bold text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-4 py-3 text-left text-xl font-bold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-4 py-3 text-left text-xl font-bold text-gray-500 uppercase tracking-wider">
                    Results
                  </th>
                  <th className="px-4 py-3 text-left text-xl font-bold text-gray-500 uppercase tracking-wider">
                    Solution
                  </th>
                </tr>
              </thead>
              <tbody
                className={`${
                  isDarkMode ? "bg-[#403f3f]" : "bg-white"
                } divide-y ${
                  isDarkMode ? "divide-gray-700" : "divide-gray-200"
                }`}
              >
                {filteredQuizzes
                  .slice()
                  .reverse()
                  .map((quiz, index) => (
                    <tr
                      key={quiz._id}
                      className={
                        index % 2 === 0
                          ? isDarkMode
                            ? "bg-[#333333]"
                            : "bg-gray-50"
                          : isDarkMode
                          ? "bg-[#403f3f]"
                          : "bg-white"
                      }
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm">
                        {getQuizType(quiz.quizName)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        {removeQuizTypePrefix(quiz.quizName)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button
                          onClick={() =>
                            handleStartQuiz(quiz._id, userID, quiz.quizName)
                          }
                          className="text-white py-2 px-5 rounded-xl bg-blue-500 hover:bg-[#003366]"
                        >
                          Start
                        </button>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        {new Date() > new Date(quiz.end) && (
                          <button
                            onClick={() =>
                              handleQuizResults(quiz._id, userID, quiz.quizName)
                            }
                            className="text-white py-2 px-2 rounded-xl bg-[#429e9d] hover:bg-[#096c6c]"
                          >
                            View Results
                          </button>
                        )}
                      </td>
                      {/* Solution Column with Icons */}
                      <td className="px-4 py-4 whitespace-nowrap flex items-center gap-4 text-lg">
                        {/* Text Solution Icon */}
                        <button
                          onClick={() => handleTextSolution(quiz._id)}
                          className="text-blue-500 hover:text-blue-700"
                          title="Text Solution"
                        >
                          <FaFileAlt />
                        </button>
                        {/* Video Solution Icon */}
                        <button
                          onClick={() => handleVideoSolution(quiz._id)}
                          className="text-white-500 hover:text-white-700"
                          title="Video Solution"
                        >
                          <FaVideo />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default DataSkillsDashboard;
