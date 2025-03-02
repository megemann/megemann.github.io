import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeContext from '../../ThemeContext';
import './Sidebar.css';

export default function Sidebar() {
    const nav = useNavigate();
    const location = useLocation();
    const { isMobile } = useContext(ThemeContext);
    const [expandedFolders, setExpandedFolders] = useState({
        portfolio: true,
        data: true,
        notebooks: false,
        models: false,
        visualizations: false,
        assets: true,
        scripts: false
    });

    const toggleFolder = (folder) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folder]: !prev[folder]
        }));
    };

    // Check if we're on the projects page
    const isProjectsPage = location.pathname === '/projects';
    // Check if we're on the resume page
    const isResumePage = location.pathname === '/resume';

    // If on mobile, don't render the sidebar
    if (isMobile) {
        return null;
    }

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
                            <div className={`file ${location.pathname === '/' ? 'active' : ''} clickable-file`}>
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
                            <div className={`file ${location.pathname === '/about' ? 'active' : ''} clickable-file`}>
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
                
                {/* Data Folder - Always expanded to show projects.json */}
                <div className="folder">
                    <div className="folder-header" onClick={() => toggleFolder('data')}>
                        <i className={`folder-icon fas ${expandedFolders.data ? 'fa-folder-open' : 'fa-folder'}`}></i>
                        <span className="folder-name">data</span>
                    </div>
                    
                    {expandedFolders.data && (
                        <div className="folder-content">
                            <div className={`file ${isProjectsPage ? 'active' : ''} clickable-file`}>
                                <i className="file-icon json-icon fas fa-file-code"></i>
                                <span 
                                    className="file-name"
                                    onClick={() => nav('/projects')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    projects.json
                                    {!isProjectsPage && <span className="file-badge">Click to view projects</span>}
                                </span>
                            </div>
                            <div className="file">
                                <i className="file-icon csv-icon fas fa-file-csv"></i>
                                <span className="file-name">train.csv</span>
                            </div>
                            <div className="file">
                                <i className="file-icon csv-icon fas fa-file-csv"></i>
                                <span className="file-name">test.csv</span>
                            </div>
                            <div className="file">
                                <i className="file-icon python-icon fab fa-python"></i>
                                <span className="file-name">data_science.py</span>
                            </div>
                            <div className="file">
                                <i className="file-icon database-icon fas fa-database"></i>
                                <span className="file-name">features.db</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Notebooks Folder */}
                <div className="folder">
                    <div className="folder-header" onClick={() => toggleFolder('notebooks')}>
                        <i className={`folder-icon fas ${expandedFolders.notebooks ? 'fa-folder-open' : 'fa-folder'}`}></i>
                        <span className="folder-name">notebooks</span>
                    </div>
                    
                    {expandedFolders.notebooks && (
                        <div className="folder-content">
                            <div className="file">
                                <i className="file-icon jupyter-icon fas fa-book"></i>
                                <span className="file-name">EDA.ipynb</span>
                            </div>
                            <div className="file">
                                <i className="file-icon jupyter-icon fas fa-book"></i>
                                <span className="file-name">Model_Training.ipynb</span>
                            </div>
                            <div className="file">
                                <i className="file-icon jupyter-icon fas fa-book"></i>
                                <span className="file-name">Feature_Engineering.ipynb</span>
                            </div>
                            <div className="file">
                                <i className="file-icon jupyter-icon fas fa-book"></i>
                                <span className="file-name">Evaluation.ipynb</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Models Folder */}
                <div className="folder">
                    <div className="folder-header" onClick={() => toggleFolder('models')}>
                        <i className={`folder-icon fas ${expandedFolders.models ? 'fa-folder-open' : 'fa-folder'}`}></i>
                        <span className="folder-name">models</span>
                    </div>
                    
                    {expandedFolders.models && (
                        <div className="folder-content">
                            <div className="file">
                                <i className="file-icon model-icon fas fa-brain"></i>
                                <span className="file-name">random_forest.pkl</span>
                            </div>
                            <div className="file">
                                <i className="file-icon model-icon fas fa-brain"></i>
                                <span className="file-name">neural_network.h5</span>
                            </div>
                            <div className="file">
                                <i className="file-icon model-icon fas fa-brain"></i>
                                <span className="file-name">xgboost_model.pkl</span>
                            </div>
                            <div className="file">
                                <i className="file-icon python-icon fab fa-python"></i>
                                <span className="file-name">model_utils.py</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Scripts Folder */}
                <div className="folder">
                    <div className="folder-header" onClick={() => toggleFolder('scripts')}>
                        <i className={`folder-icon fas ${expandedFolders.scripts ? 'fa-folder-open' : 'fa-folder'}`}></i>
                        <span className="folder-name">scripts</span>
                    </div>
                    
                    {expandedFolders.scripts && (
                        <div className="folder-content">
                            <div className="file">
                                <i className="file-icon python-icon fab fa-python"></i>
                                <span className="file-name">preprocess.py</span>
                            </div>
                            <div className="file">
                                <i className="file-icon python-icon fab fa-python"></i>
                                <span className="file-name">train.py</span>
                            </div>
                            <div className="file">
                                <i className="file-icon python-icon fab fa-python"></i>
                                <span className="file-name">evaluate.py</span>
                            </div>
                            <div className="file">
                                <i className="file-icon shell-icon fas fa-terminal"></i>
                                <span className="file-name">run_pipeline.sh</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Visualizations Folder */}
                <div className="folder">
                    <div className="folder-header" onClick={() => toggleFolder('visualizations')}>
                        <i className={`folder-icon fas ${expandedFolders.visualizations ? 'fa-folder-open' : 'fa-folder'}`}></i>
                        <span className="folder-name">visualizations</span>
                    </div>
                    
                    {expandedFolders.visualizations && (
                        <div className="folder-content">
                            <div className="file">
                                <i className="file-icon image-icon fas fa-chart-bar"></i>
                                <span className="file-name">feature_importance.png</span>
                            </div>
                            <div className="file">
                                <i className="file-icon image-icon fas fa-chart-line"></i>
                                <span className="file-name">learning_curve.png</span>
                            </div>
                            <div className="file">
                                <i className="file-icon image-icon fas fa-chart-pie"></i>
                                <span className="file-name">confusion_matrix.png</span>
                            </div>
                            <div className="file">
                                <i className="file-icon python-icon fab fa-python"></i>
                                <span className="file-name">plot_utils.py</span>
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
                            <div className={`file ${isResumePage ? 'active' : ''} clickable-file`}>
                                <i className="file-icon pdf-icon fas fa-file-pdf"></i>
                                <span 
                                    className="file-name"
                                    onClick={() => nav('/resume')}
                                    style={{ cursor: 'pointer' }}
                                >
                                    Resume_Austin_Fairbanks.pdf
                                </span>
                            </div>
                            <div className="file">
                                <i className="file-icon image-icon fas fa-file-image"></i>
                                <span className="file-name">profile.jpg</span>
                            </div>
                            <div className="file">
                                <i className="file-icon image-icon fas fa-file-image"></i>
                                <span className="file-name">umass_logo.png</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Config Files */}
                <div className="file">
                    <i className="file-icon config-icon fas fa-cog"></i>
                    <span className="file-name">requirements.txt</span>
                </div>
                <div className="file">
                    <i className="file-icon config-icon fas fa-cog"></i>
                    <span className="file-name">.gitignore</span>
                </div>
                <div className="file">
                    <i className="file-icon config-icon fas fa-cog"></i>
                    <span className="file-name">environment.yml</span>
                </div>
            </div>
        </div>
    );
} 