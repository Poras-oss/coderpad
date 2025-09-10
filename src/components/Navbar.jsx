import { useState, useEffect, useRef } from "react";
import { useUser, SignInButton, UserButton } from "@clerk/clerk-react";
import { Moon, Sun, LayoutDashboard } from "lucide-react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Button } from "./ui/button";
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaYoutube, FaDiscord} from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import RenderSubscription from "./RenderSubscription";
import logo from "../assets/logo.png";
import logoNew from "../assets/coderpadLogo.png";


const Navbar = ({ isDarkMode, setIsDarkMode }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const communityRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (communityRef.current && !communityRef.current.contains(event.target)) {
        setIsCommunityOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleBackToHome = () => {
    window.location.href = "https://practice.datasenseai.com";
  };

  return (
    <header className="sticky top-0 w-full bg-[#008B8B] shadow-lg z-50">
      <div className="container mx-auto px-0">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center pl-6 gap-5">
            <img
              className="h-10 w-auto cursor-pointer pr-4"
              src={logo}
              alt="Datasense"
              onClick={handleBackToHome}
            />
            {/* <a className="hidden md:block text-white hover:underline text-lg" href="https://dashboard.datasenseai.com/practice-dashboard">Dashboard</a>
            <a className="hidden md:block text-white hover:underline text-lg" href="/practice-area?subject=sql">Practice</a>
            <a className="hidden md:block text-white hover:underline text-lg" href="/live-events">Live Quiz</a>
            <a className="hidden md:block text-white hover:underline text-lg" href="https://assessment.datasenseai.com/">Create Quiz</a> */}
            <a
              className="relative text-white text-lg font-medium transition duration-200 hover:text-[#03E9E9] after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-[#03E9E9] after:transition-all after:duration-300 hover:after:w-full"
              href="https://dashboard.datasenseai.com/practice-dashboard"
            >
              Dashboard
            </a>
            <a
              className="relative text-white text-lg font-medium transition duration-200 hover:text-[#03E9E9] after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-[#03E9E9] after:transition-all after:duration-300 hover:after:w-full"
              href="/practice-area?subject=sql"
            >
              Practice
            </a>
            <a
              className="relative text-white text-lg font-medium transition duration-200 hover:text-[#03E9E9] after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-[#03E9E9] after:transition-all after:duration-300 hover:after:w-full"
              href="/live-events"
            >
              Live Quiz
            </a>
            <a
              className="relative text-white text-lg font-medium transition duration-200 hover:text-[#03E9E9] after:content-[''] after:absolute after:w-0 after:h-[2px] after:left-0 after:-bottom-1 after:bg-[#03E9E9] after:transition-all after:duration-300 hover:after:w-full"
              href="https://assessment.datasenseai.com/"
            >
              Create Quiz
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-white hover:bg-teal-600 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 pr-6">
          {/* {isLoaded && isSignedIn && <RenderSubscription />} */}
            {/* Join Community Button for desktop */}
            <div
              ref={communityRef}
              className="relative flex items-center cursor-pointer"
              // onMouseEnter={() => setIsCommunityOpen(true)}
              // onMouseLeave={() => setIsCommunityOpen(false)}
              onClick={() => setIsCommunityOpen(!isCommunityOpen)}
            >
              <div className="relative bg-white hover:bg-teal-600 rounded-full p-2 shadow-md hover:shadow-lg transition-all duration-300 group">
                <IoIosNotifications className="text-[#008B8B] hover:text-white text-2xl transition-transform duration-300 hover:scale-110" />
                <span className="absolute top-0 right-0 bg-red-500 h-3 w-3 rounded-full animate-pulse"></span>
              </div>

            
              {isCommunityOpen && (
                <div 
                  className="absolute top-12 right-0 bg-[#008B8B] p-4 rounded-lg shadow-xl flex flex-col items-center z-50 origin-top-right"
                  style={{
                    animation: "fadeInScale 0.3s ease-out forwards",
                    boxShadow: "0 10px 25px -5px rgba(0, 139, 139, 0.3), 0 8px 10px -6px rgba(0, 139, 139, 0.2)"
                  }}
                >
                  <style>{`
                    @keyframes fadeInScale {
                      0% {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                      }
                      100% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                      }
                    }
                    @keyframes glowPulse {
                      0% {
                        box-shadow: 0 0 5px rgba(0, 139, 139, 0.4);
                      }
                      50% {
                        box-shadow: 0 0 15px rgba(0, 139, 139, 0.6);
                      }
                      100% {
                        box-shadow: 0 0 5px rgba(0, 139, 139, 0.4);
                      }
                    }
                    @keyframes floatIcon {
                      0% {
                        transform: translateY(0) scale(1);
                      }
                      50% {
                        transform: translateY(-3px) scale(1.1);
                      }
                      100% {
                        transform: translateY(0) scale(1);
                      }
                    }
                    .social-icon {
                      transition: all 0.3s ease;
                      position: relative;
                    }
                    .social-icon:hover {
                      transform: scale(1.2);
                      animation: floatIcon 1s ease infinite;
                    }
                    .social-icon:hover::after {
                      content: '';
                      position: absolute;
                      top: 50%;
                      left: 50%;
                      width: 140%;
                      height: 140%;
                      border-radius: 50%;
                      background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
                      transform: translate(-50%, -50%);
                      z-index: -1;
                      animation: glowPulse 1.5s infinite;
                    }
                  `}</style>
                  <p 
                    className="text-white font-semibold mb-3 relative pb-2"
                    style={{
                      borderBottom: "2px solid rgba(0, 139, 139, 0.3)",
                      textShadow: "0 0 1px rgba(0, 139, 139, 0.3)"
                    }}
                  >
                    Join Community
                  </p>
                  <div className="flex space-x-4 p-2 rounded-xl bg-gradient-to-r from-teal-50 to-white">
                    <a href="https://www.youtube.com/@Senseofdata" target="_blank" rel="noopener noreferrer" className="social-icon">
                      <FaYoutube className="text-teal-600 text-2xl" />
                    </a>
                    <a href="https://www.linkedin.com/company/data-sense-lms/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="social-icon">
                      <FaLinkedin className="text-teal-600 text-2xl" />
                    </a>
                    <a href="https://www.instagram.com/senseofdata/" target="_blank" rel="noopener noreferrer" className="social-icon">
                      <FaInstagram className="text-teal-600 text-2xl" />
                    </a>
                    <a href="https://chat.whatsapp.com/DYgDxOA8nBvJp4tPz5J6ox" target="_blank" rel="noopener noreferrer" className="social-icon">
                      <FaWhatsapp className="text-teal-600 text-2xl" />
                    </a>
                    <a href="https://www.facebook.com/people/Data-Sense/61550202884240/?mibextid=LQQJ4d" target="_blank" rel="noopener noreferrer" className="social-icon">
                      <FaFacebook className="text-teal-600 text-2xl" />
                    </a>
                    <a href="https://discord.gg/your-invite-link" target="_blank" rel="noopener noreferrer" className="social-icon">
                      <FaDiscord className="text-teal-600 text-2xl" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="text-white hover:bg-teal-600 transition-colors"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <button className="hover:bg-[#03E9E9] hover:text-gray-900 text-white font-medium flex py-2 px-2 rounded-lg transition-colors gap-2" onClick={() => (window.location.href = '/pricing')}>
              <img className="h-6 w-6" src={logoNew} alt="Logo" />
              Upgrade to Pro
            </button>

            {isLoaded && isSignedIn ? (
              <div className="flex items-center space-x-4">
                {/* Add Dashboard button */}
                {/* <a
                  href="https://dashboard.datasenseai.com/practice-dashboard"
                  className="flex items-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </a>
                <span className="text-white text-sm">
                  Welcome, {user.firstName}
                </span> */}
                <UserButton afterSignOutUrl={`/live-events`} />
              </div>
            ) : (
              <SignInButton
                mode="modal"
                fallbackRedirectUrl={`/live-events`}
                signUpForceRedirectUrl={`/live-events`}
              >
                <button className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  Log In
                </button>
              </SignInButton>
            )}
          </nav>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } md:hidden bg-[#008B8B] border-t border-teal-600`}
        >
          <div className="px-4 py-3 space-y-3">
            <div className="flex flex-col items-center space-y-3">
              {/* Join Community Button in mobile menu */}
             
              <div className="relative w-full">


                <button 
                  onClick={() => setIsCommunityOpen(!isCommunityOpen)}
                  className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-teal-600 text-[#008B8B] font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  <span>Join Community</span>
                  <div className="relative">
                    <IoIosNotifications className="text-[#008B8B] text-xl" />
                    <span className="absolute top-0 right-0 bg-red-500 h-2 w-2 rounded-full animate-pulse"></span>
                  </div>
                </button>
                
                {isCommunityOpen && (
                  <div 
                    className="mt-2 p-3 bg-white rounded-lg shadow-md"
                    style={{
                      animation: "fadeInScale 0.3s ease-out forwards",
                    }}
                  >
                    <div className="flex justify-center space-x-4 p-2 rounded-xl bg-gradient-to-r from-teal-50 to-white">
                      <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaYoutube className="text-teal-600 text-2xl" />
                      </a>
                      <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaLinkedin className="text-teal-600 text-2xl" />
                      </a>
                      <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaInstagram className="text-teal-600 text-2xl" />
                      </a>
                      <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaWhatsapp className="text-teal-600 text-2xl" />
                      </a>
                      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaFacebook className="text-teal-600 text-2xl" />
                      </a>
                      <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                        <FaDiscord className="text-teal-600 text-2xl" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {isLoaded && isSignedIn ? (
                <>
                  {/* Add Dashboard button in mobile menu */}
                  <a
                    href="/dashboard" // Replace with your dashboard route
                    className="w-full flex items-center justify-center space-x-2 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Dashboard</span>
                  </a>
                  <span className="text-white text-sm font-mono">
                    Welcome, {user.firstName}
                  </span>
                  <UserButton afterSignOutUrl={`/live-events`} />
                </>
              ) : (
                <SignInButton
                  mode="modal"
                  fallbackRedirectUrl={`/live-events`}
                  signUpForceRedirectUrl={`/live-events`}
                >
                  <button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Log In
                  </button>
                </SignInButton>
              )}
               {/* {isLoaded && isSignedIn && <RenderSubscription />} */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="text-white hover:bg-teal-600 transition-colors mt-2"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;