import { useEffect } from 'react';

const AppHeightController = () => {
  useEffect(() => {
    const setAppHeight = () => {
      // Get the document's root element (the <html> tag)
      const doc = document.documentElement;
      // Set a CSS custom property '--app-height' to the window's inner height
      doc.style.setProperty('--app-height', `${window.innerHeight}px`);
    };

    // Add event listener to recalculate on resize
    window.addEventListener('resize', setAppHeight);
    // Set the height immediately on component mount
    setAppHeight();

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('resize', setAppHeight);
    };
  }, []);

  // This component renders nothing to the DOM
  return null;
};

export default AppHeightController;