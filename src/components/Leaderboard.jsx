// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { Loader2, KeyRound, X, Download } from 'lucide-react';
// import queryString from 'query-string';
// import Navbar from './Navbar';

// const Leaderboard = ({ quizId }) => {
//   const [leaderboard, setLeaderboard] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isPremiumPopupOpen, setIsPremiumPopupOpen] = useState(false);

//   const parsed = queryString.parse(window.location.search);
//   const quizID = parsed.quizID;
//   const quizName = parsed.quizName;

//   const getQuizType = (quizName) => {
//     const parts = quizName?.split(':');
//     return parts?.length > 1 ? parts[0].trim().toLowerCase() : 'mcq';
//   };

//   useEffect(() => {
//     const fetchLeaderboard = async () => {
//       try {
//         let response;
//         const quizType = getQuizType(quizName);
//         if (quizType === 'mcq') {
//           response = await axios.get(`https://server.datasenseai.com/leaderboard/${quizID}`);
//           // response = await axios.get(`http://localhost:4000/leaderboard/${quizID}`);
//         } else if (quizType === 'python') {
//           response = await axios.get(`https://server.datasenseai.com/leaderboard/python/${quizID}`);
//           // response = await axios.get(`http://localhost:4000/leaderboard/python/${quizID}`);
//         } else if (quizType === 'sql') {
//           response = await axios.get(`https://server.datasenseai.com/leaderboard/sql/${quizID}`);
//           // response = await axios.get(`http://localhost:4000/leaderboard/sql/${quizID}`);
//         }

//         console.log('🔍 Leaderboard API response:', response.data.leaderboard);
//         console.log('📊 Timely users count:', response.data.leaderboard?.timelyUsers?.length || 0);
//         console.log('📊 Late users count:', response.data.leaderboard?.lateUsers?.length || 0);

        
//         setLeaderboard(response.data.leaderboard);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.message || 'An error occurred');
//         setLoading(false);
//       }
//     };

//     fetchLeaderboard();
//   }, [quizId, quizName, quizID]);

//   const formatDuration = (seconds) => {
//     if (seconds > 60) {
//       const minutes = Math.floor(seconds / 60);
//       const remainingSeconds = seconds % 60;
//       return `${minutes} min ${remainingSeconds} sec`;
//     }
//     return `${seconds} sec`;
//   };

//   // NEW: Helper function to format the timestamp into a readable date
//   const formatDate = (isoString) => {
//     if (!isoString) return 'N/A';
//     try {
//       const date = new Date(isoString);
//       return date.toLocaleDateString('en-US', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric',
//       });
//     } catch (error) {
//       return 'Invalid Date';
//     }
//   };

//   const getUserName = (userId) => {
//     if (!userId) return 'Unknown';
//     const parts = userId.split(',');
//     const email = parts[0].trim();
//     const name = parts[1]?.trim();
//     return name && name !== "N/A" ? name : email;
//   }

//   // MODIFIED: LeaderboardTable now accepts 'showSubmissionDate' prop
//   // const LeaderboardTable = ({ users, isDarkMode, highlightTopThree = false, onCertificateClick, showSubmissionDate = false }) => {
//   //   const getHighlightClass = (rank) => {
//   //     if (!highlightTopThree) return '';
//   //     switch (rank) {
//   //       // case 1: return isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-400/20';
//   //       case 1: return isDarkMode ? 'bg-[#FFD700]/80' : 'bg-yellow-400/20';
//   //       // case 2: return isDarkMode ? 'bg-gray-500/10' : 'bg-gray-400/20';
//   //       case 2: return isDarkMode ? 'bg-gray-500/10' : 'bg-gray-400/20';
//   //       case 3: return isDarkMode ? 'bg-orange-500/10' : 'bg-orange-400/20';
//   //       default: return '';
//   //     }
//   //   };

