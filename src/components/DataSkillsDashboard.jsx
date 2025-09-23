// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";
// import { Loader2, Star, BookOpen, Clock3, Users, Flag, Merge, FolderKanban, Search, KeyRound, X } from "lucide-react";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { ScrollArea } from "./ui/scroll-area";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogCancel,
// } from "./ui/alert-dialog";
// import Navbar from "./Navbar";
// import certificate from "../assets/certificate.png"; // Make sure this path is correct

// // Copied from QuestionGallery.jsx for consistent UI
// const SQLIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-9 w-9" fill="currentColor">
//     <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" />
//   </svg>
// );

// // Copied from QuestionGallery.jsx for consistent UI
// const Footer = ({ isDarkMode }) => (
//   <footer className={`w-full py-4 mt-auto ${isDarkMode ? "bg-[#1D1E23] text-gray-200" : "bg-gray-100 text-gray-800"} border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
//     <div className="max-w-screen-2xl mx-auto px-6 text-center text-lg">
//       <span className="font-semibold text-teal-500">DataSense:</span> All rights reserved, 2025
//     </div>
//   </footer>
// );

// // New Testimonial Card Component
// const TestimonialCard = ({ isDarkMode, avatar, name, role, comment, stats }) => (
//     <div className={`p-4 rounded-lg flex flex-col ${isDarkMode ? "bg-[#25272C]" : "bg-slate-50"}`}>
//         <div className="flex items-center gap-3">
//             <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
//             <div>
//                 <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{name}</div>
//                 <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{role}</div>
//             </div>
//         </div>
//         <p className={`mt-3 text-sm flex-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>"{comment}"</p>
//         <div className={`mt-3 pt-3 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"} flex items-center justify-between text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
//             <span>👍 {stats.likes}</span>
//             <span>💬 {stats.comments}</span>
//         </div>
//     </div>
// );


// const DataSkillsDashboard = () => {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const navigateTo = useNavigate();
//   const [quizzes, setQuizzes] = useState([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [quizType, setQuizType] = useState("");
//   const [showInstructions, setShowInstructions] = useState(false);
//   const [pendingNavigation, setPendingNavigation] = useState(null);
//   const [isPremiumPopupOpen, setIsPremiumPopupOpen] = useState(false);

//   // States for search functionality
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const searchInputRef = useRef(null);

//   // **NEW**: State to hold the completion status of quizzes
//   const [completionStatus, setCompletionStatus] = useState({});

//   // Helper function to identify quiz type from its name
//   const getQuizType = (quizName) => {
//     const lowerCaseQuizName = quizName.toLowerCase();
//     if (lowerCaseQuizName.startsWith("sql:")) return "sql";
//     if (lowerCaseQuizName.startsWith("python:")) return "python";
//     if (lowerCaseQuizName.startsWith("mcq:")) return "mcq";
//     return "sql"; // Default
//   };

//   // **NEW**: Helper function to check if a single quiz is completed by the user
//   const checkIfQuizCompleted = async (quiz, user) => {
//     const quizType = getQuizType(quiz.quizName);
//     const userEmail = user.primaryEmailAddress?.emailAddress;

//     if (!userEmail) return false; // Can't check if user email is not available

//     let url;
//     if (quizType === 'mcq') {
//       url = `https://server.datasenseai.com/leaderboard/${quiz._id}`;
//     } else if (quizType === 'python') {
//       url = `https://server.datasenseai.com/leaderboard/python/${quiz._id}`;
//     } else if (quizType === 'sql') {
//       url = `https://server.datasenseai.com/leaderboard/sql/${quiz._id}`;
//     } else {
//       return false; // Unknown quiz type
//     }

//     try {
//       const response = await axios.get(url);
//       const leaderboard = response.data.leaderboard;

//       // Check if any user in the leaderboard has the same email as the current user
//       return leaderboard.users.some(leaderboardUser =>
//         leaderboardUser.userId && leaderboardUser.userId.split(',')[0].trim() === userEmail
//       );
//     } catch (error) {
//       // If leaderboard fetch fails (e.g., 404), it means the user hasn't completed it.
//       // console.warn(`Could not fetch leaderboard for quiz ${quiz._id}:`, error.message);
//       return false;
//     }
//   };


//   // **MODIFIED**: This effect now fetches quizzes AND their completion status
//   useEffect(() => {
//     // Break out of iframe if necessary
//     if (window.self !== window.top) {
//       window.top.location.href = window.location.href;
//     }

//     const fetchDashboardData = async () => {
//       setIsLoading(true);
//       try {
//         // Step 1: Fetch all quizzes
//         const quizResponse = await axios.get("https://server.datasenseai.com/quiz/quizzes");
//         const allQuizzes = quizResponse.data.slice().reverse();
//         setQuizzes(allQuizzes);

//         // Step 2: If user is logged in, fetch their completion status for each quiz
//         if (isSignedIn && user) {
//           const statusPromises = allQuizzes.map(quiz =>
//             checkIfQuizCompleted(quiz, user)
//           );
//           const statuses = await Promise.all(statusPromises);
          
//           const statusMap = {};
//           allQuizzes.forEach((quiz, index) => {
//             statusMap[quiz._id] = statuses[index];
//           });
//           setCompletionStatus(statusMap);
//         }
//       } catch (error) {
//         console.error("Error fetching dashboard data:", error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     if (isLoaded) {
//       fetchDashboardData();
//     }
//   }, [isLoaded, isSignedIn, user]); // Rerun when user logs in/out

//   // Effect for handling client-side search functionality
//   useEffect(() => {
//     if (isSearchActive) {
//       searchInputRef.current?.focus();

//       if (searchQuery.trim() === "") {
//         setSearchResults([]);
//         return;
//       }

//       // Debounce search to avoid excessive filtering on every keystroke
//       const handler = setTimeout(() => {
//         setIsSearching(true);
//         const results = quizzes.filter(quiz =>
//           quiz.quizName.toLowerCase().includes(searchQuery.toLowerCase())
//         );
//         setSearchResults(results);
//         setIsSearching(false);
//       }, 300); // 300ms debounce

//       return () => {
//         clearTimeout(handler);
//       };
//     }
//   }, [searchQuery, isSearchActive, quizzes]);

