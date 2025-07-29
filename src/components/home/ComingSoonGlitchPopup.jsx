import React, { useEffect, useRef, useState } from 'react';
import HolographicPanel from './HolographicPanel';
import GlitchText from './GlitchText';
import CyberButton from './CyberButton';
import buttonClickSound from '../../assets/mp3/button-click.mp3';
// import glitchSound from '../assets/mp3/glitch.mp3';

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {function} props.onClose
 * @param {'Python'|'SQL'} props.badgeType
 */
const ComingSoonGlitchPopup = ({ open, onClose, badgeType, description, yesLink }) => {
  const [show, setShow] = useState(open);
  const [triggerGlitch, setTriggerGlitch] = useState(false);
  const audioRef = useRef(null);
  const buttonClickRef = useRef(null);

  useEffect(() => {
    if (open) {
      setShow(true);
      setTriggerGlitch(true);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    } else {
      setTimeout(() => setShow(false), 400); // allow exit animation
    }
  }, [open]);

  const handleYes = () => {
    if (buttonClickRef.current) {
      buttonClickRef.current.currentTime = 0;
      buttonClickRef.current.play();
    }
    setTimeout(() => {
      if (yesLink) {
        window.location.href = yesLink;
      }
    }, 80);
  };

  const handleNo = () => {
    if (buttonClickRef.current) {
      buttonClickRef.current.currentTime = 0;
      buttonClickRef.current.play();
    }
    setTimeout(onClose, 80);
  };

  if (!show) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-400 px-4 py-4 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
         onClick={onClose}>
      {/* <audio ref={audioRef} src={glitchSound} preload="auto" /> */}
      <div onClick={e => e.stopPropagation()}>
        <audio ref={buttonClickRef} src={buttonClickSound} preload="auto" />
        <HolographicPanel className={`w-full max-w-2xl min-h-[320px] sm:min-h-[400px] p-4 sm:p-8 lg:p-12 relative animate-glitch-popup`}>
          <GlitchText triggerGlitch={triggerGlitch} className="text-2xl sm:text-3xl lg:text-4xl font-bold text-cyan-300 text-center mb-4 sm:mb-6 lg:mb-8 select-none">
            {`Coming Soon...`}
          </GlitchText>
          <div className="text-center text-white text-base sm:text-lg lg:text-xl font-mono mb-6 sm:mb-8 lg:mb-12 leading-relaxed px-2 sm:px-4">
            {description}
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 lg:gap-12 mb-4 sm:mb-6 lg:mb-8">
            {/* <div className="group">
              <CyberButton 
                variant="primary" 
                size="lg"
                className="animate-float w-full sm:w-48 lg:w-64"
                style={{ animationDelay: '0s' }}
                onClick={handleYes}
              >
                Yes
              </CyberButton>
            </div> */}
            <div className="group">
              <CyberButton 
                variant="primary" 
                size="lg"
                className="animate-float w-full sm:w-48 lg:w-64"
                style={{ animationDelay: '0s' }}
                onClick={handleNo}
              >
                Home
              </CyberButton>
            </div>
          </div>
        </HolographicPanel>
      </div>
    </div>
  );
};

export default ComingSoonGlitchPopup;