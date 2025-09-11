// import React, { useState, useEffect, useCallback, useRef } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { useUser } from "@clerk/clerk-react";
// import {
//   Filter,
//   Loader2,
//   ChevronLeft,
//   ChevronRight,
//   Star,
//   Briefcase,
//   Hash,
//   X,
//   ChevronDown,
//   ChevronUp,
//   BookOpen,
//   Clock3,
//   Users,
//   Flag,
//   Merge,
//   Search,
//   KeyRound,
// } from "lucide-react";
// import ReactPlayer from "react-player/youtube";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Badge } from "./ui/badge";
// import { toast } from "react-toastify";
// import { ScrollArea } from "./ui/scroll-area";
// import { Checkbox } from "./ui/checkbox";
// import RenderSubscription from "./RenderSubscription";
// import SubscriptionDialogue from "./SubscriptionDialogue";
// import { UserDetailModal } from "./UserDetailModal";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog";
// import {
//   Sheet,
//   SheetContent,
//   SheetDescription,
//   SheetHeader,
//   SheetTitle,
//   SheetTrigger,
// } from "./ui/sheet";
// import Navbar from "./Navbar"; // Add this import
// import { set } from "lodash";
// import certificate from "../assets/certificate.png";

// const PREDEFINED_SUBTOPICS = [
//   "Selection",
//   "Filtering",
//   "Sorting",
//   "Limit",
//   "Aggregation",
//   "Group By",
//   "Having",
//   "Joins",
//   "Self Join",
//   "Cross Join",
//   "Conditional Statements",
//   "Case When",
//   "Date Functions",
//   "String Functions",
//   "Numeric Functions",
//   "Subquery",
//   "CTE",
//   "Ranking Functions",
//   "Window Functions",
//   "Top N",
//   "UNION",
//   "Regular Expressions",
//   "Time Functions",
// ];
// const PREDEFINED_PYTHON_TOPICS = [
//   "Array",
//   "String",
//   "Two Pointers",
//   "Sliding Window",
//   "Dictionary",
//   "List",
//   "Tuples",
//   "Regex",
// ];

// const PREDEFINED_COMPANIES = [
//   "Capgemini",
//   "NETFLIX",
//   "TCS",
//   "WIPRO",
//   "OYO",
//   "Bookbub",
//   "Muscleblaze",
//   "ZOMATO",
//   "Physics Wallah",
//   "Make My Trip",
//   "AMAZON",
//   "NVDIA",
//   "META",
//   "Book My Show",
//   "ORACLE",
//   "Instagram",
//   "Bajaj Finserv",
//   "SWIGGY",
//   "Media365",
//   "INFOSYS",
//   "INDIGO",
//   "MYNTRA",
//   "Red Bull",
//   "UPSTOX",
//   "Dream11",
//   "YOUTUBE",
//   "Cognizant",
//   "NESTLE",
//   "BigBasket",
//   "ISRO",
//   "WHEO",
//   "Shiprocket",
//   "GOOGLE",
//   "Linkedin",
//   "Formula 1",
//   "Uber Eats",
//   "Flipkart",
//   "Indigo Parking",
//   "UBER",
//   "Nike Training Club",
//   "AGODA",
// ];
// const PREDEFINED_YEARS = [
//   "2025",
//   "2024",
//   "2023",
//   "2022",
//   "2021",
//   "2020",
//   "2019",
//   "2018",
// ];

// const PREDEFINED_SUBHEADINGS = {
//   Selection: "Learn to retrieve specific data from tables using SELECT.",
//   Filtering: "Apply conditions with WHERE to extract meaningful records.",
//   Sorting: "Organize query results with ORDER BY for clear insights.",
//   Limit: "Restrict output rows using LIMIT for precise results.",
//   Aggregation: "Summarize data with functions like COUNT, SUM, AVG, MIN, MAX.",
//   "Group By": "Categorize data into groups for deeper analysis.",
//   Having: "Filter grouped results with HAVING for refined outputs.",
//   Joins: "Combine related data across multiple tables seamlessly.",
//   "Self Join": "Join a table to itself for hierarchical or recursive queries.",
//   "Cross Join": "Generate Cartesian products to explore all row combinations.",
//   "Conditional Statements":
//     "Control logic with IF and other conditions in queries.",
//   "Case When": "Build conditional outputs with CASE expressions.",
//   "Date Functions": "Manipulate and analyze date/time values effectively.",
//   "String Functions": "Clean, modify, and analyze text data in queries.",
//   "Numeric Functions": "Perform calculations and transformations on numbers.",
//   Subquery: "Use queries inside queries for complex filtering or calculations.",
//   CTE: "Simplify queries with reusable temporary results.",
//   "Ranking Functions":
//     "Rank, number, and order rows with advanced SQL functions.",
//   "Window Functions":
//     "Perform calculations across row sets without collapsing results.",
//   "Top N": "Extract top or bottom N records efficiently.",
//   UNION: "Combine results from multiple queries into one dataset.",
//   "Regular Expressions": "Search and match complex text patterns in data.",
//   "Time Functions": "Work with time values for detailed temporal analysis.",
// };

// const SQLIcon = () => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       viewBox="0 0 448 512"
//       className="h-9 w-9"
//       fill="currentColor"
//     >
//       <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"/>
//     </svg>
//   );
// };

// // A new, simple footer component
// const Footer = ({ isDarkMode }) => {
//   return (
//     <footer
//       className={`w-full py-4 mt-auto ${
//         isDarkMode ? "bg-[#1D1E23] text-gray-200" : "bg-gray-100 text-gray-800"
//       } border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
//     >
//       <div className="max-w-screen-2xl mx-auto px-6 text-center text-lg">
//         <span className="font-semibold text-teal-500">
//           DataSense:  
//         </span>
//         {" "}
//         All rights reserved, 2025
//       </div>
//     </footer>
//   );
// };


// export default function QuestionGallery() {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const navigateTo = useNavigate();
//   const [quizzes, setQuizzes] = useState([]);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
//   const [currentVideoId, setCurrentVideoId] = useState("");
//   const [isLoading, setIsLoading] = useState(true);
//   const [getUserID, setUserID] = useState("default");
//   const [isSubscriptionDialogueOpen, setIsSubscriptionDialogueOpen] =
//     useState(false);
//   const [subscriptionStatus, setSubscriptionStatus] = useState("");
//   const [filters, setFilters] = useState({
//     difficulties: [],
//     company: [],
//     subtopics: [],
//     year: [],
//     search: "",
//     unsolved: false,
//     solved: false,
//   });
//   const [itemsPerPage] = useState(10);
//   const [availableSubtopics] = useState(PREDEFINED_SUBTOPICS);
//   const [availableCompanies] = useState(PREDEFINED_COMPANIES);
//   const [bookmarkedQuizzes, setBookmarkedQuizzes] = useState(new Set());
//   const [solvedQuestions, setSolvedQuestions] = useState(new Set());
//   const [paginationInfo, setPaginationInfo] = useState({
//     total: 0,
//     totalPages: 0,
//     currentPage: parseInt(localStorage.getItem("currentPage") || "1", 10),
//     next: null,
//     previous: null,
//   });
//   const [currentPage, setCurrentPage] = useState(
//     parseInt(localStorage.getItem("currentPage") || "1", 10)
//   );
//   const [pageInput, setPageInput] = useState(
//     localStorage.getItem("currentPage") || "1"
//   );
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [openLesson, setOpenLesson] = useState(null);
//   const [lessonQuestions, setLessonQuestions] = useState({});
//   const [lessonLoading, setLessonLoading] = useState({});
//   const [expandedLessons, setExpandedLessons] = useState(new Set()); // NEW: State for expanded lessons

//   const firstLessonRef = useRef(null);

//   // States for search overlay
//   const [isSearchActive, setIsSearchActive] = useState(false);
//   const [searchResults, setSearchResults] = useState([]);
//   const [isSearching, setIsSearching] = useState(false);
//   const searchInputRef = useRef(null);

//   let subject =
//     new URLSearchParams(window.location.search).get("subject") || "mysql";
//   if (subject === "sql") {
//     subject = "mysql";
//   }
//   const STORAGE_KEY = "quiz-bookmarks";
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isPremiumPopupOpen, setIsPremiumPopupOpen] = useState(false);

//   useEffect(() => {
//     if (isLoaded && isSignedIn) {
//       setUserID(user.id);
//     }
//   }, [isLoaded, isSignedIn, user]);

//   useEffect(() => {
//     validateSubject();
//     checkAndBreakOutOfIframe();
//   }, [subject]);

//   // This effect now only fetches the main page questions
//   useEffect(() => {
//     if (!isSearchActive) {
//       fetchQuizzes();
//     }
//   }, [
//     paginationInfo.currentPage,
//     filters.unsolved,
//     filters.solved,
//     isSearchActive,
//   ]);

//   useEffect(() => {
//     if (user && user.id) {
//       console.log(user.id);
//       fetchBookmarks();
//       fetchSolvedQuestions();
//     }
//   }, [user]);

//   // Effect for handling the search functionality
//   useEffect(() => {
//     if (isSearchActive) {
//       // Focus the input when search becomes active
//       searchInputRef.current?.focus();

//       const hasActiveFilters =
//         filters.search.trim() !== "" ||
//         filters.difficulties.length > 0 ||
//         filters.company.length > 0 ||
//         filters.year.length > 0;

//       if (!hasActiveFilters) {
//         setSearchResults([]);
//         return;
//       }

//       const handler = setTimeout(() => {
//         setIsSearching(true);
//         axios
//           .get(`https://server.datasenseai.com/test-series-coding/${subject}`, {
//             params: {
//               page: 1,
//               limit: 50, // Fetch more results for search
//               difficulties: filters.difficulties.join(","),
//               companies: filters.company.join(","),
//               year: filters.year.join(","),
//               subtopics: filters.subtopics.join(","),
//               search: filters.search,
//               searchFields: "question_text,title,id",
//             },
//           })
//           .then((response) => {
//             setSearchResults(response.data.results || []);
//           })
//           .catch((error) => {
//             console.error("Error fetching search results:", error);
//             toast.error("Failed to fetch search results.");
//           })
//           .finally(() => {
//             setIsSearching(false);
//           });
//       }, 500); // 500ms debounce

//       return () => {
//         clearTimeout(handler);
//       };
//     }
//   }, [filters, isSearchActive, subject]);

//   const fetchQuizzes = useCallback(async () => {
//     // This function is now only for the main page list, not search
//     try {
//       setIsLoading(true);

//       let url = `https://server.datasenseai.com/test-series-coding/${subject}`;

//       let params = {
//         page: paginationInfo.currentPage,
//         limit: itemsPerPage,
//         difficulties: "", // Filters are cleared for main view, only bookmark/solved apply
//         companies: "",
//         year: "",
//         subtopics: "",
//         search: "",
//         searchFields: "question_text,title,id",
//       };

//       const response = await axios.get(url, { params });

//       if (response.data && typeof response.data === "object") {
//         let { total, totalPages, currentPage, next, previous, results } =
//           response.data;


//         if (Array.isArray(results)) {
//           let filteredQuizzes = results;
          
//           if (filters.solved) {
//             filteredQuizzes = filteredQuizzes.filter((quiz) =>
//               solvedQuestions.has(quiz._id)
//             );
//           }
//           if (filters.unsolved) {
//             filteredQuizzes = filteredQuizzes.filter((quiz) =>
//               !solvedQuestions.has(quiz._id)
//             );
//           }

//           setQuizzes(filteredQuizzes);
//           const savedPage = parseInt(
//             localStorage.getItem("currentPage") || "1",
//             10
//           );

//           setPaginationInfo({
//             total: total || 0,
//             totalPages: totalPages || 1,
//             currentPage: currentPage || savedPage,
//             next,
//             previous,
//           });
//           setCurrentPage(savedPage || currentPage);
//         } else {
//           console.error(
//             "Unexpected response structure: results is not an array",
//             response.data
//           );
//           toast.error(
//             "Received unexpected data format. Please try again later."
//           );
//         }
//       } else {
//         console.error("Unexpected response structure:", response.data);
//         toast.error("Received unexpected data format. Please try again later.");
//       }
//     } catch (error) {
//       console.error("Error fetching quizzes:", error);
//       toast.error("Failed to fetch quizzes. Please try again later.");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [
//     subject,
//     paginationInfo.currentPage,
//     itemsPerPage,
//     getUserID,
//     filters.unsolved,
//     filters.solved,
//   ]);

