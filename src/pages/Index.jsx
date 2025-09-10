// import { useState, useRef, useEffect } from 'react';
// import CyberLoader from '../components/home/CyberLoader';
// import ThreeBackground from '../components/home/ThreeBackground';
// import CyberNav from '../components/home/CyberNav';
// import CyberButton from '../components/home/CyberButton';
// import SQLTerminal from '../components/home/SQLTerminal';
// import DataVisualization from '../components/home/DataVisualization';
// import { LayoutDashboard } from 'lucide-react';
// import GlobeLottie from '../components/home/GlobeLottie';
// import PathTrackerHUD from '../components/home/PathTrackerHUD';
// import FuturisticGlitchPopup from '../components/home/FuturisticGlitchPopup';
// import ComingSoonGlitchPopup from '../components/home/ComingSoonGlitchPopup';
// import CyberCoreHUD from '../components/home/CyberCoreHUD';
// import WorldMapHUD from '../components/home/WorldMapHUD';
// import buttonClickSound from '../assets/mp3/button-click.mp3';
// import QuestionProgressCircle from '../components/home/QuestionProgressCircle';
// import AppHeightController from '../components/home/AppHeightController';
// import ScannerButton from '../components/home/ScannerButton';
// import { getChatbotResponse } from './chatbot';

// // Custom hook to detect mobile devices
// const useIsMobile = () => {
//   const [isMobile, setIsMobile] = useState(false);

//   useEffect(() => {
//     const checkIsMobile = () => {
//       setIsMobile(window.innerWidth < 768);
//     };

//     checkIsMobile();
//     window.addEventListener('resize', checkIsMobile);
//     return () => window.removeEventListener('resize', checkIsMobile);
//   }, []);

//   return isMobile;
// };

// const AnimatedBar = ({ color }) => {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     let animationFrame;
//     let startTime = null;
//     const duration = 3000; // 3 seconds for a complete cycle (0 to 100)

//     const animate = (timestamp) => {
//       if (!startTime) startTime = timestamp;
      
//       const elapsed = (timestamp - startTime) % duration;
//       const progress = elapsed / duration; // 0 to 1
      
//       // Ease-in-out function for smooth start and end
//       const easeInOut = (t) => {
//         return t < 0.5 
//           ? 2 * t * t 
//           : -1 + (4 - 2 * t) * t;
//       };
      
//       const easedProgress = easeInOut(progress);
//       const currentPercent = Math.round(easedProgress * 100);
      
//       setProgress(currentPercent);
      
//       // Continue the animation indefinitely
//       animationFrame = requestAnimationFrame(animate);
//     };

//     animationFrame = requestAnimationFrame(animate);

//     return () => cancelAnimationFrame(animationFrame);
//   }, []);

//   return (
//     <div className="w-full bg-muted h-1 rounded overflow-hidden">
//       <div
//         className={`${color} h-1 rounded transition-all duration-75 ease-linear`}
//         style={{ width: `${progress}%` }}
//       />
//     </div>
//   );
// };

// // Rotating Subheading Component
// const RotatingSubheading = () => {
//   const subheadings = [
//     'EMPOWERING DATA ENTHUSIASTS TO EXPERTISE',
//     'THE ULTIMATE SQL PRACTICE PLATFORM FOR HANDS-ON LEARNING',
//     'SQL MASTERY THROUGH REAL-WORLD CASE STUDIES',
//     'GET INTERVIEW-READY WITH TARGETED SQL PRACTICE',
//     'YOUR PERSONAL SQL SANDBOX — LEARN BY DOING',
//     'NOT JUST THEORY — IT\'S EXECUTION THAT MATTERS'
//   ];

//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isBlinking, setIsBlinking] = useState(false);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setIsBlinking(true);
      
//       setTimeout(() => {
//         setCurrentIndex((prev) => (prev + 1) % subheadings.length);
//         setIsBlinking(false);
//       }, 300); // Blink duration
//     }, 3000); // Change every 3 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <p className={`text-sm md:text-base font-mono text-white tracking-wider transition-opacity duration-300 ${isBlinking ? 'opacity-0' : 'opacity-100'}`}>
//       {subheadings[currentIndex]}
//     </p>
//   );
// };

// // Animated User Counter Component
// const AnimatedUserCounter = () => {
//   const [count, setCount] = useState(0);
//   const targetCount = useRef(0);

//   useEffect(() => {
//     // Generate random number between 1200-1300 on component mount
//     targetCount.current = Math.floor(Math.random() * 101) + 1200; // 1200 to 1300
    
//     let start = null;
//     let animationFrame;
//     const duration = 2000; // 2 seconds animation

//     const animate = (timestamp) => {
//       if (!start) start = timestamp;
//       const elapsed = timestamp - start;
//       const progress = Math.min(elapsed / duration, 1);
      
//       // Easing function for smooth animation
//       const easeOutQuart = 1 - Math.pow(1 - progress, 4);
//       const currentCount = Math.floor(easeOutQuart * targetCount.current);
      
//       setCount(currentCount);
      
//       if (progress < 1) {
//         animationFrame = requestAnimationFrame(animate);
//       }
//     };

//     animationFrame = requestAnimationFrame(animate);
//     return () => cancelAnimationFrame(animationFrame);
//   }, []);

//   return <span>{count}</span>;
// };

