import React from 'react';

const ThemeContext = React.createContext({
    darkMode: true,
    setDarkMode: () => {},
    isMobile: false
});

export default ThemeContext; 