//   const [loadedLessons, setLoadedLessons] = useState(new Set());


//   const fetchLessonQuestions = useCallback(
//     async (subtopic) => {
//       try {
//         setLessonLoading((prev) => ({ ...prev, [subtopic]: true }));

//         let url = `https://server.datasenseai.com/test-series-coding/${subject}`;
//         const params = {
//           page: 1,
//           limit: 100,
//           difficulties: filters.difficulties.join(","),
//           companies: filters.company.join(","),
//           year: filters.year.join(","),
//           subtopics: subtopic,
//           search: filters.search,
//           searchFields: "question_text,title,id",
//         };

//         const response = await axios.get(url, { params });
//         let results = response?.data?.results || [];

//         if (filters.solved) {
//           results = results.filter((quiz) => solvedQuestions.has(quiz._id));
//         }
//         if (filters.unsolved) {
//             results = results.filter((quiz) => !solvedQuestions.has(quiz._id));
//         }

//         setLessonQuestions((prev) => ({ ...prev, [subtopic]: results }));
//         setLoadedLessons((prev) => new Set([...prev, subtopic]));
//       } catch (err) {
//         console.error("Error fetching lesson questions:", err);
//         toast.error("Failed to load questions for this lesson");
//       } finally {
//         setLessonLoading((prev) => ({ ...prev, [subtopic]: false }));
//       }
//     },
//     [subject, filters, solvedQuestions, getUserID]
//   );

//   const fetchBookmarks = async () => {
//     if (!user || !user.id) return;

//     try {
//       const response = await fetch(
//         `https://server.datasenseai.com/bookmark/bookmarks/${user.id}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         const bookmarkSet = new Set(data.bookmarks);
//         setBookmarkedQuizzes(bookmarkSet);
//       } else {
//         throw new Error("Failed to fetch bookmarks");
//       }
//     } catch (error) {
//       console.error("Error fetching bookmarks:", error);
//       toast.error("Failed to fetch bookmarks. Please try again later.");
//     }
//   };

//   const fetchSolvedQuestions = async () => {
//     if (!user || !user.id) return;

//     try {
//       const response = await fetch(
//         `https://server.datasenseai.com/question-attempt/solved/${user.id}`
//       );
//       if (response.ok) {
//         const data = await response.json();
//         const solvedSet = new Set(
//           data.solvedQuestions.filter((item) => item !== null)
//         );
//         setSolvedQuestions(solvedSet);
//         console.log(solvedSet);
//       } else {
//         throw new Error("Failed to fetch solved questions");
//       }
//     } catch (error) {
//       console.error("Error fetching solved questions:", error);
//       toast.error("Failed to fetch solved questions. Please try again later.");
//     }
//   };

//   const updateFilters = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//     }));

//     // For main page, we reset pagination. For search, it's handled by its own effect.
//     if (!isSearchActive) {
//       const newPage = 1;
//       setCurrentPage(newPage);
//       localStorage.setItem("currentPage", newPage.toString());
//       setPageInput(newPage.toString());
//       setPaginationInfo((prev) => ({ ...prev, currentPage: newPage }));
//     }
//   };

//   const openVideoPopup = (quiz) => {
//     if (quiz.video) {
//       const videoId = extractYoutubeId(quiz.video);
//       if (videoId) {
//         setCurrentVideoId(`https://www.youtube.com/watch?v=${videoId}`);
//         setIsVideoPopupOpen(true);
//       } else {
//         console.error("Invalid YouTube URL:", quiz.video);
//         toast.error("Invalid YouTube URL");
//       }
//     } else {
//       console.log("No video available for this quiz");
//       toast.info("Video coming soon...");
//     }
//   };

//   const extractYoutubeId = (url) => {
//     const regExp =
//       /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
//     const match = url.match(regExp);
//     return match && match[2].length === 11 ? match[2] : null;
//   };

//   const closeVideoPopup = () => {
//     setIsVideoPopupOpen(false);
//     setCurrentVideoId("");
//   };

//   const checkAndBreakOutOfIframe = () => {
//     if (window.self !== window.top) {
//       const currentUrl = window.location.href;
//       const storageKey = "iframeBreakoutAttempt";
//       const breakoutAttempt = sessionStorage.getItem(storageKey);

//       if (!breakoutAttempt) {
//         sessionStorage.setItem(storageKey, "true");
//         window.top.location.href = currentUrl;
//       } else {
//         sessionStorage.removeItem(storageKey);
//       }
//     }
//   };

//   const normalizeDifficulty = (difficulty) => {
//     if (!difficulty) {
//       return "easy";
//     }

//     const normalized = difficulty.toLowerCase();
//     if (normalized === "advance" || normalized === "advanced") {
//       return "advanced";
//     }

//     return normalized;
//   };

//   const getDifficultyStyle = (difficulty) => {
//     const normalizedDifficulty = normalizeDifficulty(difficulty);
//     switch (normalizedDifficulty) {
//       case "easy":
//         return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
//       case "medium":
//         return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
//       case "advance":
//       case "advanced":
//         return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
//       default:
//         return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
//     }
//   };

//   const capitalizeFirstLetter = (string) => {
//     if (!string || typeof string !== "string") {
//       return "";
//     }
//     return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
//   };

//   const validateSubject = () => {
//     const validSubjects = ["mysql", "python", "tableau", "excel", "powerbi"];

//     if (!subject) {
//       toast.error("URL is malformed. Subject is missing.");
//       redirectToHomePage();
//     } else if (!validSubjects.includes(subject.toLowerCase())) {
//       toast.error("URL is malformed. Invalid subject.");
//       redirectToHomePage();
//     } else if (
//       ["excel", "powerbi", "tableau"].includes(subject.toLowerCase())
//     ) {
//       redirectToScenarioPage(subject.toLowerCase());
//     }
//     // Removed fetchQuizzes() from here to avoid double fetch on load
//   };

//   const redirectToHomePage = () => {
//     window.top.location.href = "https://practice.datasenseai.com/";
//   };

//   const redirectToScenarioPage = (subject) => {
//     window.location.href = `/scenario-area?subject=${subject}`;
//   };

//   const removeQuizTypePrefix = (quizName) => {
//     return quizName.replace(/^(sql:|python:|mcq:)\s*/i, "");
//   };

//   const toggleBookmark = async (quizId, e) => {
//     e.stopPropagation();

//     if (!user || !user.id) {
//       toast.error("Please sign in to bookmark questions.");
//       return;
//     }

//     const isCurrentlyBookmarked = bookmarkedQuizzes.has(quizId);
//     const endpoint = isCurrentlyBookmarked ? "unbookmark" : "bookmark";

//     try {
//       const newBookmarks = new Set(bookmarkedQuizzes);
//       if (isCurrentlyBookmarked) {
//         newBookmarks.delete(quizId);
//       } else {
//         newBookmarks.add(quizId);
//       }
//       setBookmarkedQuizzes(newBookmarks);

