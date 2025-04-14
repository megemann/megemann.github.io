import React, { useContext } from 'react';
import ThemeContext from '../../ThemeContext';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  
  return (
    <button 
      className={`theme-toggle ${darkMode ? 'dark' : 'light'}`} 
      onClick={() => setDarkMode(!darkMode)}
      aria-label={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
    >
      {darkMode ? (
        <>
          <i className="fas fa-sun"></i>
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <i className="fas fa-moon"></i>
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle; 