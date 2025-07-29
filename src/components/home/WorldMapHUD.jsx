import Lottie from 'lottie-react';
// import worldMapAnimation from '../assets/lottie/cc1XpRzNqK.json';
import worldMapAnimation from '../../assets/lottie/cc1XpRzNqK.json';
import React from 'react';

const defaultStyle = {
  position: 'fixed',
  // left: 32,
  // bottom: 32,
  width: 230,
  height: 120,
  zIndex: 40,
  pointerEvents: 'none',
  // filter: 'drop-shadow(0 0 16px) brightness(0) saturate(100%) invert(70%) sepia(100%) hue-rotate(160deg) brightness(1.5)',
  background: 'transparent',
};

const WorldMapHUD = ({ style  }) => (
  <div style={{ ...defaultStyle, ...style }}>
    <Lottie
      animationData={worldMapAnimation}
      loop
      autoplay
      style={{ width: '100%', height: '100%', background: 'transparent' }}
      rendererSettings={{ preserveAspectRatio: 'xMidYMid slice' }}
    />
  </div>
);

export default WorldMapHUD;