//       const response = await fetch(
//         `https://server.datasenseai.com/bookmark/${endpoint}`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             clerkId: getUserID,
//             questionId: quizId,
//           }),
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to ${endpoint} question`);
//       }

//       await response.json();
//       toast.success(
//         isCurrentlyBookmarked
//           ? "Removed from bookmarks!"
//           : "Added to bookmarks!"
//       );
//     } catch (error) {
//       console.error("Error updating bookmark:", error);
//       const revertedBookmarks = new Set(bookmarkedQuizzes);
//       setBookmarkedQuizzes(revertedBookmarks);

//       toast.error(
//         `Failed to ${
//           isCurrentlyBookmarked ? "remove" : "add"
//         } bookmark. Please try again.`
//       );
//     }
//   };

//   const handleStartQuiz = async (quizID, userID, quizName, subtopic) => {
//     let route = "/quiz";
//     if (subject.toLowerCase() === "python") {
//       route = "/pyQuiz";
//     }

//     if (!isSignedIn) {
//       alert(`You're not logged in`);
//       return;
//     }

//     const userRegistered = localStorage.getItem("userRegistered");

//     const buildUrl = () => {
//       let url = `${route}?questionID=${quizID}&userID=${userID}`;
//       if (subtopic) {
//         url += `&subtopic=${encodeURIComponent(subtopic)}`;
//       }
//       return url;
//     };

//     if (process.env.NODE_ENV === "development") {
//       window.open(buildUrl(), "_blank");
//       return;
//     }

//     if (userRegistered === "true") {
//       window.open(buildUrl(), "_blank");
//       return;
//     }

//     try {
//       const effectiveUserID = userID || "default";

//       const response = await fetch(
//         `https://server.datasenseai.com/user-details/profile-status/${effectiveUserID}`
//       );
//       const data = await response.json();

//       if (response.ok) {
//         if (data.isProfileComplete) {
//           localStorage.setItem("userRegistered", "true");
//           window.open(
//             `${route}?questionID=${quizID}&userID=${effectiveUserID}`,
//             "_blank"
//           );
//         } else {
//           setIsModalOpen(true);
//         }
//       } else {
//         console.warn("Profile status check failed, proceeding anyway");
//         window.open(
//           `${route}?questionID=${quizID}&userID=${effectiveUserID}`,
//           "_blank"
//         );
//       }
//     } catch (error) {
//       console.error("Error while checking user profile status:", error);
//       window.open(
//         `${route}?questionID=${quizID}&userID=${userID || "default"}`,
//         "_blank"
//       );
//     }
//   };

//   const handleModalClose = (success) => {
//     setIsModalOpen(false);
//     if (success) {
//       alert("Details are recorded, You can attempt the question now");
//     }
//   };

//   const handlePageChange = useCallback(
//     (newPage) => {
//       setPageInput(newPage.toString());
//       if (
//         newPage >= 1 &&
//         newPage <= paginationInfo.totalPages &&
//         newPage !== currentPage
//       ) {
//         setCurrentPage(newPage);
//         localStorage.setItem("currentPage", newPage.toString());
//         setPageInput(newPage.toString());
//         setPaginationInfo((prev) => ({ ...prev, currentPage: newPage }));
//         window.scrollTo(0, 0);
//       }
//     },
//     [paginationInfo.totalPages, currentPage]
//   );

//   const renderPaginationButtons = useCallback(() => {
//     const pageNumbers = [];
//     const totalPages = paginationInfo.totalPages;
//     const currentPage = paginationInfo.currentPage;

//     let startPage = Math.max(1, currentPage - 2);
//     let endPage = Math.min(totalPages, startPage + 4);

//     if (endPage - startPage < 4) {
//       startPage = Math.max(1, endPage - 4);
//     }

//     if (startPage > 1) {
//       pageNumbers.push(
//         <Button
//           key={1}
//           onClick={() => handlePageChange(1)}
//           variant="outline"
//           size="sm"
//           className={
//             isDarkMode
//               ? "bg-[#2f2f2f] border-[#3f3f3f] text-white"
//               : "bg-white border-[#3f3f3f] text-black"
//           }
//         >
//           1
//         </Button>
//       );
//       if (startPage > 2) {
//         pageNumbers.push(
//           <span
//             key="ellipsis1"
//             className={isDarkMode ? "text-white" : "text-black"}
//           >
//             ...
//           </span>
//         );
//       }
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pageNumbers.push(
//         <Button
//           key={i}
//           onClick={() => handlePageChange(i)}
//           variant="outline"
//           size="sm"
//           className={
//             i === currentPage
//               ? isDarkMode
//                 ? "bg-white text-white border-[#3f3f3f]"
//                 : "bg-[#2f2f2f] text-white border-[#3f3f3f]"
//               : isDarkMode
//               ? "bg-[#2f2f2f] border-[#3f3f3f] text-white"
//               : "bg-white border-[#3f3f3f] text-black"
//           }
//         >
//           {i}
//         </Button>
//       );
//     }

//     if (endPage < totalPages) {
//       if (endPage < totalPages - 1) {
//         pageNumbers.push(<span key="ellipsis2">...</span>);
//       }
//       pageNumbers.push(
//         <Button
//           key={totalPages}
//           onClick={() => handlePageChange(totalPages)}
//           variant="outline"
//           size="sm"
//           className={
//             isDarkMode
//               ? "bg-[#2f2f2f] border-[#3f3f3f] text-white"
//               : "bg-white border-[#3f3f3f] text-black"
//           }
//         >
//           {totalPages}
//         </Button>
//       );
//     }

//     return pageNumbers;
//   }, [
//     paginationInfo.totalPages,
//     paginationInfo.currentPage,
//     isDarkMode,
//     handlePageChange,
//   ]);

//   const handleGoToPage = () => {
//     const page = parseInt(pageInput, 10);
//     if (page >= 1 && page <= paginationInfo.totalPages) {
//       handlePageChange(page);
//     } else {
//       toast.error(
//         `Please enter a valid page number between 1 and ${paginationInfo.totalPages}`
//       );
//     }
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen((prev) => !prev);
//   };

//   useEffect(() => {
//     const savedPage = localStorage.getItem("currentPage");
//     if (savedPage !== null) {
//       setCurrentPage(parseInt(savedPage, 10));
//     }
//   }, []);

//   useEffect(() => {
//     if (openLesson && !lessonQuestions[openLesson]) {
//       fetchLessonQuestions(openLesson);
//     }
//   }, [openLesson, lessonQuestions, fetchLessonQuestions]);


//   useEffect(() => {
//     setLessonQuestions({});
//     setLoadedLessons(new Set());
//     setExpandedLessons(new Set()); // NEW: Reset expanded state on filter change
//   }, [
//     filters.difficulties,
//     filters.company,
//     filters.year,
//     filters.unsolved,
//     filters.solved,
//   ]);

//   const handleToggleLesson = (subtopic) => {
//     if (openLesson === subtopic) {
//       setOpenLesson(null);
//       return;
//     }
//     setOpenLesson(subtopic);
//     if (!lessonQuestions[subtopic]) {
//       fetchLessonQuestions(subtopic);
//     }
//   };

//   // NEW: Handler for "Show More" / "Show Less"
//   const handleToggleExpand = (subtopic) => {
//     setExpandedLessons(prev => {
//         const newSet = new Set(prev);
//         if (newSet.has(subtopic)) {
//             newSet.delete(subtopic);
//         } else {
//             newSet.add(subtopic);
//         }
//         return newSet;
//     });
//   };

//   const handleStartLearning = () => {
//     const firstSubtopic = PREDEFINED_SUBTOPICS[0];
//     if (firstSubtopic) {
//       setOpenLesson(firstSubtopic);
//       firstLessonRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "start",
//       });
//     }
//   };

//   return (
//     <div
//       className={`font-sans flex flex-col min-h-screen ${
//         isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100"
//       }`}
//     >
//       <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

//       {/* Search Overlay */}
//       <div
//         className={`mt-14 fixed inset-0 z-40 transition-opacity duration-300 ${
//           isSearchActive
//             ? "bg-black/60 backdrop-blur-sm"
//             : "bg-transparent pointer-events-none"
//         }`}
//         onClick={() => setIsSearchActive(false)}
//       >
//         <div
//           className={`w-full transition-transform duration-300 ease-in-out ${
//             isDarkMode ? "bg-[#25272C]" : "bg-white"
//           } ${isSearchActive ? "translate-y-0" : "-translate-y-full"}`}
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* CHANGE: Removed max-width and centering classes, adjusted padding */}
//           <div className="p-6">
//             <div className="flex items-center gap-4">
//               <Search
//                 className={`h-6 w-6 flex-shrink-0 ${
//                   isDarkMode ? "text-gray-400" : "text-gray-600"
//                 }`}
//               />
//               <Input
//                 ref={searchInputRef}
//                 type="text"
//                 placeholder="Search questions by title, ID, or keyword..."
//                 value={filters.search}
//                 onChange={(e) => updateFilters("search", e.target.value)}
//                 className={`w-full h-14 text-lg ${
//                   isDarkMode
//                     ? "bg-[#2f2f2f] border-[#3f3f3f] text-white"
//                     : "bg-gray-50 border-gray-300"
//                 }`}
//               />
//               <Button
//                 variant="ghost"
//                 size="icon"
//                 onClick={() => setIsSearchActive(false)}
//               >
//                 <X
//                   className={`h-6 w-6 ${
//                     isDarkMode ? "text-gray-400" : "text-gray-600"
//                   }`}
//                 />
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
//                     <div key={quiz._id} className="p-3">
//                       <div className="grid grid-cols-12 gap-5 items-center">
//                         <div className="col-span-12 md:col-span-6">
//                           <h3
//                             className={`text-sm md:text-base font-medium ${
//                               isDarkMode ? "text-[#3E74D1]" : "text-[#4079DA]"
//                             }`}
//                           >
//                             {quiz.id ? quiz.id.toUpperCase() + " " : ""}
//                             {quiz.title ??
//                               removeQuizTypePrefix(quiz.question_text)}
//                           </h3>
//                         </div>
//                         <div className="col-span-6 md:col-span-3 flex flex-wrap gap-1 md:justify-start">
//                           {quiz.company &&
//                             quiz.company.map((company, compIndex) => (
//                               <Badge
//                                 key={compIndex}
//                                 variant="secondary"
//                                 className={`${
//                                   isDarkMode
//                                     ? "bg-purple-900 text-purple-200"
//                                     : "bg-purple-100 text-purple-700"
//                                 } flex items-center gap-1`}
//                               >
//                                 <Briefcase className="h-3 w-3" />
//                                 {company}
//                               </Badge>
//                             ))}
//                         </div>
//                         <div className="col-span-3 md:col-span-1">
//                           <Badge
//                             className={`px-2 py-1 rounded-full font-semibold text-xs ${getDifficultyStyle(
//                               quiz.difficulty
//                             )}`}
//                           >
//                             {capitalizeFirstLetter(quiz.difficulty)}
//                           </Badge>
//                         </div>
//                         <div className="col-span-12 md:col-span-2 md:justify-self-end flex justify-end">
//                           <Button
//                             onClick={() =>
//                               handleStartQuiz(
//                                 quiz._id,
//                                 user?.id,
//                                 quiz.question_text
//                               )
//                             }
//                             className={`${
//                               isDarkMode
//                                 ? "bg-cyan-700 hover:bg-cyan-600"
//                                 : "bg-cyan-600 hover:bg-cyan-700"
//                             } text-white px-4 py-2`}
//                           >
//                             Solve
//                           </Button>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-10 text-gray-500">
//                   <p>No results found. Try adjusting your search.</p>
//                 </div>
//               )}
//             </ScrollArea>
//           </div>
//         </div>
//       </div>

//       <main className="flex-1 flex gap-4 px-0 md:px-6">
//         <UserDetailModal
//           open={isModalOpen}
//           onOpenChange={setIsModalOpen}
//           onClose={handleModalClose}
//         />

//         <SubscriptionDialogue
//           isOpen={isSubscriptionDialogueOpen}
//           onClose={() => setIsSubscriptionDialogueOpen(false)}
//           status={subscriptionStatus}
//         />

//         <div className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col gap-4 p-4">
//           <div className="flex items-center justify-between gap-4">
//             <div className="flex-1">
//               <div
//                 className={`w-full rounded-lg px-4 py-3 flex items-center gap-4 ${
//                   isDarkMode ? "text-white" : "text-white"
//                 }`}
//                 style={{
//                   background: isDarkMode
//                     ? "linear-gradient(90deg,rgb(53, 54, 55) 0%,rgb(29, 30, 35) 100%)"
//                     : "linear-gradient(90deg,rgb(53, 54, 55) 0%,rgb(237, 240, 240) 100%)",
//                 }}
//               >
//                 <Merge className="h-4 w-4 text-cyan-300 font-bold" />
//                 <div className="text-sm md:text-[15px] font-medium">
//                   This path is a part of SQL Learning Roadmap
//                 </div>
//                 <a
//                   href="https://dashboard.datasenseai.com/sql-journey"
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className={`pl-10 ${
//                     isDarkMode
//                       ? "text-cyan-300 hover:text-cyan-200"
//                       : "text-cyan-300 hover:text-cyan-200"
//                   } text-sm font-semibold underline`}
//                 >
//                   View Roadmap
//                 </a>
//               </div>
//             </div>

//             <div className="">
//               <button
//                 onClick={() => setIsSearchActive(true)}
//                 className={`w-full max-w-md flex items-center gap-2 text-left p-2 rounded-lg border ${
//                   isDarkMode
//                     ? "bg-[#2f2f2f] border-[#3f3f3f] text-gray-400"
//                     : "bg-white border-gray-300 text-gray-500"
//                 }`}
//               >
//                 <Search className="h-4 w-4" />
//                 Search questions...
//               </button>
//             </div>

//             <div className="">
//               <Button onClick={() => navigateTo("/question-area?subject=sql")}>
//                 Question Gallery
//               </Button>
//             </div>
//           </div>
//           <div className="flex gap-6">
//             {/* Main Content */}
//             <div className="flex-1 max-w-5xl py-4">
//               <div
//                 className={`relative overflow-hidden rounded-2xl p-6 md:p-7 mb-6 text-white shadow-lg ${
//                   isDarkMode ? "" : ""
//                 }`}
//                 style={{
//                   backgroundImage:
//                     `${isDarkMode ? "" : ""}` +
//                     `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),` +
//                     `linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px),` +
//                     `${
//                       isDarkMode
//                         ? "linear-gradient(180deg, #1eafaf 0%, #126464 100%)"
//                         : "linear-gradient(180deg, #1eafaf 0%, #126464 100%)"
//                     }`,
//                   backgroundSize: "32px 32px, 32px 32px, cover",
//                   backgroundPosition: "0 0, 0 0, 0 0",
//                   border: isDarkMode
//                     ? "1px solid rgba(255,255,255,0.12)"
//                     : "1px solid rgba(255,255,255,0.25)",
//                 }}
//               >
//                 <div className="flex flex-col gap-5">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-3">
//                       <div
//                         className={`h-14 w-14 rounded-xl flex items-center justify-center ${
//                           isDarkMode ? "bg-white/10" : "bg-white/20"
//                         }`}
//                       >
//                         <SQLIcon />
//                       </div>
//                       <div className="flex items-center gap-2 ml-auto">
//                         <span
//                           className={`text-xs px-5 py-2 rounded-lg backdrop-blur ${
//                             isDarkMode
//                               ? "bg-[#abfff9] text-black"
//                               : "bg-[#abfff9] text-black"
//                           }`}
//                         >
//                           🏅 Certification Available
//                         </span>
//                         <span
//                           className={`text-xs px-5 py-2 rounded-lg backdrop-blur font-bold bg-[#FFF9D8] text-[#FFB039]`}
//                         >
//                           ★ 4.6 (3.5k+)
//                         </span>
//                       </div>
//                     </div>
//                     <h2 className="text-3xl md:text-[32px] font-extrabold tracking-tight">
//                       SQL Practice Queries
//                     </h2>
//                     <p
//                       className={`mt-2 text-base ${
//                         isDarkMode ? "text-white/85" : "text-white/95"
//                       }`}
//                     >
//                       Work through practical SQL queries covering Select, Where,
//                       Limit, Order By, Aggregate functions, Group By, Joins,
//                       Subqueries, and Case statements. Tackle hands-on exercises
//                       based on real-world scenarios.
//                     </p>
//                     <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-5 text-white/90 text-base">
//                       <div className="flex items-center gap-2">
//                         <BookOpen className="h-4 w-4" /> 23 Lessons
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Clock3 className="h-4 w-4" /> 100+ Hours
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Star className="h-4 w-4" /> 500 Problems
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Users className="h-4 w-4" /> 28.5k Learners
//                       </div>
//                       <div className="flex items-center gap-2">
//                         <Flag className="h-4 w-4" /> Advanced Level
//                       </div>
//                     </div>
//                   </div>
//                   <div className="mt-4">
//                     <div className="flex items-center gap-4 w-full">
//                       <div className="flex-1">
//                         <div className="text-lg mb-2">
//                           Your Progress :{" "}
//                           <span className="font-semibold text-green-400">
//                             {`${Math.round(
//                               (Array.from(solvedQuestions).length /
//                                 Math.max(quizzes.length, 1)) *
//                                 100
//                             )}%`}{" "}
//                             Completed
//                           </span>
//                         </div>
//                         <div
//                           className={`h-2 rounded-full ${
//                             isDarkMode ? "bg-white/15" : "bg-white/40"
//                           }`}
//                         >
//                           <div
//                             className={`h-2 rounded-full ${
//                               isDarkMode ? "bg-green-400" : "bg-green-300"
//                             }`}
//                             style={{
//                               width: `${Math.min(
//                                 100,
//                                 Math.round(
//                                   (Array.from(solvedQuestions).length /
//                                     Math.max(quizzes.length, 1)) *
//                                     100
//                                 )
//                               )}%`,
//                             }}
//                           />
//                         </div>
//                       </div>
//                       <Button
//                         onClick={handleStartLearning}
//                         className={`${
//                           isDarkMode
//                             ? "bg-white text-[#12325d] hover:bg-white/90"
//                             : "bg-white text-[#12325d] hover:bg-white/95"
//                         } font-semibold px-6 py-5 rounded-xl whitespace-nowrap flex-shrink-0`}
//                       >
//                         Start Learning
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-3">
//                 {PREDEFINED_SUBTOPICS.map((subtopic, idx) => (
//                   <div
//                     key={subtopic}
//                     ref={idx === 0 ? firstLessonRef : null}
//                     className={`py-5 ${
//                       isDarkMode ? "bg-[#32363C]" : "bg-gray-50"
//                     } rounded-lg border ${
//                       isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"
//                     }`}
//                   >
//                     <button
//                       onClick={() => handleToggleLesson(subtopic)}
//                       className={`w-full flex items-start justify-between px-4 py-3 ${
//                         isDarkMode ? "text-gray-100" : "text-gray-800"
//                       }`}
//                     >
//                       <div className="flex flex-col items-start gap-1">
//                         <span
//                           className={`text-2xl font-bold ${
//                             isDarkMode ? "text-gray-100" : "text-gray-800"
//                           }`}
//                         >
//                           {idx + 1}. {subtopic}
//                         </span>
//                         <span
//                           className={`text-base ${
//                             isDarkMode ? "text-gray-500" : "text-gray-500"
//                           }`}
//                         >
//                           {PREDEFINED_SUBHEADINGS[subtopic] || ""}
//                         </span>
//                       </div>
//                       {openLesson === subtopic ? (
//                         <ChevronUp className="h-7 w-7" />
//                       ) : (
//                         <ChevronDown className="h-7 w-7" />
//                       )}
//                     </button>
//                     {openLesson === subtopic && (
//                       <div className="mt-2">
//                         <div
//                           className={`hidden md:grid grid-cols-12 gap-6 px-8 py-2 ${
//                             isDarkMode ? "text-gray-300" : "text-gray-700"
//                           }`}
//                         >
//                           <div className="col-span-5 text-sm font-semibold">
//                             Problem name
//                           </div>
//                           <div className="col-span-2 text-sm font-semibold">
//                             Company
//                           </div>
//                           <div className="col-span-2 text-sm font-semibold">
//                             Status
//                           </div>
//                           <div className="col-span-1 text-sm font-semibold">
//                             Difficulty
//                           </div>
//                           <div className="col-span-2 text-sm font-semibold text-right pr-2">
//                             &nbsp;
//                           </div>
//                         </div>
//                         {lessonLoading[subtopic] ? (
//                           <div className="flex items-center gap-2 p-4">
//                             <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
//                             <span
//                               className={`${
//                                 isDarkMode ? "text-gray-300" : "text-gray-700"
//                               }`}
//                             >
//                               Loading questions...
//                             </span>
//                           </div>
//                         ) : (lessonQuestions[subtopic] || []).length === 0 ? (
//                           <div
//                             className={`p-4 ${
//                               isDarkMode ? "text-gray-400" : "text-gray-600"
//                             }`}
//                           >
//                             No questions found for selected filters.
//                           </div>
//                         ) : (() => {
//                               // NEW: Logic for Show More/Less
//                               const questions = lessonQuestions[subtopic] || [];
//                               const INITIAL_LIMIT = 8;
//                               const isExpanded = expandedLessons.has(subtopic);
//                               const questionsToShow = isExpanded ? questions : questions.slice(0, INITIAL_LIMIT);

//                               return (
//                                 <>
//                                   <div className="p-3 space-y-3">
//                                     {questionsToShow.map((quiz) => (
//                                       <div key={quiz._id} className="p-3">
//                                         <div className="grid grid-cols-12 gap-5 items-center">
//                                           <div className="col-span-12 md:col-span-5">
//                                             <h3
//                                               className={`text-sm md:text-base font-medium ${
//                                                 isDarkMode
//                                                   ? "text-blue-400"
//                                                   : "text-blue-600"
//                                               }`}
//                                             >
//                                               {quiz.id
//                                                 ? quiz.id.toUpperCase() + " "
//                                                 : ""}
//                                               {quiz.title ??
//                                                 removeQuizTypePrefix(
//                                                   quiz.question_text
//                                                 )}
//                                             </h3>
//                                           </div>
//                                           <div className="col-span-6 md:col-span-2 flex flex-wrap gap-1 md:justify-start">
//                                             {quiz.company &&
//                                               quiz.company.map((company, compIndex) => (
//                                                 <Badge
//                                                   key={compIndex}
//                                                   variant="secondary"
//                                                   className={`${
//                                                     isDarkMode
//                                                       ? "bg-purple-900 text-purple-200"
//                                                       : "bg-purple-100 text-purple-700"
//                                                   } flex items-center gap-1`}
//                                                 >
//                                                   <Briefcase className="h-3 w-3" />
//                                                   {company}
//                                                 </Badge>
//                                               ))}
//                                           </div>
//                                           <div className="col-span-3 md:col-span-2">
//                                             {solvedQuestions.has(quiz._id) ? (
//                                               <Badge
//                                                 variant="success"
//                                                 className={
//                                                   isDarkMode
//                                                     ? "bg-green-900 text-green-200"
//                                                     : "bg-green-100 text-green-700"
//                                                 }
//                                               >
//                                                 Solved
//                                               </Badge>
//                                             ) : (
//                                               <Badge
//                                                 className={
//                                                   isDarkMode
//                                                     ? "bg-gray-700 text-gray-200"
//                                                     : "bg-gray-100 text-gray-700"
//                                                 }
//                                               >
//                                                 Unsolved
//                                               </Badge>
//                                             )}
//                                           </div>
//                                           <div className="col-span-3 md:col-span-1">
//                                             <Badge
//                                               className={`px-2 py-1 rounded-full font-semibold text-xs ${getDifficultyStyle(
//                                                 quiz.difficulty
//                                               )}`}
//                                             >
//                                               {capitalizeFirstLetter(quiz.difficulty)}
//                                             </Badge>
//                                           </div>
//                                           <div className="col-span-12 md:col-span-2 md:justify-self-end flex justify-end">
//                                             <Button
//                                               onClick={() =>
//                                                 handleStartQuiz(
//                                                   quiz._id,
//                                                   user?.id,
//                                                   quiz.question_text,
//                                                   subtopic
//                                                 )
//                                               }
//                                               className={`${
//                                                 isDarkMode
//                                                   ? "bg-cyan-700 hover:bg-cyan-600"
//                                                   : "bg-cyan-600 hover:bg-cyan-700"
//                                               } text-white`}
//                                             >
//                                               Solve
//                                             </Button>
//                                           </div>
//                                         </div>
//                                       </div>
//                                     ))}
//                                   </div>
//                                   {questions.length > INITIAL_LIMIT && (
//                                     <div className="px-6 pb-2 text-center">
//                                       <Button
//                                         variant="link"
//                                         className="text-cyan-600 dark:text-cyan-400"
//                                         onClick={() => handleToggleExpand(subtopic)}
//                                       >
//                                         {isExpanded ? "Show Less <<<" : "Show More >>>"}
//                                       </Button>
//                                     </div>
//                                   )}
//                                 </>
//                               );
//                             })()}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Right Sidebar */}
//             <aside className="hidden xl:block w-[450px] py-4">
//               <div
//                 className={`rounded-xl overflow-hidden mb-4 shadow ${
//                   isDarkMode ? "bg-[#32363C]" : "bg-white"
//                 }`}
//               >
//                 <div
//                   className={`p-4 ${
//                     isDarkMode
//                       ? "bg-[#32363C]"
//                       : "bg-gradient-to-b from-slate-100 to-white"
//                   } border-b ${
//                     isDarkMode ? "border-white/10" : "border-gray-200"
//                   }`}
//                 >
//                   <div className="h-48 rounded-lg flex items-center justify-center">
//                     <img
//                       className="h-48 w-68"
//                       src={certificate}
//                       alt="certificate"
//                     />
//                   </div>
//                   <div className="flex items-center gap-2 mt-3">
//                     <span
//                       className={`text-[11px] px-2 py-1 rounded-full ${
//                         isDarkMode
//                           ? "bg-white/10 text-white"
//                           : "bg-blue-50 text-blue-700"
//                       } border ${
//                         isDarkMode ? "border-white/15" : "border-blue-200"
//                       }`}
//                     >
//                       Certification available
//                     </span>
//                     <span
//                       className={`text-[11px] px-2 py-1 rounded-full ${
//                         isDarkMode
//                           ? "bg-white/10 text-white"
//                           : "bg-emerald-50 text-emerald-700"
//                       } border ${
//                         isDarkMode ? "border-white/15" : "border-emerald-200"
//                       }`}
//                     >
//                       Included in premium
//                     </span>
//                   </div>
//                 </div>
//                 <div className="p-4">
//                   <h3
//                     className={`text-base font-semibold ${
//                       isDarkMode ? "text-white" : "text-gray-900"
//                     }`}
//                   >
//                     Certificate on Completion
//                   </h3>
//                   <p
//                     className={`${
//                       isDarkMode ? "text-gray-300" : "text-gray-600"
//                     } text-base mt-2`}
//                   >
//                     On completing all the lessons in this course, you'll get a
//                     course completion certificate.
//                   </p>
//                   <Button
//                     className={`mt-3 w-full ${
//                       isDarkMode
//                         ? "bg-cyan-700 hover:bg-cyan-600"
//                         : "bg-cyan-600 hover:bg-cyan-700"
//                     } text-white opacity-50 cursor-not-allowed`}
//                   >
//                     View Certificate
//                   </Button>
//                 </div>
//               </div>

//               <div
//                 className={`rounded-xl overflow-hidden shadow ${
//                   isDarkMode ? "bg-[#32363C]" : "bg-white"
//                 }`}
//               >
//                 <div className="p-4">
//                   <h3
//                     className={`text-base font-semibold ${
//                       isDarkMode ? "text-white" : "text-gray-900"
//                     }`}
//                   >
//                     Prerequisite course
//                   </h3>
//                   <p
//                     className={`${
//                       isDarkMode ? "text-gray-300" : "text-gray-600"
//                     } text-base mt-2`}
//                   >
//                     We recommend you complete this course first before you jump
//                     into SQL Practice Queries. This will help you understand
//                     even better.
//                   </p>

//                   <div
//                     className={`mt-4 rounded-lg p-3 ${
//                       isDarkMode
//                         ? "bg-gradient-to-t from-[#25272C] to-[#4D4D4D]"
//                         : "bg-slate-50"
//                     }`}
//                   >
//                     <div className="flex items-start gap-3">
//                       <div
//                         className={`h-10 w-10 rounded-md flex items-center justify-center ${
//                           isDarkMode ? "bg-white/10" : "bg-white"
//                         } ring-1 ${
//                           isDarkMode ? "ring-white/10" : "ring-gray-200"
//                         }`}
//                       >
//                         <span
//                           className={`${
//                             isDarkMode ? "text-white" : "text-gray-700"
//                           }`}
//                         >
//                           🗄️
//                         </span>
//                       </div>
//                       <div className="flex-1">
//                         <div
//                           className={`text-base font-semibold ${
//                             isDarkMode ? "text-white" : "text-gray-900"
//                           }`}
//                         >
//                           Learn SQL
//                         </div>
//                         <div
//                           className={`mt-1 text-sm ${
//                             isDarkMode ? "text-gray-300" : "text-gray-600"
//                           }`}
//                         >
//                           Start your journey into data handling with this
//                           interactive SQL course. Learn how to create,
//                           manipulate, and query databases with practical
//                           exercises.
//                         </div>
//                         <div
//                           className={`mt-2 text-sm flex items-center gap-4 ${
//                             isDarkMode ? "text-gray-400" : "text-gray-600"
//                           }`}
//                         >
//                           <span>14 courses</span>
//                           <span>71.9k learners</span>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="mt-3">
//                       <Button
//                         className={`${
//                           isDarkMode
//                             ? "bg-gray-700 hover:bg-gray-600"
//                             : "bg-gray-900 hover:bg-black"
//                         } text-white w-full`}
//                         onClick={() => setIsPremiumPopupOpen(true)}
//                       >
//                         Learn SQL
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div
//                 className={`rounded-xl overflow-hidden shadow ${
//                   isDarkMode
//                     ? "bg-[#32363C]"
//                     : "bg-white border border-gray-200"
//                 } mt-4`}
//               >
//                 <div className="p-4">
//                   <h3
//                     className={`text-sm font-semibold ${
//                       isDarkMode ? "text-white" : "text-gray-900"
//                     }`}
//                   >
//                     Filters
//                   </h3>
//                   <div className="mt-3 space-y-4">
//                     <div>
//                       <h4
//                         className={`text-xs font-semibold ${
//                           isDarkMode ? "text-gray-300" : "text-gray-700"
//                         } mb-2`}
//                       >
//                         Status
//                       </h4>
//                       <div className="flex items-center gap-4">
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <Checkbox
//                             checked={filters.solved}
//                             onCheckedChange={(checked) =>
//                               updateFilters("solved", checked)
//                             }
//                           />
//                           <span
//                             className={`${
//                               isDarkMode ? "text-gray-300" : "text-gray-700"
//                             }`}
//                           >
//                             Solved
//                           </span>
//                         </label>
//                         <label className="flex items-center gap-2 cursor-pointer">
//                           <Checkbox
//                             checked={filters.unsolved}
//                             onCheckedChange={(checked) =>
//                               updateFilters("unsolved", checked)
//                             }
//                           />
//                           <span
//                             className={`${
//                               isDarkMode ? "text-gray-300" : "text-gray-700"
//                             }`}
//                           >
//                             Unsolved
//                           </span>
//                         </label>
//                       </div>
//                     </div>
//                     <div>
//                       <h4
//                         className={`text-xs font-semibold ${
//                           isDarkMode ? "text-gray-300" : "text-gray-700"
//                         } mb-2`}
//                       >
//                         Difficulty
//                       </h4>
//                       <div className="flex items-center gap-4">
//                         {["Easy", "Medium", "Advanced"].map((difficulty) => (
//                           <label
//                             key={difficulty}
//                             className="flex items-center gap-2 cursor-pointer"
//                           >
//                             <Checkbox
//                               checked={filters.difficulties.includes(
//                                 difficulty.toLowerCase()
//                               )}
//                               onCheckedChange={(checked) => {
//                                 updateFilters(
//                                   "difficulties",
//                                   checked
//                                     ? [
//                                         ...filters.difficulties,
//                                         difficulty.toLowerCase(),
//                                       ]
//                                     : filters.difficulties.filter(
//                                         (d) => d !== difficulty.toLowerCase()
//                                       )
//                                 );
//                               }}
//                             />
//                             <span
//                               className={`${
//                                 isDarkMode ? "text-gray-300" : "text-gray-700"
//                               }`}
//                             >
//                               {difficulty}
//                             </span>
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                     <div>
//                       <h4
//                         className={`text-xs font-semibold ${
//                           isDarkMode ? "text-gray-300" : "text-gray-700"
//                         } mb-2`}
//                       >
//                         Companies
//                       </h4>
//                       <ScrollArea className="h-[160px] pr-2">
//                         <div className="flex flex-wrap gap-2">
//                           {availableCompanies.map((company) => (
//                             <Badge
//                               key={company}
//                               variant={
//                                 filters.company.includes(company)
//                                   ? "default"
//                                   : "outline"
//                               }
//                               className={`cursor-pointer border ${
//                                 filters.company.includes(company)
//                                   ? "bg-teal-500 text-white border-teal-500"
//                                   : isDarkMode
//                                   ? "bg-[#2f2f2f] text-gray-100 hover:bg-gray-600 border-gray-500"
//                                   : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
//                               }`}
//                               onClick={() => {
//                                 updateFilters(
//                                   "company",
//                                   filters.company.includes(company)
//                                     ? filters.company.filter(
//                                         (c) => c !== company
//                                       )
//                                     : [...filters.company, company]
//                                 );
//                               }}
//                             >
//                               {company}
//                               {filters.company.includes(company) && (
//                                 <X className="w-3 h-3 ml-1" />
//                               )}
//                             </Badge>
//                           ))}
//                         </div>
//                       </ScrollArea>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </aside>
//           </div>
//         </div>
//       </main>

//       <Footer isDarkMode={isDarkMode} />

//       {/* Video Solution Dialog */}
//       <Dialog open={isVideoPopupOpen} onOpenChange={setIsVideoPopupOpen}>
//         <DialogContent className="sm:max-w-[800px]">
//           <DialogHeader>
//             <DialogTitle>Solution Video</DialogTitle>
//           </DialogHeader>
//           <div className="relative pt-[56.25%]">
//             {currentVideoId ? (
//               <ReactPlayer
//                 url={currentVideoId}
//                 width="100%"
//                 height="100%"
//                 controls
//                 playing
//                 className="absolute top-0 left-0"
//                 onError={(e) => console.error("ReactPlayer error:", e)}
//               />
//             ) : (
//               <p>No video URL available</p>
//             )}
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Premium Feature Popup */}
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
// }

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Star,
  Briefcase,
  Hash,
  X,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock3,
  Users,
  Flag,
  Merge,
  Search,
  KeyRound,
} from "lucide-react";
import ReactPlayer from "react-player/youtube";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { toast } from "react-toastify";
import { ScrollArea } from "./ui/scroll-area";
import { Checkbox } from "./ui/checkbox";
import RenderSubscription from "./RenderSubscription";
import SubscriptionDialogue from "./SubscriptionDialogue";
import { UserDetailModal } from "./UserDetailModal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import Navbar from "./Navbar"; // Add this import
import { set } from "lodash";
import certificate from "../assets/certificate.png";

