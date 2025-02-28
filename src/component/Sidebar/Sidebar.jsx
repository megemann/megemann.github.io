import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeContext from '../../ThemeContext';
import './Sidebar.css';

export default function Sidebar() {
    const nav = useNavigate();
    const location = useLocation();
    const { darkMode, setDarkMode } = useContext(ThemeContext);
    const [expandedFolders, setExpandedFolders] = useState({
        portfolio: true,
        data: true,
        assets: false
    });

    const toggleFolder = (folder) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folder]: !prev[folder]
        }));
    };

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <span className="explorer-title">EXPLORER</span>
                <button className="sidebar-toggle">
                    <i className="fas fa-ellipsis-v"></i>
                </button>
            </div>
            
            <div className="folder-structure">
                {/* Portfolio Folder */}
                <div className="folder">
                    <div className="folder-header" onClick={() => toggleFolder('portfolio')}>
                        <i className={`folder-icon fas ${expandedFolders.portfolio ? 'fa-folder-open' : 'fa-folder'}`}></i>
                        <span className="folder-name">portfolio</span>
                    </div>
                    
                    {expandedFolders.portfolio && (
                        <div className="folder-content">
                            <div className={`file ${location.pathname === '/' ? 'active' : ''}`}>
                                <i className="file-icon python-icon fab fa-python"></i>
                                <span 
                                    className="file-name"
                                    onClick={() => nav('/')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Portfolio.ipynb
                                </span>
                            </div>
                            <div className="file">
                                <i className="file-icon markdown-icon fas fa-file-alt"></i>
                                <span className="file-name">README.md</span>
                            </div>
                            <div className={`file ${location.pathname === '/about' ? 'active' : ''}`}>
                                <i className="file-icon markdown-icon fas fa-file-alt"></i>
                                <span 
                                    className="file-name"
                                    onClick={() => nav('/about')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    austin_fairbanks.md
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Data Folder */}
                <div className="folder">
                    <div className="folder-header" onClick={() => toggleFolder('data')}>
                        <i className={`folder-icon fas ${expandedFolders.data ? 'fa-folder-open' : 'fa-folder'}`}></i>
                        <span className="folder-name">data</span>
                    </div>
                    
                    {expandedFolders.data && (
                        <div className="folder-content">
                            <div className={`file ${location.pathname === '/projects' ? 'active' : ''}`}>
                                <i className="file-icon json-icon fas fa-file-code"></i>
                                <span 
                                    className="file-name"
                                    onClick={() => nav('/projects')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    projects.json
                                </span>
                            </div>
                            <div className="file">
                                <i className="file-icon json-icon fas fa-file-code"></i>
                                <span className="file-name">skills.json</span>
                            </div>
                            <div className="file">
                                <i className="file-icon python-icon fab fa-python"></i>
                                <span className="file-name">data_science.py</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Assets Folder */}
                <div className="folder">
                    <div className="folder-header" onClick={() => toggleFolder('assets')}>
                        <i className={`folder-icon fas ${expandedFolders.assets ? 'fa-folder-open' : 'fa-folder'}`}></i>
                        <span className="folder-name">assets</span>
                    </div>
                    
                    {expandedFolders.assets && (
                        <div className="folder-content">
                            <div className="file">
                                <i className="file-icon image-icon fas fa-file-image"></i>
                                <span className="file-name">profile.jpg</span>
                            </div>
                            <div className="file">
                                <i className="file-icon image-icon fas fa-file-image"></i>
                                <span className="file-name">umass_logo.png</span>
                            </div>
                            <div className="file">
                                <i className="file-icon folder-icon fas fa-folder"></i>
                                <span className="file-name">projects/</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
        </div>
    );
} 