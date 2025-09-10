import React, { useState, useEffect, useRef } from 'react'; // Import useEffect and useRef
import CyberButton from './CyberButton';
import { Bell, Users, Menu, X } from 'lucide-react';
import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import SoundManager from './SoundManager';
import {
  FaYoutube,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
  FaDownload
} from "react-icons/fa";
import buttonClickSound from '../../assets/mp3/button-click.mp3';

const socialLinks = [
  { icon: FaYoutube, title: "Youtube", url: "https://www.youtube.com/@Senseofdata" },
  { icon: FaLinkedin, title: "LinkedIn", url: "https://www.linkedin.com/company/data-sense-lms/" },
  { icon: FaFacebook, title: "Facebook", url: "https://www.facebook.com/people/Data-Sense/61550202884240/?mibextid=LQQJ4d" },
  { icon: FaInstagram, title: "Instagram", url: "https://www.instagram.com/senseofdata/" },
  { icon: FaWhatsapp, title: "WhatsApp", url: "https://chat.whatsapp.com/D9gTjEcWKzeELJw9qZc8aJ" },
];

const pdfResources = [
  {
    name: "SQL Notes",
    // file: "/assets/resources/Full SQL Notes.pdf",
    file: "assets/resources/Full SQL Notes 📘.pdf",
  },
  {
    name: "Sql Cheat Sheet",
    file: "assets/resources/sql-basics-cheat-sheet-a4.pdf",
  },
  {
    name: "Beginners Guide to SQL",
    file: "assets/resources/Beginners Guide to SQL.pdf",
  },
  {
    name: "Advanced SQL questions",
    file: "public/assets/resources/Advanced SQL questions.pdf",
  },
];