//   // **REMOVED**: The old `calculateQuizProgress` function is no longer needed.
  
//   const removeQuizTypePrefix = (quizName) => {
//     return quizName.replace(/^(sql:|python:|mcq:)\s*/i, "");
//   };

//   const handleStartQuiz = (quizID, quizName) => {
//     if (!isSignedIn) {
//       alert("You need to log in to start the quiz.");
//       return;
//     }
//     const type = getQuizType(quizName);
//     let navigationPath;
    
//     if (type === "sql") navigationPath = `/quiz?quizID=${quizID}`;
//     else if (type === "python") navigationPath = `/pyQuiz?quizID=${quizID}`;
//     else if (type === "mcq") navigationPath = `/mcqQuiz?quizID=${quizID}`;
//     else {
//         alert("Unknown quiz type.");
//         return;
//     }

//     setQuizType(type);
//     setShowInstructions(true);
//     setPendingNavigation(() => () => navigateTo(navigationPath));
//   };

//   const handleQuizResults = (quizID, quizName) => {
//     if (!isSignedIn) {
//       alert("You need to log in to get the results.");
//       return;
//     }
//     navigateTo(`/leaderboard?quizID=${quizID}&quizName=${quizName}`);
//   };
  
//   const handleSolution = (quiz) => {
//     alert("Solution feature coming soon!");
//   };

//   // **MODIFIED**: Logic to calculate completed quizzes count
//   const completedQuizzesCount = Object.values(completionStatus).filter(status => status === true).length;
  
//   const totalQuizzes = quizzes.length;
//   const progressPercentage = totalQuizzes > 0 ? Math.floor((completedQuizzesCount / totalQuizzes) * 100) : 0;

//   // **MODIFIED**: This helper object is simplified for only two states
//   const progressStyles = {
//     'Start Quiz': { width: 0, position: 0 },
//     'Completed': { width: 100, position: 100 },
//   };
  
//   return (
//     <div className={`font-sans flex flex-col min-h-screen ${
//       isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100"
//     }`}>
//       <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
//       <div
//         className={`mt-14 fixed inset-0 z-40 transition-opacity duration-300 ${ isSearchActive ? "bg-black/60 backdrop-blur-sm" : "bg-transparent pointer-events-none" }`}
//         onClick={() => setIsSearchActive(false)}
//       >
//         <div
//           className={`w-full transition-transform duration-300 ease-in-out ${ isDarkMode ? "bg-[#25272C]" : "bg-white" } ${ isSearchActive ? "translate-y-0" : "-translate-y-full" }`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           <div className="p-6 max-w-screen-2xl mx-auto">
//             <div className="flex items-center gap-4">
//               <Search className={`h-6 w-6 flex-shrink-0 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
//               <Input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search quizzes by name..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className={`w-full h-14 text-lg ${isDarkMode ? "bg-[#2f2f2f] border-[#3f3f3f] text-white" : "bg-gray-50 border-gray-300"}`}
//               />
//               <Button variant="ghost" size="icon" onClick={() => setIsSearchActive(false)}>
//                 <X className={`h-6 w-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
//               </Button>
//             </div>

//             <ScrollArea className="h-[calc(100vh-150px)] mt-4">
//               {isSearching ? (
//                 <div className="flex justify-center items-center h-32">
//                   <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
//                 </div>
//               ) : searchResults.length > 0 ? (
//                 <div className="space-y-3 p-1">
//                   {searchResults.map((quiz) => (
//                     <div key={quiz._id} className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'hover:bg-[#32363C]' : 'hover:bg-gray-50'}`}>
//                       <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
//                         {removeQuizTypePrefix(quiz.quizName)}
//                       </h3>
//                       <Button
//                         onClick={() => {
//                           handleStartQuiz(quiz._id, quiz.quizName);
//                           setIsSearchActive(false);
//                         }}
//                         className="bg-cyan-600 hover:bg-cyan-700 text-white"
//                       >
//                         Start
//                       </Button>
//                     </div>
//                   ))}
//                 </div>
//               ) : searchQuery && (
//                 <div className="text-center py-10 text-gray-500">
//                   <p>No results found for "{searchQuery}". Try a different search.</p>
//                 </div>
//               )}
//             </ScrollArea>
//           </div>
//         </div>
//       </div>
      
//       <AlertDialog open={showInstructions} onOpenChange={setShowInstructions}>
//         <AlertDialogContent className={`font-sans max-w-lg shadow-xl border-none ${
//           isDarkMode ? 'bg-[#262626] text-gray-50' : 'bg-white text-gray-900'
//         }`}>
//           <AlertDialogHeader>
//             <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
//               <FolderKanban className="h-6 w-6 text-yellow-500" />
//             </div>
//             <AlertDialogTitle className="text-xl font-bold mb-2 text-teal-500">
//               Quiz Instructions
//             </AlertDialogTitle>
//             <AlertDialogDescription asChild>
//               <div className={`mt-4 space-y-4 text-sm `}>
//                 <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                   {quizType === "sql" && (
//                     <div>
//                       <p>This SQL quiz will test your knowledge of database queries. Make sure to:</p>
//                       <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
//                         <li>Write standard SQL syntax</li>
//                         <li>Test your queries before submitting</li>
//                         <li>Pay attention to the required output format</li>
//                       </ul>
//                     </div>
//                   )}
//                   {quizType === "python" && (
//                     <div>
//                       <p>This Python programming quiz will test your coding skills. Remember to:</p>
//                       <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
//                         <li>Follow Python PEP 8 style guidelines</li>
//                         <li>Handle edge cases</li>
//                         <li>Use appropriate data structures</li>
//                       </ul>
//                     </div>
//                   )}
//                   {quizType === "mcq" && (
//                     <div>
//                       <p>This multiple-choice quiz will test your knowledge. Please note:</p>
//                       <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
//                         <li>Read all options carefully</li>
//                         <li>Only one answer is correct</li>
//                         <li>You cannot change your answer after submission</li>
//                       </ul>
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <p className={`font-semibold ${isDarkMode ? 'text-teal-500' : 'text-teal-500'}`}>General Instructions:</p>
//                   <ul className={`list-disc list-inside pl-4 mt-2 space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//                     <li>This is a timed quiz and can only be attempted once.</li>
//                     <li>For coding questions, use the 'Run Code' button to check if your code works correctly.</li>
//                     <li>Once satisfied, use the 'Submit Code' button to submit your answer.</li>
//                     <li>You can re-submit a question if your first attempt was incorrect, as long as time hasn't run out.</li>
//                     <li>Finally, make sure to submit the quiz using the 'Submit' button at the top right corner.</li>
//                   </ul>
//                 </div>
//               </div>
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter className="mt-6">
//             <AlertDialogCancel className={`border ${isDarkMode ? 'bg-transparent border-gray-600 hover:bg-gray-700' : 'bg-transparent border-gray-300 hover:bg-gray-100'}`}>
//               Cancel
//             </AlertDialogCancel>
//             <AlertDialogAction
//               onClick={() => {
//                 setShowInstructions(false);
//                 pendingNavigation && pendingNavigation();
//               }}
//               className="bg-teal-500 text-white hover:bg-teal-600"
//             >
//               Start Quiz
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>

