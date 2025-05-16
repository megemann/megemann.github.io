import React, { useContext, useEffect } from 'react';
import Timeline from '../../component/Timeline/Timeline';
import Sidebar from '../../component/Sidebar/Sidebar';
import ThemeContext from '../../ThemeContext';
import './TimelinePage.css';

const TimelinePage = () => {
    const { darkMode, isMobile } = useContext(ThemeContext);
    
    useEffect(() => {
        // Apply dark mode to body
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Scroll to top when page loads
        window.scrollTo(0, 0);
    }, [darkMode]);
    
    return (
        <div className={`timeline-page ${darkMode ? 'dark-mode' : ''}`}>
            {/* Sidebar - only render if not on mobile */}
            {!isMobile && (
                <div className="sidebar">
                    <Sidebar />
                </div>
            )}
            
            <div className="timeline-page-content" style={isMobile ? { marginLeft: 0 } : {}}>
                <div className="timeline-page-header">
                    <h1>My Journey</h1>
                    <p>
                        A chronological visualization of my academic, professional, and project milestones.
                        Explore the events that have shaped my career and skills over time.
                    </p>
                </div>
                
                <Timeline />
                
                <div className="timeline-page-footer">
                    <p>
                        This timeline is continuously updated as I progress in my journey.
                        Check back regularly to see new milestones and achievements!
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TimelinePage; 