// const Chatbot = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const messagesEndRef = useRef(null);
//   const buttonclickRef = useRef(null);

//   const playButtonClick = () => {
//     if (buttonclickRef.current) {
//       buttonclickRef.current.currentTime = 0;
//       buttonclickRef.current.play();
//     }
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSubmit = (e) => {
//     playButtonClick();
//     e.preventDefault();
//     const trimmedInput = input.trim();
//     if (!trimmedInput) return;

//     setMessages((prev) => [...prev, { text: trimmedInput, isUser: true }]);
//     setInput('');

//     setTimeout(() => {
//       const isGreeting = /quiz|test|hello|hi/i.test(trimmedInput);
//       // const aiResponse = isGreeting
//       //   ? 'Ready to help you with data challenges!'
//       //   : 'I am your AI assistant. Ask me anything about data, gaming, or this dashboard!';
//       const aiResponse = getChatbotResponse(trimmedInput);
//       setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
//     }, 700);
//   };

//   return (
//     <div className="relative w-full max-w-md mx-auto flex flex-col h-48 md:h-56">
//       <audio ref={buttonclickRef} src={buttonClickSound} preload="auto" />
//       {/* Glow background */}
//       <div className="absolute inset-0 z-0 rounded-lg pointer-events-none animate-pulse-glow bg-cyan-400/20 blur-xl" />
//       {/* Chatbot content */}
//       <div className="relative z-10 bg-[#0C1116] text-cyan-100 shadow-[0_0_20px_rgba(0,255,255,0.25)] flex flex-col h-full rounded-lg">
//         <div className="border-b border-cyan-400/25 px-2.5 py-1.5 font-bold tracking-widest text-sm md:text-base text-cyan-200 drop-shadow-lg text-left">
//           DataSense AI Assistant
//         </div>

//         <div className="flex-1 px-2.5 py-1.5 overflow-y-auto text-xs min-h-0" id="chatbot-messages">
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`mb-1.5 flex items-end ${msg.isUser ? 'justify-end' : 'justify-start'}`}
//             >
//               {!msg.isUser && (
//                 <div className="mr-1.5 flex-shrink-0">
//                   <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-cyan-400/80 shadow-lg flex items-left justify-center animate-bounce text-xs">
//                     🤖
//                   </span>
//                 </div>
//               )}
//               <div
//                 className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded-md max-w-[70%] transition-all duration-300 text-xs text-left
//                   ${msg.isUser
//                     ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-400/40 animate-fade-in-right'
//                     : 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/30 animate-fade-in-left'
//                   }`}
//               >
//                 {msg.text}
//               </div>
//               {msg.isUser && (
//                 <div className="ml-1.5 flex-shrink-0">
//                   <span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-cyan-600/80 shadow-lg flex items-center justify-center animate-bounce">
//                     <svg width="12" height="12" fill="none"><circle cx="6" cy="6" r="5" fill="#0ff" /></svg>
//                   </span>
//                 </div>
//               )}
//             </div>
//           ))}
//           <div ref={messagesEndRef} />
//         </div>

//         <form
//           onSubmit={handleSubmit}
//           className="flex items-center border-t border-cyan-400/25 px-1.5 py-1.5 flex-shrink-0"
//         >
//           <input
//             type="text"
//             className="flex-1 bg-cyan-400/10 text-cyan-100 placeholder:text-cyan-200/50 text-xs px-1.5 py-1 rounded-md outline-none mr-1.5"
//             placeholder="Ask me anything..."
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             autoComplete="off"
//           />
//           <CyberButton
//             variant="outline"
//             size="sm"
//             style={{ animationDelay: '0s' }}
//             type="submit"
//           >
//             Send
//           </CyberButton>
//         </form>
//       </div>
//     </div>
//   );
// };

// const Index = () => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [popupOpen, setPopupOpen] = useState(false);
//   const [comingSoonPopupOpen, setComingSoonPopupOpen] = useState(false);
//   const [popupBadge, setPopupBadge] = useState('SQL');
//   const [popupDesc, setPopupDesc] = useState('');
//   const [popupLink, setPopupLink] = useState('');
//   const isMobile = useIsMobile();
//   const [time, setTime] = useState(new Date());

//   const buttonclickRef = useRef(null);

//   useEffect(() => {
//     const timer = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(timer);
//   }, []);
  
//   const playButtonClick = () => {
//     if (buttonclickRef.current) {
//       buttonclickRef.current.currentTime = 0;
//       buttonclickRef.current.play();
//     }
//   };

//   // Map badgeType to description and link
//   const popupData = {
//     'SQL': {
//       description: 'Ready to join a live quiz? You will be redirected to the quiz arena.',
//       yesLink: '/live-events',
//     },
//     'Dashboard': {
//       description: 'Access the neural dashboard for advanced analytics and controls.',
//       yesLink: 'https://dashboard.datasenseai.com/',
//     },
//     'Custom Test': {
//       description: 'Start a custom test tailored to your skills and interests.',
//       yesLink: 'https://assessment.datasenseai.com/',
//     },
//     'Practice Question': {
//       description: 'Practice with individual questions to sharpen your knowledge.',
//       yesLink: '/practice-area?subject=sql',
//     },
//     'DataSense Gaming Arena': {
//       description: 'Enter the DataSense Gaming Arena for interactive challenges.',
//       yesLink: 'https://battleground.datasenseai.com/start',
//     },
//   };

