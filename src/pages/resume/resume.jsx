import React, { useContext } from 'react';
import Sidebar from '../../component/Sidebar/Sidebar';
import ThemeContext from '../../ThemeContext';
import './resume.css';

export default function Resume() {
    const { darkMode, setDarkMode, isMobile } = useContext(ThemeContext);
    
    // Direct reference to the PDF on GitHub
    const resumeUrl = `https://raw.githubusercontent.com/megemann/megemann.github.io/main/public/Resume_Austin_Fairbanks.pdf`;
    
    // Use Google Docs Viewer to display the PDF
    const googleDocsViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}&embedded=true`;

    return (
        <div className={`notebook-container ${darkMode ? 'dark-mode' : ''}`}>
            {/* Sidebar - only render if not on mobile */}
            {!isMobile && (
                <div className="sidebar">
                    <Sidebar />
                </div>
            )}
            
            <div className="main-content" style={isMobile ? { marginLeft: 0 } : {}}>
                <div className="notebook-header">
                    <div className="notebook-title">Resume_Austin_Fairbanks.pdf</div>
                    <div className="notebook-controls">
                        <a 
                            href={resumeUrl} 
                            download="Resume.pdf"
                            className="download-button"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fas fa-download"></i> Download
                        </a>
                        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>

                <div className="resume-container">
                    <iframe
                        src={googleDocsViewerUrl}
                        width="100%"
                        height="100%"
                        className="resume-viewer"
                        title="Austin Fairbanks Resume"
                        frameBorder="0"
                    />
                </div>
            </div>
        </div>
    );
} 