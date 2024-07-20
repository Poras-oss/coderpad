import React, { useState, useEffect } from 'react';
import axios from 'axios';
import queryString from 'query-string';

const Leaderboard = ({ quizId }) => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const parsed = queryString.parse(window.location.search);
  const userID = parsed.userID;
  const quizID = parsed.quizID;
  const quizName = parsed.quizName;

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(`https://server.datasenseai.com/leaderboard/${quizID}`);
        setLeaderboard(response.data.leaderboard);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [quizId]);

  const formatDuration = (seconds) => {
    if (seconds > 60) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes} min ${remainingSeconds} sec`;
    }
    return `${seconds} sec`;
  };

  const getUserName = (userId) => {
    const parts = userId.split(',');
    return parts.length > 1 ? parts[1].trim() : userId;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold leading-tight mb-4">{quizName}</h2>
        </div>
        <div className="overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-3 py-3 sm:px-5 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-3 py-3 sm:px-5 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-3 py-3 sm:px-5 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-3 py-3 sm:px-5 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.users.map((user) => (
                  <tr key={user.userId}>
                    <td className="px-3 py-4 sm:px-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.rank}</p>
                    </td>
                    <td className="px-3 py-4 sm:px-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{getUserName(user.userId)}</p>
                    </td>
                    <td className="px-3 py-4 sm:px-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.score}</p>
                    </td>
                    <td className="px-3 py-4 sm:px-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{formatDuration(user.duration)}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;