const PREDEFINED_SUBTOPICS = [
  "Selection",
  "Filtering",
  "Sorting",
  "Limit",
  "Aggregation",
  "Group By",
  "Having",
  "Joins",
  "Self Join",
  "Cross Join",
  "Conditional Statements",
  "Case When",
  "Date Functions",
  "String Functions",
  "Numeric Functions",
  "Subquery",
  "CTE",
  "Ranking Functions",
  "Window Functions",
  "Top N",
  "UNION",
  "Regular Expressions",
  "Time Functions",
];
const PREDEFINED_PYTHON_TOPICS = [
  "Array",
  "String",
  "Two Pointers",
  "Sliding Window",
  "Dictionary",
  "List",
  "Tuples",
  "Regex",
];

const PREDEFINED_COMPANIES = [
  "Capgemini",
  "NETFLIX",
  "TCS",
  "WIPRO",
  "OYO",
  "Bookbub",
  "Muscleblaze",
  "ZOMATO",
  "Physics Wallah",
  "Make My Trip",
  "AMAZON",
  "NVDIA",
  "META",
  "Book My Show",
  "ORACLE",
  "Instagram",
  "Bajaj Finserv",
  "SWIGGY",
  "Media365",
  "INFOSYS",
  "INDIGO",
  "MYNTRA",
  "Red Bull",
  "UPSTOX",
  "Dream11",
  "YOUTUBE",
  "Cognizant",
  "NESTLE",
  "BigBasket",
  "ISRO",
  "WHEO",
  "Shiprocket",
  "GOOGLE",
  "Linkedin",
  "Formula 1",
  "Uber Eats",
  "Flipkart",
  "Indigo Parking",
  "UBER",
  "Nike Training Club",
  "AGODA",
];
const PREDEFINED_YEARS = [
  "2025",
  "2024",
  "2023",
  "2022",
  "2021",
  "2020",
  "2019",
  "2018",
];

