import './App.css';
import Home from './pages/home/home';
import "./fonts/NovaFlat-Regular.ttf";
import ProjectPage from './pages/projectPage/projectPage';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProjectList from './pages/projectList/projectList';
import AboutMe from './pages/aboutMe/aboutMe';
import React, { useEffect, useState } from 'react';

const App = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
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

    if (isMobile) {
        return (
            <div style={{ 
                textAlign: 'center', 
                padding: '10%', 
                backgroundColor: '#2E2C31', 
                color: 'white', 
                height: '100vh', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center' 
            }}>
                <h1 style={{ color: '#0096ff', marginBottom: '20px' }}>Mobile View Coming Soon</h1>
                <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
                    This site is optimized for desktop viewing. Please visit on a larger screen for the best experience.
                </p>
            </div>
        );
    }

    return (
      <div>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home/>}></Route>
            <Route path="/project/:projectKey" element={<ProjectPage/>}></Route>
            <Route path="/projects" element={<ProjectList/>}></Route>
            <Route path="/aboutme" element={<AboutMe/>}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    );
};

export default App;