//       {/* Main Content */}
//       <main className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col gap-4 p-4">
        
//         <div className="flex items-center justify-between">
//             <div className="flex-1">
//                 <div
//                     className={`w-full rounded-lg px-4 py-3 flex items-center gap-4 ${isDarkMode ? "text-white" : "text-white"}`}
//                     style={{
//                         background: isDarkMode
//                             ? "linear-gradient(90deg,rgb(53, 54, 55) 0%,rgb(29, 30, 35) 100%)"
//                             : "linear-gradient(90deg,rgb(53, 54, 55) 0%,rgb(237, 240, 240) 100%)",
//                     }}
//                 >
//                     <Merge className="h-4 w-4 text-cyan-300 font-bold" />
//                     <div className="text-sm md:text-[15px] font-medium">This path is a part of SQL Learning Roadmap</div>
//                     <a href="https://dashboard.datasenseai.com/sql-journey" target="_blank" rel="noopener noreferrer" className={`pl-10 ${isDarkMode ? "text-cyan-300 hover:text-cyan-200" : "text-cyan-300 hover:text-cyan-200"} text-sm font-semibold underline`}>
//                         View Roadmap
//                     </a>
//                 </div>
//             </div>
//             <div className="hidden md:block">
//                 <button
//                     onClick={() => setIsSearchActive(true)}
//                     className={`w-full max-w-md flex items-center gap-2 text-left p-2 rounded-lg border ${isDarkMode ? "bg-[#2f2f2f] border-[#3f3f3f] text-gray-400" : "bg-white border-gray-300 text-gray-500"}`}
//                 >
//                     <Search className="h-4 w-4" />
//                     Search quizzes...
//                 </button>
//             </div>
//         </div>
        
//         <div className="flex gap-6">
//             <div className="flex-1 max-w-5xl py-4 flex flex-col gap-6">
              
//               <div
//                   className="relative overflow-hidden rounded-2xl p-6 md:p-7 text-white shadow-lg"
//                   style={{
//                       backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(180deg, #1eafaf 0%, #126464 100%)`,
//                       backgroundSize: "32px 32px, 32px 32px, cover",
//                       backgroundPosition: "0 0, 0 0, 0 0",
//                       border: isDarkMode ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.25)",
//                   }}
//               >
//                   <div className="flex flex-col gap-5">
//                       <div>
//                           <div className="flex items-center gap-3 mb-3">
//                               <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-white/10" : "bg-white/20"}`}>
//                                   <SQLIcon />
//                               </div>
//                               <div className="flex items-center gap-2 ml-auto">
//                                   <span className="text-xs px-5 py-2 rounded-lg backdrop-blur bg-[#abfff9] text-black">🏅 Certification Available</span>
//                                   <span className="text-xs px-5 py-2 rounded-lg backdrop-blur font-bold bg-[#FFF9D8] text-[#FFB039]">★ 4.6 (3.5k+)</span>
//                               </div>
//                           </div>
//                           <h2 className="text-3xl md:text-[32px] font-extrabold tracking-tight">SQL Live Quizzes</h2>
//                           <p className="mt-2 text-base text-white/95">Join real-time interactive quizzes designed to test your knowledge under pressure. Compete, learn, and sharpen your skills with timed challenges on SELECT, Joins, Aggregates, Subqueries, and more — all based on real-world scenarios.</p>
//                           <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-5 text-white/90 text-base">
//                               <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> New Quiz Weekly</div>
//                               <div className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> 15+ Case Studies</div>
//                               <div className="flex items-center gap-2"><Star className="h-4 w-4" /> 1,500+ Premium Quality Problems</div>
//                               <div className="flex items-center gap-2"><Users className="h-4 w-4" /> 18.5k Learners</div>
//                               <div className="flex items-center gap-2"><Flag className="h-4 w-4" /> Advanced Level</div>
//                           </div>
//                       </div>

//                       <div className="mt-4">
//                           <div className="flex items-center gap-4 w-full">
//                               <div className="flex-1">
//                                   <div className="flex justify-between items-center mb-2">
//                                     <p className="font-semibold">Number of Test Attended: {completedQuizzesCount} out of {totalQuizzes}</p>
//                                     <p className="font-semibold text-green-400">{progressPercentage}% Completed</p>
//                                   </div>
//                                   <div className={`h-2 rounded-full w-full ${isDarkMode ? "bg-white/15" : "bg-white/40"}`}>
//                                       <div
//                                           className="h-2 rounded-full bg-green-400 transition-all duration-500"
//                                           style={{ width: `${progressPercentage}%` }}
//                                       />
//                                   </div>
//                               </div>
//                               <Button className={`${isDarkMode ? "bg-white text-[#12325d] hover:bg-white/90" : "bg-white text-[#12325d] hover:bg-white/95"} font-semibold px-6 py-5 rounded-xl whitespace-nowrap ml-6`}>
//                                   Start Solving
//                               </Button>
//                           </div>
//                       </div>
//                   </div>
//               </div>

