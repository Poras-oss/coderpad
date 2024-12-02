'use client'

import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import queryString from 'query-string'
import { useNavigate } from 'react-router-dom'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react'
import { Video, FileText, ChevronDown, X, ArrowLeft, Search, Filter, Moon, Sun, Bookmark, BookmarkCheck, Loader2, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import ReactPlayer from 'react-player/youtube'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { toast } from 'react-toastify'
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ScrollArea } from "./ui/scroll-area"
import { Checkbox } from "./ui/checkbox"
import { Skeleton } from "./ui/skeleton"
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

export default function QuizApp() {
  const { isLoaded, isSignedIn, user } = useUser()
  const navigateTo = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedDifficulties, setSelectedDifficulties] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [selectedSubtopics, setSelectedSubtopics] = useState([])
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const [difficulties] = useState(['Easy', 'Medium', 'Advamce'])
  const [companies] = useState(['Amazon', 'Google', 'Microsoft', 'Facebook', 'Apple'])
  const [subtopics, setSubtopics] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [paginationInfo, setPaginationInfo] = useState({
    total: 0,
    totalPages: 0,
    currentPage: 1,
    next: null,
    previous: null
  })
  const [itemsPerPage] = useState(10)

  const parsed = queryString.parse(window.location.search)

  const subject = new URLSearchParams(window.location.search).get('subject') || 'mysql'
  const STORAGE_KEY = 'quiz-bookmarks'

  const [getUserID, setUserID] = useState('default')

  const [filters, setFilters] = useState({
    difficulties: [],
    companies: [],
    subtopics: [],
    search: '',
    bookmarked: false
  })

  const [availableSubtopics, setAvailableSubtopics] = useState([])
  const [availableCompanies, setAvailableCompanies] = useState([])
  const [bookmarkedQuizzes, setBookmarkedQuizzes] = useState(new Set())
   const [solvedQuestions, setSolvedQuestions] = useState(new Set())

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
      fetchBookmarks()
      fetchSolvedQuestions()
    }
  }, [user])

  const fetchQuizzes = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`https://server.datasenseai.com/test-series-coding/${subject}`, {
        params: {
          page: paginationInfo.currentPage,
          limit: itemsPerPage,
          difficulties: filters.difficulties.join(','),
          companies: filters.companies.join(','),
          subtopics: filters.subtopics.join(','),
          search: filters.search,
          bookmarked: filters.bookmarked
        }
      })
      
      if (response.data && typeof response.data === 'object') {
        const { total, totalPages, currentPage, next, previous, results } = response.data

        if (Array.isArray(results)) {
          setQuizzes(results)
          setPaginationInfo({
            total: total || 0,
            totalPages: totalPages || 1,
            currentPage: currentPage || 1,
            next,
            previous
          })
          
          const allSubtopics = [...new Set(results.flatMap(quiz => Array.isArray(quiz.subtopics) ? quiz.subtopics : []))]
          const allCompanies = [...new Set(results.flatMap(quiz => Array.isArray(quiz.companies) ? quiz.companies : []))]
          setAvailableSubtopics(allSubtopics)
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
  }, [subject, paginationInfo.currentPage, itemsPerPage, filters])

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
        const data = await response.json()
        const solvedSet = new Set(data.solvedQuestions.filter(id => id !== null))
        setSolvedQuestions(solvedSet)
      } else {
        throw new Error("Failed to fetch solved questions")
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
    }))
    setPaginationInfo(prev => ({ ...prev, currentPage: 1 }))
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
      return 'advance'
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
      case 'advance':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }
  
  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

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

  const handleStartQuiz = (quizID, userID, quizName) => {
    let route = '/quiz'
    if (subject.toLowerCase() === 'python') {
      route = '/pyQuiz'
    }
    
    navigateTo(`${route}?questionID=${quizID}&userID=${userID}`)
  }

  const toggleQuestionExpansion = (quizId) => {
    setExpandedQuestions(prev => ({...prev, [quizId]: !prev[quizId]}))
  }

  const shortenQuestion = (question, maxLength = 135) => {
    if (question.length <= maxLength) return question
    return question.substring(0, maxLength) + '...'
  }

  return (
    // <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark bg-[#141414]' : 'bg-gray-100'}`}>
    //   {/* Header */}
    //   <header className={`${isDarkMode ? 'bg-[#1d1d1d]' : 'bg-teal-600'} `}>
    //     <div className="container mx-auto px-4 py-4 flex justify-between items-center">
    //       <div className="flex items-center gap-4">
    //         <Button 
    //           variant="ghost" 
    //           onClick={() => window.top.location.href = 'https://practice.datasenseai.com'} 
    //           className={`${isDarkMode ? 'text-white hover:bg-[#2f2f2f]' : 'text-gray-700 hover:bg-gray-100'}`}
    //         >
    //           <ArrowLeft className="h-5 w-5" />
    //         </Button>
    //         <img src="./7.png" alt="Quiz App Logo" className="h-8" />
    //       </div>
          
    //       <div className="flex items-center space-x-4">
    //         <Button
    //           variant="ghost"
    //           size="icon"
    //           onClick={() => setIsDarkMode(!isDarkMode)}
    //           className={`${isDarkMode ? 'text-white hover:bg-[#2f2f2f]' : 'text-gray-700 hover:bg-gray-100'}`}
    //         >
    //           {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    //         </Button>
    //         {isLoaded && isSignedIn ? (
    //           <UserButton afterSignOutUrl={`/practice-area?subject=${subject}`} />
    //         ) : (
    //           <SignInButton mode="modal" fallbackRedirectUrl={`/practice-area?subject=${subject}`}>
    //             <Button size={"sm"} className={`${isDarkMode ? 'bg-green-600 hover:bg-green-700' : 'bg-green-600 hover:bg-green-700'} text-white`}>
    //               LogIn
    //             </Button>
    //           </SignInButton>
    //         )}
    //       </div>
    //     </div>
    //   </header>

    //   <main className="flex-1 flex">
    //     {/* Sidebar */}
    //     <aside className={`w-64 border-r ${isDarkMode ? 'border-[#2f2f2f] bg-[#1d1d1d]' : 'border-gray-200 bg-gray-50'} hidden md:block`}>
    //       <div className="p-4">
    //         <div className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
    //           <h2 className="text-sm font-semibold mb-2">STATUS</h2>
    //           <div className="space-y-2">
    //             <label className="flex items-center space-x-2 cursor-pointer">
    //               <Checkbox 
    //                 checked={filters.bookmarked} 
    //                 onCheckedChange={(checked) => updateFilters('bookmarked', checked)}
    //               />
    //               <span>Solved</span>
    //             </label>
    //             <label className="flex items-center space-x-2 cursor-pointer">
    //               <Checkbox />
    //               <span>Unsolved</span>
    //             </label>
    //           </div>
    //         </div>

    //         <div className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
    //           <h2 className="text-sm font-semibold mb-2">DIFFICULTY</h2>
    //           <div className="space-y-2">
    //             {['Easy', 'Medium', 'Advance'].map((difficulty) => (
    //               <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
    //                 <Checkbox
    //                   checked={filters.difficulties.includes(difficulty.toLowerCase())}
    //                   onCheckedChange={(checked) => {
    //                     updateFilters('difficulties', checked
    //                       ? [...filters.difficulties, difficulty.toLowerCase()]
    //                       : filters.difficulties.filter(d => d !== difficulty.toLowerCase())
    //                     )
    //                   }}
    //                 />
    //                 <span>{difficulty}</span>
    //               </label>
    //             ))}
    //           </div>
    //         </div>

    //         <div className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
    //           <h2 className="text-sm font-semibold mb-2">SUBTOPICS</h2>
    //           <ScrollArea className="h-[200px]">
    //             {availableSubtopics.map((subtopic) => (
    //               <label key={subtopic} className="flex items-center space-x-2 cursor-pointer mb-2">
    //                 <Checkbox
    //                   checked={filters.subtopics.includes(subtopic)}
    //                   onCheckedChange={(checked) => {
    //                     updateFilters('subtopics', checked
    //                       ? [...filters.subtopics, subtopic]
    //                       : filters.subtopics.filter(s => s !== subtopic)
    //                     )
    //                   }}
    //                 />
    //                 <span>{subtopic}</span>
    //               </label>
    //             ))}
    //           </ScrollArea>
    //         </div>

    //         <div className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
    //           <h2 className="text-sm font-semibold mb-2">COMPANIES</h2>
    //           <ScrollArea className="h-[200px]">
    //             {availableCompanies.map((company) => (
    //               <label key={company} className="flex items-center space-x-2 cursor-pointer mb-2">
    //                 <Checkbox
    //                   checked={filters.companies.includes(company)}
    //                   onCheckedChange={(checked) => {
    //                     updateFilters('companies', checked
    //                       ? [...filters.companies, company]
    //                       : filters.companies.filter(c => c !== company)
    //                     )
    //                   }}
    //                 />
    //                 <span>{company}</span>
    //               </label>
    //             ))}
    //           </ScrollArea>
    //         </div>
    //       </div>
    //     </aside>

    //     {/* Mobile Filter Button */}
    //     <Sheet>
    //       <SheetTrigger asChild>
    //       <Button 
    //         variant="outline" 
    //         className={`md:hidden fixed bottom-4 right-4 z-10 ${
    //           isDarkMode 
    //             ? 'bg-[#1d1d1d] text-white hover:bg-[#2f2f2f] border-[#2f2f2f]' 
    //             : 'bg-white text-gray-800 hover:bg-gray-100'
    //         }`}
    //       >
    //           <Filter className="mr-2 h-4 w-4" />
    //           Filters
    //         </Button>
    //       </SheetTrigger>
    //       <SheetContent side="left" className={`w-[300px] sm:w-[400px] ${
    //         isDarkMode ? 'bg-[#1d1d1d] text-white' : 'bg-white text-gray-800'
    //       }`}>
    //         <SheetHeader>
    //         <SheetTitle className={isDarkMode ? 'text-white' : 'text-gray-800'}>Filters</SheetTitle>
    //         <h4 className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
    //           Apply filters to narrow down the questions.
    //         </h4>
    //       </SheetHeader>
    //         <ScrollArea className="h-[calc(100vh-120px)] mt-4">
    //           <div className="p-4">
    //             {/* Mobile filters content - same as sidebar */}
    //             <div className="mb-6">
    //               <h2 className="text-sm font-semibold mb-2">STATUS</h2>
    //               <div className="space-y-2">
    //                 <label className="flex items-center space-x-2 cursor-pointer">
    //                   <Checkbox 
    //                     checked={filters.bookmarked} 
    //                     onCheckedChange={(checked) => updateFilters('bookmarked', checked)}
    //                   />
    //                   <span>Solved</span>
    //                 </label>
    //                 <label className="flex items-center space-x-2 cursor-pointer">
    //                   <Checkbox />
    //                   <span>Unsolved</span>
    //                 </label>
    //               </div>
    //             </div>
    //             <div className="mb-6">
    //               <h2 className="text-sm font-semibold mb-2">DIFFICULTY</h2>
    //               <div className="space-y-2">
    //                 {['Easy', 'Medium', 'advance'].map((difficulty) => (
    //                   <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
    //                     <Checkbox
    //                       checked={filters.difficulties.includes(difficulty.toLowerCase())}
    //                       onCheckedChange={(checked) => {
    //                         updateFilters('difficulties', checked
    //                           ? [...filters.difficulties, difficulty.toLowerCase()]
    //                           : filters.difficulties.filter(d => d !== difficulty.toLowerCase())
    //                         )
    //                       }}
    //                     />
    //                     <span>{difficulty}</span>
    //                   </label>
    //                 ))}
    //               </div>
    //             </div>
    //             <div className="mb-6">
    //               <h2 className="text-sm font-semibold mb-2">SUBTOPICS</h2>
    //               <ScrollArea className="h-[200px]">
    //                 {availableSubtopics.map((subtopic) => (
    //                   <label key={subtopic} className="flex items-center space-x-2 cursor-pointer mb-2">
    //                     <Checkbox
    //                       checked={filters.subtopics.includes(subtopic)}
    //                       onCheckedChange={(checked) => {
    //                         updateFilters('subtopics', checked
    //                           ? [...filters.subtopics, subtopic]
    //                           : filters.subtopics.filter(s => s !== subtopic)
    //                         )
    //                       }}
    //                     />
    //                     <span>{subtopic}</span>
    //                   </label>
    //                 ))}
    //               </ScrollArea>
    //             </div>
    //             <div>
    //               <h2 className="text-sm font-semibold mb-2">COMPANIES</h2>
    //               <ScrollArea className="h-[200px]">
    //                 {availableCompanies.map((company) => (
    //                   <label key={company} className="flex items-center space-x-2 cursor-pointer mb-2">
    //                     <Checkbox
    //                       checked={filters.companies.includes(company)}
    //                       onCheckedChange={(checked) => {
    //                         updateFilters('companies', checked
    //                           ? [...filters.companies, company]
    //                           : filters.companies.filter(c => c !== company)
    //                         )
    //                       }}
    //                     />
    //                     <span>{company}</span>
    //                   </label>
    //                 ))}
    //               </ScrollArea>
    //             </div>
    //           </div>
    //         </ScrollArea>
    //       </SheetContent>
    //     </Sheet>

    //     {/* Main Content */}
    //     <div className="flex-1">
    //       {/* Search Bar */}
    //       <div className={`p-4 border-b ${isDarkMode ?  'border-[#2f2f2f]' : 'border-gray-200'}`} >
    //         <Input
    //           type="text"
    //           placeholder="Search questions..."
    //           value={filters.search}
    //           onChange={(e) => updateFilters('search', e.target.value)}
    //           className={`max-w ${isDarkMode ? 'bg-[#2f2f2f] border-[#3f3f3f]' : 'bg-white border-gray-200'}`}
    //         />
    //       </div>

    //       {/* Questions List */}
    //       <ScrollArea className="h-[calc(100vh-120px)]">
    //         <div className="p-4">
    //           {isLoading ? (
    //             <div className="space-y-4">
    //               {[...Array(5)].map((_, index) => (
    //                 <Skeleton key={index} className="h-32" />
    //               ))}
    //             </div>
    //           ) : (
    //             <>
    //        {quizzes.map((quiz, index) => (
    //                 <div 
    //                   key={quiz._id} 
    //                   className={`mb-4 p-4 border ${isDarkMode ? 'border-[#2f2f2f] bg-[#1d1d1d]' : 'border-gray-200 bg-white'} rounded-lg`}
    //                 >
    //                   <div className="flex justify-between items-start">
    //                     <div>
    //                       <h3 className={`text-lg font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
    //                         {removeQuizTypePrefix(quiz.question_text)}
    //                       </h3>
    //                       <div className="flex items-center gap-2 mt-2">
    //                         <Badge className={`px-2 py-1 rounded-full font-semibold text-xs ${getDifficultyStyle(quiz.difficulty)}`}>
    //                           {capitalizeFirstLetter(quiz.difficulty)}
    //                         </Badge>
    //                         {quiz.subtopics && quiz.subtopics.map((subtopic, index) => (
    //                           <Badge key={index} variant="outline">
    //                             {subtopic}
    //                           </Badge>
    //                         ))}
    //                         {quiz.companies && quiz.companies.map((company, index) => (
    //                           <Badge key={index} variant="secondary">
    //                             {company}
    //                           </Badge>
    //                         ))}
    //                         {solvedQuestions.has(quiz._id) && (
    //                           <Badge variant="success"><div className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}>Solved</div></Badge>
    //                         )}
    //                       </div>
    //                     </div>
    //                     <div className="flex items-center gap-2">
    //                       <Button
    //                         variant="ghost"
    //                         size="icon"
    //                         onClick={(e) => toggleBookmark(quiz._id, e)}
    //                         className={isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'}
    //                       >
    //                         {bookmarkedQuizzes.has(quiz._id) ? (
    //                           <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
    //                         ) : (
    //                           <Star className="h-5 w-5" />
    //                         )}
    //                       </Button>
    //                       <Button
    //                         onClick={() => handleStartQuiz(quiz._id, user?.id, quiz.question_text)}
    //                         className="bg-cyan-600 hover:bg-cyan-700 text-white"
    //                       >
    //                         Solve
    //                       </Button>
    //                     </div>
    //                   </div>
    //                 </div>
    //               ))}

    //               {/* Pagination */}
    //               <div className="flex justify-center items-center mt-4 space-x-2">
    //                 <Button
    //                   onClick={() => setPaginationInfo(prev => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
    //                   disabled={paginationInfo.currentPage === 1}
    //                   variant="outline"
    //                   size="sm"
    //                   className={isDarkMode ? 'text-white border-[#2f2f2f]' : ''}
    //                 >
    //                   <ChevronLeft className="h-4 w-4" />
    //                   <span className="hidden sm:inline ml-1">Previous</span>
    //                 </Button>
    //                 <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : ''}`}>
    //                   Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
    //                 </span>
    //                 <Button
    //                   onClick={() => setPaginationInfo(prev => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, prev.totalPages) }))}
    //                   disabled={paginationInfo.currentPage === paginationInfo.totalPages}
    //                   variant="outline"
    //                   size="sm"
    //                   className={isDarkMode ? 'text-white border-[#2f2f2f]' : ''}
    //                 >
    //                   <span className="hidden sm:inline mr-1">Next</span>
    //                   <ChevronRight className="h-4 w-4" />
    //                 </Button>
    //               </div>
    //             </>
    //           )}
    //         </div>
    //       </ScrollArea>
    //     </div>
    //   </main>

    //   {/* Video Solution Dialog */}
    //   <Dialog open={isVideoPopupOpen} onOpenChange={setIsVideoPopupOpen}>
    //     <DialogContent className="sm:max-w-[800px]">
    //       <DialogHeader>
    //         <DialogTitle>Solution Video</DialogTitle>
    //       </DialogHeader>
    //       <div className="relative pt-[56.25%]">
    //         {currentVideoId ? (
    //           <ReactPlayer
    //             url={currentVideoId}
    //             width="100%"
    //             height="100%"
    //             controls
    //             playing
    //             className="absolute top-0 left-0"
    //             onError={(e) => console.error('ReactPlayer error:', e)}
    //           />
    //         ) : (
    //           <p>No video URL available</p>
    //         )}
    //       </div>
    //     </DialogContent>
    //   </Dialog>
    // </div>

    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-teal-500 text-white">
      <div className="text-center p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Coming Soon</h1>
        <p className="text-gray-600 mb-6">
          We're working hard to bring something amazing to you. Stay tuned!
        </p>
       
      </div>

    </div> 
  )
}

