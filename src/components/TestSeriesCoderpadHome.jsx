'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { Filter, Loader2, ChevronLeft, ChevronRight, Star, Briefcase, Hash } from 'lucide-react'
import ReactPlayer from 'react-player/youtube'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { toast } from 'react-toastify'
import { ScrollArea } from "./ui/scroll-area"
import { Checkbox } from "./ui/checkbox"
import RenderSubscription from './RenderSubscription';
import SubscriptionDialogue from './SubscriptionDialogue';
import { UserDetailModal } from "./UserDetailModal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import Navbar from './Navbar' // Add this import
import { set } from 'lodash'

const PREDEFINED_SUBTOPICS = ['Column Selection', 'filtering', 'multiple costraints', 'Custom Selection', 'Filtering', 'Condition', 'Aggregation', 'Group by', 'Filter', 'Top N', 'Rank', 'Group']
const PREDEFINED_PYTHON_TOPICS = ['Array', 'String', 'Two Pointers', 'Sliding Window', 'Dictionary', 'List', 'Tuples', 'Regex']

export default function QuizApp() {
  const { isLoaded, isSignedIn, user } = useUser()
  const navigateTo = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [getUserID, setUserID] = useState('default')
  const [isSubscriptionDialogueOpen, setIsSubscriptionDialogueOpen] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [filters, setFilters] = useState({
    difficulties: [],
    company: [],
    subtopics: [],
    search: '',
    bookmarked: false,
    solved: false
  })
  const [itemsPerPage] = useState(10)
  const [availableSubtopics] = useState(PREDEFINED_SUBTOPICS)
  const [availableCompanies, setAvailableCompanies] = useState([])
  const [bookmarkedQuizzes, setBookmarkedQuizzes] = useState(new Set())
  const [solvedQuestions, setSolvedQuestions] = useState(new Set())
const [paginationInfo, setPaginationInfo] = useState({
  total: 0,
  totalPages: 0,
  currentPage: parseInt(localStorage.getItem('currentPage') || '1', 10),
  next: null,
  previous: null
});
const [currentPage, setCurrentPage] = useState(parseInt(localStorage.getItem('currentPage') || '1', 10));
const [pageInput, setPageInput] = useState((localStorage.getItem('currentPage') || '1'));
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  let subject = new URLSearchParams(window.location.search).get('subject') || 'mysql'
  if(subject === 'sql'){subject = 'mysql'}
  const STORAGE_KEY = 'quiz-bookmarks'
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setUserID(user.id)
    }
  }, [isLoaded, isSignedIn, user])

  useEffect(() => {
    validateSubject()
    checkAndBreakOutOfIframe()
  }, [subject])

  useEffect(() => {
    fetchQuizzes()
  }, [paginationInfo.currentPage, filters])

  useEffect(() => {
    if (user && user.id) {
      console.log(user.id)
      fetchBookmarks()
      fetchSolvedQuestions()
    }
  }, [user])

  const fetchQuizzes = useCallback(async () => {
    try {
      setIsLoading(true)
      
      let url = `https://server.datasenseai.com/test-series-coding/${subject}`
      let params = {
        page: paginationInfo.currentPage,
        limit: itemsPerPage,
        difficulties: filters.difficulties.join(','),
        company: filters.company.join(','),
        subtopics: filters.subtopics.join(','),
        search: filters.search,
        searchFields: 'question_text,title,id' // Add this line to include ID in search
      }

      if (filters.bookmarked) {
        url = `https://server.datasenseai.com/bookmark/bookmarked-questions/${getUserID}`
        params = {
          ...params,
          subject
        }
      }

      const response = await axios.get(url, { params })
     
      
      if (response.data && typeof response.data === 'object') {
        let { total, totalPages, currentPage, next, previous, results } = response.data

        if (filters.bookmarked) {
          results = response.data.bookmarkedQuestions
          total = response.data.totalBookmarks
          totalPages = response.data.totalPages
          currentPage = response.data.currentPage
        }

        if (Array.isArray(results)) {
          let filteredQuizzes = results

          if (filters.solved) {
            filteredQuizzes = filteredQuizzes.filter(quiz => solvedQuestions.has(quiz._id))
          }

          setQuizzes(filteredQuizzes)
          const savedPage = parseInt(localStorage.getItem('currentPage') || '1', 10);
          // const newCurrentPage = currentPage || savedPage;
          setPaginationInfo({
            total: total || 0,
            totalPages: totalPages || 1,
            currentPage: currentPage || savedPage,
            next,
            previous
          })
          setCurrentPage(savedPage || currentPage)
          
          
          const allCompanies = [...new Set(results.flatMap(quiz => Array.isArray(quiz.company) ? quiz.company : []))]
          setAvailableCompanies(allCompanies)
        } else {
          console.error('Unexpected response structure: results is not an array', response.data)
          toast.error("Received unexpected data format. Please try again later.")
        }
      } else {
        console.error('Unexpected response structure:', response.data)
        toast.error("Received unexpected data format. Please try again later.")
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      toast.error("Failed to fetch quizzes. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [subject, paginationInfo.currentPage, itemsPerPage, filters, solvedQuestions, getUserID])

  const fetchBookmarks = async () => {
    if (!user || !user.id) return

    try {
      const response = await fetch(`https://server.datasenseai.com/bookmark/bookmarks/${user.id}`)
      if (response.ok) {
        const data = await response.json()
        const bookmarkSet = new Set(data.bookmarks)
        setBookmarkedQuizzes(bookmarkSet)
      } else {
        throw new Error("Failed to fetch bookmarks")
      }
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
      toast.error("Failed to fetch bookmarks. Please try again later.")
    }
  }

  const fetchSolvedQuestions = async () => {
    if (!user || !user.id) return

    try {
      const response = await fetch(`https://server.datasenseai.com/question-attempt/solved/${user.id}`)
      if (response.ok) {
        const data = await response.json();
        // Filter out null values and store them in a Set
        const solvedSet = new Set(data.solvedQuestions.filter(item => item !== null));
        setSolvedQuestions(solvedSet);
        console.log(solvedSet);
      } else {
        throw new Error("Failed to fetch solved questions");
      }
      
    } catch (error) {
      console.error("Error fetching solved questions:", error)
      toast.error("Failed to fetch solved questions. Please try again later.")
    }
  }

  const updateFilters = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    
    // When changing filters, either reset to page 1 or keep current page based on your preference
    const newPage = 1; // Reset to page 1 when filters change
    setCurrentPage(newPage);
    localStorage.setItem('currentPage', newPage.toString());
    setPageInput(newPage.toString());
    setPaginationInfo(prev => ({ ...prev, currentPage: newPage }));
  }

  const openVideoPopup = (quiz) => {
    if (quiz.video) {
      const videoId = extractYoutubeId(quiz.video)
      if (videoId) {
        setCurrentVideoId(`https://www.youtube.com/watch?v=${videoId}`)
        setIsVideoPopupOpen(true)
      } else {
        console.error('Invalid YouTube URL:', quiz.video)
        toast.error('Invalid YouTube URL')
      }
    } else {
      console.log('No video available for this quiz')
      toast.info('Video coming soon...')
    }
  }
  
  const extractYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = url.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
  }

  const closeVideoPopup = () => {
    setIsVideoPopupOpen(false)
    setCurrentVideoId('')
  }

  const checkAndBreakOutOfIframe = () => {
    if (window.self !== window.top) {
      const currentUrl = window.location.href
      const storageKey = 'iframeBreakoutAttempt'
      const breakoutAttempt = sessionStorage.getItem(storageKey)

      if (!breakoutAttempt) {
        sessionStorage.setItem(storageKey, 'true')
        window.top.location.href = currentUrl
      } else {
        sessionStorage.removeItem(storageKey)
      }
    }
  }

  const normalizeDifficulty = (difficulty) => {
    if (!difficulty) {
      return 'easy'
    }

    const normalized = difficulty.toLowerCase()
    if (normalized === 'advance' || normalized === 'advanced') {
      return 'advanced'
    }

    return normalized
  }

  const getDifficultyStyle = (difficulty) => {
    const normalizedDifficulty = normalizeDifficulty(difficulty)
    switch (normalizedDifficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advance':
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }
  
  const capitalizeFirstLetter = (string) => {
    if (!string || typeof string !== 'string') {
      return ''; // Return empty string if input is null, undefined, or not a string
    }
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  

  const validateSubject = () => {
    const validSubjects = ['mysql', 'python', 'tableau', 'excel', 'powerbi']
    
    if (!subject) {
      toast.error('URL is malformed. Subject is missing.')
      redirectToHomePage()
    } else if (!validSubjects.includes(subject.toLowerCase())) {
      toast.error('URL is malformed. Invalid subject.')
      redirectToHomePage()
    } else if (['excel', 'powerbi', 'tableau'].includes(subject.toLowerCase())) {
      redirectToScenarioPage(subject.toLowerCase())
    } else {
      fetchQuizzes()
    }
  }

  const redirectToHomePage = () => {
    window.top.location.href = 'https://practice.datasenseai.com/'
  }

  const redirectToScenarioPage = (subject) => {
    window.location.href = `/scenario-area?subject=${subject}`
  }

  const removeQuizTypePrefix = (quizName) => {
    return quizName.replace(/^(sql:|python:|mcq:)\s*/i, '')
  }

  const toggleBookmark = async (quizId, e) => {
    e.stopPropagation()

    if (!user || !user.id) {
      toast.error("Please sign in to bookmark questions.")
      return
    }

    const isCurrentlyBookmarked = bookmarkedQuizzes.has(quizId)
    const endpoint = isCurrentlyBookmarked ? 'unbookmark' : 'bookmark'

    try {
      // Optimistically update UI
      const newBookmarks = new Set(bookmarkedQuizzes)
      if (isCurrentlyBookmarked) {
        newBookmarks.delete(quizId)
      } else {
        newBookmarks.add(quizId)
      }
      setBookmarkedQuizzes(newBookmarks)

      // Make API call
      const response = await fetch(`https://server.datasenseai.com/bookmark/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerkId: getUserID,
          questionId: quizId,
        }),
      })

      if (!response.ok) {
        throw new Error(`Failed to ${endpoint} question`)
      }

      await response.json()
      toast.success(isCurrentlyBookmarked ? "Removed from bookmarks!" : "Added to bookmarks!")

    } catch (error) {
      console.error('Error updating bookmark:', error)
      // Revert the optimistic update
      const revertedBookmarks = new Set(bookmarkedQuizzes)
      setBookmarkedQuizzes(revertedBookmarks)
      
      toast.error(`Failed to ${isCurrentlyBookmarked ? 'remove' : 'add'} bookmark. Please try again.`)
    }
  }



  const handleStartQuiz = async (quizID, userID, quizName) => {
    let route = '/quiz';
    if (subject.toLowerCase() === 'python') {
      route = '/pyQuiz';
    }
  
    if (!isSignedIn) {
      alert(`You're not logged in`);
      return;
    }
  
    // Check subscription status from localStorage
    // const subscriptionData = JSON.parse(localStorage.getItem('subscriptionStatus'));
  
    // if (!subscriptionData || subscriptionData.message === 'User not subscribed') {
    //   setSubscriptionStatus('not_premium');
    //   setIsSubscriptionDialogueOpen(true);
    //   return;
    // }
  
    // if (subscriptionData.message === 'Subscription Expired') {
    //   setSubscriptionStatus('expired');
    //   setIsSubscriptionDialogueOpen(true);
    //   return;
    // }
  
    // Check if `userRegistered` exists in localStorage
    const userRegistered = localStorage.getItem('userRegistered');
  
    // Direct quiz access - bypass profile check in development
    if (process.env.NODE_ENV === 'development') {
      window.open(`${route}?questionID=${quizID}&userID=${userID}`, '_blank');
      return;
    }
  
    if (userRegistered === 'true') {
      // User is already registered, start the quiz
      window.open(`${route}?questionID=${quizID}&userID=${userID}`, '_blank');
      return;
    }
  
    // If `userRegistered` doesn't exist or is false, check with the server
    try {
      // Use a fallback ID if userID is not available
      const effectiveUserID = userID || 'default';
      
      const response = await fetch(`https://server.datasenseai.com/user-details/profile-status/${effectiveUserID}`);
      const data = await response.json();
  
      if (response.ok) {
        if (data.isProfileComplete) {
          localStorage.setItem('userRegistered', 'true');
          window.open(`${route}?questionID=${quizID}&userID=${effectiveUserID}`, '_blank');
        } else {
          setIsModalOpen(true);
        }
      } else {
        // If profile status check fails, still allow quiz access but show a warning
        console.warn('Profile status check failed, proceeding anyway');
        window.open(`${route}?questionID=${quizID}&userID=${effectiveUserID}`, '_blank');
      }
    } catch (error) {
      console.error('Error while checking user profile status:', error);
      // On error, still allow access but log the error
      window.open(`${route}?questionID=${quizID}&userID=${userID || 'default'}`, '_blank');
    }
  };

  const handleModalClose = (success) => {
    setIsModalOpen(false)
    if (success) {
      // If the modal was closed successfully (user details saved),
      // we can start the quiz
      alert('Details are recorded, You can attempt the question now');
    }
  }
  
  const handlePageChange = useCallback((newPage) => {

    setPageInput(newPage.toString()); 
    if (newPage >= 1 && newPage <= paginationInfo.totalPages && newPage !== currentPage) {
      setCurrentPage(newPage);
      localStorage.setItem('currentPage', newPage.toString());
      setPageInput(newPage.toString());
      setPaginationInfo(prev => ({ ...prev, currentPage: newPage }));
      window.scrollTo(0, 0);
    }
  }, [paginationInfo.totalPages, currentPage]);

  const renderPaginationButtons = useCallback(() => {
    const pageNumbers = [];
    const totalPages = paginationInfo.totalPages;
    const currentPage = paginationInfo.currentPage;
    
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);
    
    if (endPage - startPage < 4) {
      startPage = Math.max(1, endPage - 4);
    }

    // Always show first page
    if (startPage > 1) {
      pageNumbers.push(
        <Button
          key={1}
          onClick={() => handlePageChange(1)}
          variant="outline"
          size="sm"
          className={isDarkMode ? 'text-white border-[#2f2f2f]' : ''}
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pageNumbers.push(<span key="ellipsis1">...</span>);
      }
    }

    // Show page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handlePageChange(i)}
          variant={i === currentPage ? "default" : "outline"}
          size="sm"
          className={isDarkMode ? 'text-white border-[#2f2f2f]' : ''}
        >
          {i}
        </Button>
      );
    }

    // Always show last page
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
          className={isDarkMode ? 'text-white border-[#2f2f2f]' : ''}
        >
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  }, [paginationInfo.totalPages, paginationInfo.currentPage, isDarkMode, handlePageChange]);

  const handleGoToPage = () => {
    const page = parseInt(pageInput, 10);
    if (page >= 1 && page <= paginationInfo.totalPages) {
      handlePageChange(page);
    } else {
      toast.error(`Please enter a valid page number between 1 and ${paginationInfo.totalPages}`);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    const savedPage = localStorage.getItem('currentPage');
    if (savedPage !== null) {
      setCurrentPage(parseInt(savedPage, 10));
    }
  }, []);

  return (

    
    <div className={`font-sans flex flex-col min-h-screen ${isDarkMode ? 'dark bg-[#141414]' : 'bg-gray-200'}`}>
      {/* Replace old header with Navbar component */}
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      <main className="flex-1 flex">

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

      {/* Sidebar Toggle Button */}
{/* Remove or comment out the current button code */}
{/* <button
  onClick={toggleSidebar}
  className={`absolute top-4 left-4 z-50 p-2 rounded-full shadow-lg ${
    isDarkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  }`}
  ...
</button> */}

      {/* Sidebar */}                          
      {isSidebarOpen && (
        <aside className={`w-64 border-r ${isDarkMode ? 'border-[#2f2f2f] dark bg-[#141414]' : 'border-gray-300 bg-gray-200'} hidden md:block`}>
          <div className="p-4">
            <div className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              <h2 className="text-sm font-semibold mb-2">STATUS</h2>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox 
                    checked={filters.solved} 
                    onCheckedChange={(checked) => updateFilters('solved', checked)}
                />
                <span>Solved</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox 
                  checked={filters.bookmarked}
                  onCheckedChange={(checked) => updateFilters('bookmarked', checked)}
                />
                <span>Bookmarked</span>
              </label>
            </div>
          </div>

          <div className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <h2 className="text-sm font-semibold mb-2">DIFFICULTY</h2>
            <div className="space-y-2">
              {['Easy', 'Medium', 'Advanced'].map((difficulty) => (
                <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
                  <Checkbox
                    checked={filters.difficulties.includes(difficulty.toLowerCase())}
                    onCheckedChange={(checked) => {
                      updateFilters('difficulties', checked
                        ? [...filters.difficulties, difficulty.toLowerCase()]
                        : filters.difficulties.filter(d => d !== difficulty.toLowerCase())
                      )
                    }}
                  />
                  <span>{difficulty}</span>
                </label>
              ))}
            </div>
          </div>

          <div className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <h2 className="text-sm font-semibold mb-2">SUBTOPICS</h2>
            <ScrollArea className="h-[200px]">
            {subject === "python" ? (
  PREDEFINED_PYTHON_TOPICS.map((topic) => (
    <Badge
      key={topic}
      variant={(filters?.topics || []) ? "default" : "outline"}
      className={`cursor-pointer border ${
        (filters?.topics || []).includes(topic)
          ? 'bg-blue-500 text-white border-blue-500' // Active styles
          : isDarkMode
          ? 'bg-[#2f2f2f] text-gray-100 hover:bg-gray-600 border-gray-500' // Inactive styles in dark mode
          : 'bg-gray-100 text-gray-500 hover:bg-gray-300 border-gray-200' // Inactive styles in light mode
      }`}
      onClick={() => {
        updateFilters(
          'topics',
          filters.topics.includes(topic)
            ? filters.topics.filter(t => t !== topic)
            : [...filters.topics, topic]
        );
      }}
    >
      {topic}
      {(filters?.topics || []).includes(topic) && (
        <X className="w-3 h-3 ml-1" />
      )}
    </Badge>
  ))
) : (
  PREDEFINED_SUBTOPICS.map((subtopic) => (
    <Badge
      key={subtopic}
      variant={filters.subtopics.includes(subtopic) ? "default" : "outline"}
      className={`cursor-pointer border ${
        filters.subtopics.includes(subtopic)
          ? 'bg-teal-500 text-white border-teal-500' // Active styles
          : isDarkMode
          ? 'bg-[#2f2f2f] text-gray-100 hover:bg-gray-600 border-gray-500' // Inactive styles in dark mode
          : 'bg-gray-100 text-gray-500 hover:bg-gray-300 border-gray-200' // Inactive styles in light mode
      }`}
      onClick={() => {
        updateFilters(
          'subtopics',
          filters.subtopics.includes(subtopic)
            ? filters.subtopics.filter(s => s !== subtopic)
            : [...filters.subtopics, subtopic]
        );
      }}
    >
      {subtopic}
      {filters.subtopics.includes(subtopic) && (
        <X className="w-3 h-3 ml-1" />
      )}
    </Badge>
  ))
)}

            </ScrollArea>
          </div>

          <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <h2 className="text-sm font-semibold mb-2">COMPANIES</h2>
            <ScrollArea className="h-[200px]">
              {availableCompanies.map((company) => (
              <Badge
              key={company}
              variant={filters.company.includes(company) ? "default" : "outline"}
              className={`cursor-pointer border ${
                filters.company.includes(company)
                ? 'bg-teal-500 text-white border-teal-500' // Active styles
                : isDarkMode
                ? 'bg-[#2f2f2f] text-gray-100 hover:bg-gray-600 border-gray-500' // Inactive styles in dark mode
                : 'bg-gray-100 text-gray-500 hover:bg-gray-300 border-gray-200' // Inactive styles in light mode
              }`}
              onClick={() => {
                updateFilters(
                  'company', 
                  filters.company.includes(company)
                    ? filters.company.filter(c => c !== company)
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
            </ScrollArea>
          </div>
        </div>
      </aside>
      )}

      {/* Mobile Filter Button */}
      <Sheet>
        <SheetTrigger asChild>
        <Button 
          variant="outline" 
          className={`md:hidden fixed bottom-4 right-4 z-10 ${
            isDarkMode 
              ? 'bg-[#1d1d1d] text-white hover:bg-[#2f2f2f] border-[#2f2f2f]' 
              : 'bg-white text-gray-800 hover:bg-gray-100'
          }`}
        >
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className={`w-[300px] sm:w-[400px] ${
          isDarkMode ? 'bg-[#1d1d1d] text-white' : 'bg-white text-gray-800'
        }`}>
          <SheetHeader>
          <SheetTitle className={isDarkMode ? 'text-white' : 'text-gray-800'}>Filters</SheetTitle>
          <h4 className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Apply filters to narrow down the questions.
          </h4>
        </SheetHeader>
          <ScrollArea className="h-[calc(100vh-120px)] mt-4">
            <div className="p-4">
              {/* Mobile filters content - same as sidebar */}
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2">STATUS</h2>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox 
                      checked={filters.solved} 
                      onCheckedChange={(checked) => updateFilters('solved', checked)}
                    />
                    <span>Solved</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox 
                      checked={filters.bookmarked}
                      onCheckedChange={(checked) => updateFilters('bookmarked', checked)}
                    />
                    <span>Bookmarked</span>
                  </label>
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2">DIFFICULTY</h2>
                <div className="space-y-2">
                  {['Easy', 'Medium', 'Advance'].map((difficulty) => (
                    <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
                      <Checkbox
                        checked={filters.difficulties.includes(difficulty.toLowerCase())}
                        onCheckedChange={(checked) => {
                          updateFilters('difficulties', checked
                            ? [...filters.difficulties, difficulty.toLowerCase()]
                            : filters.difficulties.filter(d => d !== difficulty.toLowerCase())
                          )
                        }}
                      />
                      <span>{difficulty}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="mb-6">
                <h2 className="text-sm font-semibold mb-2">SUBTOPICS</h2>
                <ScrollArea className="h-[200px]">
                {subject === "python" ? (
  PREDEFINED_PYTHON_TOPICS.map((topic) => (
    <Badge
      key={topic}
      variant={(filters?.topics || []) ? "default" : "outline"}
      className={`cursor-pointer border ${
        (filters?.topics || []).includes(topic)
          ? 'bg-blue-500 text-white border-blue-500' // Active styles
          : isDarkMode
          ? 'bg-[#2f2f2f] text-gray-100 hover:bg-gray-600 border-gray-500' // Inactive styles in dark mode
          : 'bg-gray-100 text-gray-500 hover:bg-gray-300 border-gray-200' // Inactive styles in light mode
      }`}
      onClick={() => {
        updateFilters(
          'topics',
          filters.topics.includes(topic)
            ? filters.topics.filter(t => t !== topic)
            : [...filters.topics, topic]
        );
      }}
    >
      {topic}
      {(filters?.topics || []).includes(topic) && (
        <X className="w-3 h-3 ml-1" />
      )}
    </Badge>
  ))
) : (
  PREDEFINED_SUBTOPICS.map((subtopic) => (
    <Badge
      key={subtopic}
      variant={filters.subtopics.includes(subtopic) ? "default" : "outline"}
      className={`cursor-pointer border ${
        filters.subtopics.includes(subtopic)
          ? 'bg-teal-500 text-white border-teal-500' // Active styles
          : isDarkMode
          ? 'bg-[#2f2f2f] text-gray-100 hover:bg-gray-600 border-gray-500' // Inactive styles in dark mode
          : 'bg-gray-100 text-gray-500 hover:bg-gray-300 border-gray-200' // Inactive styles in light mode
      }`}
      onClick={() => {
        updateFilters(
          'subtopics',
          filters.subtopics.includes(subtopic)
            ? filters.subtopics.filter(s => s !== subtopic)
            : [...filters.subtopics, subtopic]
        );
      }}
    >
      {subtopic}
      {filters.subtopics.includes(subtopic) && (
        <X className="w-3 h-3 ml-1" />
      )}
    </Badge>
  ))
)}
                </ScrollArea>
              </div>
              <div>
                <h2 className="text-sm font-semibold mb-2">COMPANIES</h2>
                <ScrollArea className="h-[200px]">
                  {availableCompanies.map((company) => (
                    <label key={company} className="flex items-center space-x-2 cursor-pointer mb-2">
                      <Checkbox
                        checked={filters.company.includes(company)}
                        onCheckedChange={(checked) => {
                          updateFilters('company', checked
                            ? [...filters.company, company]
                            : filters.company.filter(c => c !== company)
                          )
                        }}
                      />
                      <span>{company}</span>
                    </label>
                  ))}
                </ScrollArea>
              </div>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search Bar */}
        <div className={`p-4 border-b ${isDarkMode ? 'border-[#2f2f2f]' : 'border-gray-200'} flex items-center gap-4`}>
  <button
    onClick={toggleSidebar}
    className={`p-2 hover:bg-opacity-80 rounded transition-colors ${
      isDarkMode 
        ? 'hover:bg-[#2f2f2f] text-gray-300' 
        : 'hover:bg-gray-100 text-gray-700'
    }`}
    aria-label="Toggle sidebar"
  >
    {isSidebarOpen ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    )}
  </button>
  <Input
    type="text"
    placeholder="Search questions..."
    value={filters.search}
    onChange={(e) => updateFilters('search', e.target.value)}
    className={`w-full ${
      isDarkMode 
        ? 'bg-[#2f2f2f] border-[#3f3f3f] text-white' 
        : 'bg-white border-gray-200'
    }`}
  />
</div>

        {/* Questions List */}
        <ScrollArea className="h-[calc(100vh-120px)]">
          <div className="p-4">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center p-8">
                          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
                          <h4  className={`mt-4 text-lg font-medium ${ isDarkMode ? 'text-white' : 'text-black'}`}>Fetching questions...</h4>
                        </div>
            ): quizzes.length === 0 ? (
              <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <p className="text-xl font-semibold">No questions available</p>
                <p className="mt-2">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <>
                {quizzes.map((quiz, index) => {
                  // console.log(quiz._id.toString())
                  const questionNumber = (paginationInfo.currentPage - 1) * itemsPerPage + index + 1;
                  return (
                    <div 
                      key={quiz._id} 
                      className={`mb-4 p-4 border ${isDarkMode ? 'border-[#2f2f2f] bg-[#1d1d1d]' : 'border-gray-200 bg-white'} shadow-sm rounded-lg`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {questionNumber}. {quiz.title ?? removeQuizTypePrefix(quiz.question_text)}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge className={`px-2 py-1 rounded-full font-semibold text-xs ${getDifficultyStyle(quiz.difficulty)}`}>
                              {capitalizeFirstLetter(quiz.difficulty)}
                            </Badge>
                            {quiz.id && (
                              <Badge variant="secondary" className={`flex items-center gap-1 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
                                <Hash className="h-3 w-3" />
                                {quiz.id.toUpperCase()}
                              </Badge>
                            )}
                            {/* {quiz.subtopics && quiz.subtopics.map((subtopic, subIndex) => (
                              <Badge key={subIndex} variant="secondary" className={`flex items-center gap-1 ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-700'}`}>
                                <BookOpen className="h-3 w-3" />
                                {subtopic}
                              </Badge>
                            ))} */}
                            {quiz.company && quiz.company.map((company, compIndex) => (
                              <Badge key={compIndex} variant="secondary" className={`flex items-center gap-1 ${isDarkMode ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
                                <Briefcase className="h-3 w-3" />
                                {company}
                              </Badge>
                            ))}
                            {solvedQuestions.has(quiz._id) && (
                              <Badge variant="success" className={isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-700'}>Solved</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => toggleBookmark(quiz._id, e)}
                            className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
                          >
                            {bookmarkedQuizzes.has(quiz._id) ? (
                              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <Star className="h-5 w-5" />
                            )}
                          </Button>
                          <Button
                            onClick={() => handleStartQuiz(quiz._id, user?.id, quiz.question_text)}
                            className={`${isDarkMode ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-cyan-600 hover:bg-cyan-700'} text-white`}
                          >
                            Solve
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </ScrollArea>
      </div>
    </main>

    {/* Pagination */}
    <div className="flex flex-wrap justify-center items-center mt-4 space-x-2 space-y-2 p-4">
      <Button
        onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
        disabled={paginationInfo.currentPage === 1}
        variant="outline"
        size="sm"
        className={isDarkMode ? 'text-white border-[#2f2f2f]' : ''}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </Button>
      
      {renderPaginationButtons()}

      <Button
        onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
        disabled={paginationInfo.currentPage === paginationInfo.totalPages}
        variant="outline"
        size="sm"
        className={isDarkMode ? 'text-white border-[#2f2f2f]' : ''}
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="flex items-center space-x-2 mt-2 sm:mt-0 sm:ml-4">
        <Input
          type="number"
          min={1}
          max={paginationInfo.totalPages}
          value={pageInput}
          onChange={(e) => setPageInput(e.target.value)}
          className={`w-16 ${
            isDarkMode
              ? 'bg-[#2f2f2f] border-[#3f3f3f] text-white'
              : 'bg-white border-gray-200'
          }`}
        />
        <Button
          onClick={handleGoToPage}
          variant="outline"
          size="sm"
          className={isDarkMode ? 'text-white border-[#2f2f2f]' : ''}
        >
          Go
        </Button>
      </div>
    </div>
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
              onError={(e) => console.error('ReactPlayer error:', e)}
            />
          ) : (
            <p>No video URL available</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  </div>

  )
}

