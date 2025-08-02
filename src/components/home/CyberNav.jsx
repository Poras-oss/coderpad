// import React ,{ useState } from 'react';
// import CyberButton from './CyberButton';
// import { Bell, Users, Menu, X } from 'lucide-react';
// import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
// import SoundManager from './SoundManager';
// import {
//   FaYoutube,
//   FaLinkedin,
//   FaInstagram,
//   FaWhatsapp,
//   FaFacebook
// } from "react-icons/fa";
// // import buttonClickSound from '../assets/mp3/button-click.mp3';
// import buttonClickSound from '../../assets/mp3/button-click.mp3';

// const socialLinks = [
//   { icon: FaYoutube, title: "Youtube", url: "https://www.youtube.com/@Senseofdata" },
//   { icon: FaLinkedin, title: "LinkedIn", url: "https://www.linkedin.com/company/data-sense-lms/" },
//   { icon: FaFacebook, title: "Facebook", url: "https://www.facebook.com/people/Data-Sense/61550202884240/?mibextid=LQQJ4d" },
//   { icon: FaInstagram, title: "Instagram", url: "https://www.instagram.com/senseofdata/" },
//   { icon: FaWhatsapp, title: "WhatsApp", url: "https://chat.whatsapp.com/DYgDxOA8nBvJp4tPz5J6ox" },
// ];

// const CyberNav = () => {
//   const { isSignedIn } = useUser();
//   const [showSocial, setShowSocial] = useState(false);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [showMobileMenu, setShowMobileMenu] = useState(false);
//   const buttonclickRef = React.useRef(null);

//   const handleMouseEnter = () => {
//     setShowSocial(true);
//     setIsAnimating(true);
//   };

//   const handleClick = () => {
//     if (buttonclickRef.current) {
//       buttonclickRef.current.currentTime = 0;
//       buttonclickRef.current.play();
//     }
//   };

//   const handleMouseLeave = () => {
//     setIsAnimating(false);
//     // Delay hiding to allow exit animation
//     setTimeout(() => setShowSocial(false), 300);
//   };

//   // Mobile touch handlers for social panel
//   const handleTouchStart = (e) => {
//     e.preventDefault();
//     if (showSocial) {
//       setIsAnimating(false);
//       setTimeout(() => setShowSocial(false), 300);
//     } else {
//       setShowSocial(true);
//       setIsAnimating(true);
//     }
//   };

//   // Mobile menu handlers
//   const toggleMobileMenu = () => {
//     setShowMobileMenu(!showMobileMenu);
//     handleClick();
//   };

//   const closeMobileMenu = () => {
//     setShowMobileMenu(false);
//   };

//   return (
//     <nav className="absolute top-0 left-0 right-0 z-40 pt-2 sm:pt-3 px-3 sm:px-6">
//       <div className="flex justify-between items-center">
//         <audio ref={buttonclickRef} src={buttonClickSound} preload="auto" />
        
//         {/* Logo */}
//         <div className="group cursor-pointer flex-shrink-0">
//           <img 
//             src="assets/logo.png" 
//             alt="DATASENSE" 
//             className="h-6 sm:h-7 md:h-9 rounded-lg shadow-lg" 
//           />
//           <div className="h-0.5 bg-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
//         </div>

//         {/* Right side: Auth button + SoundManager */}
//         <div className="flex items-center gap-2 sm:gap-4">
//           {/* Mobile Menu Button - Only show when signed in and on small screens */}
//           {isSignedIn && (
//             <button
//               onClick={toggleMobileMenu}
//               className="sm:hidden relative w-10 h-10 bg-gray-800/50 backdrop-blur-lg rounded-full border border-cyan-400/30 flex items-center justify-center transition-all duration-300 hover:bg-cyan-400/10 active:scale-95"
//             >
//               {showMobileMenu ? (
//                 <X className="w-5 h-5 text-cyan-400" />
//               ) : (
//                 <Menu className="w-5 h-5 text-cyan-400" />
//               )}
//             </button>
//           )}

//           {/* Show links only when signed in - Hidden on very small screens */}
//           {isSignedIn && (
//             <div className="hidden sm:flex items-center gap-2 md:gap-4 mr-2 md:mr-4">
//               <a
//                 href="#"
//                 onClick={handleClick}
//                 className="relative text-cyan-300 hover:text-cyan-100 font-mono text-sm md:text-lg transition-colors duration-200
//                   after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full"
//                 // TODO: Replace '#' with your actual link
//               >
//                 <span className="hidden md:inline">Our Resources</span>
//                 <span className="md:hidden">Resources</span>
//               </a>
//               <span className="text-cyan-400/60 mx-0.5 md:mx-1 select-none text-sm md:text-lg font-bold">|</span>
//               <a
//                 href="#"
//                 onClick={handleClick}
//                 className="relative text-cyan-300 hover:text-cyan-100 font-mono text-sm md:text-lg transition-colors duration-200
//                   after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full"
//                 // TODO: Replace '#' with your actual link
//               >
//                 Learn SQL
//               </a>
//             </div>
//           )}