//               {/* Quizzes List - Enhanced Circle Handle Design */}
//               <div className="space-y-4">
//                   {isLoading ? (
//                       <div className="flex flex-col items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-cyan-600" /><p className="mt-4 text-lg font-medium">Loading quizzes...</p></div>
//                   ) : (
//                       quizzes.map((quiz) => {
//                           // **MODIFIED**: Logic simplified to use the new completionStatus state
//                           const isCompleted = completionStatus[quiz._id] || false;
//                           const status = isCompleted ? "Completed" : "Start Quiz";
//                           const style = progressStyles[status];

//                           return (
//                             <div key={quiz._id} className={`p-4 rounded-lg flex flex-col gap-2 ${isDarkMode ? "bg-[#32363C]" : "bg-white"} border ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
//                                 {/* Top Row: Title & Buttons */}
//                                 <div className="flex justify-between items-center">
//                                     <h3 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>{removeQuizTypePrefix(quiz.quizName)}</h3>
//                                     <div className="flex items-center gap-2 flex-shrink-0">
//                                         <Button onClick={() => handleStartQuiz(quiz._id, quiz.quizName)} className="bg-cyan-400 hover:bg-cyan-500 text-white">Start Quiz</Button>
//                                         <Button onClick={() => handleQuizResults(quiz._id, quiz.quizName)} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4">Results</Button>
//                                         <Button onClick={() => handleSolution(quiz)} className=" bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 text-black dark:text-white px-4">Solution</Button>
//                                         {/* <Button onClick={() => handleQuizResults(quiz._id, quiz.quizName)} className={`${isDarkMode ? "bg-cyan-600 hover:bg-cyan-700 text-white" : "border-gray-300 hover:bg-gray-100"}`}>Results</Button> */}
//                                         {/* <Button onClick={() => handleSolution(quiz)} variant="outline" className={`${isDarkMode ? "border-yellow-500 text-yellow-500 hover:bg-yellow-500/10" : "border-yellow-500 text-yellow-600 hover:bg-yellow-50"}`}>Solution</Button> */}
//                                     </div>
//                                 </div>

//                                 {/* Bottom Row: Enhanced Progress Bar */}
//                                 <div className="pt-2">
//                                     <div className="relative h-5 flex items-center">
//                                         {/* Track */}
//                                         <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                        
//                                         {/* Fill */}
//                                         <div
//                                             className={`absolute h-2 rounded-full transition-all duration-700 ease-out ${
//                                                 status === "Completed" 
//                                                 ? "bg-gradient-to-r from-green-400 to-green-500" 
//                                                 : "bg-gradient-to-r from-cyan-400 to-cyan-500"
//                                             }`}
//                                             style={{ width: `${style.width}%` }}
//                                         />

//                                         {/* Handle */}
//                                         <div
//                                             className="absolute top-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-800 shadow-lg transition-all duration-700 ease-out"
//                                             style={{
//                                                 left: `${style.position}%`,
//                                                 transform: 'translateX(-50%) translateY(-50%)', // Corrected transform for alignment
//                                                 border: `3px solid ${status === "Completed" ? "#22c55e" : "#06b6d4"}`
//                                             }}
//                                         />
//                                     </div>
                                    
//                                     {/* **MODIFIED**: Labels simplified to two states */}
//                                     <div className="grid grid-cols-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
//                                         <span className={`text-left ${status === 'Start Quiz' ? 'font-bold text-cyan-500' : ''}`}>Start Quiz</span>
//                                         <span className={`text-right ${status === 'Completed' ? 'font-bold text-green-500' : ''}`}>Completed</span>
//                                     </div>
//                                 </div>
//                             </div>
//                           );
//                       })
//                   )}
//               </div>
//             </div>

//             <aside className="hidden xl:block w-[450px] py-4 space-y-4">
//               <div className={`rounded-xl overflow-hidden shadow ${isDarkMode ? "bg-[#32363C]" : "bg-white"}`}>
//                 <div className={`p-4 border-b ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
//                   <div className="h-48 rounded-lg flex items-center justify-center"><img className="h-48 w-68" src={certificate} alt="certificate" /></div>
//                   <div className="flex items-center gap-2 mt-3">
//                       <span className={`text-[11px] px-2 py-1 rounded-full ${isDarkMode ? "bg-white/10 text-white" : "bg-blue-50 text-blue-700"} border ${isDarkMode ? "border-white/15" : "border-blue-200"}`}>Certification available</span>
//                       <span className={`text-[11px] px-2 py-1 rounded-full ${isDarkMode ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-700"} border ${isDarkMode ? "border-white/15" : "border-emerald-200"}`}>Included in premium</span>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Certificate on Completion</h3>
//                   <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-base mt-2`}>The top three performers of each live quiz, will get a completion certificate.</p>
//                   <Button className={`mt-3 w-full ${isDarkMode ? "bg-cyan-700 hover:bg-cyan-600" : "bg-cyan-600 hover:bg-cyan-700"} text-white opacity-50 cursor-not-allowed`}>View Certificate</Button>
//                 </div>
//               </div>

//               <div className={`rounded-xl overflow-hidden shadow ${isDarkMode ? "bg-[#32363C]" : "bg-white"}`}>
//                 <div className="p-4">
//                   <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Prerequisite course</h3>
//                   <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-base mt-2`}>We recommend you complete this course first before you jump into SQL Practice Queries. This will help you understand even better.</p>
//                   <div className={`mt-4 rounded-lg p-3 ${isDarkMode ? "bg-gradient-to-t from-[#25272C] to-[#4D4D4D]" : "bg-slate-50"}`}>
//                       <div className="flex items-start gap-3">
//                           <div className={`h-10 w-10 rounded-md flex items-center justify-center ${isDarkMode ? "bg-white/10" : "bg-white"} ring-1 ${isDarkMode ? "ring-white/10" : "ring-gray-200"}`}><span className={`${isDarkMode ? "text-white" : "text-gray-700"}`}>🗄️</span></div>
//                           <div className="flex-1">
//                               <div className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Learn SQL</div>
//                               <div className={`mt-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Start your journey into data handling with this interactive SQL course.</div>
//                               <div className={`mt-2 text-sm flex items-center gap-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}><span>14 courses</span><span>71.9k learners</span></div>
//                           </div>
//                       </div>
//                       <Button onClick={() => setIsPremiumPopupOpen(true)} className={`${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-900 hover:bg-black"} text-white w-full mt-3`}>Learn SQL</Button>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                  <TestimonialCard 
//                    isDarkMode={isDarkMode}
//                    avatar="https://randomuser.me/api/portraits/women/44.jpg"
//                    name="Kavya Reddy"
//                    role="Data Analyst at Uber"
//                    comment="From zero coding experience to landing a ride at Uber! 🚕 The structured curriculum, mentorship program and career guidance were exceptional."
//                    stats={{ likes: 285, comments: 12 }}
//                  />
//                  <TestimonialCard 
//                    isDarkMode={isDarkMode}
//                    avatar="https://randomuser.me/api/portraits/men/1.jpg"
//                    name="Vikash Kumar"
//                    role="Data Scientist"
//                    comment="Just got a job offer from @Microsoft! 🔥 Thanks to @DataSenseAI for the amazing SQL course. The practical approach made all the difference!"
//                    stats={{ likes: 483, comments: 45 }}
//                  />
//               </div>
//             </aside>
//         </div>
//       </main>