const PREDEFINED_SUBHEADINGS = {
  Selection: "Learn to retrieve specific data from tables using SELECT.",
  Filtering: "Apply conditions with WHERE to extract meaningful records.",
  Sorting: "Organize query results with ORDER BY for clear insights.",
  Limit: "Restrict output rows using LIMIT for precise results.",
  Aggregation: "Summarize data with functions like COUNT, SUM, AVG, MIN, MAX.",
  "Group By": "Categorize data into groups for deeper analysis.",
  Having: "Filter grouped results with HAVING for refined outputs.",
  Joins: "Combine related data across multiple tables seamlessly.",
  "Self Join": "Join a table to itself for hierarchical or recursive queries.",
  "Cross Join": "Generate Cartesian products to explore all row combinations.",
  "Conditional Statements":
    "Control logic with IF and other conditions in queries.",
  "Case When": "Build conditional outputs with CASE expressions.",
  "Date Functions": "Manipulate and analyze date/time values effectively.",
  "String Functions": "Clean, modify, and analyze text data in queries.",
  "Numeric Functions": "Perform calculations and transformations on numbers.",
  Subquery: "Use queries inside queries for complex filtering or calculations.",
  CTE: "Simplify queries with reusable temporary results.",
  "Ranking Functions":
    "Rank, number, and order rows with advanced SQL functions.",
  "Window Functions":
    "Perform calculations across row sets without collapsing results.",
  "Top N": "Extract top or bottom N records efficiently.",
  UNION: "Combine results from multiple queries into one dataset.",
  "Regular Expressions": "Search and match complex text patterns in data.",
  "Time Functions": "Work with time values for detailed temporal analysis.",
};

const SQLIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 448 512"
      className="h-9 w-9"
      fill="currentColor"
    >
      <path d="M448 80v48c0 44.2-100.3 80-224 80S0 172.2 0 128V80C0 35.8 100.3 0 224 0S448 35.8 448 80zM393.2 214.7c20.8-7.4 39.9-16.9 54.8-28.6V288c0 44.2-100.3 80-224 80S0 332.2 0 288V186.1c14.9 11.8 34 21.2 54.8 28.6C99.7 230.7 159.5 240 224 240s124.3-9.3 169.2-25.3zM0 346.1c14.9 11.8 34 21.2 54.8 28.6C99.7 390.7 159.5 400 224 400s124.3-9.3 169.2-25.3c20.8-7.4 39.9-16.9 54.8-28.6V432c0 44.2-100.3 80-224 80S0 476.2 0 432V346.1z"/>
    </svg>
  );
};