//   //   return (
//   //     <div className="overflow-x-auto">
//   //       <table className="w-full">
//   //         <thead>
//   //           <tr className={`border-b ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
//   //             {/* MODIFIED: Adjusted widths for new column */}
//   //             <th className={`px-4 py-3 text-left text-sm font-bold w-[10%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Rank</th>
//   //             <th className={`px-4 py-3 text-left text-sm font-bold ${showSubmissionDate ? 'w-[35%]' : 'w-[40%]'} ${isDarkMode ? "text-white" : "text-gray-900"}`}>User</th>
//   //             <th className={`px-4 py-3 text-left text-sm font-bold w-[15%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Score</th>
//   //             <th className={`px-4 py-3 text-left text-sm font-bold w-[20%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Duration</th>
//   //             {highlightTopThree && (
//   //               <th className={`px-4 py-3 text-left text-sm font-bold w-[15%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Certificate</th>
//   //             )}
//   //             {/* NEW: Conditional header for submission date */}
//   //             {showSubmissionDate && (
//   //               <th className={`px-4 py-3 text-left text-sm font-bold w-[20%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Date of Submission</th>
//   //             )}
//   //           </tr>
//   //         </thead>
//   //         <tbody>
//   //           {users.map((user, index) => (
//   //             <tr 
//   //               key={user.userId + user.rank} 
//   //               className={`border-b ${getHighlightClass(user.rank)} ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"} ${index === users.length - 1 ? 'border-b-0' : ''}`}
//   //             >
//   //               <td className={`px-4 py-4 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.rank}</td>
//   //               <td className={`px-4 py-4 text-sm ${isDarkMode ? "text-white" : "text-gray-900"}`}>{getUserName(user.userId)}</td>
//   //               <td className={`px-4 py-4 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.score}</td>
//   //               <td className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{formatDuration(user.duration)}</td>
//   //               {highlightTopThree && (
//   //                 <td className={`px-4 py-4 text-sm`}>
//   //                   {[1, 2, 3].includes(user.rank) && (
//   //                     <button 
//   //                       onClick={onCertificateClick} 
//   //                       className="flex items-center justify-center gap-2 text-sm font-medium bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 text-black dark:text-white px-3 py-1.5 rounded-md"
//   //                     >
//   //                       <Download className="h-4 w-4" />
//   //                       Download
//   //                     </button>
//   //                   )}
//   //                 </td>
//   //               )}
//   //               {/* NEW: Conditional cell for submission date */}
//   //               {showSubmissionDate && (
//   //                 <td className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{formatDate(user.timestamp)}</td>
//   //               )}
//   //             </tr>
//   //           ))}
//   //         </tbody>
//   //       </table>
//   //     </div>
//   //   );
//   // };

//   // MODIFIED: LeaderboardTable now accepts 'showSubmissionDate' prop
//   const LeaderboardTable = ({ users, isDarkMode, highlightTopThree = false, onCertificateClick, showSubmissionDate = false }) => {
//     const getHighlightClass = (rank) => {
//       if (!highlightTopThree) return '';
//       switch (rank) {
//         // case 1: return isDarkMode ? 'bg-yellow-500/10' : 'bg-yellow-400/20';
//         case 1: return isDarkMode ? 'bg-[#FFD700]/80' : 'bg-[#FFD700]/80';
//         // case 2: return isDarkMode ? 'bg-gray-500/10' : 'bg-gray-400/20';
//         case 2: return isDarkMode ? 'bg-[#C0C0C0]/80' : 'bg-[#C0C0C0]/80';
//         // case 3: return isDarkMode ? 'bg-orange-500/10' : 'bg-orange-400/20';
//         case 3: return isDarkMode ? 'bg-[#CD7F32]/80' : 'bg-[#CD7F32]/80';
//         default: return '';
//       }
//     };

