import React from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Skeleton } from "./ui/skeleton"
import { Star } from 'lucide-react'

const getDifficultyColor = (difficulty) => {
  const normalizedDifficulty = difficulty?.toLowerCase()
  switch (normalizedDifficulty) {
    case 'easy':
      return 'text-green-600 dark:text-green-400'
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'hard':
    case 'advance':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

const QuizList = ({ quizzes, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex items-center space-x-4 p-4">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]">Status</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Difficulty</TableHead>
          <TableHead className="text-right">Success Rate</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {quizzes.map((quiz) => (
          <TableRow key={quiz._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
            <TableCell>
              <Star className="w-4 h-4 text-gray-300 dark:text-gray-700" />
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <Button variant="link" className="h-auto p-0 font-medium text-left">
                  {quiz.question_text}
                </Button>
                <div className="flex gap-2 mt-1">
                  {quiz.table_names?.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </TableCell>
            <TableCell>
              <span className={getDifficultyColor(quiz.difficulty)}>
                {quiz.difficulty}
              </span>
            </TableCell>
            <TableCell className="text-right">
              {quiz.success_rate || '99.52%'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default QuizList

