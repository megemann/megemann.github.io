import React, { useState, useContext, useEffect } from 'react';
import Sidebar from '../../component/Sidebar/Sidebar';
import ReactMarkdown from 'react-markdown';
import markdownContent from '../../content/austin_fairbanks.md';
import './aboutMe.css';
import ThemeContext from '../../ThemeContext';
import golfImage from '../../assets/golf.png';
import travelImage from '../../assets/travel.jpeg';
import iceSkateImage from '../../assets/Ice_Skate.jpg';
import psuImage from '../../assets/PSU.jpg';

export default function AboutMe() {
    const [activeTab, setActiveTab] = useState('preview');
    const { darkMode, setDarkMode, isMobile } = useContext(ThemeContext);
    const [processedContent, setProcessedContent] = useState('');

    useEffect(() => {
        // Process the markdown content to replace image paths
        const content = markdownContent
            .replace(/\(\.\.\/assets\/golf\.png\)/g, '(#golf-image)')
            .replace(/\(\.\.\/assets\/travel\.jpeg\)/g, '(#travel-image)')
            .replace(/\(\.\.\/assets\/Ice_Skate\.jpg\)/g, '(#ice-skate-image)')
            .replace(/\(\.\.\/assets\/PSU\.jpg\)/g, '(#psu-image)');
        
        setProcessedContent(content);
    }, []);

    // Custom renderer for images
    const imageRenderer = ({ src, alt }) => {
        let image;
        
        if (src === '#golf-image') {
            image = <img src={golfImage} alt={alt} className="about-image" />;
        } else if (src === '#travel-image') {
            image = <img src={travelImage} alt={alt} className="about-image" />;
        } else if (src === '#ice-skate-image') {
            image = <img src={iceSkateImage} alt={alt} className="about-image" />;
        } else if (src === '#psu-image') {
            image = <img src={psuImage} alt={alt} className="about-image" />;
        } else {
            image = <img src={src} alt={alt} className="about-image" />;
        }
        
        return (
            <div className="image-container">
                {image}
                <div className="image-caption">{alt}</div>
            </div>
        );
    };

    return (
        <div className={`notebook-container ${darkMode ? 'dark-mode' : ''}`}>
            {/* Sidebar - only render if not on mobile */}
            {!isMobile && (
                <div className="sidebar">
                    <Sidebar/>
                </div>
            )}

            <div className="main-content" style={isMobile ? { marginLeft: 0 } : {}}>
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
                            <ReactMarkdown 
                                components={{
                                    img: imageRenderer
                                }}
                            >
                                {processedContent}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}