//   if (isLoading) {
//     return <CyberLoader onComplete={() => setIsLoading(false)} />;
//   }

//   // Helper to open popup with badge type
//   const handleOpenPopup = (badgeType) => {
//     playButtonClick();
//     setPopupBadge(badgeType);
//     setPopupDesc(popupData[badgeType]?.description || 'Are you ready to proceed?');
//     setPopupLink(popupData[badgeType]?.yesLink || '/');
//     setPopupOpen(true);
//   };

//   // Helper to open coming soon popup for Mock Quiz
//   const handleOpenComingSoonPopup = () => {
//     playButtonClick();
//     setComingSoonPopupOpen(true);
//   };
  
//   return (
//     <div className="relative landing-page-body w-full h-full">

//       <AppHeightController />
//       {/* Three.js Background - Always render */}
//       <ThreeBackground />
      
//       {/* Desktop-only components */}
//       {!isMobile && (
//         <>
//           <PathTrackerHUD />
//           <SQLTerminal />
//           <DataVisualization />
//           <QuestionProgressCircle />
//           <GlobeLottie style={{ 
//             position: 'absolute', 
//             left: 28, 
//             bottom: 262, 
//             width: 170, 
//             height: 170, 
//             zIndex: 30, 
//             pointerEvents: 'none', 
//             filter: 'drop-shadow(0 0 14px #00fff7cc)', 
//             background: 'transparent' 
//           }} />
//           <WorldMapHUD style={{ right: 10, bottom: 10 }} />
//           <CyberCoreHUD style={{ left: 10, bottom: 10 }} />
          
//           {/* Floating Geometric Elements - Desktop only */}
//           <div className="fixed inset-0 pointer-events-none z-10">
//             {Array.from({ length: 5 }).map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute border border-primary/20 animate-float"
//                 style={{
//                   width: `${18 + i * 9}px`,
//                   height: `${18 + i * 9}px`,
//                   left: `${10 + i * 20}%`,
//                   top: `${20 + i * 15}%`,
//                   animationDelay: `${i * 0.5}s`,
//                   animationDuration: `${4 + i}s`
//                 }}
//               />
//             ))}
//           </div>
//         </>
//       )}
      
//       {/* Navigation - Always render */}
//       <CyberNav />
      
//       {/* Main Content */}
//       <audio ref={buttonclickRef} src={buttonClickSound} preload="auto" />
//       <div className="flex flex-col h-full relative overflow-auto">
//         {/* Mobile Layout */}
//         {isMobile ? (
//           <div className="flex flex-col h-full p-4 pt-20">
//             {/* Title Area - Reduced margin bottom */}
//             <div className="text-center mb-12 pt-8">
//               <div className="relative w-fit mx-auto">
//                 <div className="absolute inset-0 blur-xl rounded-lg pointer-events-none"></div>
//                 <h1 className="text-3xl sm:text-4xl font-black-ops-one font-bold text-primary mb-3">
//                   DATASENSE PRACTICE ARENA
//                 </h1>
//                 <RotatingSubheading />
//               </div>
//             </div>
            
//             {/* Button Area - Moved up and reduced margin bottom */}
//             <div className="flex-1 flex items-start justify-center mb-6 pt-4">
//               <div className="space-y-6">
//                 {/* First row - Two buttons */}
//                 <div className="flex gap-4 justify-center">
//                   <CyberButton 
//                     variant="primary" 
//                     size="sm"
//                     className="flex-1 max-w-[200px]"
//                     style={{ animationDelay: '0s' }}
//                     onClick={() => handleOpenPopup('Practice Question')}
//                   >
//                     Practice Question
//                   </CyberButton>

//                   <CyberButton 
//                     variant="primary" 
//                     size="sm"
//                     className="flex-1 max-w-[200px]"
//                     style={{ animationDelay: '0s' }}
//                     onClick={() => handleOpenPopup('SQL')}
//                   >
//                     Join Live Tests
//                   </CyberButton>
//                 </div>
                
//                 {/* Second row - Dashboard button (circular) */}
//                 <div className="flex justify-center">
//                   <CyberButton
//                     variant="secondary"
//                     size="md"
//                     className="
//                       !rounded-full
//                       !w-12 !h-12
//                       p-0
//                       shadow-cyan-400/40 hover:shadow-cyan-400/80 transition-shadow
//                       animate-spin-slow
//                       ring-2 ring-cyan-400/60 hover:ring-cyan-400/90
//                       relative
//                       group
//                     "
//                     style={{
//                       minWidth: '3rem',
//                       minHeight: '3rem',
//                       width: '3rem',
//                       height: '3rem',
//                       animationDelay: '0s'
//                     }}
//                     icon={
//                       <LayoutDashboard
//                         className="w-6 h-6 font-bold flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
//                         fill="currentColor"
//                         color="currentColor"
//                       />
//                     }
//                     onClick={() => handleOpenPopup('Dashboard')}
//                   >
//                   </CyberButton>
//                 </div>
                
//                 {/* Third row - Two buttons */}
//                 <div className="flex gap-4 justify-center">
//                   <CyberButton 
//                     variant="primary" 
//                     size="sm"
//                     className="flex-1 max-w-[140px]"
//                     style={{ animationDelay: '0s' }}
//                     onClick={handleOpenComingSoonPopup}
//                   >
//                     Mock Tests
//                   </CyberButton>
                  