//           <div
//             className="relative group"
//             onMouseEnter={handleMouseEnter}
//             onMouseLeave={handleMouseLeave}
//           >
//             {/* Main Bell Button - Responsive sizing */}
//             <button 
//               className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/50 backdrop-blur-lg rounded-full border border-cyan-400/30 flex items-center justify-center transition-all duration-300 ${
//                 showSocial ? 'bg-cyan-400/20 border-cyan-400/60 shadow-lg shadow-cyan-400/25' : 'hover:bg-cyan-400/10'
//               }`}
//               onTouchStart={handleTouchStart}
//             >
//               <Bell className={`w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 transition-all duration-300 ${
//                 showSocial ? 'animate-pulse scale-110' : ''
//               }`} />
//               {/* Notification dot with pulse - Responsive sizing */}
//               <div className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full transition-all duration-300`} />
              
//               {/* Scanning ring effect */}
//               {showSocial && (
//                 <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping" />
//               )}
//             </button>

//             {/* Responsive Social Panel - Adjusted positioning and sizing */}
//             {showSocial && (
//               <div className="absolute right-0 sm:left-1/2 sm:transform sm:-translate-x-1/2 top-12 sm:top-16 w-64 sm:w-56 bg-gray-900/95 backdrop-blur-xl border border-cyan-400/30 rounded-lg overflow-hidden shadow-2xl shadow-cyan-400/10">
//                 {/* Social Links Grid - Responsive layout */}
//                 <div className="p-3 sm:p-4">
//                   {/* Mobile: 5 items in single row, Desktop: 3x2 grid */}
//                   <div className="grid grid-cols-5 sm:grid-cols-3 gap-2 sm:gap-3">
//                     {socialLinks.map((link, i) => (
//                       <a
//                         key={i}
//                         href={link.url}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="group/social relative w-11 h-11 sm:w-14 sm:h-14 bg-gray-800/60 rounded-lg border border-cyan-400/20 flex items-center justify-center transition-all duration-300 hover:bg-cyan-400/10 hover:border-cyan-400/60 active:scale-95"
//                         style={{
//                           transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
//                           opacity: isAnimating ? 1 : 0,
//                           transition: `all 0.3s ease-out ${i * 60}ms`
//                         }}
//                         onClick={handleClick}
//                       >
//                         {/* Icon - Responsive sizing */}
//                         <div className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover/social:scale-105">
//                           {React.createElement(link.icon, { 
//                             color: "#00fff7", 
//                             size: window.innerWidth < 640 ? 20 : 24 
//                           })}
//                         </div>
                        
//                         {/* Subtle hover glow */}
//                         <div className="absolute inset-0 bg-cyan-400/5 rounded-lg opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
                        
//                         {/* Minimal corner indicators on hover - Responsive sizing */}
//                         <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-cyan-400/60 opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
//                         <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-cyan-400/60 opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
//                         <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-cyan-400/60 opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
//                         <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-cyan-400/60 opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
//                       </a>
//                     ))}
//                   </div>
                  
//                   {/* Mobile navigation links - Only show when signed in and on small screens */}
//                   {isSignedIn && (
//                     <div className="sm:hidden mt-3 pt-3 border-t border-cyan-400/20">
//                       <div className="flex flex-col gap-2">
//                         <a
//                           href="#"
//                           onClick={handleClick}
//                           className="relative text-cyan-300 hover:text-cyan-100 font-mono text-sm transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-cyan-400/10"
//                         >
//                           Our Resources
//                         </a>
//                         <a
//                           href="#"
//                           onClick={handleClick}
//                           className="relative text-cyan-300 hover:text-cyan-100 font-mono text-sm transition-colors duration-200 py-2 px-3 rounded-lg hover:bg-cyan-400/10"
//                         >
//                           Learn SQL
//                         </a>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Auth Button - Responsive sizing */}
//           {isSignedIn ? (
//             <div className="w-8 h-8 ml-2 pt-2 sm:w-10 sm:h-10 rounded-full">
//               <UserButton />
//             </div>
//           ) : (
//             <SignInButton>
//               <CyberButton 
//                 variant="outline" 
//                 size="sm"
//                 icon={<Users className="w-3 h-3 sm:w-4 sm:h-4" />}
//                 className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-8 sm:h-auto min-w-16 sm:min-w-20"
//               >
//                 <span className="sm:inline">Sign In</span>
//                 {/* <span className="sm:hidden">In</span> */}
//               </CyberButton>
//             </SignInButton>
//           )}
          
//           <SoundManager />
//         </div>
//       </div>

