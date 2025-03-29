import {React, useState} from 'react';
import { Badge } from "./ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate } from 'react-router-dom';
import SubscriptionDialogue from './SubscriptionDialogue';

const QuizGrid = ({ darkmode, subject, topics }) => {
  const navigate = useNavigate();
     const [isSubscriptionDialogueOpen, setIsSubscriptionDialogueOpen] = useState(false);
      const [subscriptionStatus, setSubscriptionStatus] = useState('');

  // const handleTopicSelect = async(difficulty, subtopic) => {
    

  //    // Check subscription status from localStorage
  //    const subscriptionData = JSON.parse(localStorage.getItem('subscriptionStatus'));
    
  //    if (!subscriptionData || subscriptionData.message === 'User not subscribed') {
  //      setSubscriptionStatus('not_premium');
  //      setIsSubscriptionDialogueOpen(true);
  //      return;
  //    }
     
  //    if (subscriptionData.message === 'Subscription Expired') {
  //      setSubscriptionStatus('expired');
  //      setIsSubscriptionDialogueOpen(true);
  //      return;
  //    }
   
  //    // Check if `userRegistered` exists in localStorage
  //    const userRegistered = localStorage.getItem('userRegistered');
   
  //    if (userRegistered === 'true') {
  //      // User is already registered, start the quiz
  //      navigate(`/scenario-quiz?subject=${encodeURIComponent(subject)}&difficulty=${difficulty}&subtopic=${encodeURIComponent(subtopic)}`);
  //      return;
  //    }
   
  //    // If `userRegistered` doesn't exist or is false, check with the server
  //    try {
  //      const response = await fetch(`https://server.datasenseai.com/user-details/profile-status/${userID}`);
  //      const data = await response.json();
   
  //      if (response.ok) {
  //        if (data.isProfileComplete) {
  //          // Save the result in localStorage and start the quiz
  //          localStorage.setItem('userRegistered', 'true');
  //          navigate(`/scenario-quiz?subject=${encodeURIComponent(subject)}&difficulty=${difficulty}&subtopic=${encodeURIComponent(subtopic)}`);
  //        } else {
  //          // Show the UserDetailModal for incomplete profile
  //          setIsModalOpen(true);
  //        }
  //      } else {
  //        console.error('Failed to fetch profile status:', data.message);
  //        alert('Login first!');
  //      }
  //    } catch (error) {
  //      console.error('Error while checking user profile status:', error);
  //      alert('An unexpected error occurred. Please try again.');
  //    }
  // };

  const handleTopicSelect = async(difficulty, subtopic) => {
    // Check subscription status from localStorage
    const subscriptionData = JSON.parse(localStorage.getItem('subscriptionStatus'));
    
    if (!subscriptionData || subscriptionData.message === 'User not subscribed') {
      setSubscriptionStatus('not_premium');
      setIsSubscriptionDialogueOpen(true);
      return;
    }
    
    if (subscriptionData.message === 'Subscription Expired') {
      setSubscriptionStatus('expired');
      setIsSubscriptionDialogueOpen(true);
      return;
    }
  
    // Set userRegistered to true and navigate directly
    localStorage.setItem('userRegistered', 'true');
    navigate(`/scenario-quiz?subject=${encodeURIComponent(subject)}&difficulty=${difficulty}&subtopic=${encodeURIComponent(subtopic)}`);
  };

  function capitalizeFirstLetter(str) {
    if (!str) return ''; // Handle empty string or undefined input
    return str[0].toUpperCase() + str.slice(1);
}

  const quizzes = [
    {
      title: `${capitalizeFirstLetter(subject)} Easy Quiz`,
      difficulty: "Easy",
      description: "Test your fundamental knowledge of data analysis concepts and techniques.",
      difficultyColor: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-800 dark:text-green-100"
    },
    {
      title: `${capitalizeFirstLetter(subject)} Medium Quiz`,
      difficulty: "Medium",
      description: "Challenge yourself with complex SQL queries and database management problems.",
      difficultyColor: "bg-yellow-100 dark:bg-yellow-900",
      textColor: "text-yellow-800 dark:text-yellow-100"
    },
    {
      title: `${capitalizeFirstLetter(subject)} Hard Quiz`,
      difficulty: "Hard",
      description: "Dive deep into advanced machine learning algorithms and implementations.",
      difficultyColor: "bg-red-100 dark:bg-red-900",
      textColor: "text-red-800 dark:text-red-100"
    }
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 ${
      darkmode ? 'bg-[#1a1a1a]' : 'bg-white'
    }`}>
      <SubscriptionDialogue 
        isOpen={isSubscriptionDialogueOpen}
        onClose={() => setIsSubscriptionDialogueOpen(false)}
        status={subscriptionStatus}
      />
      {quizzes.map((quiz, index) => (
        <Card 
          key={index} 
          className={`${
            darkmode 
              ? 'bg-[#1a1a1a] border-gray-700' 
              : 'bg-white border-gray-200'
          } hover:scale-105 transition-all duration-300 cursor-pointer`}
          onClick={() => handleTopicSelect(quiz.difficulty, quiz.title)}
        >
          <CardHeader className="space-y-3">
            <CardTitle className={`text-xl font-bold ${
              darkmode ? 'text-white' : 'text-gray-900'
            }`}>
              {quiz.title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                className={`${quiz.difficultyColor} ${quiz.textColor}`}
                variant="secondary"
              >
                {quiz.difficulty}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h5 className={`text-sm mb-6 ${
              darkmode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {quiz.description}
            </h5>
            <Button 
              className={`w-full ${
                darkmode 
                  ? 'bg-cyan-600 hover:bg-cyan-700 text-white' 
                  : 'bg-cyan-500 hover:bg-cyan-600 text-white'
              } transition-colors duration-300`}
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