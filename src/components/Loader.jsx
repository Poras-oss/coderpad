import logo from "../assets/coderpadLogo.png";

const Loader = ({ inline = false, isDarkMode = false }) => {
  // Inline variant - smaller, relative positioning
  if (inline) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="relative flex flex-col items-center gap-4">
          {/* Animated particles in background */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-0.5 bg-teal-400/30 dark:bg-teal-500/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `particle-float ${3 + Math.random() * 4}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Logo with animation */}
          <div className="relative">
            <img 
              src={logo} 
              alt="Loading" 
              className="w-16 h-16 object-contain logo-flip"
            />
          </div>

          {/* Loading text */}
          <div className="flex items-center gap-2">
            {/* <span className={`text-base font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}> */}
            <span className="bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent animate-gradient-x">
              Loading
            </span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-bounce-custom" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-bounce-custom" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-bounce-custom" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        </div>

        <style>{`
          @keyframes particle-float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(-50px) translateX(10px);
              opacity: 0;
            }
          }

          @keyframes bounce-custom {
            0%, 100% {
              transform: translateY(0px) scale(1);
            }
            50% {
              transform: translateY(-8px) scale(1.2);
            }
          }

          .animate-bounce-custom {
            animation: bounce-custom 0.8s ease-in-out infinite;
          }

          .logo-flip {
            animation: logo-flip 2s ease-in-out infinite;
          }

          @keyframes logo-flip {
            0%, 100% {
              transform: rotateY(0deg);
            }
            50% {
              transform: rotateY(180deg);
            }
          }
        `}</style>
      </div>
    );
  }

  // Full-screen variant (original)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-teal-50 dark:from-[#0f1419] dark:via-[#1D1E23] dark:to-[#1a2a33]">
      {/* Animated particles in background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/30 dark:bg-teal-500/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `particle-float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center gap-10">
        {/* Logo with advanced animations */}
        <div className="relative">
          {/* Expanding circle background */}
          <div className="absolute inset-0 -m-8">
            {/* <div className="w-full h-full rounded-full bg-gradient-to-r from-teal-400/20 to-cyan-400/20 dark:from-teal-500/10 dark:to-cyan-500/10 animate-expand-pulse" /> */}
          </div>
          
          {/* Rotating gradient ring */}
          {/* <div className="absolute inset-0 -m-10">
            <div className="w-full h-full rounded-full" style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(20, 184, 166, 0.4) 50%, transparent 100%)',
              animation: 'spin 2s linear infinite'
            }} />
          </div> */}

          {/* Logo with multiple animations */}
          <div className="relative">
            <img 
              src={logo} 
              alt="Loading" 
              className="w-36 h-36 md:w-44 md:h-44 object-contain logo-flip"
              // style={{
              //   animation: 'logo-reveal 2s cubic-bezier(0.34, 1.56, 0.64, 1) infinite, logo-glow 2s ease-in-out infinite'
              // }}
            />
          </div>
        </div>

        {/* Loading text with modern animation */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl md:text-3xl font-bold relative">
              <span className="bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-teal-400 dark:via-cyan-400 dark:to-teal-400 bg-clip-text text-transparent animate-gradient-x">
                Loading
              </span>
            </h2>
            <div className="flex gap-1.5">
              <span className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-bounce-custom" style={{ animationDelay: "0ms" }} />
              <span className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-bounce-custom" style={{ animationDelay: "150ms" }} />
              <span className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full animate-bounce-custom" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
          
          {/* Animated bars */}
          {/* <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-gradient-to-t from-teal-500 to-cyan-500 rounded-full"
                style={{
                  height: '20px',
                  animation: `bar-scale 1s ease-in-out infinite`,
                  animationDelay: `${i * 0.1}s`
                }}
              />
            ))}
          </div> */}
        </div>
      </div>

      <style>{`
        @keyframes logo-reveal {
          0% {
            transform: scale(0) rotate(-180deg);
            opacity: 0;
            filter: blur(10px);
          }
          50% {
            transform: scale(1.1) rotate(10deg);
            opacity: 1;
            filter: blur(0px);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            filter: blur(0px);
          }
        }

        @keyframes logo-glow {
          0%, 100% {
            filter: drop-shadow(0 0 0px rgba(20, 184, 166, 0)) brightness(1);
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(20, 184, 166, 0)) brightness(1.2);
          }
        }

        @keyframes expand-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.1;
          }
        }

        @keyframes particle-float {
          0%, 100% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }

        @keyframes bounce-custom {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-10px) scale(1.2);
          }
        }

        .animate-bounce-custom {
          animation: bounce-custom 0.8s ease-in-out infinite;
        }

        @keyframes bar-scale {
          0%, 100% {
            transform: scaleY(0.3);
            opacity: 0.5;
          }
          50% {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes gradient-x {
          0%, 100% {
            background-size: 200% 100%;
            background-position: 0% 50%;
          }
          50% {
            background-size: 200% 100%;
            background-position: 100% 50%;
          }
        }

        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
          background-size: 200% 100%;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;