// A new, simple footer component
const Footer = ({ isDarkMode }) => {
  return (
    <footer
      className={`w-full py-4 mt-auto ${
        isDarkMode ? "bg-[#1D1E23] text-gray-200" : "bg-gray-100 text-gray-800"
      } border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"}`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 text-center text-lg">
        <span className="font-semibold text-teal-500">
          DataSense:  
        </span>
        {" "}
        All rights reserved, 2025
      </div>
    </footer>
  );
};


export default function QuestionGallery() {
  const { isLoaded, isSignedIn, user } = useUser();
  const navigateTo = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [getUserID, setUserID] = useState("default");
  const [isSubscriptionDialogueOpen, setIsSubscriptionDialogueOpen] =
    useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState("");
  const [filters, setFilters] = useState({
    difficulties: [],
    company: [],
    subtopics: [],
    year: [],
    search: "",
    unsolved: false,
    solved: false,
  });
  const [itemsPerPage] = useState(10);
  const [availableSubtopics] = useState(PREDEFINED_SUBTOPICS);
  const [availableCompanies] = useState(PREDEFINED_COMPANIES);
  const [bookmarkedQuizzes, setBookmarkedQuizzes] = useState(new Set());
  const [solvedQuestions, setSolvedQuestions] = useState(new Set());
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
    currentPage: parseInt(localStorage.getItem("currentPage") || "1", 10),
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage") || "1", 10)
  );
  const [pageInput, setPageInput] = useState(
    localStorage.getItem("currentPage") || "1"
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openLesson, setOpenLesson] = useState(null);
  const [lessonQuestions, setLessonQuestions] = useState({});
  const [lessonLoading, setLessonLoading] = useState({});
  const [expandedLessons, setExpandedLessons] = useState(new Set()); 

  const firstLessonRef = useRef(null);

  // States for search overlay
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  let subject =
    new URLSearchParams(window.location.search).get("subject") || "mysql";
  if (subject === "sql") {
    subject = "mysql";
  }
  const STORAGE_KEY = "quiz-bookmarks";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPremiumPopupOpen, setIsPremiumPopupOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setUserID(user.id);
    }
  }, [isLoaded, isSignedIn, user]);

  useEffect(() => {
    validateSubject();
    checkAndBreakOutOfIframe();
  }, [subject]);

  // This effect now only fetches the main page questions
  useEffect(() => {
    if (!isSearchActive) {
      fetchQuizzes();
    }
  }, [
    paginationInfo.currentPage,
    filters.unsolved,
    filters.solved,
    isSearchActive,
  ]);

  useEffect(() => {
    if (user && user.id) {
      console.log(user.id);
      fetchBookmarks();
      fetchSolvedQuestions();
    }
  }, [user]);

  // Effect for handling the search functionality
  useEffect(() => {
    if (isSearchActive) {
      // Focus the input when search becomes active
      searchInputRef.current?.focus();

      const hasActiveFilters =
        filters.search.trim() !== "" ||
        filters.difficulties.length > 0 ||
        filters.company.length > 0 ||
        filters.year.length > 0;

      if (!hasActiveFilters) {
        setSearchResults([]);
        return;
      }

      const handler = setTimeout(() => {
        setIsSearching(true);
        axios
          .get(`https://server.datasenseai.com/test-series-coding/${subject}`, {
            params: {
              page: 1,
              limit: 50, // Fetch more results for search
              difficulties: filters.difficulties.join(","),
              companies: filters.company.join(","),
              year: filters.year.join(","),
              subtopics: filters.subtopics.join(","),
              search: filters.search,
              searchFields: "question_text,title,id",
            },
          })
          .then((response) => {
            setSearchResults(response.data.results || []);
          })
          .catch((error) => {
            console.error("Error fetching search results:", error);
            toast.error("Failed to fetch search results.");
          })
          .finally(() => {
            setIsSearching(false);
          });
      }, 500); // 500ms debounce

      return () => {
        clearTimeout(handler);
      };
    }
  }, [filters, isSearchActive, subject]);

  const fetchQuizzes = useCallback(async () => {
    // This function is now only for the main page list, not search
    try {
      setIsLoading(true);

      let url = `https://server.datasenseai.com/test-series-coding/${subject}`;

      let params = {
        page: paginationInfo.currentPage,
        limit: itemsPerPage,
        difficulties: "", 
        companies: "",
        year: "",
        subtopics: "",
        search: "",
        searchFields: "question_text,title,id",
      };

      const response = await axios.get(url, { params });

      if (response.data && typeof response.data === "object") {
        let { total, totalPages, currentPage, next, previous, results } =
          response.data;


        if (Array.isArray(results)) {
          let filteredQuizzes = results;
          
          if (filters.solved) {
            filteredQuizzes = filteredQuizzes.filter((quiz) =>
              solvedQuestions.has(quiz._id)
            );
          }
          if (filters.unsolved) {
            filteredQuizzes = filteredQuizzes.filter((quiz) =>
              !solvedQuestions.has(quiz._id)
            );
          }

          setQuizzes(filteredQuizzes);
          const savedPage = parseInt(
            localStorage.getItem("currentPage") || "1",
            10
          );

          setPaginationInfo({
            total: total || 0,
            totalPages: totalPages || 1,
            currentPage: currentPage || savedPage,
            next,
            previous,
          });
          setCurrentPage(savedPage || currentPage);
        } else {
          console.error(
            "Unexpected response structure: results is not an array",
            response.data
          );
          toast.error(
            "Received unexpected data format. Please try again later."
          );
        }
      } else {
        console.error("Unexpected response structure:", response.data);
        toast.error("Received unexpected data format. Please try again later.");
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      toast.error("Failed to fetch quizzes. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [
    subject,
    paginationInfo.currentPage,
    itemsPerPage,
    getUserID,
    filters.unsolved,
    filters.solved,
  ]);

  const [loadedLessons, setLoadedLessons] = useState(new Set());


  const fetchLessonQuestions = useCallback(
    async (subtopic) => {
      try {
        setLessonLoading((prev) => ({ ...prev, [subtopic]: true }));

        let url = `https://server.datasenseai.com/test-series-coding/${subject}`;
        const params = {
          page: 1,
          limit: 100,
          difficulties: filters.difficulties.join(","),
          companies: filters.company.join(","),
          year: filters.year.join(","),
          subtopics: subtopic,
          search: filters.search,
          searchFields: "question_text,title,id",
        };

        const response = await axios.get(url, { params });
        let results = response?.data?.results || [];

        if (filters.solved) {
          results = results.filter((quiz) => solvedQuestions.has(quiz._id));
        }
        if (filters.unsolved) {
            results = results.filter((quiz) => !solvedQuestions.has(quiz._id));
        }

        setLessonQuestions((prev) => ({ ...prev, [subtopic]: results }));
        setLoadedLessons((prev) => new Set([...prev, subtopic]));
      } catch (err) {
        console.error("Error fetching lesson questions:", err);
        toast.error("Failed to load questions for this lesson");
      } finally {
        setLessonLoading((prev) => ({ ...prev, [subtopic]: false }));
      }
    },
    [subject, filters, solvedQuestions, getUserID]
  );

  const fetchBookmarks = async () => {
    if (!user || !user.id) return;

    try {
      const response = await fetch(
        `https://server.datasenseai.com/bookmark/bookmarks/${user.id}`
      );
      if (response.ok) {
        const data = await response.json();
        const bookmarkSet = new Set(data.bookmarks);
        setBookmarkedQuizzes(bookmarkSet);
      } else {
        throw new Error("Failed to fetch bookmarks");
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      toast.error("Failed to fetch bookmarks. Please try again later.");
    }
  };

  const fetchSolvedQuestions = async () => {
    if (!user || !user.id) return;

    try {
      const response = await fetch(
        `https://server.datasenseai.com/question-attempt/solved/${user.id}`
      );
      if (response.ok) {
        const data = await response.json();
        const solvedSet = new Set(
          data.solvedQuestions.filter((item) => item !== null)
        );
        setSolvedQuestions(solvedSet);
        console.log(solvedSet);
      } else {
        throw new Error("Failed to fetch solved questions");
      }
    } catch (error) {
      console.error("Error fetching solved questions:", error);
      toast.error("Failed to fetch solved questions. Please try again later.");
    }
  };

  const updateFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (!isSearchActive) {
      const newPage = 1;
      setCurrentPage(newPage);
      localStorage.setItem("currentPage", newPage.toString());
      setPageInput(newPage.toString());
      setPaginationInfo((prev) => ({ ...prev, currentPage: newPage }));
    }
  };

  const openVideoPopup = (quiz) => {
    if (quiz.video) {
      const videoId = extractYoutubeId(quiz.video);
      if (videoId) {
        setCurrentVideoId(`https://www.youtube.com/watch?v=${videoId}`);
        setIsVideoPopupOpen(true);
      } else {
        console.error("Invalid YouTube URL:", quiz.video);
        toast.error("Invalid YouTube URL");
      }
    } else {
      console.log("No video available for this quiz");
      toast.info("Video coming soon...");
    }
  };

  const extractYoutubeId = (url) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const closeVideoPopup = () => {
    setIsVideoPopupOpen(false);
    setCurrentVideoId("");
  };

  const checkAndBreakOutOfIframe = () => {
    if (window.self !== window.top) {
      const currentUrl = window.location.href;
      const storageKey = "iframeBreakoutAttempt";
      const breakoutAttempt = sessionStorage.getItem(storageKey);

      if (!breakoutAttempt) {
        sessionStorage.setItem(storageKey, "true");
        window.top.location.href = currentUrl;
      } else {
        sessionStorage.removeItem(storageKey);
      }
    }
  };

  const normalizeDifficulty = (difficulty) => {
    if (!difficulty) {
      return "easy";
    }

    const normalized = difficulty.toLowerCase();
    if (normalized === "advance" || normalized === "advanced") {
      return "advanced";
    }

    return normalized;
  };

  const getDifficultyStyle = (difficulty) => {
    const normalizedDifficulty = normalizeDifficulty(difficulty);
    switch (normalizedDifficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "advance":
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  const capitalizeFirstLetter = (string) => {
    if (!string || typeof string !== "string") {
      return "";
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };

  const validateSubject = () => {
    const validSubjects = ["mysql", "python", "tableau", "excel", "powerbi"];

    if (!subject) {
      toast.error("URL is malformed. Subject is missing.");
      redirectToHomePage();
    } else if (!validSubjects.includes(subject.toLowerCase())) {
      toast.error("URL is malformed. Invalid subject.");
      redirectToHomePage();
    } else if (
      ["excel", "powerbi", "tableau"].includes(subject.toLowerCase())
    ) {
      redirectToScenarioPage(subject.toLowerCase());
    }
  };

  const redirectToHomePage = () => {
    window.top.location.href = "https://practice.datasenseai.com/";
  };

  const redirectToScenarioPage = (subject) => {
    window.location.href = `/scenario-area?subject=${subject}`;
  };

  const removeQuizTypePrefix = (quizName) => {
    return quizName.replace(/^(sql:|python:|mcq:)\s*/i, "");
  };

  const toggleBookmark = async (quizId, e) => {
    e.stopPropagation();

    if (!user || !user.id) {
      toast.error("Please sign in to bookmark questions.");
      return;
    }

    const isCurrentlyBookmarked = bookmarkedQuizzes.has(quizId);
    const endpoint = isCurrentlyBookmarked ? "unbookmark" : "bookmark";

    try {
      const newBookmarks = new Set(bookmarkedQuizzes);
      if (isCurrentlyBookmarked) {
        newBookmarks.delete(quizId);
      } else {
        newBookmarks.add(quizId);
      }
      setBookmarkedQuizzes(newBookmarks);

      const response = await fetch(
        `https://server.datasenseai.com/bookmark/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            clerkId: getUserID,
            questionId: quizId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to ${endpoint} question`);
      }

      await response.json();
      toast.success(
        isCurrentlyBookmarked
          ? "Removed from bookmarks!"
          : "Added to bookmarks!"
      );
    } catch (error) {
      console.error("Error updating bookmark:", error);
      const revertedBookmarks = new Set(bookmarkedQuizzes);
      setBookmarkedQuizzes(revertedBookmarks);

      toast.error(
        `Failed to ${
          isCurrentlyBookmarked ? "remove" : "add"
        } bookmark. Please try again.`
      );
    }
  };

  const handleStartQuiz = async (quizID, userID, quizName, subtopic) => {
    let route = "/quiz";
    if (subject.toLowerCase() === "python") {
      route = "/pyQuiz";
    }

    if (!isSignedIn) {
      alert(`You're not logged in`);
      return;
    }

    const userRegistered = localStorage.getItem("userRegistered");

    const buildUrl = () => {
      let url = `${route}?questionID=${quizID}&userID=${userID}`;
      if (subtopic) {
        url += `&subtopic=${encodeURIComponent(subtopic)}`;
      }
      return url;
    };

    if (process.env.NODE_ENV === "development") {
      window.open(buildUrl(), "_blank");
      return;
    }

    if (userRegistered === "true") {
      window.open(buildUrl(), "_blank");
      return;
    }

    try {
      const effectiveUserID = userID || "default";

      const response = await fetch(
        `https://server.datasenseai.com/user-details/profile-status/${effectiveUserID}`
      );
      const data = await response.json();

      if (response.ok) {
        if (data.isProfileComplete) {
          localStorage.setItem("userRegistered", "true");
          window.open(
            `${route}?questionID=${quizID}&userID=${effectiveUserID}`,
            "_blank"
          );
        } else {
          setIsModalOpen(true);
        }
      } else {
        console.warn("Profile status check failed, proceeding anyway");
        window.open(
          `${route}?questionID=${quizID}&userID=${effectiveUserID}`,
          "_blank"
        );
      }
    } catch (error) {
      console.error("Error while checking user profile status:", error);
      window.open(
        `${route}?questionID=${quizID}&userID=${userID || "default"}`,
        "_blank"
      );
    }
  };

  const handleModalClose = (success) => {
    setIsModalOpen(false);
    if (success) {
      alert("Details are recorded, You can attempt the question now");
    }
  };

  const handlePageChange = useCallback(
    (newPage) => {
      setPageInput(newPage.toString());
      if (
        newPage >= 1 &&
        newPage <= paginationInfo.totalPages &&
        newPage !== currentPage
      ) {
        setCurrentPage(newPage);
        localStorage.setItem("currentPage", newPage.toString());
        setPageInput(newPage.toString());
        setPaginationInfo((prev) => ({ ...prev, currentPage: newPage }));
        window.scrollTo(0, 0);
      }
    },
    [paginationInfo.totalPages, currentPage]
  );

  const renderPaginationButtons = useCallback(() => {
    const pageNumbers = [];
    const totalPages = paginationInfo.totalPages;
    const currentPage = paginationInfo.currentPage;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    if (startPage > 1) {
      pageNumbers.push(
        <Button
          key={1}
          onClick={() => handlePageChange(1)}
          variant="outline"
          size="sm"
          className={
            isDarkMode
              ? "bg-[#2f2f2f] border-[#3f3f3f] text-white"
              : "bg-white border-[#3f3f3f] text-black"
          }
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pageNumbers.push(
          <span
            key="ellipsis1"
            className={isDarkMode ? "text-white" : "text-black"}
          >
            ...
          </span>
        );
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant="outline"
          size="sm"
          className={
            i === currentPage
              ? isDarkMode
                ? "bg-white text-white border-[#3f3f3f]"
                : "bg-[#2f2f2f] text-white border-[#3f3f3f]"
              : isDarkMode
              ? "bg-[#2f2f2f] border-[#3f3f3f] text-white"
              : "bg-white border-[#3f3f3f] text-black"
          }
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="ellipsis2">...</span>);
      }
      pageNumbers.push(
        <Button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          variant="outline"
          size="sm"
          className={
            isDarkMode
              ? "bg-[#2f2f2f] border-[#3f3f3f] text-white"
              : "bg-white border-[#3f3f3f] text-black"
          }
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  }, [
    paginationInfo.totalPages,
    paginationInfo.currentPage,
    isDarkMode,
    handlePageChange,
  ]);

  const handleGoToPage = () => {
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= paginationInfo.totalPages) {
      handlePageChange(page);
    } else {
      toast.error(
        `Please enter a valid page number between 1 and ${paginationInfo.totalPages}`
      );
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem("currentPage");
    if (savedPage !== null) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  useEffect(() => {
    if (openLesson && !lessonQuestions[openLesson]) {
      fetchLessonQuestions(openLesson);
    }
  }, [openLesson, lessonQuestions, fetchLessonQuestions]);


  useEffect(() => {
    setLessonQuestions({});
    setLoadedLessons(new Set());
    setExpandedLessons(new Set()); 
  }, [
    filters.difficulties,
    filters.company,
    filters.year,
    filters.unsolved,
    filters.solved,
  ]);

  const handleToggleLesson = (subtopic) => {
    if (openLesson === subtopic) {
      setOpenLesson(null);
      return;
    }
    setOpenLesson(subtopic);
    if (!lessonQuestions[subtopic]) {
      fetchLessonQuestions(subtopic);
    }
  };

  const handleToggleExpand = (subtopic) => {
    setExpandedLessons(prev => {
        const newSet = new Set(prev);
        if (newSet.has(subtopic)) {
            newSet.delete(subtopic);
        } else {
            newSet.add(subtopic);
        }
        return newSet;
    });
  };

  const handleStartLearning = () => {
    const firstSubtopic = PREDEFINED_SUBTOPICS[0];
    if (firstSubtopic) {
      setOpenLesson(firstSubtopic);
      firstLessonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // FIXED: Correct progress calculation logic
  const solvedCount = Array.from(solvedQuestions).length;
  const TOTAL_QUESTIONS = 500; // Based on the "500 Problems" text in the UI
  const progressPercentage = Math.floor((solvedCount / TOTAL_QUESTIONS) * 100);

  return (
    <div
      className={`font-sans flex flex-col min-h-screen ${
        isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100"
      }`}
    >
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Search Overlay */}
      <div
        className={`mt-14 fixed inset-0 z-40 transition-opacity duration-300 ${
          isSearchActive
            ? "bg-black/60 backdrop-blur-sm"
            : "bg-transparent pointer-events-none"
        }`}
        onClick={() => setIsSearchActive(false)}
      >
        <div
          className={`w-full transition-transform duration-300 ease-in-out ${
            isDarkMode ? "bg-[#25272C]" : "bg-white"
          } ${isSearchActive ? "translate-y-0" : "-translate-y-full"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center gap-4">
              <Search
                className={`h-6 w-6 flex-shrink-0 ${
                  isDarkMode ? "text-gray-400" : "text-gray-600"
                }`}
              />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search questions by title, ID, or keyword..."
                value={filters.search}
                onChange={(e) => updateFilters("search", e.target.value)}
                className={`w-full h-14 text-lg ${
                  isDarkMode
                    ? "bg-[#2f2f2f] border-[#3f3f3f] text-white"
                    : "bg-gray-50 border-gray-300"
                }`}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSearchActive(false)}
              >
                <X
                  className={`h-6 w-6 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                />
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
                    <div key={quiz._id} className="p-3">
                      <div className="grid grid-cols-12 gap-5 items-center">
                        <div className="col-span-12 md:col-span-6">
                          <h3
                            className={`text-sm md:text-base font-medium ${
                              isDarkMode ? "text-[#3E74D1]" : "text-[#4079DA]"
                            }`}
                          >
                            {quiz.id ? quiz.id.toUpperCase() + " " : ""}
                            {quiz.title ??
                              removeQuizTypePrefix(quiz.question_text)}
                          </h3>
                        </div>
                        <div className="col-span-6 md:col-span-3 flex flex-wrap gap-1 md:justify-start">
                          {quiz.company &&
                            quiz.company.map((company, compIndex) => (
                              <Badge
                                key={compIndex}
                                variant="secondary"
                                className={`${
                                  isDarkMode
                                    ? "bg-purple-900 text-purple-200"
                                    : "bg-purple-100 text-purple-700"
                                } flex items-center gap-1`}
                              >
                                <Briefcase className="h-3 w-3" />
                                {company}
                              </Badge>
                            ))}
                        </div>
                        <div className="col-span-3 md:col-span-1">
                          <Badge
                            className={`px-2 py-1 rounded-full font-semibold text-xs ${getDifficultyStyle(
                              quiz.difficulty
                            )}`}
                          >
                            {capitalizeFirstLetter(quiz.difficulty)}
                          </Badge>
                        </div>
                        <div className="col-span-12 md:col-span-2 md:justify-self-end flex justify-end">
                          <Button
                            onClick={() =>
                              handleStartQuiz(
                                quiz._id,
                                user?.id,
                                quiz.question_text
                              )
                            }
                            className={`${
                              isDarkMode
                                ? "bg-cyan-700 hover:bg-cyan-600"
                                : "bg-cyan-600 hover:bg-cyan-700"
                            } text-white px-4 py-2`}
                          >
                            Solve
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No results found. Try adjusting your search.</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </div>

      <main className="flex-1 flex gap-4 px-0 md:px-6">
        <UserDetailModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onClose={handleModalClose}
        />

        <SubscriptionDialogue
          isOpen={isSubscriptionDialogueOpen}
          onClose={() => setIsSubscriptionDialogueOpen(false)}
          status={subscriptionStatus}
        />

        <div className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col gap-4 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <div
                className={`w-full rounded-lg px-4 py-3 flex items-center gap-4 ${
                  isDarkMode ? "text-white" : "text-white"
                }`}
                style={{
                  background: isDarkMode
                    ? "linear-gradient(90deg,rgb(53, 54, 55) 0%,rgb(29, 30, 35) 100%)"
                    : "linear-gradient(90deg,rgb(53, 54, 55) 0%,rgb(237, 240, 240) 100%)",
                }}
              >
                <Merge className="h-4 w-4 text-cyan-300 font-bold" />
                <div className="text-sm md:text-[15px] font-medium">
                  This path is a part of SQL Learning Roadmap
                </div>
                <a
                  href="https://dashboard.datasenseai.com/sql-journey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`pl-10 ${
                    isDarkMode
                      ? "text-cyan-300 hover:text-cyan-200"
                      : "text-cyan-300 hover:text-cyan-200"
                  } text-sm font-semibold underline`}
                >
                  View Roadmap
                </a>
              </div>
            </div>

            <div className="">
              <button
                onClick={() => setIsSearchActive(true)}
                className={`w-full max-w-md flex items-center gap-2 text-left p-2 rounded-lg border ${
                  isDarkMode
                    ? "bg-[#2f2f2f] border-[#3f3f3f] text-gray-400"
                    : "bg-white border-gray-300 text-gray-500"
                }`}
              >
                <Search className="h-4 w-4" />
                Search questions...
              </button>
            </div>

            <div className="">
              <Button onClick={() => navigateTo("/question-area?subject=sql")}>
                Question Gallery
              </Button>
            </div>
          </div>
          <div className="flex gap-6">
            {/* Main Content */}
            <div className="flex-1 max-w-5xl py-4">
              <div
                className={`relative overflow-hidden rounded-2xl p-6 md:p-7 mb-6 text-white shadow-lg ${
                  isDarkMode ? "" : ""
                }`}
                style={{
                  backgroundImage:
                    `${isDarkMode ? "" : ""}` +
                    `linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),` +
                    `linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px),` +
                    `${
                      isDarkMode
                        ? "linear-gradient(180deg, #1eafaf 0%, #126464 100%)"
                        : "linear-gradient(180deg, #1eafaf 0%, #126464 100%)"
                    }`,
                  backgroundSize: "32px 32px, 32px 32px, cover",
                  backgroundPosition: "0 0, 0 0, 0 0",
                  border: isDarkMode
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "1px solid rgba(255,255,255,0.25)",
                }}
              >
                <div className="flex flex-col gap-5">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                          isDarkMode ? "bg-white/10" : "bg-white/20"
                        }`}
                      >
                        <SQLIcon />
                      </div>
                      <div className="flex items-center gap-2 ml-auto">
                        <span
                          className={`text-xs px-5 py-2 rounded-lg backdrop-blur ${
                            isDarkMode
                              ? "bg-[#abfff9] text-black"
                              : "bg-[#abfff9] text-black"
                          }`}
                        >
                          🏅 Certification Available
                        </span>
                        <span
                          className={`text-xs px-5 py-2 rounded-lg backdrop-blur font-bold bg-[#FFF9D8] text-[#FFB039]`}
                        >
                          ★ 4.6 (11.9k+)
                        </span>
                      </div>
                    </div>
                    <h2 className="text-3xl md:text-[32px] font-extrabold tracking-tight">
                      SQL Practice Queries
                    </h2>
                    <p
                      className={`mt-2 text-base ${
                        isDarkMode ? "text-white/85" : "text-white/95"
                      }`}
                    >
                      Work through practical SQL queries covering Select, Where,
                      Limit, Order By, Aggregate functions, Group By, Joins,
                      Subqueries, and Case statements. Tackle hands-on exercises
                      based on real-world scenarios.
                    </p>
                    <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-5 text-white/90 text-base">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" /> 23 Lessons
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock3 className="h-4 w-4" /> 100+ Hours
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4" /> 500 Problems
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" /> 95.0k Learners
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag className="h-4 w-4" /> Advanced Level
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-4 w-full">
                      <div className="flex-1">
                        <div className="text-lg mb-2">
                          Your Progress :{" "}
                          <span className="font-semibold text-green-400">
                            {`${progressPercentage}%`}{" "}
                            Completed
                          </span>
                        </div>
                        <div
                          className={`h-2 rounded-full ${
                            isDarkMode ? "bg-white/15" : "bg-white/40"
                          }`}
                        >
                          <div
                            className={`h-2 rounded-full ${
                              isDarkMode ? "bg-green-400" : "bg-green-300"
                            }`}
                            style={{
                              width: `${Math.min(100, progressPercentage)}%`,
                            }}
                          />
                        </div>
                      </div>
                      <Button
                        onClick={handleStartLearning}
                        className={`${
                          isDarkMode
                            ? "bg-white text-[#12325d] hover:bg-white/90"
                            : "bg-white text-[#12325d] hover:bg-white/95"
                        } font-semibold px-6 py-5 rounded-xl whitespace-nowrap flex-shrink-0`}
                      >
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {PREDEFINED_SUBTOPICS.map((subtopic, idx) => (
                  <div
                    key={subtopic}
                    ref={idx === 0 ? firstLessonRef : null}
                    className={`py-5 ${
                      isDarkMode ? "bg-[#32363C]" : "bg-gray-50"
                    } rounded-lg border ${
                      isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"
                    }`}
                  >
                    <button
                      onClick={() => handleToggleLesson(subtopic)}
                      className={`w-full flex items-start justify-between px-4 py-3 ${
                        isDarkMode ? "text-gray-100" : "text-gray-800"
                      }`}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <span
                          className={`text-2xl font-bold ${
                            isDarkMode ? "text-gray-100" : "text-gray-800"
                          }`}
                        >
                          {idx + 1}. {subtopic}
                        </span>
                        <span
                          className={`text-base ${
                            isDarkMode ? "text-gray-500" : "text-gray-500"
                          }`}
                        >
                          {PREDEFINED_SUBHEADINGS[subtopic] || ""}
                        </span>
                      </div>
                      {openLesson === subtopic ? (
                        <ChevronUp className="h-7 w-7" />
                      ) : (
                        <ChevronDown className="h-7 w-7" />
                      )}
                    </button>
                    {openLesson === subtopic && (
                      <div className="mt-2">
                        <div
                          className={`hidden md:grid grid-cols-12 gap-6 px-8 py-2 ${
                            isDarkMode ? "text-gray-300" : "text-gray-700"
                          }`}
                        >
                          <div className="col-span-5 text-sm font-semibold">
                            Problem name
                          </div>
                          <div className="col-span-2 text-sm font-semibold">
                            Company
                          </div>
                          <div className="col-span-2 text-sm font-semibold">
                            Status
                          </div>
                          <div className="col-span-1 text-sm font-semibold">
                            Difficulty
                          </div>
                          <div className="col-span-2 text-sm font-semibold text-right pr-2">
                            &nbsp;
                          </div>
                        </div>
                        {lessonLoading[subtopic] ? (
                          <div className="flex items-center gap-2 p-4">
                            <Loader2 className="h-5 w-5 animate-spin text-cyan-600" />
                            <span
                              className={`${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              Loading questions...
                            </span>
                          </div>
                        ) : (lessonQuestions[subtopic] || []).length === 0 ? (
                          <div
                            className={`p-4 ${
                              isDarkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                          >
                            No questions found for selected filters.
                          </div>
                        ) : (() => {
                              const questions = lessonQuestions[subtopic] || [];
                              const INITIAL_LIMIT = 8;
                              const isExpanded = expandedLessons.has(subtopic);
                              const questionsToShow = isExpanded ? questions : questions.slice(0, INITIAL_LIMIT);

                              return (
                                <>
                                  <div className="p-3 space-y-3">
                                    {questionsToShow.map((quiz) => (
                                      <div key={quiz._id} className="p-3">
                                        <div className="grid grid-cols-12 gap-5 items-center">
                                          <div className="col-span-12 md:col-span-5">
                                            <h3
                                              className={`text-sm md:text-base font-medium ${
                                                isDarkMode
                                                  ? "text-blue-400"
                                                  : "text-blue-600"
                                              }`}
                                            >
                                              {quiz.id
                                                ? quiz.id.toUpperCase() + " "
                                                : ""}
                                              {quiz.title ??
                                                removeQuizTypePrefix(
                                                  quiz.question_text
                                                )}
                                            </h3>
                                          </div>
                                          <div className="col-span-6 md:col-span-2 flex flex-wrap gap-1 md:justify-start">
                                            {quiz.company &&
                                              quiz.company.map((company, compIndex) => (
                                                <Badge
                                                  key={compIndex}
                                                  variant="secondary"
                                                  className={`${
                                                    isDarkMode
                                                      ? "bg-purple-900 text-purple-200"
                                                      : "bg-purple-100 text-purple-700"
                                                  } flex items-center gap-1`}
                                                >
                                                  <Briefcase className="h-3 w-3" />
                                                  {company}
                                                </Badge>
                                              ))}
                                          </div>
                                          <div className="col-span-3 md:col-span-2">
                                            {solvedQuestions.has(quiz._id) ? (
                                              <Badge
                                                variant="success"
                                                className={
                                                  isDarkMode
                                                    ? "bg-green-900 text-green-200"
                                                    : "bg-green-100 text-green-700"
                                                }
                                              >
                                                Solved
                                              </Badge>
                                            ) : (
                                              <Badge
                                                className={
                                                  isDarkMode
                                                    ? "bg-gray-700 text-gray-200"
                                                    : "bg-gray-100 text-gray-700"
                                                }
                                              >
                                                Unsolved
                                              </Badge>
                                            )}
                                          </div>
                                          <div className="col-span-3 md:col-span-1">
                                            <Badge
                                              className={`px-2 py-1 rounded-full font-semibold text-xs ${getDifficultyStyle(
                                                quiz.difficulty
                                              )}`}
                                            >
                                              {capitalizeFirstLetter(quiz.difficulty)}
                                            </Badge>
                                          </div>
                                          <div className="col-span-12 md:col-span-2 md:justify-self-end flex justify-end">
                                            <Button
                                              onClick={() =>
                                                handleStartQuiz(
                                                  quiz._id,
                                                  user?.id,
                                                  quiz.question_text,
                                                  subtopic
                                                )
                                              }
                                              className={`${
                                                isDarkMode
                                                  ? "bg-cyan-700 hover:bg-cyan-600"
                                                  : "bg-cyan-600 hover:bg-cyan-700"
                                              } text-white`}
                                            >
                                              Solve
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  {questions.length > INITIAL_LIMIT && (
                                    <div className="px-6 pb-2 text-center">
                                      <Button
                                        variant="link"
                                        className="text-cyan-600 dark:text-cyan-400"
                                        onClick={() => handleToggleExpand(subtopic)}
                                      >
                                        {isExpanded ? "Show Less" : "Show More"}
                                      </Button>
                                    </div>
                                  )}
                                </>
                              );
                            })()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Sidebar */}
            <aside className="hidden xl:block w-[450px] py-4">
              <div
                className={`rounded-xl overflow-hidden mb-4 shadow ${
                  isDarkMode ? "bg-[#32363C]" : "bg-white"
                }`}
              >
                <div
                  className={`p-4 ${
                    isDarkMode
                      ? "bg-[#32363C]"
                      : "bg-gradient-to-b from-slate-100 to-white"
                  } border-b ${
                    isDarkMode ? "border-white/10" : "border-gray-200"
                  }`}
                >
                  <div className="h-48 rounded-lg flex items-center justify-center">
                    <img
                      className="h-48 w-68"
                      src={certificate}
                      alt="certificate"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <span
                      className={`text-[11px] px-2 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-white/10 text-white"
                          : "bg-blue-50 text-blue-700"
                      } border ${
                        isDarkMode ? "border-white/15" : "border-blue-200"
                      }`}
                    >
                      Certification available
                    </span>
                    <span
                      className={`text-[11px] px-2 py-1 rounded-full ${
                        isDarkMode
                          ? "bg-white/10 text-white"
                          : "bg-emerald-50 text-emerald-700"
                      } border ${
                        isDarkMode ? "border-white/15" : "border-emerald-200"
                      }`}
                    >
                      Included in premium
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <h3
                    className={`text-base font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Certificate on Completion
                  </h3>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } text-base mt-2`}
                  >
                    On completing all the lessons in this course, you'll get a
                    course completion certificate.
                  </p>
                  <Button
                    className={`mt-3 w-full ${
                      isDarkMode
                        ? "bg-cyan-700 hover:bg-cyan-600"
                        : "bg-cyan-600 hover:bg-cyan-700"
                    } text-white opacity-50 cursor-not-allowed`}
                  >
                    View Certificate
                  </Button>
                </div>
              </div>

              <div
                className={`rounded-xl overflow-hidden shadow ${
                  isDarkMode ? "bg-[#32363C]" : "bg-white"
                }`}
              >
                <div className="p-4">
                  <h3
                    className={`text-base font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Prerequisite course
                  </h3>
                  <p
                    className={`${
                      isDarkMode ? "text-gray-300" : "text-gray-600"
                    } text-base mt-2`}
                  >
                    We recommend you complete this course first before you jump
                    into SQL Practice Queries. This will help you understand
                    even better.
                  </p>

                  <div
                    className={`mt-4 rounded-lg p-3 ${
                      isDarkMode
                        ? "bg-gradient-to-t from-[#25272C] to-[#4D4D4D]"
                        : "bg-slate-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`h-10 w-10 rounded-md flex items-center justify-center ${
                          isDarkMode ? "bg-white/10" : "bg-white"
                        } ring-1 ${
                          isDarkMode ? "ring-white/10" : "ring-gray-200"
                        }`}
                      >
                        <span
                          className={`${
                            isDarkMode ? "text-white" : "text-gray-700"
                          }`}
                        >
                          🗄️
                        </span>
                      </div>
                      <div className="flex-1">
                        <div
                          className={`text-base font-semibold ${
                            isDarkMode ? "text-white" : "text-gray-900"
                          }`}
                        >
                          Learn SQL
                        </div>
                        <div
                          className={`mt-1 text-sm ${
                            isDarkMode ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          Start your journey into data handling with this
                          interactive SQL course. Learn how to create,
                          manipulate, and query databases with practical
                          exercises.
                        </div>
                        <div
                          className={`mt-2 text-sm flex items-center gap-4 ${
                            isDarkMode ? "text-gray-400" : "text-gray-600"
                          }`}
                        >
                          <span>14 courses</span>
                          <span>71.9k learners</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Button
                        className={`${
                          isDarkMode
                            ? "bg-gray-700 hover:bg-gray-600"
                            : "bg-gray-900 hover:bg-black"
                        } text-white w-full`}
                        onClick={() => setIsPremiumPopupOpen(true)}
                      >
                        Learn SQL
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`rounded-xl overflow-hidden shadow ${
                  isDarkMode
                    ? "bg-[#32363C]"
                    : "bg-white border border-gray-200"
                } mt-4`}
              >
                <div className="p-4">
                  <h3
                    className={`text-sm font-semibold ${
                      isDarkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Filters
                  </h3>
                  <div className="mt-3 space-y-4">
                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        } mb-2`}
                      >
                        Status
                      </h4>
                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={filters.solved}
                            onCheckedChange={(checked) =>
                              updateFilters("solved", checked)
                            }
                          />
                          <span
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Solved
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={filters.unsolved}
                            onCheckedChange={(checked) =>
                              updateFilters("unsolved", checked)
                            }
                          />
                          <span
                            className={`${
                              isDarkMode ? "text-gray-300" : "text-gray-700"
                            }`}
                          >
                            Unsolved
                          </span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        } mb-2`}
                      >
                        Difficulty
                      </h4>
                      <div className="flex items-center gap-4">
                        {["Easy", "Medium", "Advanced"].map((difficulty) => (
                          <label
                            key={difficulty}
                            className="flex items-center gap-2 cursor-pointer"
                          >
                            <Checkbox
                              checked={filters.difficulties.includes(
                                difficulty.toLowerCase()
                              )}
                              onCheckedChange={(checked) => {
                                updateFilters(
                                  "difficulties",
                                  checked
                                    ? [
                                        ...filters.difficulties,
                                        difficulty.toLowerCase(),
                                      ]
                                    : filters.difficulties.filter(
                                        (d) => d !== difficulty.toLowerCase()
                                      )
                                );
                              }}
                            />
                            <span
                              className={`${
                                isDarkMode ? "text-gray-300" : "text-gray-700"
                              }`}
                            >
                              {difficulty}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4
                        className={`text-xs font-semibold ${
                          isDarkMode ? "text-gray-300" : "text-gray-700"
                        } mb-2`}
                      >
                        Companies
                      </h4>
                      <ScrollArea className="h-[160px] pr-2">
                        <div className="flex flex-wrap gap-2">
                          {availableCompanies.map((company) => (
                            <Badge
                              key={company}
                              variant={
                                filters.company.includes(company)
                                  ? "default"
                                  : "outline"
                              }
                              className={`cursor-pointer border ${
                                filters.company.includes(company)
                                  ? "bg-teal-500 text-white border-teal-500"
                                  : isDarkMode
                                  ? "bg-[#2f2f2f] text-gray-100 hover:bg-gray-600 border-gray-500"
                                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"
                              }`}
                              onClick={() => {
                                updateFilters(
                                  "company",
                                  filters.company.includes(company)
                                    ? filters.company.filter(
                                        (c) => c !== company
                                      )
                                    : [...filters.company, company]
                                );
                              }}
                            >
                              {company}
                              {filters.company.includes(company) && (
                                <X className="w-3 h-3 ml-1" />
                              )}
                            </Badge>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer isDarkMode={isDarkMode} />

      {/* Video Solution Dialog */}
      <Dialog open={isVideoPopupOpen} onOpenChange={setIsVideoPopupOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Solution Video</DialogTitle>
          </DialogHeader>
          <div className="relative pt-[56.25%]">
            {currentVideoId ? (
              <ReactPlayer
                url={currentVideoId}
                width="100%"
                height="100%"
                controls
                playing
                className="absolute top-0 left-0"
                onError={(e) => console.error("ReactPlayer error:", e)}
              />
            ) : (
              <p>No video URL available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Premium Feature Popup */}
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
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
              Premium Feature
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The <span className="font-semibold text-teal-500">Learn SQL</span>{" "}
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
}