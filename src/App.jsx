import { React, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
// import QuizApp from './components/QuizApp';
import QuizApp from './components/QuizApp copy'
import PythonQuizApp from './components/PythonQuizApp';
import Quiz from './components/Quiz';
import Leaderboard from './components/Leaderboard';
import QuizHome from './components/QuizHome';
import Instructions from './components/Instructions';
// import DataSkillsDashboard from './components/dash';
import DataSkillsDashboard from './components/DataSkillsDashboard';
import TestSeriesCoderpadHome from './components/TestSeriesCoderpadHome';
import QuestionGallery from './components/QuestionGallery';
import TestSeriesMcqHome from './components/TestSeriesMcqHome';
import McqTestSeries from './components/McqTestSeries';
import ScenarioTestSeries from './components/ScenarioTestSeries';
import ScenarioQuiz from './components/ScenarioQuiz';
import PaymentPlan from './components/PaymentPlan';
import Dashboard from './components/Dashboard';
import { useUser } from "@clerk/clerk-react";
import { NotificationProvider } from "./notification/NotificationProvider";
import NavSwitcher from './components/DashAndBadgeSwitch';
import Index from './pages/Index';
import Pricing from './components/Pricing';

// Define custom hook outside the component
const useSubscriptionPolling = (clerkId) => {
  useEffect(() => {
    if (!clerkId) return;

    const fetchSubscriptionStatus = async (clerkId) => {
      try {
        const response = await fetch(`https://server.datasenseai.com/subscription/subscription-status?clerkId=${clerkId}`);
        const data = await response.json();
        localStorage.setItem('subscriptionStatus', JSON.stringify(data));
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        localStorage.removeItem('subscriptionStatus');
      }
    };

    fetchSubscriptionStatus(clerkId); // Initial fetch

    const interval = setInterval(() => {
      fetchSubscriptionStatus(clerkId);
    }, 60000); // Poll every 60 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [clerkId]);
};

// Define DailyCheckinBonus outside (not a hook)
const DailyCheckinBonus = async (clerkId) => {
  console.log(clerkId);
  try {
    const response = await fetch(`https://server.datasenseai.com/fuel-engine/check-in`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ clerkId, key: 'daily-checkin' }),
    });
  } catch (error) {
    console.error('Error adding daily checkin bonus', error);
  }
};

const App = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  // Call the hook at the top level
  useSubscriptionPolling(user?.id);

  // Keep non-hook logic in useEffect
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      DailyCheckinBonus(user.id);
    }
  }, [isLoaded, isSignedIn, user]);

  return (
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          {/* currently we have removed the framer landing page and created our own(react) 

              if we need that back, we have to place two files in /public directory(home.html and script.js) which is currenly preresent
              as a repo in datasense org github(practice-backup-framer)
          */}
          {/* <Route path="/" element={<iframe src="/home.html" style={{ width: '100%', height: '100vh', border: 'none' }} title="External Page" />} /> */}
          <Route path="/" element={<Index />} />
          <Route path="/live-events" element={<DataSkillsDashboard />} />
          <Route path="/quiz" element={<QuizApp />} />
          <Route path="/pyQuiz" element={<PythonQuizApp />} />
          <Route path="/mcqQuiz" element={<Quiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/practice-area" element={<QuestionGallery />} />
          <Route path="/question-area" element={<TestSeriesCoderpadHome />} />
          <Route path="/quiz-area" element={<TestSeriesMcqHome />} />
          <Route path="/mcq" element={<McqTestSeries />} />
          <Route path="/scenario-area" element={<ScenarioTestSeries />} />
          <Route path="/scenario-quiz" element={<ScenarioQuiz />} />
          <Route path="/go-premium" element={<PaymentPlan />} />
          <Route path="/dashboard" element={<NavSwitcher />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </BrowserRouter>
    </NotificationProvider>

  );
};

export default App;