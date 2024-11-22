'use client'


import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import queryString from 'query-string'
import { useNavigate } from 'react-router-dom'
import { useUser, SignInButton, UserButton } from '@clerk/clerk-react'
import { Video, FileText, ChevronDown, X, ArrowLeft, Search, Filter, Moon, Sun, Bookmark, BookmarkCheck, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactPlayer from 'react-player/youtube'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { toast } from 'react-toastify';
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

export default function Component() {
  const { isLoaded, isSignedIn, user } = useUser()
  const navigateTo = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedDifficulties, setSelectedDifficulties] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [selectedSubtopics, setSelectedSubtopics] = useState([])
  const [expandedQuestions, setExpandedQuestions] = useState({})
  const [difficulties] = useState(['Easy', 'Medium', 'Hard'])
  const [companies] = useState(['Amazon', 'Google', 'Microsoft', 'Facebook', 'Apple'])
  const [subtopics, setSubtopics] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false)
  const [currentVideoId, setCurrentVideoId] = useState('')
  const [isLoading, setIsLoading] = React.useState(true);
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
  const STORAGE_KEY = 'quiz-bookmarks';

  const [getUserID, setUserID] = useState('default');

  useEffect(() => {
    // Check if user is loaded and signed in before accessing user.id
    if (isLoaded && isSignedIn) {
      setUserID(user.id);
      console.log('user id -> '+user.id);
    }
  }, [ isSignedIn, user?.id]);

  useEffect(() => {
    validateSubject()
    checkAndBreakOutOfIframe()
  }, [subject])

  const [filters, setFilters] = useState({
    difficulties: [],
    companies: [],
    subtopics: [],
    search: '',
    bookmarked: false
  })

  const [availableSubtopics, setAvailableSubtopics] = useState([])
  const [availableCompanies, setAvailableCompanies] = useState([])



  useEffect(() => {
    fetchQuizzes()
  }, [paginationInfo.currentPage, filters])



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
          
          // Extract unique subtopics and companies from all quizzes
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

  useEffect(() => {
    fetchQuizzes()
  }, [fetchQuizzes])

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
        alert('Invalid YouTube URL')
      }
    } else {
      console.log('No video available for this quiz')
      alert('Video coming soon...')
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
    const normalized = difficulty.toLowerCase()
    if (normalized === 'advance' || normalized === 'advanced') {
      return 'hard'
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
      case 'hard':
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
      showPopup('URL is malformed. Subject is missing.')
      redirectToHomePage()
    } else if (!validSubjects.includes(subject.toLowerCase())) {
      showPopup('URL is malformed. Invalid subject.')
      redirectToHomePage()
    } else if (subject.toLowerCase() == 'excel' || subject.toLowerCase() == 'powerbi'|| subject.toLowerCase() == 'tableau') {
      redirectToScenarioPage(subject.toLowerCase())
    }  else {
      fetchQuizzes()
    }
  }

  const showPopup = (message) => {
    alert(message)
  }

  const redirectToHomePage = () => {
    window.top.location.href = 'https://practice.datasenseai.com/'
  }

  const redirectToScenarioPage = (subject) => {
    window.location.href = '/scenario-area?subject='+subject
  }

  const removeQuizTypePrefix = (quizName) => {
    return quizName.replace(/^(sql:|python:|mcq:)\s*/i, '')
  }




  const [bookmarkedQuizzes, setBookmarkedQuizzes] = React.useState(new Set());
  useEffect(() => {
    const loadBookmarks = async () => {
      if (!user || !user.id) {
        toast.error("Please sign in first!");
       
        return;
      }
  
      try {
        // Fetch bookmarks from the API
        await fetchBookmarks();
      } catch (error) {
        console.error("Error loading bookmarks:", error);
        toast.error("Failed to load bookmarks. Please try again later.");
      } finally {
       
      }
    };
  
    if (user && user.id) {
      loadBookmarks();
    }
  }, [user]);
  
  const fetchBookmarks = async () => {
    if (!user || !user.id) return;
  
    try {
      const response = await fetch(`https://server.datasenseai.com/bookmark/bookmarks/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data);
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
  

  const toggleBookmark = async (quizId, e) => {
    e.stopPropagation();

    if (!user || !user.id) {
      toast.error("Please sign in to bookmark questions.");
      return;
    }

   

    const isCurrentlyBookmarked = bookmarkedQuizzes.has(quizId);
    const endpoint = isCurrentlyBookmarked ? 'unbookmark' : 'bookmark';

    try {
      // Optimistically update UI
      const newBookmarks = new Set(bookmarkedQuizzes);
      if (isCurrentlyBookmarked) {
        newBookmarks.delete(quizId);
      } else {
        newBookmarks.add(quizId);
      }
      setBookmarkedQuizzes(newBookmarks);
      localStorage.setItem(`${STORAGE_KEY}-${user.id}`, JSON.stringify(Array.from(newBookmarks)));

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
      });

      if (!response.ok) {
        throw new Error(`Failed to ${endpoint} question`+getUserID);
      }

      const data = await response.json();
      toast.success("Added to bookmarks!");

    } catch (error) {
      console.error('Error updating bookmark:', error);
      // Revert the optimistic update
      const revertedBookmarks = new Set(bookmarkedQuizzes);
      setBookmarkedQuizzes(revertedBookmarks);
      localStorage.setItem(`${STORAGE_KEY}-${user.id}`, JSON.stringify(Array.from(revertedBookmarks)));
      
      toast.error(`Failed to ${isCurrentlyBookmarked ? 'remove' : 'add'} bookmark. Please try again.`);
    }
  }


  const handleStartQuiz = (quizID, userID, quizName) => {
    let route = '/quiz'
    if (subject.toLowerCase() === 'python') {
      route = '/pyQuiz'
    }
    
    navigateTo(`${route}?questionID=${quizID}&userID=${userID}`)
  }

  const determineButtonLabel = (quiz) => {
    // Implement button label logic here
    return 'Start Quiz'
  }

  const determineButtonColor = (quiz) => {
    // Implement button color logic here
    return 'bg-blue-500 hover:bg-blue-600 text-white'
  }

  const filteredQuizzes = quizzes.filter(quiz => {
    const difficultyMatch = selectedDifficulties.length === 0 || selectedDifficulties.includes(normalizeDifficulty(quiz.difficulty))
    const companyMatch = selectedCompanies.length === 0 || selectedCompanies.includes(quiz.company)
    const subtopicMatch = selectedSubtopics.length === 0 || quiz.subtopic.some(topic => selectedSubtopics.includes(topic))
    const searchMatch = !searchTerm || quiz.quizName.toLowerCase().includes(searchTerm.toLowerCase())
    const bookmarkMatch = !showBookmarkedOnly || bookmarkedQuizzes.has(quiz._id)
    return difficultyMatch && companyMatch && subtopicMatch && searchMatch && bookmarkMatch
  })

  const createMarkup = (htmlContent) => {
    return { __html: htmlContent }
  }

  const toggleQuestionExpansion = (quizId) => {
    setExpandedQuestions(prev => ({...prev, [quizId]: !prev[quizId]}))
  }

  const shortenQuestion = (question, maxLength = 135) => {
    if (question.length <= maxLength) return question
    return question.substring(0, maxLength) + '...'
  }







  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'dark' : ''}`}>
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Button variant="ghost" onClick={() => window.top.location.href = 'https://practice.datasenseai.com'}>
            <ArrowLeft className="mr-2" size={16} />
            Back to Home
          </Button>
          <h1 className="text-2xl font-bold text-center flex-1">{subject.toUpperCase()} Coding Platform</h1>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            {isLoaded && isSignedIn ? (
              <div className="flex items-center space-x-2">
                <span className="text-sm">Welcome, {user?.firstName}</span>
                <UserButton afterSignOutUrl={`/practice-area?subject=${subject}`} />
              </div>
            ) : (
              <SignInButton mode="modal" fallbackRedirectUrl={`/practice-area?subject=${subject}`} signUpForceRedirectUrl={`/practice-area?subject=${subject}`}>
                <Button>Log In</Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <ScrollArea className="w-1/4 p-4">
          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Search and Filters</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                type="text"
                placeholder="Search questions..."
                value={filters.search}
                onChange={(e) => updateFilters('search', e.target.value)}
                className="mb-4"
              />
              <div className="flex items-center space-x-2 mb-4">
                <Checkbox
                  id="show-bookmarked"
                  checked={filters.bookmarked}
                  onCheckedChange={(checked) => updateFilters('bookmarked', checked)}
                />
                <label
                  htmlFor="show-bookmarked"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show Bookmarked Only
                </label>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Difficulty</CardTitle>
            </CardHeader>
            <CardContent>
              {['Easy', 'Medium', 'Advance'].map((difficulty) => (
                <div key={difficulty} className="flex items-center space-x-2 mb-2">
                  <Checkbox
                    id={`difficulty-${difficulty}`}
                    checked={filters.difficulties.includes(difficulty.toLowerCase())}
                    onCheckedChange={(checked) => {
                      updateFilters('difficulties', checked
                        ? [...filters.difficulties, difficulty.toLowerCase()]
                        : filters.difficulties.filter(d => d !== difficulty.toLowerCase())
                      )
                    }}
                  />
                  <label
                    htmlFor={`difficulty-${difficulty}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {difficulty}
                  </label>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mb-4">
            <CardHeader>
              <CardTitle>Subtopics</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {availableSubtopics.map((subtopic) => (
                  <div key={subtopic} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`subtopic-${subtopic}`}
                      checked={filters.subtopics.includes(subtopic)}
                      onCheckedChange={(checked) => {
                        updateFilters('subtopics', checked
                          ? [...filters.subtopics, subtopic]
                          : filters.subtopics.filter(s => s !== subtopic)
                        )
                      }}
                    />
                    <label
                      htmlFor={`subtopic-${subtopic}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {subtopic}
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Companies</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {availableCompanies.map((company) => (
                  <div key={company} className="flex items-center space-x-2 mb-2">
                    <Checkbox
                      id={`company-${company}`}
                      checked={filters.companies.includes(company)}
                      onCheckedChange={(checked) => {
                        updateFilters('companies', checked
                          ? [...filters.companies, company]
                          : filters.companies.filter(c => c !== company)
                        )
                      }}
                    />
                    <label
                      htmlFor={`company-${company}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {company}
                    </label>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </ScrollArea>

        <ScrollArea className="w-3/4 p-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium text-muted-foreground">Loading questions...</p>
            </div>
          ) : (
            <>
              {quizzes.map((quiz, index) => (
                <Card key={quiz._id} className="mb-4">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <CardTitle 
                            className="text-lg"
                            dangerouslySetInnerHTML={{ __html: `${(paginationInfo.currentPage - 1) * itemsPerPage + index + 1}. ${quiz.question_text}` }}
                          />
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => toggleBookmark(quiz._id, e)}
                              className="hover:bg-transparent p-1 relative"
                            >
                              {bookmarkedQuizzes.has(quiz._id) ? (
                                <BookmarkCheck className="h-5 w-5 text-blue-500" />
                              ) : (
                                <Bookmark className="h-5 w-5" />
                              )}
                            </Button>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="secondary" className={getDifficultyStyle(quiz.difficulty)}>
                            {quiz.difficulty}
                          </Badge>
                          {quiz.table_names && quiz.table_names.map(table => (
                            <Badge key={table} variant="outline">{table}</Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        onClick={() => handleStartQuiz(quiz._id, user?.id, quiz.question_text)}
                        className="ml-4"
                      >
                        Start Quiz
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="scenario" className="w-full">
                      <TabsList>
                        <TabsTrigger value="scenario">Scenario</TabsTrigger>
                        <TabsTrigger value="solution">Solution</TabsTrigger>
                      </TabsList>
                      <TabsContent value="scenario">
                        <div
                          className={`mt-2 text-sm ${expandedQuestions[quiz._id] ? '' : 'line-clamp-3'}`}
                          dangerouslySetInnerHTML={{ __html: quiz.scenario }}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleQuestionExpansion(quiz._id)}
                          className="mt-2"
                        >
                          {expandedQuestions[quiz._id] ? 'Show Less' : 'Show More'}
                        </Button>
                      </TabsContent>
                      <TabsContent value="solution">
                        <div className="flex space-x-4 mt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <FileText size={16} className="mr-2" />
                                Text Solution
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Text Solution</DialogTitle>
                                <DialogDescription>
                                  {quiz.query}
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" size="sm" onClick={() => openVideoPopup(quiz)}>
                            <Video size={16} className="mr-2" />
                            Video Solution
                          </Button>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-center items-center mt-4 space-x-2">
                <Button
                  onClick={() => setPaginationInfo(prev => ({ ...prev, currentPage: Math.max(prev.currentPage - 1, 1) }))}
                  disabled={paginationInfo.currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm font-medium">
                  Page {paginationInfo.currentPage} of {paginationInfo.totalPages}
                </span>
                <Button
                  onClick={() => setPaginationInfo(prev => ({ ...prev, currentPage: Math.min(prev.currentPage + 1, prev.totalPages) }))}
                  disabled={paginationInfo.currentPage === paginationInfo.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </ScrollArea>
      </main>

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