//                   <CyberButton 
//                     variant="primary" 
//                     size="sm"
//                     className="flex-1 max-w-[140px]"
//                     style={{ animationDelay: '0s' }}
//                     onClick={() => handleOpenPopup('Custom Test')}
//                   >
//                     Custom Test
//                   </CyberButton>
//                 </div>
//               </div>
//             </div>
            
//             {/* Scanner Buttons Area - New section between buttons and chatbot */}
//             <div className="flex justify-center gap-8 mb-16">
//               <ScannerButton 
//                 onClick={() => handleOpenPopup('DataSense Gaming Arena')}
//                 description="DataSense Gaming Arena" 
//               />
//               <ScannerButton 
//                 onClick={() => handleOpenPopup('DataSense Gaming Arena')}
//                 description="Scan to Enter Gaming Arena" 
//               />
//             </div>
            
//             {/* Chatbot Area */}
//             <div className="flex-shrink-0 mb-6">
//               <Chatbot />
//             </div>
//           </div>
//         ) : (
//           /* Desktop Layout - Original */
//           <>
//             {/* Top Section - Title and Buttons */}
//             <div className="flex-1 flex items-center justify-center py-3 mt-8">
//               <div className="text-center space-y-5 max-w-5xl mx-auto px-0">
//                 {/* Main Title */}
//                 <div className="relative w-fit mx-auto">
//                   <div className="absolute inset-0 blur-xl rounded-lg pointer-events-none"></div>
//                   <h1 className="text-3xl md:text-5xl font-black-ops-one font-bold text-primary mb-2.5">
//                     DATASENSE PRACTICE ARENA
//                   </h1>
//                   <RotatingSubheading />
//                   <div className="w-28 h-px mx-auto mt-6" />
//                 </div>
                
//                 {/* Action Buttons */}
//                 <div className="mb-8">
//                   <div className="flex flex-col sm:flex-row gap-1 items-center justify-center mb-5">
//                     {/* Join Live Quizzes */}
//                     <div className="group">
//                       <CyberButton 
//                         variant="primary" 
//                         size="md"
//                         className="w-56"
//                         style={{ animationDelay: '0s' }}
//                         onClick={() => handleOpenPopup('Practice Question')}
//                       >
//                         Practice Questions
//                       </CyberButton>
//                       <div className="text-xs font-mono text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         Personalized Training Protocols
//                       </div>
//                     </div>
//                     {/* Dashboard */}
//                     <div className="group">
//                       <CyberButton
//                         variant="secondary"
//                         size="md"
//                         className="
//                           !rounded-full
//                           !w-10 !h-10
//                           p-0
//                           shadow-cyan-400/40 hover:shadow-cyan-400/80 transition-shadow
//                           animate-spin-slow
//                           ring-2 ring-cyan-400/60 hover:ring-cyan-400/90
//                           relative
//                           group
//                         "
//                         style={{
//                           minWidth: '4rem',
//                           minHeight: '4rem',
//                           width: '4rem',
//                           height: '4rem',
//                           animationDelay: '0s'
//                         }}
//                         icon={
//                           <LayoutDashboard
//                             className="w-14 h-14 font-bold flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
//                             fill="currentColor"
//                             color="currentColor"
//                           />
//                         }
//                         onClick={() => handleOpenPopup('Dashboard')}
//                       >
//                       </CyberButton>
//                       <div className="text-xs font-mono text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         Neural Dashboard
//                       </div>
//                     </div>
//                     {/* Custom Test */}
//                     <div className="group">
//                       <CyberButton 
//                         variant="primary" 
//                         size="md"
//                         className="w-56"
//                         style={{ animationDelay: '0s' }}
//                         onClick={() => handleOpenPopup('SQL')}
//                       >
//                         Join Live Tests
//                       </CyberButton>
//                       <div className="text-xs font-mono text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
//                         Real-Time Challenges
//                       </div>
//                     </div>
//                   </div>
//                   {/* New row for MOCK QUIZ and PRACTICE QUESTION */}
//                   <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
//                     <CyberButton 
//                       variant="primary" 
//                       size="md"
//                       className="w-48"
//                       style={{ animationDelay: '0s' }}
//                       onClick={handleOpenComingSoonPopup}
//                     >
//                       Mock Tests
//                     </CyberButton>
                    
//                     <CyberButton 
//                       variant="primary" 
//                       size="md"
//                       className="w-48"
//                       style={{ animationDelay: '0s' }}
//                       onClick={() => handleOpenPopup('Custom Test')}
//                     >
//                       Custom Test
//                     </CyberButton>
//                   </div>
//                   <div className="w-28 h-px mx-auto mt-6" />
//                 </div>
                
//                 {/* Chatbot - Fixed height, won't push content */}
//                 <div className="flex flex-col sm:flex-row gap-10 items-center justify-center mb-6">
//                   <ScannerButton 
//                     onClick={() => handleOpenPopup('DataSense Gaming Arena')}
//                     description="DataSense Gaming Arena" />
//                   <Chatbot />
//                   <ScannerButton 
//                     onClick={() => handleOpenPopup('DataSense Gaming Arena')}
//                     description="Scan to Enter Gaming Arena" />
//                 </div>
//               </div>
//             </div>
            
