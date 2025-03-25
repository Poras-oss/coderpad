"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Sun, Moon } from "lucide-react"
import { Button } from "../components/ui/button"
import axios from "axios"
import { useUser } from "@clerk/clerk-react"

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [userData, setUserData] = useState(null)
  const [streakData, setStreakData] = useState(null)
  const [totalQuestions, setTotalQuestions] = useState(100) // Example total
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [expandedSolved, setExpandedSolved] = useState(false)
  const [expandedSubmissions, setExpandedSubmissions] = useState(false)

  useEffect(() => {
    // Apply dark mode class to body
    if (isDarkMode) {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }
  }, [isDarkMode])

  useEffect(() => {
    const fetchData = async () => {
      if (!isLoaded || !isSignedIn || !user) {
        setLoading(false)
        return
      }

      console.log(user.id)

      try {
        // Fetch user data and streak data in parallel
        const [userDataResponse, streakDataResponse] = await Promise.allSettled([
          axios.get(`https://server.datasenseai.com/practice-dashboard/${user.id}`),
          axios.get(`https://server.datasenseai.com/question-attempt/streak/${user.id}`),
        ])

        let processedUserData = null
        let processedStreakData = null

        // Process user data if successful
        if (userDataResponse.status === "fulfilled" && userDataResponse.value.data) {
          const apiUserData = userDataResponse.value.data

          // Match solved questions with submission history
          const matchedSubmissions =
            apiUserData.submissionHistory?.map((submission) => {
              // Find if this submission corresponds to a solved question
              const solvedQuestion = apiUserData.solved?.find((question) => question._id === submission.questionId)

              return {
                ...submission,
                solvedQuestion,
              }
            }) || []

          processedUserData = {
            username: user.username || user.firstName || "User",
            email: user.primaryEmailAddress?.emailAddress || "user@example.com",
            profileImageUrl: user.imageUrl || "/placeholder.svg?height=40&width=40",
            fuel: apiUserData.fuel || 75,
            isPremium: apiUserData.isPremium || false,
            solved: apiUserData.solved || [],
            submissionHistory: matchedSubmissions.slice().reverse(),
            liveQuiz: apiUserData.liveQuiz || [],
          }

          // Set total questions if available from API
          if (apiUserData.totalQuestions) {
            setTotalQuestions(apiUserData.totalQuestions)
          }
        } else {
          // Use mock data if API call fails
          processedUserData = createMockUserData()
        }

        // Process streak data if successful
      if (streakDataResponse.status === "fulfilled" && streakDataResponse.value.data) {
    const apiStreakData = streakDataResponse.value.data;
    console.log(apiStreakData);

    processedStreakData = {
        subjectStreaks: new Map(
            Object.entries(apiStreakData.subjectStreaks || {}).map(([subject, data]) => [
                subject,
                {
                    currentStreak: data.currentStreak || 0,
                    longestStreak: data.longestStreak || 0,
                    lastActiveDate: data.lastActiveDate || null, // Preserve null instead of overwriting with current date
                },
            ])
        ),
        activityLog: apiStreakData.activityLog ?? generateActivityLog(), // Use nullish coalescing to ensure correct fallback
    };
} else {
  console.log('not fullfilled for streak data')
    processedStreakData = createMockStreakData();
}


        setUserData(processedUserData)
        setStreakData(processedStreakData)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        // Fall back to mock data
        setUserData(createMockUserData())
        setStreakData(createMockStreakData())
        setLoading(false)
      }
    }

    fetchData()
  }, [isLoaded, isSignedIn, user])

  // Generate mock activity data for the heatmap
  function generateActivityLog() {
    const today = new Date()
    const activityLog = {}

    for (let i = 0; i < 60; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)

      const year = date.getFullYear().toString()
      const month = (date.getMonth() + 1).toString()
      const day = date.getDate().toString()

      if (!activityLog[year]) {
        activityLog[year] = { months: {} }
      }

      if (!activityLog[year].months[month]) {
        activityLog[year].months[month] = {}
      }

      // Random activity level (0-3)
      activityLog[year].months[month][day] = Math.floor(Math.random() * 4)
    }

    return activityLog
  }

  // Create mock user data
  function createMockUserData() {
    return {
      username: user?.username || user?.firstName || "CodeMaster",
      email: user?.primaryEmailAddress?.emailAddress || "codemaster@example.com",
      profileImageUrl: user?.imageUrl || "/placeholder.svg?height=40&width=40",
      fuel: 75,
      isPremium: true,
      solved: new Array(10).fill({}), // 10 solved questions
      submissionHistory: [
        {
          questionId: null,
          isCorrect: true,
          submittedCode: "SELECT  Festival_Name,Country,Ticket_Type FROM festivaldata;",
          submittedAt: new Date(Date.now() - 3600000).toISOString(),
          _id: "67571ad63f4d82f359e49df9",
        },
        {
          questionId: null,
          isCorrect: false,
          submittedCode: "def find_max(lst):\n    # Your code here\n    print('heya')",
          submittedAt: new Date(Date.now() - 86400000).toISOString(),
          _id: "6744c5c35a3bea765a844345",
        },
        {
          questionId: null,
          isCorrect: true,
          submittedCode: "select festival_name, city, date from festivaldata where country='USA';",
          submittedAt: new Date(Date.now() - 172800000).toISOString(),
          _id: "67daae7677de071e30f7a386",
        },
      ],
      liveQuiz: [
        { subject: "Algorithms", scores: 85, totalScores: 100 },
        { subject: "Data Structures", scores: 70, totalScores: 100 },
        { subject: "System Design", scores: 60, totalScores: 100 },
      ],
    }
  }

  // Create mock streak data
  function createMockStreakData() {
    return {
      subjectStreaks: new Map([
        ["Algorithms", { currentStreak: 7, longestStreak: 14 }],
        ["Data Structures", { currentStreak: 3, longestStreak: 10 }],
        ["System Design", { currentStreak: 0, longestStreak: 5 }],
      ]),
      activityLog: generateActivityLog(),
    }
  }

  // Process streak data from API response
  const processStreakData = () => {
    if (!streakData) return null

    // If activityLog is in the server format, process it
    const processedActivityLog = streakData.activityLog

    // Convert subjectStreaks from API format to Map if it's not already a Map
    if (!(streakData.subjectStreaks instanceof Map)) {
      const subjectStreaksMap = new Map()
      if (streakData.subjectStreaks) {
        Object.entries(streakData.subjectStreaks).forEach(([subject, data]) => {
          subjectStreaksMap.set(subject, {
            currentStreak: data.currentStreak || 0,
            longestStreak: data.longestStreak || 0,
            lastActiveDate: data.lastActiveDate || new Date().toISOString(),
          })
        })
      }
      return {
        ...streakData,
        subjectStreaks: subjectStreaksMap,
        activityLog: processedActivityLog,
      }
    }

    return streakData
  }

  const processedStreakData = processStreakData()

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg text-gray-800 dark:text-gray-200">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Show empty state if no data is available
  if (!userData && !streakData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-lg text-gray-800 dark:text-gray-200">No dashboard data available.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Refresh
          </Button>
        </div>
      </div>
    )
  }

  // Color constants
  const colors = {
    primary: "#3B82F6", // blue-500
    primaryDark: "#2563EB", // blue-600
    secondary: "#10B981", // emerald-500
    secondaryDark: "#059669", // emerald-600
    accent: "#8B5CF6", // violet-500
    accentDark: "#7C3AED", // violet-600
    success: "#22C55E", // green-500
    error: "#EF4444", // red-500
    warning: "#F59E0B", // amber-500
    info: "#3B82F6", // blue-500
    background: "#FFFFFF", // white
    backgroundDark: "#111827", // gray-900
    card: "#F9FAFB", // gray-50
    cardDark: "#1F2937", // gray-800
    text: "#1F2937", // gray-800
    textDark: "#F9FAFB", // gray-50
    muted: "#6B7280", // gray-500
    mutedDark: "#9CA3AF", // gray-400
    border: "#E5E7EB", // gray-200
    borderDark: "#374151", // gray-700
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="container mx-auto p-4">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={userData.profileImageUrl || "/placeholder.svg?height=40&width=40"}
                alt={userData.username}
                className="w-16 h-16 rounded-full border-2"
                style={{ borderColor: isDarkMode ? colors.primaryDark : colors.primary }}
              />
              {userData.isPremium && (
                <div className="absolute -top-2 -right-2">
                  <Badge
                    variant="outline"
                    style={{
                      backgroundColor: isDarkMode ? "#78350F" : "#FEF3C7",
                      color: isDarkMode ? "#FBBF24" : "#92400E",
                      borderColor: isDarkMode ? "#F59E0B" : "#FDE68A",
                    }}
                  >
                    PRO
                  </Badge>
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">{userData.username}</h1>
              <p style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>{userData.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              style={{
                backgroundColor: isDarkMode ? colors.cardDark : colors.card,
                borderColor: isDarkMode ? colors.borderDark : colors.border,
                color: isDarkMode ? colors.textDark : colors.text,
              }}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="flex items-center gap-2">
              <div style={{ color: isDarkMode ? colors.mutedDark : colors.muted }} className="text-sm">
                Fuel
              </div>
              <Progress
                value={userData.fuel}
                className="w-24 h-2"
                style={{
                  backgroundColor: isDarkMode ? colors.borderDark : colors.border,
                  "--progress-background": isDarkMode ? colors.primaryDark : colors.primary,
                }}
              />
              <span className="text-sm font-medium">{userData.fuel}%</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            style={{
              backgroundColor: isDarkMode ? colors.cardDark : colors.card,
              borderColor: isDarkMode ? colors.borderDark : colors.border,
              color: isDarkMode ? colors.textDark : colors.text,
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Solved Questions</CardTitle>
              <CardDescription style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                Your progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">
                {userData.solved?.length || 0} / {totalQuestions}
              </div>
              <Progress
                value={(userData.solved?.length / totalQuestions) * 100 || 0}
                className="h-2 mb-4"
                style={{
                  backgroundColor: isDarkMode ? colors.borderDark : colors.border,
                  "--progress-background": isDarkMode ? colors.secondaryDark : colors.secondary,
                }}
              />

              {userData.solved && userData.solved.length > 0 && (
                <div className="mt-2">
                  <div className="text-sm font-medium mb-2">Recently Solved:</div>
                  <div className="space-y-2">
                    {userData.solved.slice(0, expandedSolved ? userData.solved.length : 3).map((question) => (
                      <div
                        key={question._id}
                        className="text-sm p-2 rounded-md"
                        style={{
                          backgroundColor: isDarkMode ? colors.borderDark : colors.border,
                          color: isDarkMode ? colors.textDark : colors.text,
                        }}
                      >
                        <div className="font-medium">{question.title || "Untitled Question"}</div>
                        <div className="flex justify-between items-center mt-1">
                          <Badge
                            variant="outline"
                            style={{
                              backgroundColor: isDarkMode
                                ? question.difficulty === "easy"
                                  ? "#064E3B"
                                  : question.difficulty === "medium"
                                    ? "#78350F"
                                    : "#7F1D1D"
                                : question.difficulty === "easy"
                                  ? "#D1FAE5"
                                  : question.difficulty === "medium"
                                    ? "#FEF3C7"
                                    : "#FEE2E2",
                              color: isDarkMode
                                ? question.difficulty === "easy"
                                  ? "#10B981"
                                  : question.difficulty === "medium"
                                    ? "#F59E0B"
                                    : "#EF4444"
                                : question.difficulty === "easy"
                                  ? "#047857"
                                  : question.difficulty === "medium"
                                    ? "#D97706"
                                    : "#DC2626",
                            }}
                          >
                            {question.difficulty || "Unknown"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  {userData.solved.length > 3 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedSolved(!expandedSolved)}
                      className="mt-2 w-full"
                      style={{
                        color: isDarkMode ? colors.primaryDark : colors.primary,
                      }}
                    >
                      {expandedSolved ? "Show Less" : `Show All (${userData.solved.length})`}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: isDarkMode ? colors.cardDark : colors.card,
              borderColor: isDarkMode ? colors.borderDark : colors.border,
              color: isDarkMode ? colors.textDark : colors.text,
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Current Streak</CardTitle>
              <CardDescription style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                Keep it going!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-3xl font-bold">
                  {processedStreakData && processedStreakData.subjectStreaks.size > 0
                    ? Math.max(...[...processedStreakData.subjectStreaks.values()].map((s) => s.currentStreak))
                    : 0}
                </div>
                <div className="flex -space-x-1">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor:
                            i < 3
                              ? isDarkMode
                                ? colors.secondaryDark
                                : colors.secondary
                              : isDarkMode
                                ? colors.borderDark
                                : colors.border,
                        }}
                      >
                        <span className="text-xs text-white">{i + 1}</span>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: isDarkMode ? colors.cardDark : colors.card,
              borderColor: isDarkMode ? colors.borderDark : colors.border,
              color: isDarkMode ? colors.textDark : colors.text,
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Longest Streak</CardTitle>
              <CardDescription style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                Your best run
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {processedStreakData && processedStreakData.subjectStreaks.size > 0
                  ? Math.max(...[...processedStreakData.subjectStreaks.values()].map((s) => s.longestStreak))
                  : 0}
              </div>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: isDarkMode ? colors.cardDark : colors.card,
              borderColor: isDarkMode ? colors.borderDark : colors.border,
              color: isDarkMode ? colors.textDark : colors.text,
            }}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Success Rate</CardTitle>
              <CardDescription style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                Correct submissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {userData.submissionHistory && userData.submissionHistory.length > 0
                  ? Math.round(
                      (userData.submissionHistory.filter((s) => s.isCorrect).length /
                        userData.submissionHistory.length) *
                        100,
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card
            className="lg:col-span-2"
            style={{
              backgroundColor: isDarkMode ? colors.cardDark : colors.card,
              borderColor: isDarkMode ? colors.borderDark : colors.border,
              color: isDarkMode ? colors.textDark : colors.text,
            }}
          >
            <CardHeader>
              <CardTitle>Activity Heatmap</CardTitle>
              <CardDescription style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                Your coding activity over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1">
                {processedStreakData &&
                  processedStreakData.activityLog &&
                  Object.entries(processedStreakData.activityLog).flatMap(([year, yearData]) =>
                    Object.entries(yearData.months || {}).flatMap(([month, monthData]) =>
                      Object.entries(monthData || {}).map(([day, activity]) => {
                        // Calculate activity level based on the server format
                        const activityLevel =
                          typeof activity === "object"
                            ? Object.values(activity).reduce((sum, val) => sum + (typeof val === "number" ? val : 0), 0)
                            : typeof activity === "number"
                              ? activity
                              : 0

                        let bgColor
                        if (isDarkMode) {
                          if (activityLevel === 0)
                            bgColor = "#1F2937" // gray-800
                          else if (activityLevel === 1)
                            bgColor = "#065F46" // emerald-800
                          else if (activityLevel === 2)
                            bgColor = "#047857" // emerald-700
                          else bgColor = "#059669" // emerald-600
                        } else {
                          if (activityLevel === 0)
                            bgColor = "#F3F4F6" // gray-100
                          else if (activityLevel === 1)
                            bgColor = "#D1FAE5" // emerald-100
                          else if (activityLevel === 2)
                            bgColor = "#6EE7B7" // emerald-300
                          else bgColor = "#10B981" // emerald-500
                        }

                        // Format the tooltip to show the subjects
                        const subjectList =
                          typeof activity === "object"
                            ? Object.entries(activity)
                                .map(([subject, count]) => `${subject}: ${count}`)
                                .join(", ")
                            : ""

                        const tooltip = `${month}/${day}/${year}: ${activityLevel} activities${subjectList ? ` (${subjectList})` : ""}`

                        return (
                          <div
                            key={`${year}-${month}-${day}`}
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: bgColor }}
                            title={tooltip}
                          />
                        )
                      }),
                    ),
                  )}
              </div>
            </CardContent>
          </Card>

          <Card
            style={{
              backgroundColor: isDarkMode ? colors.cardDark : colors.card,
              borderColor: isDarkMode ? colors.borderDark : colors.border,
              color: isDarkMode ? colors.textDark : colors.text,
            }}
          >
            <CardHeader>
              <CardTitle>Subject Streaks</CardTitle>
              <CardDescription style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                Your progress by topic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {processedStreakData &&
                  [...processedStreakData.subjectStreaks.entries()].map(([subject, data]) => (
                    <div key={subject}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{subject}</span>
                        <span className="text-sm" style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                          {data.currentStreak} day{data.currentStreak !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <Progress
                        value={(data.currentStreak / (data.longestStreak || 1)) * 100}
                        className="h-2"
                        style={{
                          backgroundColor: isDarkMode ? colors.borderDark : colors.border,
                          "--progress-background": isDarkMode ? colors.accentDark : colors.accent,
                        }}
                      />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="submissions" className="mb-8" style={{ color: isDarkMode ? colors.textDark : colors.text }}>
          <TabsList
            className="mb-4"
            style={{
              backgroundColor: isDarkMode ? colors.cardDark : colors.card,
              borderColor: isDarkMode ? colors.borderDark : colors.border,
            }}
          >
            <TabsTrigger
              value="submissions"
              style={{
                color: isDarkMode ? colors.textDark : colors.text,
                "&[data-state=active]": {
                  backgroundColor: isDarkMode ? colors.primaryDark : colors.primary,
                  color: "#FFFFFF",
                },
              }}
            >
              Recent Submissions
            </TabsTrigger>
            <TabsTrigger
              value="quizzes"
              style={{
                color: isDarkMode ? colors.textDark : colors.text,
                "&[data-state=active]": {
                  backgroundColor: isDarkMode ? colors.primaryDark : colors.primary,
                  color: "#FFFFFF",
                },
              }}
            >
              Live Quiz Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <Card
              style={{
                backgroundColor: isDarkMode ? colors.cardDark : colors.card,
                borderColor: isDarkMode ? colors.borderDark : colors.border,
                color: isDarkMode ? colors.textDark : colors.text,
              }}
            >
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
                <CardDescription style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                  Your latest problem attempts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userData.submissionHistory && userData.submissionHistory.length > 0 ? (
                    userData.submissionHistory
                      .slice(0, expandedSubmissions ? userData.submissionHistory.length : 5)
                      .map((submission, index) => {
                        // Extract title from submitted code or use the solved question title if available
                        let title = submission.solvedQuestion?.title || "Problem"
                        if (!title && submission.submittedCode) {
                          if (submission.submittedCode.includes("find_max")) {
                            title = "Find Maximum Value"
                          } else if (submission.submittedCode.includes("reverse_list")) {
                            title = "Reverse List"
                          } else if (submission.submittedCode.includes("Festival_Name")) {
                            title = "Festival Data Query"
                          } else if (submission.submittedCode.includes("SELECT")) {
                            title = "SQL Query"
                          }
                        }

                        // Use difficulty from solved question or determine based on code complexity
                        let difficulty = submission.solvedQuestion?.difficulty || "Medium"
                        if (!submission.solvedQuestion && submission.submittedCode) {
                          if (submission.submittedCode.length < 50) {
                            difficulty = "Easy"
                          } else if (submission.submittedCode.length > 150) {
                            difficulty = "Hard"
                          }
                        }

                        return (
                          <div
                            key={submission._id || index}
                            className="flex items-center justify-between pb-3 last:border-0"
                            style={{ borderBottom: `1px solid ${isDarkMode ? colors.borderDark : colors.border}` }}
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor: submission.isCorrect
                                    ? isDarkMode
                                      ? colors.secondaryDark
                                      : colors.success
                                    : isDarkMode
                                      ? "#B91C1C"
                                      : colors.error,
                                }}
                              ></div>
                              <div>
                                <div className="font-medium">{title}</div>
                                <div
                                  className="text-sm"
                                  style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}
                                >
                                  {new Date(submission.submittedAt).toLocaleDateString()} •
                                  <Badge
                                    variant="outline"
                                    className="ml-2"
                                    style={{
                                      backgroundColor: isDarkMode
                                        ? difficulty.toLowerCase() === "easy"
                                          ? "#064E3B"
                                          : difficulty.toLowerCase() === "medium"
                                            ? "#78350F"
                                            : "#7F1D1D"
                                        : difficulty.toLowerCase() === "easy"
                                          ? "#D1FAE5"
                                          : difficulty.toLowerCase() === "medium"
                                            ? "#FEF3C7"
                                            : "#FEE2E2",
                                      color: isDarkMode
                                        ? difficulty.toLowerCase() === "easy"
                                          ? "#10B981"
                                          : difficulty.toLowerCase() === "medium"
                                            ? "#F59E0B"
                                            : "#EF4444"
                                        : difficulty.toLowerCase() === "easy"
                                          ? "#047857"
                                          : difficulty.toLowerCase() === "medium"
                                            ? "#D97706"
                                            : "#DC2626",
                                    }}
                                  >
                                    {difficulty}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-sm" style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                              {new Date(submission.submittedAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        )
                      })
                  ) : (
                    <div className="text-center py-6">
                      <p style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>No submissions yet</p>
                    </div>
                  )}

                  {userData.submissionHistory && userData.submissionHistory.length > 5 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedSubmissions(!expandedSubmissions)}
                      className="w-full"
                      style={{
                        color: isDarkMode ? colors.primaryDark : colors.primary,
                      }}
                    >
                      {expandedSubmissions ? "Show Less" : `Show All (${userData.submissionHistory.length})`}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quizzes">
            <Card
              style={{
                backgroundColor: isDarkMode ? colors.cardDark : colors.card,
                borderColor: isDarkMode ? colors.borderDark : colors.border,
                color: isDarkMode ? colors.textDark : colors.text,
              }}
            >
              <CardHeader>
                <CardTitle>Live Quiz Performance</CardTitle>
                <CardDescription style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                  Your results from live quizzes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userData.liveQuiz && userData.liveQuiz.length > 0 ? (
                    userData.liveQuiz.map((quiz, index) => (
                      <div key={index}>
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">{quiz.subject}</span>
                          <span className="text-sm" style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
                            {quiz.scores} / {quiz.totalScores}
                          </span>
                        </div>
                        <Progress
                          value={(quiz.scores / quiz.totalScores) * 100}
                          className="h-2"
                          style={{
                            backgroundColor: isDarkMode ? colors.borderDark : colors.border,
                            "--progress-background": isDarkMode ? colors.accentDark : colors.accent,
                          }}
                        />
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>No quiz results yet</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center text-sm" style={{ color: isDarkMode ? colors.mutedDark : colors.muted }}>
          <p>Keep up the good work! Your next milestone is just around the corner.</p>
        </div>
      </div>
    </div>
  )
}