const CyberNav = () => {
  const { isSignedIn } = useUser();
  const [showSocial, setShowSocial] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const buttonclickRef = useRef(null);
  const resourcesRef = useRef(null); // Ref for the resources dropdown

  const handleClick = () => {
    if (buttonclickRef.current) {
      buttonclickRef.current.currentTime = 0;
      buttonclickRef.current.play();
    }
  };

  // Function to toggle the resources dropdown
  const handleResourcesToggle = () => {
    setShowResources(prev => !prev);
    handleClick();
  };

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (resourcesRef.current && !resourcesRef.current.contains(event.target)) {
        setShowResources(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [resourcesRef]);


  const handleMouseEnter = () => {
    setShowSocial(true);
    setIsAnimating(true);
  };

  const handleMouseLeave = () => {
    setIsAnimating(false);
    setTimeout(() => setShowSocial(false), 300);
  };

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
        
        <div className="group cursor-pointer flex-shrink-0">
          <img 
            src="assets/logo.png" 
            alt="DATASENSE" 
            className="h-6 sm:h-7 md:h-9 rounded-lg shadow-lg" 
          />
          <div className="h-0.5 bg-primary/50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
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

          {isSignedIn && (
            <div className="hidden sm:flex items-center gap-2 md:gap-4 mr-2 md:mr-4">
              {/* Our Resources Dropdown */}
              <div
                className="relative"
                ref={resourcesRef} // Attach the ref here
              >
                <button
                  onClick={handleResourcesToggle} // Changed to toggle function
                  className="relative text-cyan-300 hover:text-cyan-100 font-mono text-sm md:text-lg transition-colors duration-200
                    after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full flex items-center gap-1"
                >
                  <span className="hidden md:inline">Our Resources</span>
                  <span className="md:hidden">Resources</span>
                  <svg className={`ml-1 w-3 h-3 transition-transform duration-200 ${showResources ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                </button>
                {/* Dropdown */}
                {showResources && (
                  <div className="absolute left-0 mt-2 w-64 bg-gray-900/95 backdrop-blur-xl border border-cyan-400/30 rounded-lg shadow-2xl shadow-cyan-400/10 z-50">
                    <div className="p-2">
                      {pdfResources.map((pdf, idx) => (
                        <div key={idx} className="flex items-center justify-between px-3 py-2 hover:bg-cyan-400/10 rounded transition">
                          <span className="text-cyan-200 font-mono text-sm truncate">{pdf.name}</span>
                          <a
                            href={pdf.file}
                            download
                            className="ml-2 px-2 py-1 bg-cyan-600/80 hover:bg-cyan-400 text-white rounded flex items-center gap-1 text-xs transition"
                          >
                            <FaDownload className="w-3 h-3" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <span className="text-cyan-400/60 mx-0.5 md:mx-1 select-none text-sm md:text-lg font-bold">|</span>
              <a
                href="https://pages.razorpay.com/DataSenseAIChatBot"
                target="_blank" 
                rel="noopener noreferrer"
                onClick={handleClick}
                className="relative text-cyan-300 hover:text-cyan-100 font-mono text-sm md:text-lg transition-colors duration-200
                  after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-cyan-300 after:transition-all after:duration-300 hover:after:w-full"
              >
                Learn SQL
              </a>
            </div>
          )}
          
          {/* ... (rest of the component remains the same) ... */}
           <div
             className="relative group"
             onMouseEnter={handleMouseEnter}
             onMouseLeave={handleMouseLeave}
           >
             <button 
               className={`relative w-10 h-10 sm:w-12 sm:h-12 bg-gray-800/50 backdrop-blur-lg rounded-full border border-cyan-400/30 flex items-center justify-center transition-all duration-300 ${
                 showSocial ? 'bg-cyan-400/20 border-cyan-400/60 shadow-lg shadow-cyan-400/25' : 'hover:bg-cyan-400/10'
               }`}
               onTouchStart={handleTouchStart}
             >
               <Bell className={`w-5 h-5 sm:w-6 sm:h-6 text-cyan-400 transition-all duration-300 ${
                 showSocial ? 'animate-pulse scale-110' : ''
               }`} />
               <div className={`absolute top-1.5 right-1.5 sm:top-2 sm:right-2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full transition-all duration-300`} />
               
               {showSocial && (
                 <div className="absolute inset-0 rounded-full border-2 border-cyan-400/50 animate-ping" />
               )}
             </button>

             {showSocial && (
               <div className="absolute left-1/3 transform -translate-x-1/2 top-12 sm:top-16 w-64 sm:w-56 bg-gray-900/95 backdrop-blur-xl border border-cyan-400/30 rounded-lg overflow-hidden shadow-2xl shadow-cyan-400/10">
                 <div className="p-3 sm:p-4">
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
                         <div className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 group-hover/social:scale-105">
                           {React.createElement(link.icon, { 
                             color: "#00fff7", 
                             size: window.innerWidth < 640 ? 20 : 24 
                           })}
                         </div>
                         
                         <div className="absolute inset-0 bg-cyan-400/5 rounded-lg opacity-0 group-hover/social:opacity-100 transition-opacity duration-200" />
                         
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

           {isSignedIn ? (
             <div className="w-8 h-8 ml-2 pt-2 sm:w-10 sm:h-10 rounded-full">
               {/* <UserButton /> */}
               {/* // Find the UserButton component and replace it with: */}

              <UserButton 
                appearance={{
                  baseTheme: 'dark',
                  variables: {
                    colorBackground: '#000000',
                    colorBackgroundSecondary: '#000000',
                    colorText: 'rgb(254, 254, 254)',
                  },
                  elements: {
                    rootBox: {
                      width: '100%',
                      height: '100%'
                    },
                    card: {
                      backgroundColor: '#000000 !important',
                      borderColor: 'rgba(34, 211, 238, 0.3)',
                      borderWidth: '1px',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                    },
                    userButtonPopoverActionButton: {
                      color: 'rgb(251, 251, 251)',
                      backgroundColor: '#000000',
                      '&:hover': {
                        backgroundColor: '#000000',
                        color: 'rgb(255, 255, 255)',
                        cursor: 'pointer'
                      },
                    },
                    userButtonPopoverActionButtonText: {
                      color: 'rgb(251, 251, 251)',
                    },
                    // Add these new styles for Manage Account page
                    userProfilePage: {
                      backgroundColor: '#000000 !important',
                    },
                    userPreviewMainIdentifier: {
                      color: 'rgb(251, 251, 251)',
                    },
                    userPreviewSecondaryIdentifier: {
                      color: 'rgba(251, 251, 251, 0.7)',
                    },
                    navbarButton: {
                      backgroundColor: '#000000',
                      color: 'rgb(251, 251, 251)',
                      '&:hover': {
                        backgroundColor: '#000000',
                        color: 'rgb(34, 211, 238)',
                      },
                    },
                    // Style the account management page
                    page: {
                      backgroundColor: '#000000 !important',
                      color: 'rgb(251, 251, 251)',
                    },
                    formFieldInput: {
                      backgroundColor: '#111827',
                      borderColor: 'rgba(34, 211, 238, 0.3)',
                      color: 'rgb(251, 251, 251)',
                    },
                    formButtonPrimary: {
                      backgroundColor: '#000000',
                      color: 'rgb(34, 211, 238)',
                      '&:hover': {
                        backgroundColor: 'rgba(34, 211, 238, 0.1)',
                      },
                    },
                    formFieldLabel: {
                      color: 'rgb(251, 251, 251)',
                    }
                  }
                }}
              />
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
               </CyberButton>
             </SignInButton>
           )}
           
           <SoundManager />
        </div>
      </div>

      {isSignedIn && showMobileMenu && (
        <div className="sm:hidden absolute top-full left-0 right-0 bg-gray-900/95 backdrop-blur-xl border-b border-cyan-400/30 shadow-2xl shadow-cyan-400/10 z-50">
          <div className="p-4">
            <div className="flex flex-col gap-3">
              <details className="group" open>
                <summary className="relative text-cyan-300 hover:text-cyan-100 font-mono text-base transition-colors duration-200 py-3 px-4 rounded-lg hover:bg-cyan-400/10 border border-transparent hover:border-cyan-400/30 cursor-pointer flex items-center justify-between">
                  Our Resources
                  <svg className="ml-2 w-4 h-4 inline-block" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
                </summary>
                <div className="mt-2 bg-gray-900/95 rounded-lg border border-cyan-400/20">
                  {pdfResources.map((pdf, idx) => (
                    <div key={idx} className="flex items-center justify-between px-4 py-2 hover:bg-cyan-400/10 rounded transition">
                      <span className="text-cyan-200 font-mono text-sm truncate">{pdf.name}</span>
                      <a
                        href={pdf.file}
                        download
                        className="ml-2 px-2 py-1 bg-cyan-600/80 hover:bg-cyan-400 text-white rounded flex items-center gap-1 text-xs transition"
                      >
                        <FaDownload className="w-3 h-3" />
                      </a>
                    </div>
                  ))}
                </div>
              </details>
              <a
                href="https://pages.razorpay.com/DataSenseAIChatBot"
                target="_blank"
                rel="noopener noreferrer"
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