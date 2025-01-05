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
import QuizHome from './components/QuizHome'; // Import the QuizHome component
import Instructions from './components/Instructions';
import DataSkillsDashboard from './components/dash';
import TestSeriesCoderpadHome from './components/TestSeriesCoderpadHome';
import TestSeriesMcqHome from './components/TestSeriesMcqHome';
import McqTestSeries from './components/McqTestSeries';
import ScenarioTestSeries from './components/ScenarioTestSeries';
import ScenarioQuiz from './components/ScenarioQuiz';
import PaymentPlan from './components/PaymentPlan';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {  <Route path="/" element={<iframe src="/home.html" style={{ width: '100%', height: '100vh', border: 'none' }} title="External Page" />} /> }
        <Route path="/live-events" element={<DataSkillsDashboard />} />
        <Route path="/quiz" element={<QuizApp />} />
        <Route path="/pyQuiz" element={<PythonQuizApp />} />
        <Route path="/mcqQuiz" element={<Quiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/instructions" element={<Instructions />} />
        <Route path="/practice-area" element={<TestSeriesCoderpadHome />} />
        <Route path="/quiz-area" element={<TestSeriesMcqHome />} />
        <Route path="/mcq" element={<McqTestSeries />} />
        <Route path="/scenario-area" element={<ScenarioTestSeries />} />
        <Route path="/scenario-quiz" element={<ScenarioQuiz />} />
        <Route path="/go-premium" element={<PaymentPlan />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