//             {/* Bottom Section - Training Matrix (Fixed at bottom) */}
//             <div className="flex-shrink-0 pb-6">
//               <div className="flex justify-center gap-2.5 max-w-3xl mx-auto px-3">
//                 {/* TRAINING MATRIX STATUS Card */}
//                 <div className="hud-overlay border border-primary/30 p-3 w-60">
//                   <div className="text-left">
//                     <div className="text-cyber-success font-mono text-xs mb-1.5 font-bold">● 3000+ Practice Questions</div>
//                     <div className="text-primary font-mono text-xs mb-1.5 font-bold">● 30+ Mock Quizzes</div>
//                     <div className="text-cyber-warning font-mono text-xs mb-1.5 font-bold">● 5+ Active Live Quiz</div>
//                     <div className="mt-2.5">
//                       <AnimatedBar  color="bg-primary" />
//                     </div>
//                   </div>
//                 </div>
//                 <div className="hud-overlay border border-primary/30 p-3 w-60">
//                   <div className="text-left">
//                     <div className="text-primary font-mono text-xs mb-1.5 font-bold">● SYSTEM TIME : {time.toLocaleTimeString()}</div>
//                     <div className="text-cyber-warning font-mono text-xs mb-1.5 font-bold">● ACTIVE USERS: <AnimatedUserCounter /></div>
//                     <div className="text-cyber-success font-mono text-xs mb-1.5 font-bold">● ALL SYSTEMS NOMINAL</div>
//                     <div className="mt-2.5">
//                       <AnimatedBar color="bg-primary" />
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
      
//       {/* Popups - Always render */}
//       <FuturisticGlitchPopup 
//         open={popupOpen} 
//         onClose={() => setPopupOpen(false)} 
//         badgeType={popupBadge} 
//         description={popupDesc} 
//         yesLink={popupLink} 
//       />
      
//       <ComingSoonGlitchPopup 
//         open={comingSoonPopupOpen} 
//         onClose={() => setComingSoonPopupOpen(false)} 
//         badgeType="Mock Quiz"
//         description="Mock Tests are currently under development. We're working hard to bring you comprehensive mock tests soon!"
//       />
//     </div>
//   );
// };

// export default Index;

import { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, Maximize, X, Eraser } from 'lucide-react'; 
import CyberLoader from '../components/home/CyberLoader';
import ThreeBackground from '../components/home/ThreeBackground';
import CyberNav from '../components/home/CyberNav';
import CyberButton from '../components/home/CyberButton';
import SQLTerminal from '../components/home/SQLTerminal';
import DataVisualization from '../components/home/DataVisualization';
import GlobeLottie from '../components/home/GlobeLottie';
import PathTrackerHUD from '../components/home/PathTrackerHUD';
import FuturisticGlitchPopup from '../components/home/FuturisticGlitchPopup';
import ComingSoonGlitchPopup from '../components/home/ComingSoonGlitchPopup';
import CyberCoreHUD from '../components/home/CyberCoreHUD';
import WorldMapHUD from '../components/home/WorldMapHUD';
import buttonClickSound from '../assets/mp3/button-click.mp3';
import QuestionProgressCircle from '../components/home/QuestionProgressCircle';
import AppHeightController from '../components/home/AppHeightController';
import ScannerButton from '../components/home/ScannerButton';
import { getChatbotResponse } from './chatbot';


// Custom hook to detect mobile devices
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};

const AnimatedBar = ({ color }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame;
    let startTime = null;
    const duration = 3000; // 3 seconds for a complete cycle (0 to 100)

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      
      const elapsed = (timestamp - startTime) % duration;
      const progressValue = elapsed / duration; // 0 to 1
      
      const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      
      const easedProgress = easeInOut(progressValue);
      const currentPercent = Math.round(easedProgress * 100);
      
      setProgress(currentPercent);
      
      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="w-full bg-muted h-1 rounded overflow-hidden">
      <div
        className={`${color} h-1 rounded transition-all duration-75 ease-linear`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Rotating Subheading Component
const RotatingSubheading = () => {
  const subheadings = [
    'EMPOWERING DATA ENTHUSIASTS TO EXPERTISE',
    'THE ULTIMATE SQL PRACTICE PLATFORM FOR HANDS-ON LEARNING',
    'SQL MASTERY THROUGH REAL-WORLD CASE STUDIES',
    'GET INTERVIEW-READY WITH TARGETED SQL PRACTICE',
    'YOUR PERSONAL SQL SANDBOX — LEARN BY DOING',
    'NOT JUST THEORY — IT\'S EXECUTION THAT MATTERS'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBlinking, setIsBlinking] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsBlinking(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % subheadings.length);
        setIsBlinking(false);
      }, 300); // Blink duration
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <p className={`text-sm md:text-base font-mono text-white tracking-wider transition-opacity duration-300 ${isBlinking ? 'opacity-0' : 'opacity-100'}`}>
      {subheadings[currentIndex]}
    </p>
  );
};

