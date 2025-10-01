import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import queryString from 'query-string';
import Navbar from './Navbar';

const Leaderboard = ({ quizId }) => {
  // The 'leaderboard' state will now hold an object { timelyUsers: [], lateUsers: [] }
  const [leaderboard, setLeaderboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const parsed = queryString.parse(window.location.search);
  const quizID = parsed.quizID;
  const quizName = parsed.quizName;

  const getQuizType = (quizName) => {
    const parts = quizName.split(':');
    return parts.length > 1 ? parts[0].trim().toLowerCase() : 'mcq';
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        let response;
        const quizType = getQuizType(quizName);
        if (quizType === 'mcq') {
          response = await axios.get(`https://server.datasenseai.com/leaderboard/${quizID}`);
          // response = await axios.get(`http://localhost:4000/leaderboard/${quizID}`);
        } else if (quizType === 'python') {
          response = await axios.get(`https://server.datasenseai.com/leaderboard/python/${quizID}`);
          // response = await axios.get(`http://localhost:4000/leaderboard/python/${quizID}`);
        } else if (quizType === 'sql') {
          response = await axios.get(`https://server.datasenseai.com/leaderboard/sql/${quizID}`);
          // response = await axios.get(`http://localhost:4000/leaderboard/sql/${quizID}`);
        }
        
        // The response.data.leaderboard now contains our timelyUsers and lateUsers object
        console.log('🔍 Leaderboard API response:', response.data.leaderboard);
        console.log('📊 Timely users count:', response.data.leaderboard?.timelyUsers?.length || 0);
        console.log('📊 Late users count:', response.data.leaderboard?.lateUsers?.length || 0);
        
        setLeaderboard(response.data.leaderboard);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizId]); // Dependency array is fine as is

  const formatDuration = (seconds) => {
    if (seconds > 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} min ${remainingSeconds} sec`;
    }
    return `${seconds} sec`;
  };

  const getUserName = (userId) => {
    if (!userId) return 'Unknown';
    const parts = userId.split(',');
    const email = parts[0].trim();
    const name = parts[1]?.trim();
    return name && name !== "N/A" ? name : email;
  }

  // Helper component to render a leaderboard table to avoid repetition
  const LeaderboardTable = ({ users }) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className={`border-b ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
            <th className={`px-4 py-3 text-left text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Rank
            </th>
            <th className={`px-4 py-3 text-left text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              User
            </th>
            <th className={`px-4 py-3 text-left text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Score
            </th>
            <th className={`px-4 py-3 text-left text-sm font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.userId + user.rank} className={`border-b ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"} ${index === users.length - 1 ? 'border-b-0' : ''}`}>
              <td className={`px-4 py-4 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {user.rank}
              </td>
              <td className={`px-4 py-4 text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {getUserName(user.userId)}
              </td>
              <td className={`px-4 py-4 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                {user.score}
              </td>
              <td className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
                {formatDuration(user.duration)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Loading and Error states remain the same
  // if (loading) { /* ... */ }
  // if (error) { /* ... */ }

  if (loading) {
    return (
      <div className={`font-sans flex flex-col min-h-screen ${
        isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100"
      }`}>
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className={`h-8 w-8 animate-spin ${isDarkMode ? "text-gray-200" : "text-black"}`} />
            <p className={`mt-4 text-lg font-medium ${isDarkMode ? "text-gray-200" : "text-black"}`}>
              Loading leaderboard...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`font-sans flex flex-col min-h-screen ${
        isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100"
      }`}>
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-red-500">Failed to load Leaderboard</h3>
            <p className={`mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`font-sans flex flex-col min-h-screen ${
      isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100"
    }`}>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col gap-6 p-4">
        
        {/* Simple Quiz Title */}
        <div className="pt-4">
          <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
            {quizName ? quizName.replace(/^(sql:|python:|mcq:)\s*/i, "") : "Quiz Leaderboard"}
          </h1>
        </div>

        {/* Main Leaderboard for Timely Submissions */}
        <div className="space-y-6">
          <div>
            <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Leaderboard
            </h2>
          </div>
          
          {leaderboard && leaderboard.timelyUsers && leaderboard.timelyUsers.length > 0 ? (
            <div className={`rounded-lg overflow-hidden shadow ${isDarkMode ? "bg-[#32363C]" : "bg-white"} border ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
              <LeaderboardTable users={leaderboard.timelyUsers} />
            </div>
          ) : (
            <div className={`p-6 rounded-lg ${isDarkMode ? "bg-[#32363C]" : "bg-white"} border ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
              <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                No timely submissions have been recorded for this quiz yet.
              </p>
            </div>
          )}

          {/* Late Submissions Section */}
          {leaderboard && leaderboard.lateUsers && leaderboard.lateUsers.length > 0 && (
            <div className="space-y-4">
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
                  Late Submissions
                </h2>
              </div>
              <div className={`rounded-lg overflow-hidden shadow ${isDarkMode ? "bg-[#32363C]" : "bg-white"} border ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
                <LeaderboardTable users={leaderboard.lateUsers} />
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;