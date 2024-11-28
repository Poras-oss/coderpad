'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { Star, StarOff } from 'lucide-react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { ScrollArea } from "./ui/scroll-area"
import { Separator } from "./ui/separator"
import Header from './header'
import QuizList from './quiz-list'
import FilterSidebar from './filter-sidebar'

export default function QuizApp() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [quizzes, setQuizzes] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all', // all, solved, unsolved
    difficulty: [], // easy, medium, hard
    skills: [], // basic, intermediate, advanced
    subdomains: [], // joins, subqueries, etc
    search: '',
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const subject = new URLSearchParams(window.location.search).get('subject') || 'mysql'

  useEffect(() => {
    fetchQuizzes()
  }, [filters])

  const fetchQuizzes = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await axios.get(`https://server.datasenseai.com/test-series-coding/${subject}`)
      if (response.data?.results) {
        setQuizzes(response.data.results)
      }
    } catch (error) {
      console.error('Error fetching quizzes:', error)
      toast.error("Failed to fetch quizzes. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }, [subject, filters])

  const updateFilters = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  return (
    <div className={`flex flex-col min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Header 
        isSignedIn={isSignedIn} 
        subject={subject} 
        isDarkMode={isDarkMode} 
        setIsDarkMode={setIsDarkMode}
      />
      
      <div className="flex-1 flex">
        <main className="flex-1 border-r dark:border-gray-800">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Problems
              </h1>
              <Input
                type="search"
                placeholder="Search problems..."
                className="max-w-xs"
                value={filters.search}
                onChange={(e) => updateFilters('search', e.target.value)}
              />
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => updateFilters('status', 'all')}
                  className={filters.status === 'all' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                >
                  All
                </Button>
                <Separator orientation="vertical" className="h-4" />
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => updateFilters('status', 'solved')}
                  className={filters.status === 'solved' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                >
                  <Star className="w-4 h-4 mr-1" />
                  Solved
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => updateFilters('status', 'unsolved')}
                  className={filters.status === 'unsolved' ? 'bg-gray-100 dark:bg-gray-800' : ''}
                >
                  <StarOff className="w-4 h-4 mr-1" />
                  Unsolved
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[calc(100vh-220px)]">
              <QuizList 
                quizzes={quizzes} 
                isLoading={isLoading}
              />
            </ScrollArea>
          </div>
        </main>

        <FilterSidebar 
          filters={filters}
          updateFilters={updateFilters}
        />
      </div>
    </div>
  )
}

