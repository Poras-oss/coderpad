import React, { useEffect, useRef, useState } from 'react';
import HolographicPanel from './HolographicPanel';
import GlitchText from './GlitchText';
import buttonClickSound from '../../assets/mp3/button-click.mp3';

/**
 * Learn SQL Popup Component
 * Displays two clickable screenshots for purchasing SQL course
 * @param {Object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 */
const LearnSQLPopup = ({ open, onClose }) => {
  const [show, setShow] = useState(open);
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const buttonClickRef = useRef(null);

  useEffect(() => {
    if (open) {
      setShow(true);
      setTriggerGlitch(true);
    } else {
      setTimeout(() => setShow(false), 400);
    }
  }, [open]);

  const handleImageClick = (link) => {
    if (buttonClickRef.current) {
      buttonClickRef.current.currentTime = 0;
      buttonClickRef.current.play();
    }
    setTimeout(() => {
      window.open(link, '_blank', 'noopener,noreferrer');
    }, 80);
  };

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-400 px-4 py-4 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    >
      <div onClick={e => e.stopPropagation()}>
        <audio ref={buttonClickRef} src={buttonClickSound} preload="auto" />
        <HolographicPanel className={`w-full max-w-6xl min-h-[400px] p-4 sm:p-8 lg:p-12 relative animate-glitch-popup`}>
          <GlitchText
            triggerGlitch={triggerGlitch}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-300 text-center mb-4 sm:mb-6 lg:mb-8 select-none"
          >
            Learn SQL - Choose Your Platform
          </GlitchText>

          <div className="text-center text-white text-base sm:text-lg font-mono mb-6 sm:mb-8 leading-relaxed px-2 sm:px-4">
            Select your preferred platform to purchase the SQL course
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-6 sm:gap-8 lg:gap-12 mb-4 sm:mb-6 lg:mb-8">
            {/* Topmate Purchase Option */}
            <div
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
              onClick={() => handleImageClick('https://topmate.io/datasense/1809137')}
            >
              <div className="relative overflow-hidden rounded-lg border-2 border-cyan-400/30 hover:border-cyan-400/80 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src="assets/sql-course/topmate.jpg"
                  alt="Purchase via Topmate"
                  className="w-full h-auto max-w-xs sm:max-w-sm object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
                  <p className="text-cyan-300 font-mono text-sm sm:text-base font-bold text-center">
                    Purchase via Topmate
                  </p>
                </div>
              </div>
            </div>

            {/* Google Drive Purchase Option */}
            <div
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-400/50"
              onClick={() => handleImageClick('https://pages.razorpay.com/SQLHEIST')}
            >
              <div className="relative overflow-hidden rounded-lg border-2 border-cyan-400/30 hover:border-cyan-400/80 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  // src="assets\sql-course\gDrive.jpg"
                  src="assets/sql-course/gDrive.jpg"
                  alt="Purchase via Google Drive"
                  className="w-full h-auto max-w-xs sm:max-w-sm object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 sm:p-4">
                  <p className="text-cyan-300 font-mono text-sm sm:text-base font-bold text-center">
                    Purchase via Google Drive
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Close button hint */}
          <div className="text-center text-cyan-400/60 text-xs sm:text-sm font-mono mt-4">
            Click outside to close
          </div>
        </HolographicPanel>
      </div>
    </div>
  );
};

export default LearnSQLPopup;
