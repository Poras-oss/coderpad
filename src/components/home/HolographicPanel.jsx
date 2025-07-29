import React from 'react';

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {string} [props.glowColor]
 */
const HolographicPanel = ({ 
  children, 
  className = '', 
  glowColor = 'cyan' 
}) => {
  return (
    <div className={`relative ${className}`} data-holographic-panel>
      {/* Main panel */}
      <div className="relative bg-gray-900/20 backdrop-blur-xl border border-cyan-400/30 rounded-lg p-6 shadow-2xl hover:bg-gray-900/30 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-cyan-400/20">
        {/* Holographic glow effect */}
        <div 
          className="absolute inset-0 rounded-lg opacity-20 blur-sm hover:opacity-30 transition-opacity duration-300"
          style={{
            background: `linear-gradient(45deg, transparent, ${glowColor === 'cyan' ? '#00d4aa' : '#4dd0e1'}, transparent)`,
            animation: 'holographicGlow 3s ease-in-out infinite alternate'
          }}
        />
        
        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400 group-hover:border-cyan-300 transition-colors duration-300"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400 group-hover:border-cyan-300 transition-colors duration-300"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400 group-hover:border-cyan-300 transition-colors duration-300"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400 group-hover:border-cyan-300 transition-colors duration-300"></div>
        
        {/* Scanning line effect */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-1 rounded-lg"
          style={{
            animation: 'scanLine 4s linear infinite'
          }}
        />
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default HolographicPanel;