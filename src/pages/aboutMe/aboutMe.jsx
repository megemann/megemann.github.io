import React, { useState } from 'react';
import Sidebar from '../../component/Sidebar/Sidebar';
import ReactMarkdown from 'react-markdown';
import markdownContent from '../../content/austin_fairbanks.md';
import './aboutMe.css';

export default function AboutMe() {
    const [darkMode, setDarkMode] = useState(true);
    const [activeTab, setActiveTab] = useState('preview');

    return (
        <div className={`notebook-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="sidebar">
                <Sidebar/>
            </div>

            <div className="main-content">
                <div className="notebook-header">
                    <div className="notebook-title">austin_fairbanks.md</div>
                    <div className="notebook-controls">
                        <div className="tab-buttons">
                            <button 
                                className={`tab-button ${activeTab === 'raw' ? 'active' : ''}`}
                                onClick={() => setActiveTab('raw')}
                            >
                                Raw
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'preview' ? 'active' : ''}`}
                                onClick={() => setActiveTab('preview')}
                            >
                                Preview
                            </button>
                        </div>
                        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>

                <div className="markdown-container">
                    {activeTab === 'raw' ? (
                        <pre className="raw-content">{markdownContent}</pre>
                    ) : (
                        <div className="preview-content">
                            <ReactMarkdown>{markdownContent}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}