//     return (
//       <div className="overflow-x-auto">
//         {/* The 'table-fixed' class is important for respecting column widths */}
//         <table className="w-full table-fixed">
//           <thead>
//             <tr className={`border-b ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
//               {/* --- CORRECTED WIDTHS --- */}
//               <th className={`px-4 py-3 text-left text-sm font-bold w-[10%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Rank</th>
//               {/* User column is now always 40% */}
//               <th className={`px-4 py-3 text-left text-sm font-bold w-[40%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>User</th>
//               <th className={`px-4 py-3 text-left text-sm font-bold w-[15%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Score</th>
//               <th className={`px-4 py-3 text-left text-sm font-bold w-[20%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Duration</th>
//               {highlightTopThree && (
//                 // Last column is now always 15%
//                 <th className={`px-4 py-3 text-left text-sm font-bold w-[15%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Certificate</th>
//               )}
//               {showSubmissionDate && (
//                 // Last column is now always 15%
//                 <th className={`px-4 py-3 text-left text-sm font-bold w-[15%] ${isDarkMode ? "text-white" : "text-gray-900"}`}>Date of Submission</th>
//               )}
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user, index) => (
//               <tr 
//                 key={user.userId + user.rank} 
//                 className={` ${getHighlightClass(user.rank)} ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"} ${index === users.length - 1 ? 'border-b-0' : ''}`}
//               >
//                 <td className={`px-4 py-4 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.rank}</td>
//                 {/* Added 'truncate' to prevent long names from breaking layout */}
//                 <td className={`px-4 py-4 text-sm truncate ${isDarkMode ? "text-white" : "text-gray-900"}`}>{getUserName(user.userId)}</td>
//                 <td className={`px-4 py-4 text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}>{user.score}</td>
//                 <td className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{formatDuration(user.duration)}</td>
//                 {highlightTopThree && (
//                   <td className={`px-4 py-4 text-sm`}>
//                     {[1, 2, 3].includes(user.rank) && (
//                       <button 
//                         onClick={onCertificateClick} 
//                         className="flex items-center justify-center gap-2 text-sm font-medium bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900/50 text-black dark:text-white px-3 py-1.5 rounded-md"
//                       >
//                         <Download className="h-4 w-4" />
//                         Download
//                       </button>
//                     )}
//                   </td>
//                 )}
//                 {showSubmissionDate && (
//                   <td className={`px-4 py-4 text-sm ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{formatDate(user.timestamp)}</td>
//                 )}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className={`font-sans flex flex-col min-h-screen ${ isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100" }`}>
//         <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
//         <div className="flex-1 flex items-center justify-center">
//           <Loader2 className={`h-8 w-8 animate-spin ${isDarkMode ? "text-gray-200" : "text-black"}`} />
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//         <div className={`font-sans flex flex-col min-h-screen ${ isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100" }`}>
//         <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
//         <div className="flex-1 flex items-center justify-center text-red-500">Error: {error}</div>
//       </div>
//     );
//   }

//   return (
//     <div className={`font-sans flex flex-col min-h-screen ${ isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-100" }`}>
//       <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
//       <main className="flex-1 w-full max-w-screen-2xl mx-auto flex flex-col gap-6 p-4">
//         <div className="pt-4">
//           <h1 className={`text-2xl md:text-3xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
//             {quizName ? quizName.replace(/^(sql:|python:|mcq:)\s*/i, "") : "Quiz Leaderboard"}
//           </h1>
//         </div>
//         <div className="space-y-6">
//           <div>
//             <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Leaderboard</h2>
//           </div>
//           {leaderboard && leaderboard.timelyUsers && leaderboard.timelyUsers.length > 0 ? (
//             <div className={`rounded-lg overflow-hidden shadow ${isDarkMode ? "bg-[#32363C]" : "bg-white"} border ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
//               <LeaderboardTable 
//                 users={leaderboard.timelyUsers} 
//                 isDarkMode={isDarkMode}
//                 highlightTopThree={true}
//                 onCertificateClick={() => setIsPremiumPopupOpen(true)}
//               />
//             </div>
//           ) : (
//             <div className={`p-6 rounded-lg ${isDarkMode ? "bg-[#32363C]" : "bg-white"} border ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
//               <p className={`text-center ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>No timely submissions recorded yet.</p>
//             </div>
//           )}
//           {leaderboard && leaderboard.lateUsers && leaderboard.lateUsers.length > 0 && (
//             <div className="space-y-4">
//               <div>
//                 <h2 className={`text-xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Late Submissions</h2>
//               </div>
//               <div className={`rounded-lg overflow-hidden shadow ${isDarkMode ? "bg-[#32363C]" : "bg-white"} border ${isDarkMode ? "border-[#2f2f2f]" : "border-gray-200"}`}>
//                 {/* MODIFIED: Pass 'showSubmissionDate' prop to the late submissions table */}
//                 <LeaderboardTable 
//                   users={leaderboard.lateUsers} 
//                   isDarkMode={isDarkMode} 
//                   showSubmissionDate={true}
//                 />
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//       {isPremiumPopupOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
//           <div className="bg-white dark:bg-[#252526] p-6 rounded-lg shadow-xl relative w-11/12 max-w-md text-center">
//             <button
//               onClick={() => setIsPremiumPopupOpen(false)}
//               className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
//             >
//               <X size={24} />
//             </button>
//             <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50">
//               <KeyRound className="h-6 w-6 text-yellow-500" />
//             </div>
//             <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Premium Feature</h3>
//             <p className="text-gray-600 dark:text-gray-400 mb-6">
//               The <span className="font-semibold text-teal-500">Certificate Download</span> feature is coming soon! Subscribe to be the first to know.
//             </p>
//             <button disabled className="w-full bg-teal-500 text-white font-semibold py-2.5 px-4 rounded-lg opacity-50 cursor-not-allowed">
//               Subscribe
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Leaderboard;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, KeyRound, X, Download } from 'lucide-react';
import queryString from 'query-string';
import Navbar from './Navbar';
import Loader from './Loader';