//       {/* Mobile Menu Overlay - Only show when signed in */}
//       {isSignedIn && showMobileMenu && (
//         <div className="sm:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
//           <div className="p-4">
//             <div className="flex flex-col gap-3">
//               <a
//                 href="#"
//                 onClick={() => {
//                   handleClick();
//                   closeMobileMenu();
//                 }}
//                 className="relative text-cyan-300 hover:text-cyan-100 font-mono text-base transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/30"
//               >
//                 Our Resources
//                 <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-cyan-400/30 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
//               </a>
//               <a
//                 href="#"
//                 onClick={() => {
//                   handleClick();
//                   closeMobileMenu();
//                 }}
//                 className="relative text-cyan-300 hover:text-cyan-100 font-mono text-base transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/30"
//               >
//                 Learn SQL
//                 <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-cyan-400/30 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default CyberNav;

import React ,{ useState } from 'react';
import CyberButton from './CyberButton';
import { Bell, Users, Menu, X } from 'lucide-react';
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import SoundManager from './SoundManager';
import {
  FaYoutube,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaFacebook
} from "react-icons/fa";
// import buttonClickSound from '../assets/mp3/button-click.mp3';
import buttonClickSound from '../../assets/mp3/button-click.mp3';

const socialLinks = [
  { icon: FaYoutube, title: "Youtube", url: "https://www.youtube.com/@Senseofdata" },
  { icon: FaLinkedin, title: "LinkedIn", url: "https://www.linkedin.com/company/data-sense-lms/" },
  { icon: FaFacebook, title: "Facebook", url: "https://www.facebook.com/people/Data-Sense/61550202884240/?mibextid=LQQJ4d" },
  { icon: FaInstagram, title: "Instagram", url: "https://www.instagram.com/senseofdata/" },
  { icon: FaWhatsapp, title: "WhatsApp", url: "https://chat.whatsapp.com/D9gTjEcWKzeELJw9qZc8aJ" },
];

