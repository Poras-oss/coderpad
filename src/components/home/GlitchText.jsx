import React, { useEffect, useState } from 'react';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {boolean} [props.triggerGlitch]
 */
const GlitchText = ({ 
  children, 
  className = '', 
  triggerGlitch = false 
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (triggerGlitch) {
      setIsGlitching(true);
      const timer = setTimeout(() => {
        setIsGlitching(false);
      }, 2000); // 2 second glitch duration

      return () => clearTimeout(timer);
    }
  }, [triggerGlitch]);

  return (
    <div className={`relative ${className}`}>
      {/* Main text */}
      <div className={`relative z-10 ${isGlitching ? 'animate-glitch-main' : ''}`}>
        {children}
      </div>
      
      {/* Glitch layers */}
      {isGlitching && (
        <>
          {/* Red glitch layer */}
          <div 
            className="absolute inset-0 z-5 text-red-500 animate-glitch-red"
            style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)' }}
          >
            {children}
          </div>
          
          {/* Blue glitch layer */}
          <div 
            className="absolute inset-0 z-5 text-blue-500 animate-glitch-blue"
            style={{ clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)' }}
          >
            {children}
          </div>
          
          {/* Cyan glitch layer */}
          <div 
            className="absolute inset-0 z-5 text-cyan-400 animate-glitch-cyan"
            style={{ clipPath: 'polygon(0 20%, 100% 20%, 100% 80%, 0 80%)' }}
          >
            {children}
          </div>
        </>
      )}
    </div>
  );
};

export default GlitchText;