// --- Helper Functions (No Change) ---
const formatDuration = (seconds) => {
    if (seconds > 60) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} min ${seconds % 60} sec`;
    }
    return `${seconds} sec`;
};

const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    return new Date(isoString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

const getUserName = (userId) => {
    if (!userId) return 'Unknown';
    const [email, name] = userId.split(',');
    return name?.trim() && name.trim() !== "N/A" ? name.trim() : email.trim();
};

// --- Sub-Components ---
const PodiumItem = ({ user, rank }) => {
    const styles = {
        1: { // Gold - Champion
            coverGradient: 'from-yellow-400 via-amber-500 to-yellow-600',
            avatarBg: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600',
            rankText: '1st',
            medal: '🥇',
            scoreColor: 'text-yellow-600 dark:text-yellow-500',
            buttonGradient: 'from-yellow-400 via-amber-500 to-yellow-600',
            borderColor: 'border-yellow-400',
        },
        2: { // Silver - Runner Up
            coverGradient: 'from-slate-300 via-gray-400 to-slate-500',
            avatarBg: 'bg-gradient-to-br from-slate-300 via-gray-400 to-slate-500',
            rankText: '2nd',
            medal: '🥈',
            scoreColor: 'text-slate-600 dark:text-slate-400',
            buttonGradient: 'from-slate-300 via-gray-400 to-slate-500',
            borderColor: 'border-slate-400',
        },
        3: { // Bronze - Third Place
            coverGradient: 'from-orange-400 via-amber-600 to-orange-700',
            avatarBg: 'bg-gradient-to-br from-orange-400 via-amber-600 to-orange-700',
            rankText: '3rd',
            medal: '🥉',
            scoreColor: 'text-orange-600 dark:text-orange-500',
            buttonGradient: 'from-orange-400 via-amber-600 to-orange-700',
            borderColor: 'border-orange-400',
        }
    };
    const style = styles[rank];
    
    // Get user initials
    const getInitials = (userId) => {
        const name = getUserName(userId);
        const words = name.split(' ');
        if (words.length >= 2) {
            return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };
    
    return (
        <div className="relative w-full max-w-[340px] bg-white dark:bg-[#25272C] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border border-gray-200 dark:border-gray-700">
            {/* Cover Photo with Rank Text */}
            <div className={`relative h-24 bg-gradient-to-r ${style.coverGradient}`}>
                {/* Large Rank Text Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-7xl font-black italic text-white/20">
                        {style.rankText}
                    </span>
                </div>
                
                {/* Medal Badge - Top Right */}
                <div className="absolute top-3 right-3 text-3xl drop-shadow-lg">
                    {style.medal}
                </div>
            </div>
            
            {/* Profile Content */}
            <div className="relative px-5 pb-5">
                {/* Avatar - Overlapping Cover (LinkedIn Style) */}
                <div className="absolute -top-12 left-5">
                    {/* Crown for Rank 1 */}
                    {rank === 1 && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-30 text-5xl drop-shadow-2xl">
                            👑
                        </div>
                    )}
                    <div className={`w-24 h-24 ${style.avatarBg} flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white dark:ring-[#25272C] border-2 ${style.borderColor}`} style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                        {getInitials(user.userId)}
                    </div>
                </div>
                
                {/* Content - Starts below avatar */}
                <div className="pt-16">
                    {/* User Name */}
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mb-1 truncate">
                        {getUserName(user.userId)}
                    </h3>
                    
                    {/* Stats */}
                    <div className="space-y-2 mb-4 mt-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Score</span>
                            <span className={`text-3xl font-black ${style.scoreColor}`}>{user.score}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Time</span>
                            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{formatDuration(user.duration)}</span>
                        </div>
                    </div>
                    
                    {/* Certificate Button */}
                    <button 
                        onClick={() => document.dispatchEvent(new CustomEvent('openPremiumPopup'))} 
                        className={`w-full bg-gradient-to-r ${style.buttonGradient} text-white font-bold py-2.5 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2 text-sm`}
                    >
                        <Download className="h-4 w-4" />
                        Download Certificate
                    </button>
                </div>
            </div>
        </div>
    );
};