const CyberNav = () => {
  const { isSignedIn } = useUser();
  const [showSocial, setShowSocial] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const buttonclickRef = React.useRef(null);

  const handleMouseEnter = () => {
    setShowSocial(true);
    setIsAnimating(true);
  };

  const handleClick = () => {
    if (buttonclickRef.current) {
      buttonclickRef.current.currentTime = 0;
      buttonclickRef.current.play();
    }
  };

  const handleMouseLeave = () => {
    setIsAnimating(false);
    // Delay hiding to allow exit animation
    setTimeout(() => setShowSocial(false), 300);
  };

  // Mobile touch handlers for social panel
  const handleTouchStart = (e) => {
    e.preventDefault();
    if (showSocial) {
      setIsAnimating(false);
      setTimeout(() => setShowSocial(false), 300);
    } else {
      setShowSocial(true);
      setIsAnimating(true);
    }
  };

  // Mobile menu handlers
  const toggleMobileMenu = () => {
    setShowMobileMenu(!showMobileMenu);
    handleClick();
  };

  const closeMobileMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <nav className="absolute top-0 left-0 right-0 z-40 pt-2 sm:pt-3 px-3 sm:px-6">
      <div className="flex justify-between items-center">
        <audio ref={buttonclickRef} src={buttonClickSound} preload="auto" />
        
        {/* Logo */}
        <div className="group cursor-pointer flex-shrink-0">
          <img 
            src="assets/logo.png" 
            alt="DATASENSE" 
            className="h-6 sm:h-7 md:h-9 rounded-lg shadow-lg" 
          />
          <div className="h-0.5 bg-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>

        {/* Right side: Auth button + SoundManager */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Mobile Menu Button - Only show when signed in and on small screens */}
          {isSignedIn && (
            <button
              onClick={toggleMobileMenu}
              className="sm:hidden relative w-10 h-10 bg-gray-800/50 backdrop-blur-lg rounded-full border border-cyan-400/30 flex items-center justify-center transition-all duration-300 hover:bg-cyan-400/10 active:scale-95"
            >
              {showMobileMenu ? (
                <X className="w-5 h-5 text-cyan-400" />
              ) : (
                <Menu className="w-5 h-5 text-cyan-400" />
              )}
            </button>
          )}

          {/* Show links only when signed in - Hidden on very small screens */}
          {isSignedIn && (
            <div className="hidden sm:flex items-center gap-2 md:gap-4 mr-2 md:mr-4">
              <a
                href="#"
                onClick={handleClick}
                className="relative text-cyan-300 hover:text-cyan-100 font-mono text-sm md:text-lg transition-colors duration-200
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full"
                // TODO: Replace '#' with your actual link
              >
                <span className="hidden md:inline">Our Resources</span>
                <span className="md:hidden">Resources</span>
              </a>
              <span className="text-cyan-400/60 mx-0.5 md:mx-1 select-none text-sm md:text-lg font-bold">|</span>
              <a
                href="#"
                onClick={handleClick}
                className="relative text-cyan-300 hover:text-cyan-100 font-mono text-sm md:text-lg transition-colors duration-200
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full"
                // TODO: Replace '#' with your actual link
              >
                Learn SQL
              </a>
            </div>
          )}

          <div
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {/* Main Bell Button - Responsive sizing */}
            <button 
              className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/50 backdrop-blur-lg rounded-full border border-cyan-400/30 flex items-center justify-center transition-all duration-300 ${
                showSocial ? 'bg-cyan-400/20 border-cyan-400/60 shadow-lg shadow-cyan-400/25' : 'hover:bg-cyan-400/10'
              }`}
              onTouchStart={handleTouchStart}
            >
              <Bell className={`w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 transition-all duration-300 ${
                showSocial ? 'animate-pulse scale-110' : ''
              }`} />
              {/* Notification dot with pulse - Responsive sizing */}
              <div className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full transition-all duration-300`} />
              
              {/* Scanning ring effect */}
              {showSocial && (
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping" />
              )}
            </button>

            {/* Responsive Social Panel - Fixed positioning for mobile center alignment */}
            {showSocial && (
              <div className="absolute left-1/3 transform -translate-x-1/2 top-12 sm:top-16 w-64 sm:w-56 bg-gray-900/95 backdrop-blur-xl border border-cyan-400/30 rounded-lg overflow-hidden shadow-2xl shadow-cyan-400/10">
                {/* Social Links Grid - Responsive layout */}
                <div className="p-3 sm:p-4">
                  {/* Mobile: 5 items in single row, Desktop: 3x2 grid */}
                  <div className="grid grid-cols-5 sm:grid-cols-3 gap-2 sm:gap-3">
                    {socialLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/social relative w-11 h-11 sm:w-14 sm:h-14 bg-gray-800/60 rounded-lg border border-cyan-400/20 flex items-center justify-center transition-all duration-300 hover:bg-cyan-400/10 hover:border-cyan-400/60 active:scale-95"
                        style={{
                          transform: isAnimating ? 'translateY(0) scale(1)' : 'translateY(10px) scale(0.9)',
                          opacity: isAnimating ? 1 : 0,
                          transition: `all 0.3s ease-out ${i * 60}ms`
                        }}
                        onClick={handleClick}
                      >
                        {/* Icon - Responsive sizing */}
                        <div className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover/social:scale-105">
                          {React.createElement(link.icon, { 
                            color: "#00fff7", 
                            size: window.innerWidth < 640 ? 20 : 24 
                          })}
                        </div>
                        
                        {/* Subtle hover glow */}
                        <div className="absolute inset-0 bg-cyan-400/5 rounded-lg opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
                        
                        {/* Minimal corner indicators on hover - Responsive sizing */}
                        <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-l-2 border-cyan-400/60 opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
                        <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-t-2 border-r-2 border-cyan-400/60 opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
                        <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-l-2 border-cyan-400/60 opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
                        <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-b-2 border-r-2 border-cyan-400/60 opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Auth Button - Responsive sizing */}
          {isSignedIn ? (
            <div className="w-8 h-8 ml-2 pt-2 sm:w-10 sm:h-10 rounded-full">
              <UserButton />
            </div>
          ) : (
            <SignInButton>
              <CyberButton 
                variant="outline" 
                size="sm"
                icon={<Users className="w-3 h-3 sm:w-4 sm:h-4" />}
                className="text-xs sm:text-sm px-2 py-1 sm:px-3 sm:py-2 h-8 sm:h-auto min-w-16 sm:min-w-20"
              >
                <span className="sm:inline">Sign In</span>
                {/* <span className="sm:hidden">In</span> */}
              </CyberButton>
            </SignInButton>
          )}
          
          <SoundManager />
        </div>
      </div>

      {/* Mobile Menu Overlay - Only show when signed in */}
      {isSignedIn && showMobileMenu && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-cyan-400/30 shadow-2xl shadow-cyan-400/10">
          <div className="p-4">
            <div className="flex flex-col gap-3">
              <a
                href="#"
                onClick={() => {
                  handleClick();
                  closeMobileMenu();
                }}
                className="relative text-cyan-300 hover:text-cyan-100 font-mono text-base transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/30"
              >
                Our Resources
                <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-cyan-400/30 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
              <a
                href="#"
                onClick={() => {
                  handleClick();
                  closeMobileMenu();
                }}
                className="relative text-cyan-300 hover:text-cyan-100 font-mono text-base transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/30"
              >
                Learn SQL
                <div className="absolute bottom-2 left-4 right-4 h-0.5 bg-cyan-400/30 transform scale-x-0 transition-transform duration-300 group-hover:scale-x-100" />
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CyberNav;