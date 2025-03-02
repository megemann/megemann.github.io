import './App.css';
import Home from './pages/home/home';
import "./fonts/NovaFlat-Regular.ttf";
import ProjectPage from './pages/projectPage/projectPage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProjectList from './pages/projectList/projectList';
import AboutMe from './pages/aboutMe/aboutMe';
import Resume from './pages/resume/resume';
import React, { useEffect, useState } from 'react';
import ThemeContext from './ThemeContext';
    
const App = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 920) {
                setIsMobile(true);
            } else {
                setIsMobile(false);
            }
        };

        handleResize(); // Check the screen size on load
        window.addEventListener('resize', handleResize);

        // Cleanup the event listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Create a context value that includes both darkMode and isMobile
    const contextValue = {
        darkMode,
        setDarkMode,
        isMobile
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<ProjectList />} />
                    <Route path="/project/:id" element={<ProjectPage />} />
                    <Route path="/about" element={<AboutMe />} />
                    <Route path="/resume" element={<Resume />} />
                </Routes>
            </BrowserRouter>
        </ThemeContext.Provider>
    );
};

export default App;
