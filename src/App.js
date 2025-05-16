import './App.css';
import Home from './pages/home/home';
import "./fonts/NovaFlat-Regular.ttf";
import ProjectPage from './pages/projectPage/projectPage';
import { Routes, Route, HashRouter } from 'react-router-dom';
import ProjectList from './pages/projectList/projectList';
import AboutMe from './pages/aboutMe/aboutMe';
import Resume from './pages/resume/resume';
import Blogs from './pages/blogs/blogs';
import BlogPost from './pages/blogs/BlogPost';
import TimelinePage from './pages/timeline/TimelinePage';
import React, { useEffect, useState } from 'react';
import ThemeContext from './ThemeContext';
import { initGA, logPageView } from './analytics';
import RouteChangeTracker from './RouteChangeTracker';

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

    useEffect(() => {
        // Initialize Google Analytics
        initGA();
        // Log initial page view
        logPageView();
    }, []);

    // Create a context value that includes both darkMode and isMobile
    const contextValue = {
        darkMode,
        setDarkMode,
        isMobile
    };

    return (
        <ThemeContext.Provider value={contextValue}>
            <HashRouter>
                <RouteChangeTracker />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/projects" element={<ProjectList />} />
                    <Route path="/project/:id" element={<ProjectPage />} />
                    <Route path="/about" element={<AboutMe />} />
                    <Route path="/resume" element={<Resume />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/blog/:slug" element={<BlogPost />} />
                    <Route path="/timeline" element={<TimelinePage />} />
                </Routes>
            </HashRouter>
        </ThemeContext.Provider>
    );
};

export default App;
