import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import 'react-toastify/dist/ReactToastify.css';
import queryString from 'query-string';
import { useUser } from '@clerk/clerk-react';
import TopicGrid from './TopicGrid';
import Navbar from './Navbar';
import RenderSubscription from './RenderSubscription';

const ScenarioTestSeries = () => {
    const { isLoaded, isSignedIn, user } = useUser();
    const [difficulty, setDifficulty] = useState(null);
    const [subject, setSubject] = useState(null);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const topics = {
      beginner: [
        { name: 'Basic Concepts', questionCount: 10, duration: 20, progress: 30 },
        { name: 'Fundamentals', questionCount: 15, duration: 30, progress: 0 },
        { name: 'Introduction', questionCount: 12, duration: 25, progress: 50 },
      ],
      intermediate: [
        { name: 'Advanced Concepts', questionCount: 20, duration: 40, progress: 50 },
        { name: 'Problem Solving', questionCount: 18, duration: 35, progress: 20 },
        { name: 'Practical Applications', questionCount: 22, duration: 45, progress: 10 },
      ],
      advanced: [
        { name: 'Expert Level', questionCount: 25, duration: 50, progress: 10 },
        { name: 'Complex Problems', questionCount: 22, duration: 45, progress: 5 },
        { name: 'Research Topics', questionCount: 20, duration: 40, progress: 0 },
      ],
    };

    useEffect(() => {
      // Check system preference for dark mode
      const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(savedDarkMode ?? darkModePreference);

      if (isLoaded && isSignedIn) {
          const parsed = queryString.parse(window.location.search);
          const subject = parsed.subject;
          const difficulty = parsed.difficulty;
          setSubject(subject);
          setDifficulty(difficulty);
      }
    }, [isLoaded, isSignedIn]);

    // Update localStorage when dark mode changes
    useEffect(() => {
      localStorage.setItem('darkMode', isDarkMode);
    }, [isDarkMode]);

    function backToHome(){
      window.top.location.href = 'https://practice.datasenseai.com/';
    }

    return (
      <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#1a1a1a] text-white' : 'bg-white text-black'}`}>
        <Navbar 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          isLoaded={isLoaded} 
          isSignedIn={isSignedIn} 
          user={user} 
          subject={subject} 
        />
        <div className="py-8">
          <div className={`container mx-auto px-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            <TopicGrid 
              subject={subject} 
              topics={topics} 
              darkmode={isDarkMode} 
            />
          </div>
        </div>
      </div>
    );
};

export default ScenarioTestSeries;