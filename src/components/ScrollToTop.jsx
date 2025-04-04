// src/components/ScrollToTop.js
import React, { useState, useEffect } from 'react';
import { FaArrowAltCircleUp, FaLongArrowAltUp } from 'react-icons/fa';

const ScrollToTop = ({ onVisibilityChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    const newVisibility = window.scrollY > 300;
    setIsVisible(newVisibility);
    onVisibilityChange?.(newVisibility); // Notify parent component
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:bg-orange-700 transition-opacity duration-300"
        >
          <FaLongArrowAltUp/>
        </button>
      )}
    </div>
  );
};

export default ScrollToTop;