// MODIFIED: Updated dark mode background color for consistency
const LeaderboardList = ({ users, isLateSubmission = false }) => (
    <div className="space-y-3">
        <div className={`grid grid-cols-12 gap-4 px-6 py-3 text-xs font-bold uppercase rounded-lg ${isLateSubmission ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-700 dark:text-orange-400' : 'bg-teal-50 dark:bg-teal-900/10 text-teal-700 dark:text-teal-400'}`}>
            <span className="col-span-1 text-center">Rank</span>
            <span className="col-span-5">User</span>
            <span className="col-span-2 text-center">Score</span>
            <span className="col-span-4 text-center">{isLateSubmission ? 'Date of Submission' : 'Duration'}</span>
        </div>
        {users.map((user, idx) => (
            <div key={user.rank} className={`grid grid-cols-12 gap-4 items-center p-4 rounded-xl bg-white dark:bg-[#25272C] shadow-sm hover:shadow-lg border-2 border-transparent hover:border-teal-400 dark:hover:border-teal-600 transition-all duration-300 transform hover:-translate-y-1`}>
                <span className={`col-span-1 text-center text-lg font-bold ${idx < 3 ? 'text-teal-600 dark:text-teal-400' : 'text-gray-700 dark:text-gray-300'}`}>{user.rank}</span>
                <span className="col-span-5 text-sm font-semibold text-gray-800 dark:text-gray-100 truncate pr-4">{getUserName(user.userId)}</span>
                <span className="col-span-2 text-center">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300 font-bold text-sm">
                        {user.score}
                    </span>
                </span>
                <span className="col-span-4 text-center text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {isLateSubmission ? formatDate(user.timestamp) : formatDuration(user.duration)}
                </span>
            </div>
        ))}
    </div>
);


