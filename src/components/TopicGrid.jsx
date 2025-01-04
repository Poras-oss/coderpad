import React from 'react';
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from 'react-router-dom';

const QuizGrid = ({ darkmode, subject, topics }) => {
  const navigate = useNavigate();

  const handleTopicSelect = (difficulty, subtopic) => {
    navigate(`/scenario-quiz?subject=${encodeURIComponent(subject)}&difficulty=${difficulty}&subtopic=${encodeURIComponent(subtopic)}`);
  };

  const quizzes = [
    {
      title: "PowerBI Easy Quiz",
      difficulty: "Easy",
      tag: "MCQ",
      description: "Test your fundamental knowledge of data analysis concepts and techniques.",
      tagColor: "bg-green-100",
      difficultyColor: "bg-green-100"
    },
    {
      title: "PowerBI Medium Quiz",
      difficulty: "Medium",
      tag: "SQL",
      description: "Challenge yourself with complex SQL queries and database management problems.",
      tagColor: "bg-yellow-100",
      difficultyColor: "bg-yellow-100"
    },
    {
      title: "PowerBI Hard Quiz",
      difficulty: "Hard",
      tag: "Python",
      description: "Dive deep into advanced machine learning algorithms and implementations.",
      tagColor: "bg-red-100",
      difficultyColor: "bg-red-100"
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ${darkmode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {quizzes.map((quiz, index) => (
        <Card 
          key={index} 
          className={`${
            darkmode ? 'bg-gray-800 shadow-lg shadow-gray-700/20' : 'bg-white shadow-lg shadow-gray-200/50'
          } hover:shadow-xl transition-shadow duration-300 cursor-pointer`}
          onClick={() => handleTopicSelect(quiz.difficulty, quiz.title)}
        >
          <CardHeader className="space-y-3">
            <CardTitle className={`text-xl font-bold ${darkmode ? 'text-white' : 'text-gray-900'}`}>
              {quiz.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                className={`${quiz.difficultyColor} ${
                  darkmode ? 'text-white bg-opacity-20' : 'text-green-800'
                }`}
                variant="secondary"
              >
                {quiz.difficulty}
              </Badge>
              <Badge 
                className={`${quiz.tagColor} ${
                  darkmode ? 'text-white bg-opacity-20' : 'text-yellow-800'
                }`}
                variant="secondary"
              >
                {quiz.tag}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className={`text-sm mb-6 ${darkmode ? 'text-gray-300' : 'text-gray-600'}`}>
              {quiz.description}
            </p>
            <Button 
              className={`w-full ${
                darkmode 
                  ? 'bg-cyan-600 hover:bg-cyan-700' 
                  : 'bg-cyan-500 hover:bg-cyan-600'
              } text-white`}
              variant="default"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default QuizGrid;