// Animated User Counter Component
const AnimatedUserCounter = () => {
  const [count, setCount] = useState(0);
  const targetCount = useRef(0);

  useEffect(() => {
    targetCount.current = Math.floor(Math.random() * 101) + 1200;
    
    let start = null;
    let animationFrame;
    const duration = 2000;

    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * targetCount.current);
      
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return <span>{count}</span>;
};

const Chatbot = ({ isExpanded, onToggleExpand }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const buttonclickRef = useRef(null);
  const isMobile = useIsMobile();

  const playButtonClick = () => {
    if (buttonclickRef.current) {
      buttonclickRef.current.currentTime = 0;
      buttonclickRef.current.play();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e) => {
    playButtonClick();
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    setMessages((prev) => [...prev, { text: trimmedInput, isUser: true }]);
    setInput('');

    setTimeout(() => {
      const aiResponse = getChatbotResponse(trimmedInput);
      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
    }, 700);
  };

  const handleClearChat = () => {
    playButtonClick(); // Optional: play sound on clear
    setMessages([]);   // Reset the messages array
  };
  
  // This prevents the main page from scrolling when the chatbot modal is open
  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    // Cleanup function to restore scrolling when the component unmounts
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isExpanded]);


  // The UI for the chatbot is kept in a variable to avoid repetition
  const chatbotInnerContent = (
    <>
      <div className="absolute inset-0 z-0 rounded-lg pointer-events-none animate-pulse-glow bg-cyan-400/20 blur-xl" />
      <div className="relative z-10 bg-[#0C1116] text-cyan-100 shadow-[0_0_20px_rgba(0,255,255,0.25)] flex flex-col h-full rounded-lg">
        {/* <div className="flex items-center justify-between border-b border-cyan-400/25 px-2.5 py-1.5 font-bold tracking-widest text-sm md:text-base text-cyan-200 drop-shadow-lg text-left">
          <span>DataSense AI Assistant</span>
          <button onClick={onToggleExpand} className="p-1 rounded-full text-cyan-200 hover:bg-cyan-400/20 hover:text-white transition-colors">
            {isExpanded ? <X size={18} /> : <Maximize size={16} />}
          </button>
        </div> */}
        <div className="flex items-center justify-between border-b border-cyan-400/25 px-2.5 py-1.5 font-bold tracking-widest text-sm md:text-base text-cyan-200 drop-shadow-lg text-left">
          <span>DataSense AI Assistant</span>
          <div className="flex items-center gap-2">
            {/* Clear Chat Button */}
            <button
              onClick={handleClearChat}
              className="p-1 rounded-full text-cyan-200 hover:bg-cyan-400/20 hover:text-white transition-colors"
              title="Clear Chat"
            >
              <Eraser size={isExpanded ? 18 : 16} />
            </button>
            {/* Maximize/Minimize Button */}
            <button 
              onClick={onToggleExpand} 
              className="p-1 rounded-full text-cyan-200 hover:bg-cyan-400/20 hover:text-white transition-colors"
              title={isExpanded ? "Minimize" : "Maximize"}
            >
              {isExpanded ? <X size={18} /> : <Maximize size={16} />}
            </button>
          </div>
        </div>

        <div className="flex-1 px-2.5 py-1.5 overflow-y-auto text-xs min-h-0" id="chatbot-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-1.5 flex items-end ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
              {!msg.isUser && <div className="mr-1.5 flex-shrink-0"><span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-cyan-400/80 shadow-lg flex items-center justify-center animate-bounce text-xs">🤖</span></div>}
              <div className={`px-2 py-1 md:px-2.5 md:py-1.5 rounded-md max-w-[80%] transition-all duration-300 text-left ${isExpanded ? 'text-sm' : 'text-xs'} ${msg.isUser ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-400/40 animate-fade-in-right' : 'bg-cyan-400/10 text-cyan-200 border border-cyan-400/30 animate-fade-in-left'}`}>{msg.text}</div>
              {msg.isUser && <div className="ml-1.5 flex-shrink-0"><span className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-cyan-600/80 shadow-lg flex items-center justify-center animate-bounce"><svg width="12" height="12" fill="none"><circle cx="6" cy="6" r="5" fill="#0ff" /></svg></span></div>}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center border-t border-cyan-400/25 px-1.5 py-1.5 flex-shrink-0">
          <input type="text" className={`flex-1 bg-cyan-400/10 text-cyan-100 placeholder:text-cyan-200/50 px-1.5 py-1 rounded-md outline-none mr-1.5 ${isExpanded ? 'text-sm' : 'text-xs'}`} placeholder="Ask me anything..." value={input} onChange={(e) => setInput(e.target.value)} autoComplete="off" />
          <CyberButton variant="outline" size="sm" type="submit">Send</CyberButton>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* This is the modal view for expanded state */}
      {isExpanded && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
           <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onToggleExpand} />
           <div className="relative z-10 w-full h-[80vh] max-w-3xl flex flex-col">
              {chatbotInnerContent}
           </div>
         </div>
      )}

      {/* This is the original, small view */}
      <div className="relative w-full max-w-md mx-auto flex flex-col h-48 md:h-56">
        <audio ref={buttonclickRef} src={buttonClickSound} preload="auto" />
        {/* We only render the small view if it's not expanded */}
        {!isExpanded && chatbotInnerContent}
      </div>
    </>
  );
};

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [popupOpen, setPopupOpen] = useState(false);
  const [comingSoonPopupOpen, setComingSoonPopupOpen] = useState(false);
  const [isChatbotExpanded, setIsChatbotExpanded] = useState(false);
  const [popupBadge, setPopupBadge] = useState('SQL');
  const [popupDesc, setPopupDesc] = useState('');
  const [popupLink, setPopupLink] = useState('');
  const isMobile = useIsMobile();
  const [time, setTime] = useState(new Date());

  const buttonclickRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  const playButtonClick = () => {
    if (buttonclickRef.current) {
      buttonclickRef.current.currentTime = 0;
      buttonclickRef.current.play();
    }
  };

  const popupData = {
    'SQL': { description: 'Ready to join a live quiz? You will be redirected to the quiz arena.', yesLink: '/live-events' },
    'Dashboard': { description: 'Access the neural dashboard for advanced analytics and controls.', yesLink: 'https://dashboard.datasenseai.com/' },
    'Custom Test': { description: 'Start a custom test tailored to your skills and interests.', yesLink: 'https://assessment.datasenseai.com/' },
    'Practice Question': { description: 'Practice with individual questions to sharpen your knowledge.', yesLink: '/practice-area?subject=sql' },
    'DataSense Gaming Arena': { description: 'Enter the DataSense Gaming Arena for interactive challenges.', yesLink: 'https://battleground.datasenseai.com/start' },
  };

  if (isLoading) {
    return <CyberLoader onComplete={() => setIsLoading(false)} />;
  }

  const handleOpenPopup = (badgeType) => {
    playButtonClick();
    setPopupBadge(badgeType);
    setPopupDesc(popupData[badgeType]?.description || 'Are you ready to proceed?');
    setPopupLink(popupData[badgeType]?.yesLink || '/');
    setPopupOpen(true);
  };

  const handleOpenComingSoonPopup = () => {
    playButtonClick();
    setComingSoonPopupOpen(true);
  };
  
  return (
    <div className="relative landing-page-body w-full h-full">

      <AppHeightController />
      <ThreeBackground />
      
      {!isMobile && (
        <>
          <PathTrackerHUD />
          <SQLTerminal />
          <DataVisualization />
          <QuestionProgressCircle />
          <GlobeLottie style={{ position: 'absolute', left: 28, bottom: 262, width: 170, height: 170, zIndex: 30, pointerEvents: 'none', filter: 'drop-shadow(0 0 14px #00fff7cc)', background: 'transparent' }} />
          <WorldMapHUD style={{ right: 10, bottom: 10 }} />
          <CyberCoreHUD style={{ left: 10, bottom: 10 }} />
          
          <div className="fixed inset-0 pointer-events-none z-10">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="absolute border border-primary/20 animate-float" style={{ width: `${18 + i * 9}px`, height: `${18 + i * 9}px`, left: `${10 + i * 20}%`, top: `${20 + i * 15}%`, animationDelay: `${i * 0.5}s`, animationDuration: `${4 + i}s` }} />
            ))}
          </div>
        </>
      )}
      
      <CyberNav />
      
      <audio ref={buttonclickRef} src={buttonClickSound} preload="auto" />
      <div className="flex flex-col h-full relative overflow-auto">
        {isMobile ? (
          <div className="flex flex-col h-full p-4 pt-20">
            <div className="text-center mb-12 pt-8">
              <div className="relative w-fit mx-auto">
                <div className="absolute inset-0 blur-xl rounded-lg pointer-events-none"></div>
                <h1 className="text-3xl sm:text-4xl font-black-ops-one font-bold text-primary mb-3">
                  DATASENSE PRACTICE ARENA
                </h1>
                <RotatingSubheading />
              </div>
            </div>
            
            <div className="flex-1 flex items-start justify-center mb-6 pt-4">
              <div className="space-y-6">
                <div className="flex gap-4 justify-center">
                  <CyberButton variant="primary" size="sm" className="flex-1 max-w-[200px]" style={{ animationDelay: '0s' }} onClick={() => handleOpenPopup('Practice Question')}>Practice Question</CyberButton>
                  <CyberButton variant="primary" size="sm" className="flex-1 max-w-[200px]" style={{ animationDelay: '0s' }} onClick={() => handleOpenPopup('SQL')}>Join Live Tests</CyberButton>
                </div>
                
                <div className="flex justify-center">
                  <CyberButton variant="secondary" size="md" className="!rounded-full !w-12 !h-12 p-0 shadow-cyan-400/40 hover:shadow-cyan-400/80 transition-shadow animate-spin-slow ring-2 ring-cyan-400/60 hover:ring-cyan-400/90 relative group" style={{ minWidth: '3rem', minHeight: '3rem', width: '3rem', height: '3rem', animationDelay: '0s' }} icon={<LayoutDashboard className="w-6 h-6 font-bold flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="currentColor" color="currentColor" />} onClick={() => handleOpenPopup('Dashboard')}></CyberButton>
                </div>
                
                <div className="flex gap-4 justify-center">
                  <CyberButton variant="primary" size="sm" className="flex-1 max-w-[140px]" style={{ animationDelay: '0s' }} onClick={handleOpenComingSoonPopup}>Mock Tests</CyberButton>
                  <CyberButton variant="primary" size="sm" className="flex-1 max-w-[140px]" style={{ animationDelay: '0s' }} onClick={() => handleOpenPopup('Custom Test')}>Custom Test</CyberButton>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center gap-8 mb-16">
              <ScannerButton onClick={() => handleOpenPopup('DataSense Gaming Arena')} description="DataSense Gaming Arena" />
              <ScannerButton onClick={() => handleOpenPopup('DataSense Gaming Arena')} description="Scan to Enter Gaming Arena" />
            </div>
            
            <div className="flex-shrink-0 mb-6">
              <Chatbot isExpanded={isChatbotExpanded} onToggleExpand={() => setIsChatbotExpanded(!isChatbotExpanded)} />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center py-3 mt-8">
              <div className="text-center space-y-5 max-w-5xl mx-auto px-0">
                <div className="relative w-fit mx-auto">
                  <div className="absolute inset-0 blur-xl rounded-lg pointer-events-none"></div>
                  <h1 className="text-3xl md:text-5xl font-black-ops-one font-bold text-primary mb-2.5">
                    DATASENSE PRACTICE ARENA
                  </h1>
                  <RotatingSubheading />
                  <div className="w-28 h-px mx-auto mt-6" />
                </div>
                
                <div className="mb-8">
                  <div className="flex flex-col sm:flex-row gap-1 items-center justify-center mb-5">
                    <div className="group">
                      <CyberButton variant="primary" size="md" className="w-56" style={{ animationDelay: '0s' }} onClick={() => handleOpenPopup('Practice Question')}>Practice Questions</CyberButton>
                      <div className="text-xs font-mono text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Personalized Training Protocols</div>
                    </div>
                    <div className="group">
                      <CyberButton variant="secondary" size="md" className="!rounded-full !w-10 !h-10 p-0 shadow-cyan-400/40 hover:shadow-cyan-400/80 transition-shadow animate-spin-slow ring-2 ring-cyan-400/60 hover:ring-cyan-400/90 relative group" style={{ minWidth: '4rem', minHeight: '4rem', width: '4rem', height: '4rem', animationDelay: '0s' }} icon={<LayoutDashboard className="w-14 h-14 font-bold flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" fill="currentColor" color="currentColor" />} onClick={() => handleOpenPopup('Dashboard')}></CyberButton>
                      <div className="text-xs font-mono text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Neural Dashboard</div>
                    </div>
                    <div className="group">
                      <CyberButton variant="primary" size="md" className="w-56" style={{ animationDelay: '0s' }} onClick={() => handleOpenPopup('SQL')}>Join Live Tests</CyberButton>
                      <div className="text-xs font-mono text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Real-Time Challenges</div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-5 items-center justify-center">
                    <CyberButton variant="primary" size="md" className="w-48" style={{ animationDelay: '0s' }} onClick={handleOpenComingSoonPopup}>Mock Tests</CyberButton>
                    <CyberButton variant="primary" size="md" className="w-48" style={{ animationDelay: '0s' }} onClick={() => handleOpenPopup('Custom Test')}>Custom Test</CyberButton>
                  </div>
                  <div className="w-28 h-px mx-auto mt-6" />
                </div>
                
                <div className="flex flex-col sm:flex-row gap-10 items-center justify-center mb-6">
                  <ScannerButton onClick={() => handleOpenPopup('DataSense Gaming Arena')} description="DataSense Gaming Arena" />
                  <Chatbot isExpanded={isChatbotExpanded} onToggleExpand={() => setIsChatbotExpanded(!isChatbotExpanded)} />
                  <ScannerButton onClick={() => handleOpenPopup('DataSense Gaming Arena')} description="Scan to Enter Gaming Arena" />
                </div>
              </div>
            </div>
            
            <div className="flex-shrink-0 pb-6">
              <div className="flex justify-center gap-2.5 max-w-3xl mx-auto px-3">
                <div className="hud-overlay border border-primary/30 p-3 w-60">
                  <div className="text-left">
                    <div className="text-cyber-success font-mono text-xs mb-1.5 font-bold">● 3000+ Practice Questions</div>
                    <div className="text-primary font-mono text-xs mb-1.5 font-bold">● 30+ Mock Quizzes</div>
                    <div className="text-cyber-warning font-mono text-xs mb-1.5 font-bold">● 5+ Active Live Quiz</div>
                    <div className="mt-2.5"><AnimatedBar color="bg-primary" /></div>
                  </div>
                </div>
                <div className="hud-overlay border border-primary/30 p-3 w-60">
                  <div className="text-left">
                    <div className="text-primary font-mono text-xs mb-1.5 font-bold">● SYSTEM TIME : {time.toLocaleTimeString()}</div>
                    <div className="text-cyber-warning font-mono text-xs mb-1.5 font-bold">● ACTIVE USERS: <AnimatedUserCounter /></div>
                    <div className="text-cyber-success font-mono text-xs mb-1.5 font-bold">● ALL SYSTEMS NOMINAL</div>
                    <div className="mt-2.5"><AnimatedBar color="bg-primary" /></div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      
      <FuturisticGlitchPopup open={popupOpen} onClose={() => setPopupOpen(false)} badgeType={popupBadge} description={popupDesc} yesLink={popupLink} />
      <ComingSoonGlitchPopup open={comingSoonPopupOpen} onClose={() => setComingSoonPopupOpen(false)} badgeType="Mock Quiz" description="Mock Tests are currently under development. We're working hard to bring you comprehensive mock tests soon!" />
    </div>
  );
};

export default Index;