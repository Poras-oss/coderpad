import React, { useEffect, useRef, useState } from 'react';
// import backgroundMusic from '../assets/mp3/binary.mp3';
import backgroundMusic from '../../assets/mp3/binary.mp3';

const SoundManager = ({ children }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;

    const handleCanPlay = () => setAudioReady(true);
    audioRef.current.addEventListener('canplaythrough', handleCanPlay);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('canplaythrough', handleCanPlay);
      }
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current || !audioReady) return;

    if (isMuted) {
      audioRef.current.pause();
    } else if (hasUserInteracted) {
      audioRef.current.play().catch((error) => {
        console.log('Audio play failed:', error);
      });
    }
  }, [isMuted, hasUserInteracted, audioReady]);

  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasUserInteracted(true);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  useEffect(() => {
    const handleButtonClick = (e) => {
      if (
        e.target?.closest('button') &&
        !e.target?.closest('[data-sound-mute]') &&
        clickAudioRef.current
      ) {
        clickAudioRef.current.currentTime = 0;
        clickAudioRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('click', handleButtonClick);
    return () => document.removeEventListener('click', handleButtonClick);
  }, []);

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <>
      {/* Background music audio element */}
      <audio ref={audioRef} src={backgroundMusic} preload="auto" />

      {/* Button click sound audio element (optional) */}
      {/* <audio ref={clickAudioRef} src={buttonClickSound} /> */}

      {/* Mute/Unmute Button */}
      <button
        data-sound-mute
        onClick={toggleMute}
        className="w-9 h-9 bg-gray-900/80 backdrop-blur-xl border border-cyan-400/50 rounded-full flex items-center justify-center hover:bg-cyan-400/10 transition-all duration-300 group"
        title={isMuted ? 'Unmute Background' : 'Mute Background'}
      >
        {isMuted ? (
          <svg className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
        )}

        {/* Visual indicator for audio state */}
        {!isMuted && hasUserInteracted && audioReady && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        )}

        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-cyan-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
      </button>

      {/* Optional: Render children */}
      {children}
    </>
  );
};

export default SoundManager;
