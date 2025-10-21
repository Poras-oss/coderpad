import React, { useEffect } from 'react';

export default function UnityGameWrapper(){
  useEffect(() => {
    // Create an iframe to load the Unity game
    const iframe = document.createElement('iframe');
    iframe.src = '/unity-games/index.html';
    iframe.style.width = '100%';
    iframe.style.height = '100vh';
    iframe.style.border = 'none';

    // Get the container and append the iframe
    const container = document.getElementById('unity-game-container');
    if (container) {
      container.appendChild(iframe);
    }

    return () => {
      if (container && iframe) {
        container.removeChild(iframe);
      }
    };
  }, []);

  return <div id="unity-game-container" className="w-full h-screen" />;
};