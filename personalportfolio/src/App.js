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
            if (window.innerWidth < 900) {
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
            <div style={{ textAlign: 'center', marginTop: '20%' }}>
                <h1>This site is not available on mobile devices.</h1>
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
