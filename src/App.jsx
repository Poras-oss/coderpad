import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import Home from './components/Home';
import QuizApp from './components/QuizApp'; // Your QuizApp component
import PythonQuizApp from './components/PythonQuizApp';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import { useEffect, useState } from 'react';
const App = () => {



  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quiz" element={<QuizApp />} />
        <Route path="/pyQuiz" element={<PythonQuizApp />} />
        <Route path="/mcqQuiz" element={<Quiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