//       <Footer isDarkMode={isDarkMode} />
      
//       {isPremiumPopupOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-[#252526] p-6 rounded-lg shadow-xl relative w-11/12 max-w-md text-center">
//             <button
//               onClick={() => setIsPremiumPopupOpen(false)}
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
//             >
//               <X size={24} />
//             </button>
//             <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
//               <KeyRound className="h-6 w-6 text-yellow-500" />
//             </div>
//             <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
//               Premium Feature
//             </h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               The <span className="font-semibold text-teal-500">Learn SQL</span>{" "}
//               feature is coming soon! Subscribe to be the first to know.
//             </p>
//             <button
//               disabled
//               className="w-full bg-teal-500 text-white font-semibold py-2.5 px-4 rounded-lg opacity-50 cursor-not-allowed"
//             >
//               Subscribe
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DataSkillsDashboard;

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { Loader2, Star, BookOpen, Clock3, Users, Flag, Merge, FolderKanban, Search, KeyRound, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
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
import Navbar from "./Navbar";
import certificate from "../assets/certificate.png"; // Make sure this path is correct

// Copied from QuestionGallery.jsx for consistent UI
const SQLIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-9 w-9" fill="currentColor">
    <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z" />
  </svg>
);

// Copied from QuestionGallery.jsx for consistent UI
const Footer = ({ isDarkMode }) => (
  <footer className={`w-full py-4 mt-auto ${isDarkMode ? "bg-[#1D1E23] text-gray-200" : "bg-gray-100 text-gray-800"} border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}>
    <div className="max-w-screen-2xl mx-auto px-6 text-center text-lg">
      <span className="font-semibold text-teal-500">DataSense:</span> All rights reserved, 2025
    </div>
  </footer>
);

// New Testimonial Card Component
const TestimonialCard = ({ isDarkMode, avatar, name, role, comment, stats }) => (
    <div className={`p-4 rounded-lg flex flex-col ${isDarkMode ? "bg-[#25272C]" : "bg-slate-50"}`}>
        <div className="flex items-center gap-3">
            <img src={avatar} alt={name} className="h-10 w-10 rounded-full object-cover" />
            <div>
                <div className={`font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>{name}</div>
                <div className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{role}</div>
            </div>
        </div>
        <p className={`mt-3 text-sm flex-1 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>"{comment}"</p>
        {/* <div className={`mt-3 pt-3 border-t ${isDarkMode ? "border-white/10" : "border-gray-200"} flex items-center justify-between text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            <span>👍 {stats.likes}</span>
            <span>💬 {stats.comments}</span>
        </div> */}
    </div>
);


const DataSkillsDashboard = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigateTo = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [quizType, setQuizType] = useState("");
  const [showInstructions, setShowInstructions] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  
  // States for search functionality
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef(null);

  // State to hold the completion status of quizzes
  const [completionStatus, setCompletionStatus] = useState({});

  // **NEW**: States for the reusable premium feature popup
  const [isPremiumPopupOpen, setIsPremiumPopupOpen] = useState(false);
  const [premiumFeatureName, setPremiumFeatureName] = useState('');

  // **NEW**: Ref for the "Start Solving" button scroll functionality
  const quizzesContainerRef = useRef(null);

  const getQuizType = (quizName) => {
    const lowerCaseQuizName = quizName.toLowerCase();
    if (lowerCaseQuizName.startsWith("sql:")) return "sql";
    if (lowerCaseQuizName.startsWith("python:")) return "python";
    if (lowerCaseQuizName.startsWith("mcq:")) return "mcq";
    return "sql"; // Default
  };

  const checkIfQuizCompleted = async (quiz, user) => {
    const quizType = getQuizType(quiz.quizName);
    const userEmail = user.primaryEmailAddress?.emailAddress;

    if (!userEmail) return false;

    let url;
    if (quizType === 'mcq') {
      url = `https://server.datasenseai.com/leaderboard/${quiz._id}`;
    } else if (quizType === 'python') {
      url = `https://server.datasenseai.com/leaderboard/python/${quiz._id}`;
    } else if (quizType === 'sql') {
      url = `https://server.datasenseai.com/leaderboard/sql/${quiz._id}`;
    } else {
      return false;
    }

    try {
      const response = await axios.get(url);
      const leaderboard = response.data.leaderboard;
      return leaderboard.users.some(leaderboardUser =>
        leaderboardUser.userId && leaderboardUser.userId.split(',')[0].trim() === userEmail
      );
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    if (window.self !== window.top) {
      window.top.location.href = window.location.href;
    }

    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const quizResponse = await axios.get("https://server.datasenseai.com/quiz/quizzes");
        const allQuizzes = quizResponse.data.slice().reverse();
        setQuizzes(allQuizzes);

        if (isSignedIn && user) {
          const statusPromises = allQuizzes.map(quiz =>
            checkIfQuizCompleted(quiz, user)
          );
          const statuses = await Promise.all(statusPromises);
          
          const statusMap = {};
          allQuizzes.forEach((quiz, index) => {
            statusMap[quiz._id] = statuses[index];
          });
          setCompletionStatus(statusMap);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchDashboardData();
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    if (isSearchActive) {
      searchInputRef.current?.focus();

      if (searchQuery.trim() === "") {
        setSearchResults([]);
        return;
      }

      const handler = setTimeout(() => {
        setIsSearching(true);
        const results = quizzes.filter(quiz =>
          quiz.quizName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setSearchResults(results);
        setIsSearching(false);
      }, 300);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [searchQuery, isSearchActive, quizzes]);

  const removeQuizTypePrefix = (quizName) => {
    return quizName.replace(/^(sql:|python:|mcq:)\s*/i, "");
  };

  const handleStartQuiz = (quizID, quizName) => {
    if (!isSignedIn) {
      alert("You need to log in to start the quiz.");
      return;
    }
    const type = getQuizType(quizName);
    let navigationPath;
    
    if (type === "sql") navigationPath = `/quiz?quizID=${quizID}`;
    else if (type === "python") navigationPath = `/pyQuiz?quizID=${quizID}`;
    else if (type === "mcq") navigationPath = `/mcqQuiz?quizID=${quizID}`;
    else {
        alert("Unknown quiz type.");
        return;
    }

    setQuizType(type);
    setShowInstructions(true);
    setPendingNavigation(() => () => navigateTo(navigationPath));
  };

  const handleQuizResults = (quizID, quizName) => {
    if (!isSignedIn) {
      alert("You need to log in to get the results.");
      return;
    }
    navigateTo(`/leaderboard?quizID=${quizID}&quizName=${quizName}`);
  };
  
  // **MODIFIED**: This function now opens the premium popup
  const handleSolution = () => {
    setPremiumFeatureName("Quiz Solution");
    setIsPremiumPopupOpen(true);
  };

  // **NEW**: Function to scroll to the first quiz
  const handleStartSolvingClick = () => {
    quizzesContainerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const completedQuizzesCount = Object.values(completionStatus).filter(status => status === true).length;
  const totalQuizzes = quizzes.length;
  const progressPercentage = totalQuizzes > 0 ? Math.floor((completedQuizzesCount / totalQuizzes) * 100) : 0;

  const progressStyles = {
    'Start Quiz': { width: 0, position: 0 },
    'Completed': { width: 100, position: 100 },
  };
  
  return (
    <div className={`font-sans flex flex-col min-h-screen ${
      isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100"
    }`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      
      <div
        className={`mt-14 fixed inset-0 z-40 transition-opacity duration-300 ${ isSearchActive ? "bg-black/60 backdrop-blur-sm" : "bg-transparent pointer-events-none" }`}
        onClick={() => setIsSearchActive(false)}
      >
        <div
          className={`w-full transition-transform duration-300 ease-in-out ${ isDarkMode ? "bg-[#25272C]" : "bg-white" } ${ isSearchActive ? "translate-y-0" : "-translate-y-full" }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 max-w-screen-2xl mx-auto">
            <div className="flex items-center gap-4">
              <Search className={`h-6 w-6 flex-shrink-0 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search quizzes by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-14 text-lg ${isDarkMode ? "bg-[#2f2f2f] border-[#3f3f3f] text-white" : "bg-gray-50 border-gray-300"}`}
              />
              <Button variant="ghost" size="icon" onClick={() => setIsSearchActive(false)}>
                <X className={`h-6 w-6 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`} />
              </Button>
            </div>

            <ScrollArea className="h-[calc(100vh-150px)] mt-4">
              {isSearching ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3 p-1">
                  {searchResults.map((quiz) => (
                    <div key={quiz._id} className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'hover:bg-[#32363C]' : 'hover:bg-gray-50'}`}>
                      <h3 className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                        {removeQuizTypePrefix(quiz.quizName)}
                      </h3>
                      <Button
                        onClick={() => {
                          handleStartQuiz(quiz._id, quiz.quizName);
                          setIsSearchActive(false);
                        }}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white"
                      >
                        Start
                      </Button>
                    </div>
                  ))}
                </div>
              ) : searchQuery && (
                <div className="text-center py-10 text-gray-500">
                  <p>No results found for "{searchQuery}". Try a different search.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>
      
      <AlertDialog open={showInstructions} onOpenChange={setShowInstructions}>
        <AlertDialogContent className={`font-sans max-w-lg shadow-xl border-none ${
          isDarkMode ? 'bg-[#262626] text-gray-50' : 'bg-white text-gray-900'
        }`}>
          <AlertDialogHeader>
            <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
              <FolderKanban className="h-6 w-6 text-yellow-500" />
            </div>
            <AlertDialogTitle className="text-xl font-bold mb-2 text-teal-500">
              Quiz Instructions
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className={`mt-4 space-y-4 text-sm `}>
                <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {quizType === "sql" && (
                    <div>
                      <p>This SQL quiz will test your knowledge of database queries. Make sure to:</p>
                      <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Write standard SQL syntax</li>
                        <li>Test your queries before submitting</li>
                        <li>Pay attention to the required output format</li>
                      </ul>
                    </div>
                  )}
                  {quizType === "python" && (
                    <div>
                      <p>This Python programming quiz will test your coding skills. Remember to:</p>
                      <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Follow Python PEP 8 style guidelines</li>
                        <li>Handle edge cases</li>
                        <li>Use appropriate data structures</li>
                      </ul>
                    </div>
                  )}
                  {quizType === "mcq" && (
                    <div>
                      <p>This multiple-choice quiz will test your knowledge. Please note:</p>
                      <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                        <li>Read all options carefully</li>
                        <li>Only one answer is correct</li>
                        <li>You cannot change your answer after submission</li>
                      </ul>
                    </div>
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${isDarkMode ? 'text-teal-500' : 'text-teal-500'}`}>General Instructions:</p>
                  <ul className={`list-disc list-inside pl-4 mt-2 space-y-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <li>This is a timed quiz and can only be attempted once.</li>
                    <li>For coding questions, use the 'Run Code' button to check if your code works correctly.</li>
                    <li>Once satisfied, use the 'Submit Code' button to submit your answer.</li>
                    <li>You can re-submit a question if your first attempt was incorrect, as long as time hasn't run out.</li>
                    <li>Finally, make sure to submit the quiz using the 'Submit' button at the top right corner.</li>
                  </ul>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6">
            <AlertDialogCancel className={`border ${isDarkMode ? 'bg-transparent border-gray-600 hover:bg-gray-700' : 'bg-transparent border-gray-300 hover:bg-gray-100'}`}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowInstructions(false);
                pendingNavigation && pendingNavigation();
              }}
              className="bg-teal-500 text-white hover:bg-teal-600"
            >
              Start Quiz
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col gap-4 p-4">
        
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <div
                    className={`w-full rounded-lg px-4 py-3 flex items-center gap-4 ${isDarkMode ? "text-white" : "text-white"}`}
                    style={{
                        background: isDarkMode
                            ? "linear-gradient(90deg,rgb(53, 54, 55) 0%,rgb(29, 30, 35) 100%)"
                            : "linear-gradient(90deg,rgb(53, 54, 55) 0%,rgb(237, 240, 240) 100%)",
                    }}
                >
                    <Merge className="h-4 w-4 text-cyan-300 font-bold" />
                    <div className="text-sm md:text-[15px] font-medium">This path is a part of SQL Learning Roadmap</div>
                    <a href="https://dashboard.datasenseai.com/sql-journey" target="_blank" rel="noopener noreferrer" className={`pl-10 ${isDarkMode ? "text-cyan-300 hover:text-cyan-200" : "text-cyan-300 hover:text-cyan-200"} text-sm font-semibold underline`}>
                        View Roadmap
                    </a>
                </div>
            </div>
            <div className="hidden md:block">
                <button
                    onClick={() => setIsSearchActive(true)}
                    className={`w-full max-w-md flex items-center gap-2 text-left p-2 rounded-lg border ${isDarkMode ? "bg-[#2f2f2f] border-[#3f3f3f] text-gray-400" : "bg-white border-gray-300 text-gray-500"}`}
                >
                    <Search className="h-4 w-4" />
                    Search quizzes...
                </button>
            </div>
        </div>
        
        <div className="flex gap-6">
            <div className="flex-1 max-w-5xl py-4 flex flex-col gap-6">
              
              <div
                  className="relative overflow-hidden rounded-2xl p-6 md:p-7 text-white shadow-lg"
                  style={{
                      backgroundImage: `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(180deg, #1eafaf 0%, #126464 100%)`,
                      backgroundSize: "32px 32px, 32px 32px, cover",
                      backgroundPosition: "0 0, 0 0, 0 0",
                      border: isDarkMode ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.25)",
                  }}
              >
                  <div className="flex flex-col gap-5">
                      <div>
                          <div className="flex items-center gap-3 mb-3">
                              <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${isDarkMode ? "bg-white/10" : "bg-white/20"}`}>
                                  <SQLIcon />
                              </div>
                              <div className="flex items-center gap-2 ml-auto">
                                  <span className="text-xs px-5 py-2 rounded-lg backdrop-blur bg-[#abfff9] text-black">🏅 Certification Available</span>
                                  <span className="text-xs px-5 py-2 rounded-lg backdrop-blur font-bold bg-[#FFF9D8] text-[#FFB039]">★ 4.6 (3.5k+)</span>
                              </div>
                          </div>
                          <h2 className="text-3xl md:text-[32px] font-extrabold tracking-tight">SQL Live Quizzes</h2>
                          <p className="mt-2 text-base text-white/95">Join real-time interactive quizzes designed to test your knowledge under pressure. Compete, learn, and sharpen your skills with timed challenges on SELECT, Joins, Aggregates, Subqueries, and more — all based on real-world scenarios.</p>
                          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-5 text-white/90 text-base">
                              <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> New Quiz Weekly</div>
                              <div className="flex items-center gap-2"><Clock3 className="h-4 w-4" /> 15+ Case Studies</div>
                              <div className="flex items-center gap-2"><Star className="h-4 w-4" /> 1,500+ Premium Quality Problems</div>
                              <div className="flex items-center gap-2"><Users className="h-4 w-4" /> 18.5k Learners</div>
                              <div className="flex items-center gap-2"><Flag className="h-4 w-4" /> Advanced Level</div>
                          </div>
                      </div>

                      <div className="mt-4">
                          <div className="flex items-center gap-4 w-full">
                              <div className="flex-1">
                                  <div className="flex justify-between items-center mb-2">
                                    <p className="font-semibold">Number of Test Completed: {completedQuizzesCount} out of {totalQuizzes}</p>
                                    <p className="font-semibold text-green-400">{progressPercentage}% Completed</p>
                                  </div>
                                  <div className={`h-2 rounded-full w-full ${isDarkMode ? "bg-white/15" : "bg-white/40"}`}>
                                      <div
                                          className="h-2 rounded-full bg-green-400 transition-all duration-500"
                                          style={{ width: `${progressPercentage}%` }}
                                      />
                                  </div>
                              </div>
                              {/* **MODIFIED**: Added onClick handler */}
                              <Button onClick={handleStartSolvingClick} className={`${isDarkMode ? "bg-white text-[#12325d] hover:bg-white/90" : "bg-white text-[#12325d] hover:bg-white/95"} font-semibold px-6 py-5 rounded-xl whitespace-nowrap ml-6`}>
                                  Start Solving
                              </Button>
                          </div>
                      </div>
                  </div>
              </div>

              {/* **MODIFIED**: Attached ref to this container */}
              <div ref={quizzesContainerRef} className="space-y-4">
                  {isLoading ? (
                      <div className="flex flex-col items-center justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-cyan-600" /><p className="mt-4 text-lg font-medium">Loading quizzes...</p></div>
                  ) : (
                      quizzes.map((quiz) => {
                          const isCompleted = completionStatus[quiz._id] || false;
                          const status = isCompleted ? "Completed" : "Start Quiz";
                          const style = progressStyles[status];

                          return (
                            <div key={quiz._id} className={`p-4 rounded-lg flex flex-col gap-2 ${isDarkMode ? "bg-[#32363C]" : "bg-white"} border ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
                                <div className="flex justify-between items-center">
                                    <h3 className={`font-bold text-lg ${isDarkMode ? "text-white" : "text-gray-900"}`}>{removeQuizTypePrefix(quiz.quizName)}</h3>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <Button onClick={() => handleStartQuiz(quiz._id, quiz.quizName)} className="bg-cyan-400 hover:bg-cyan-500 text-white">Start Quiz</Button>
                                        <Button onClick={() => handleQuizResults(quiz._id, quiz.quizName)} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4">Results</Button>
                                        <Button onClick={handleSolution} className=" bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 text-black dark:text-white px-4">Solution</Button>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <div className="relative h-5 flex items-center">
                                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full" />
                                        <div
                                            className={`absolute h-2 rounded-full transition-all duration-700 ease-out ${
                                                status === "Completed" 
                                                ? "bg-gradient-to-r from-green-400 to-green-500" 
                                                : "bg-gradient-to-r from-cyan-400 to-cyan-500"
                                            }`}
                                            style={{ width: `${style.width}%` }}
                                        />
                                        <div
                                            className="absolute top-1/2 w-5 h-5 rounded-full bg-white dark:bg-slate-800 shadow-lg transition-all duration-700 ease-out"
                                            style={{
                                                left: `${style.position}%`,
                                                transform: 'translateX(-50%) translateY(-50%)',
                                                border: `3px solid ${status === "Completed" ? "#22c55e" : "#06b6d4"}`
                                            }}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        <span className={`text-left ${status === 'Start Quiz' ? 'font-bold text-cyan-500' : ''}`}>Start Quiz</span>
                                        <span className={`text-right ${status === 'Completed' ? 'font-bold text-green-500' : ''}`}>Completed</span>
                                    </div>
                                </div>
                            </div>
                          );
                      })
                  )}
              </div>
            </div>

            <aside className="hidden xl:block w-[450px] py-4 space-y-4">
              <div className={`rounded-xl overflow-hidden shadow ${isDarkMode ? "bg-[#32363C]" : "bg-white"}`}>
                <div className={`p-4 border-b ${isDarkMode ? "border-white/10" : "border-gray-200"}`}>
                  <div className="h-48 rounded-lg flex items-center justify-center"><img className="h-48 w-68" src={certificate} alt="certificate" /></div>
                  <div className="flex items-center gap-2 mt-3">
                      <span className={`text-[11px] px-2 py-1 rounded-full ${isDarkMode ? "bg-white/10 text-white" : "bg-blue-50 text-blue-700"} border ${isDarkMode ? "border-white/15" : "border-blue-200"}`}>Certification available</span>
                      <span className={`text-[11px] px-2 py-1 rounded-full ${isDarkMode ? "bg-white/10 text-white" : "bg-emerald-50 text-emerald-700"} border ${isDarkMode ? "border-white/15" : "border-emerald-200"}`}>Included in premium</span>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Certificate on Completion</h3>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-base mt-2`}>The top three performers of each live quiz, will get a completion certificate.</p>
                  <Button className={`mt-3 w-full ${isDarkMode ? "bg-cyan-700 hover:bg-cyan-600" : "bg-cyan-600 hover:bg-cyan-700"} text-white opacity-50 cursor-not-allowed`}>View Certificate</Button>
                </div>
              </div>

              <div className={`rounded-xl overflow-hidden shadow ${isDarkMode ? "bg-[#32363C]" : "bg-white"}`}>
                <div className="p-4">
                  <h3 className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Prerequisite course</h3>
                  <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"} text-base mt-2`}>We recommend you complete this course first before you jump into SQL Practice Queries. This will help you understand even better.</p>
                  <div className={`mt-4 rounded-lg p-3 ${isDarkMode ? "bg-gradient-to-t from-[#25272C] to-[#4D4D4D]" : "bg-slate-50"}`}>
                      <div className="flex items-start gap-3">
                          <div className={`h-10 w-10 rounded-md flex items-center justify-center ${isDarkMode ? "bg-white/10" : "bg-white"} ring-1 ${isDarkMode ? "ring-white/10" : "ring-gray-200"}`}><span className={`${isDarkMode ? "text-white" : "text-gray-700"}`}>🗄️</span></div>
                          <div className="flex-1">
                              <div className={`text-base font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Learn SQL</div>
                              <div className={`mt-1 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>Start your journey into data handling with this interactive SQL course.</div>
                              <div className={`mt-2 text-sm flex items-center gap-4 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}><span>14 courses</span><span>71.9k learners</span></div>
                          </div>
                      </div>
                      {/* **MODIFIED**: onClick handler updated to set the feature name */}
                      <Button onClick={() => {
                        setPremiumFeatureName("Learn SQL");
                        setIsPremiumPopupOpen(true);
                      }} className={`${isDarkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-900 hover:bg-black"} text-white w-full mt-3`}>Learn SQL</Button>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                 <TestimonialCard 
                   isDarkMode={isDarkMode}
                   avatar="https://randomuser.me/api/portraits/women/44.jpg"
                   name="Kathryn Murphy"
                   role="Data Analyst at Uber"
                   comment="From zero coding experience to landing a ride at Uber! 🚕 The structured curriculum, mentorship program and career guidance were exceptional."
                   stats={{ likes: 285, comments: 12 }}
                 />
                 <TestimonialCard 
                   isDarkMode={isDarkMode}
                   avatar="https://randomuser.me/api/portraits/men/1.jpg"
                   name="Marvin McKinney"
                   role="Data Scientist"
                   comment="Just got a job offer from @Microsoft! 🔥 Thanks to @DataSenseAI for the amazing SQL course. The practical approach made all the difference!"
                   stats={{ likes: 483, comments: 45 }}
                 />
              </div>
            </aside>
        </div>
      </main>

      <Footer isDarkMode={isDarkMode} />
      
      {/* **MODIFIED**: Popup now uses dynamic state for its content */}
      {isPremiumPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#252526] p-6 rounded-lg shadow-xl relative w-11/2 max-w-md text-center">
            <button
              onClick={() => setIsPremiumPopupOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
            >
              <X size={24} />
            </button>
            <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
              <KeyRound className="h-6 w-6 text-yellow-500" />
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Premium Feature
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The <span className="font-semibold text-teal-500">{premiumFeatureName}</span>{" "}
              feature is coming soon! Subscribe to be the first to know.
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
};

export default DataSkillsDashboard;