// --- Main Leaderboard Component ---
const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPremiumPopupOpen, setIsPremiumPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('leaderboard'); 

  const parsed = queryString.parse(window.location.search);
  const { quizID, quizName } = parsed;

  useEffect(() => {
    const openModal = () => setIsPremiumPopupOpen(true);
    document.addEventListener('openPremiumPopup', openModal);
    return () => document.removeEventListener('openPremiumPopup', openModal);
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const quizType = quizName?.split(':')[0].trim().toLowerCase() || 'mcq';
        const baseUrl = 'https://server.datasenseai.com';
        let response;
        if (quizType === 'python') response = await axios.get(`${baseUrl}/leaderboard/python/${quizID}`);
        else if (quizType === 'sql') response = await axios.get(`${baseUrl}/leaderboard/sql/${quizID}`);
        else response = await axios.get(`${baseUrl}/leaderboard/${quizID}`);
        setLeaderboard(response.data.leaderboard);
      } catch (err) { setError(err.response?.data?.message || 'An error occurred.'); } 
      finally { setLoading(false); }
    };
    if (quizID) fetchLeaderboard();
  }, [quizID, quizName]);
  
  const TabButton = ({ title, tabName }) => (
    <button onClick={() => setActiveTab(tabName)} className={`px-4 py-2 font-semibold transition-colors duration-300 ${activeTab === tabName ? 'border-b-2 border-teal-500 text-gray-900 dark:text-white' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}>{title}</button>
  );

  // if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1D1E23]"><Loader2 className="h-10 w-10 animate-spin" /></div>;
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-[#1D1E23]"><Loader className="" /></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500 p-4 text-center bg-gray-100 dark:bg-[#1D1E23]">{error}</div>;

  const timelyUsers = leaderboard?.timelyUsers || [];
  const lateUsers = leaderboard?.lateUsers || [];
  
  const rankOne = timelyUsers.find(u => u.rank === 1);
  const rankTwo = timelyUsers.find(u => u.rank === 2);
  const rankThree = timelyUsers.find(u => u.rank === 3);
  const remainingUsers = timelyUsers.filter(u => u.rank > 3);

  return (
    <div className={`font-sans flex flex-col min-h-screen ${ isDarkMode ? "dark bg-[#1D1E23]" : "bg-gray-50" }`}>
        <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        <main className="flex-1 w-full mx-auto flex flex-col gap-6 px-0 py-8 md:px-8">
            {/* Header Section with improved styling */}
            <div className="space-y-2">
                {/* <h1 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"> */}
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 dark:text-gray-200">
                    {quizName ? quizName.replace(/^(sql:|python:|mcq:)\s*/i, "") : "Quiz Leaderboard"}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
                    View the top performers and late submissions for this quiz
                </p>
            </div>

            {/* Tab Navigation with improved styling */}
            <div className="flex items-center gap-1 p-1 bg-white dark:bg-[#25272C] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 w-fit">
                <button
                    onClick={() => setActiveTab('leaderboard')}
                    className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        activeTab === 'leaderboard'
                            ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    🏆 Leaderboard
                </button>
                <button
                    onClick={() => setActiveTab('late')}
                    className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-300 ${
                        activeTab === 'late'
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    ⏰ Late Submissions
                </button>
            </div>

            {/* MODIFIED: Updated dark mode background color and added border for consistency */}
            {activeTab === 'leaderboard' && (
                <div className="p-2 md:p-2 lg:p-2 rounded-2xl bg-white dark:bg-[#25272C] border border-gray-200 dark:border-gray-700 shadow-xl">
                    {timelyUsers.length > 0 ? (
                        <div className="space-y-8">
                            {/* Top 3 Podium */}
                            <div className="relative pt-24 md:pt-32">
                                {/* Champions Background Text */}
                                <div className="absolute left-1/2 -translate-x-1/2 top-0 z-0 pointer-events-none">
                                    <h2 className="text-[120px] md:text-[180px] lg:text-[200px] font-black text-gray-400/20 dark:text-gray-700/20 whitespace-nowrap select-none leading-none">
                                        CHAMPIONS
                                    </h2>
                                </div>
                                
                                {/* Top 3 Cards - Horizontal Layout */}
                                <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 px-4 max-w-6xl mx-auto">
                                    {rankOne && <PodiumItem user={rankOne} rank={1} />}
                                    {rankTwo && <PodiumItem user={rankTwo} rank={2} />}
                                    {rankThree && <PodiumItem user={rankThree} rank={3} />}
                                </div>
                            </div>
                            
                            {/* Remaining Rankings */}
                            {remainingUsers.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                        {/* <span>📊</span> All Rankings */}
                                         All Rankings
                                    </h2>
                                    <LeaderboardList users={remainingUsers} />
                                </div>
                            )}
                        </div>
                    ) : ( 
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">🏆</div>
                            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">No timely submissions yet</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Be the first to complete the quiz!</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'late' && (
                 <div className="p-6 md:p-8 rounded-2xl bg-white dark:bg-[#25272C] border border-gray-200 dark:border-gray-700 shadow-xl">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span>⏰</span> Late Submissions
                    </h2>
                    {lateUsers.length > 0 ? (
                        <LeaderboardList users={lateUsers} isLateSubmission={true} />
                    ) : ( 
                        <div className="text-center py-20">
                            <div className="text-6xl mb-4">📝</div>
                            <p className="text-xl font-semibold text-gray-500 dark:text-gray-400">No late submissions recorded</p>
                            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">All submissions were on time!</p>
                        </div>
                    )}
                </div>
            )}
        </main>

        {isPremiumPopupOpen && (
           <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm">
             <div className="bg-white dark:bg-[#252526] p-6 rounded-lg shadow-xl relative w-11/12 max-w-md text-center">
                 <button onClick={() => setIsPremiumPopupOpen(false)} className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"><X size={24} /></button>
                 <div className="mx-auto mb-4 h-12 w-12 flex items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/50"><KeyRound className="h-6 w-6 text-yellow-500" /></div>
                 <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Premium Feature</h3>
                 <p className="text-gray-600 dark:text-gray-400 mb-6">The <span className="font-semibold text-teal-500">Certificate Download</span> feature is coming soon!</p>
                 <button disabled className="w-full bg-teal-500 text-white font-semibold py-2.5 px-4 rounded-lg opacity-50 cursor-not-allowed">Subscribe</button>
             </div>
           </div>
        )}
    </div>
  );
};

export default Leaderboard;