import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './dataScience.css';
import ThemeContext from '../../ThemeContext';

export default function DataScience() {
    const nav = useNavigate();
    const [isPaused] = useState(false);
    const { darkMode, setDarkMode, isMobile } = useContext(ThemeContext);

    return (
        <div className={`notebook-container ${darkMode ? 'dark-mode' : ''}`}>
            {!isMobile && (
                <div className="sidebar">
                    {/* Sidebar content */}
                </div>
            )}
            
            <div className="main-content" style={isMobile ? { marginLeft: 0 } : {}}>
                <div className="notebook-header">
                    <div className="notebook-title">Data_Science.ipynb</div>
                    <div className="notebook-controls">
                        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>
                
                <div className="notebook-content">
                    <i className="fas fa-code-branch" style={{ fontSize: '4rem', color: 'var(--jupyter-blue)' }}></i>
                    <h1>Data Science Projects Coming Soon</h1>
                    <p>
                        I'm currently working on some exciting data science projects that will be showcased here.
                        Check back soon to see interactive data visualizations, machine learning models, and more!
                    </p>
                    <div className="button-container">
                        <button className="run-button" onClick={() => nav('/projects')}>
                            View Current Projects
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
} 