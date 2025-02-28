import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import profilePic from '../../assets/ProfilePic.jpg';
import umassLogo from '../../assets/UmassLogo.png';
import { ProjectData } from '../../ProjectData';
import TheDefineHotline from "../../assets/TheDefineHotline.png";
import utrition from "../../assets/Utrition.png";
import hpoptimization from "../../assets/hpoptimization.png";
import './home.css';
import Sidebar from '../../component/Sidebar/Sidebar';
import ThemeContext from '../../ThemeContext';

const images = {
    The_Define_Hotline: TheDefineHotline,
    Utrition: utrition,
    Hyperparameter_Optimization_Framework_Evaluation_and_Manual: hpoptimization
}

export default function Home() {
    const nav = useNavigate();
    const [activeCell, setActiveCell] = useState(null);
    const [cellsExecuted, setCellsExecuted] = useState({
        intro: false,
        about: false,
        skills: false,
        projects: false,
        contact: false
    });
    const [isTyping, setIsTyping] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [darkMode, setDarkMode] = useState(true);
    const [expandedFolders, setExpandedFolders] = useState({
        portfolio: true,
        data: true,
        assets: false
    });
    const [isPaused, setIsPaused] = useState(false);
    const { darkMode: contextDarkMode } = useContext(ThemeContext);

    useEffect(() => {
        // Apply dark mode to body
        if (contextDarkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [contextDarkMode]);

    const runCell = (cellId) => {
        if (isPaused) return;
        
        // Reset this specific cell's output before running
        setCellsExecuted(prev => ({
            ...prev,
            [cellId]: false
        }));
        
        setActiveCell(cellId);
        setIsTyping(true);
        setTypingText('');
        
        // Simulate typing effect for code execution
        let text = '';
        const cellCode = getCellCode(cellId);
        let i = 0;
        
        const typingInterval = setInterval(() => {
            if (isPaused) {
                clearInterval(typingInterval);
                setIsTyping(false);
                return;
            }
            
            if (i < cellCode.length) {
                text += cellCode[i];
                setTypingText(text);
                i++;
            } else {
                clearInterval(typingInterval);
                setTimeout(() => {
                    if (!isPaused) {
                        setIsTyping(false);
                        setCellsExecuted(prev => ({
                            ...prev,
                            [cellId]: true
                        }));
                    }
                }, 500);
            }
        }, 10);
        
        window.currentTypingInterval = typingInterval;
    };

    const getCellCode = (cellId) => {
        switch(cellId) {
            case 'intro':
                return `# Load Austin's profile\nimport austin_fairbanks as af\n\n# Display introduction\naf.introduce()`;
            case 'about':
                return `# Get detailed information\naf.get_education()\naf.get_experience()`;
            case 'skills':
                return `# Analyze technical skills\nimport data_science as ds\n\naf.get_skills()\nds.visualize_skills(af.skills)`;
            case 'projects':
                return `# Load project portfolio\nprojects = af.get_projects()\n\n# Display only highlighted projects\nfor project in projects:\n    if project.highlight == True:\n        project.display()`;
            case 'contact':
                return `# Connect with Austin\ncontact_info = af.get_contact_info()\nprint(contact_info)`;
            default:
                return '';
        }
    };

    const toggleFolder = (folder) => {
        setExpandedFolders(prev => ({
            ...prev,
            [folder]: !prev[folder]
        }));
    };

    function openInNewTab(url) {
        window.open(url, '_blank').focus();
    }

    return (
        <div className={`notebook-container ${contextDarkMode ? 'dark-mode' : ''} ${isPaused ? 'paused' : ''}`}>
            {/* Sidebar */}
            <div className="sidebar">
                <Sidebar />
            </div>
            
            {/* Main Content */}
            <div className="main-content">
                <div className="notebook-header">
                    <div className="notebook-title">Portfolio.ipynb</div>
                    <div className="notebook-controls">
                        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                            {contextDarkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>
                
                <div className="notebook-toolbar">
                    <div className="toolbar-group">
                        <button className="toolbar-button" title="Code">
                            <i className="fas fa-code"></i> Code
                        </button>
                        <button className="toolbar-button" title="Markdown">
                            <i className="fas fa-font"></i> Markdown
                        </button>
                    </div>
                    
                    <div className="toolbar-divider"></div>
                    
                    <div className="toolbar-group">
                        <button className="toolbar-button run-all" title="Run All Cells" onClick={() => {
                            // Clear any existing timeouts to prevent conflicts
                            if (window.runAllTimeouts) {
                                window.runAllTimeouts.forEach(timeout => clearTimeout(timeout));
                            }
                            
                            // Reset all cells first
                            setCellsExecuted({
                                intro: false,
                                about: false,
                                skills: false,
                                projects: false,
                                contact: false
                            });
                            
                            // Reset pause state
                            setIsPaused(false);
                            
                            // Create an array to store all timeout IDs
                            window.runAllTimeouts = [];
                            
                            // Run cells in sequence with proper delays
                            const runSequence = async () => {
                                // Run intro cell
                                runCell('intro');
                                
                                // Wait for intro cell to complete before running about cell
                                const aboutTimeout = setTimeout(() => {
                                    if (!isTyping && !isPaused) {
                                        runCell('about');
                                    }
                                }, 2000);
                                window.runAllTimeouts.push(aboutTimeout);
                                
                                // Wait for about cell to complete before running skills cell
                                const skillsTimeout = setTimeout(() => {
                                    if (!isTyping && !isPaused) {
                                        runCell('skills');
                                    }
                                }, 4000);
                                window.runAllTimeouts.push(skillsTimeout);
                                
                                // Wait for skills cell to complete before running projects cell
                                const projectsTimeout = setTimeout(() => {
                                    if (!isTyping && !isPaused) {
                                        runCell('projects');
                                    }
                                }, 6000);
                                window.runAllTimeouts.push(projectsTimeout);
                                
                                // Wait for projects cell to complete before running contact cell
                                const contactTimeout = setTimeout(() => {
                                    if (!isTyping && !isPaused) {
                                        runCell('contact');
                                    }
                                }, 8000);
                                window.runAllTimeouts.push(contactTimeout);
                            };
                            
                            runSequence();
                        }}>
                            <i className="fas fa-play"></i> Run All
                        </button>
                        <button className="toolbar-button restart" title="Restart Kernel" onClick={() => {
                            // Refresh the entire page
                            window.location.reload();
                        }}>
                            <i className="fas fa-redo-alt"></i> Restart
                        </button>
                        <button 
                            className={`toolbar-button ${isPaused ? 'resume' : 'pause'}`} 
                            title={isPaused ? "Resume Execution" : "Pause Execution"} 
                            onClick={() => {
                                setIsPaused(!isPaused);
                                
                                if (!isPaused) {
                                    // Pausing execution
                                    // Clear current typing interval if exists
                                    if (window.currentTypingInterval) {
                                        clearInterval(window.currentTypingInterval);
                                    }
                                    
                                    // Clear any pending timeouts from Run All
                                    if (window.runAllTimeouts) {
                                        window.runAllTimeouts.forEach(timeout => clearTimeout(timeout));
                                    }
                                } else {
                                    // Resuming execution - we don't auto-resume, just allow new executions
                                    // This is simpler than trying to resume from the middle of a cell
                                }
                            }}
                        >
                            <i className={`fas ${isPaused ? 'fa-play' : 'fa-pause'}`}></i> {isPaused ? 'Resume' : 'Pause'}
                        </button>
                        <button className="toolbar-button clear" title="Clear All Outputs" onClick={() => {
                            setCellsExecuted({
                                intro: false,
                                about: false,
                                skills: false,
                                projects: false,
                                contact: false
                            });
                        }}>
                            <i className="fas fa-eraser"></i> Clear All Outputs
                        </button>
                    </div>
                    
                    <div className="toolbar-divider"></div>
                    
                    <div className="toolbar-group">
                        <button className="toolbar-button variables" title="Jupyter Variables">
                            <i className="fas fa-table"></i> Jupyter Variables
                        </button>
                    </div>
                    
                    <div className="toolbar-spacer"></div>
                    
                    <div className="toolbar-group">
                        <button className="toolbar-button outline" title="Outline">
                            <i className="fas fa-list"></i> Outline
                        </button>
                    </div>
                </div>
                
                <div className="notebook-content">
                    {/* Introduction Cell */}
                    <div className="notebook-cell">
                        <div className="cell-input">
                            <div className="input-prompt">In [1]:</div>
                            <div className="input-area">
                                <pre className="code-area">{getCellCode('intro')}</pre>
                            </div>
                            <button 
                                className={`run-button ${cellsExecuted.intro ? 'executed' : ''}`} 
                                onClick={() => runCell('intro')}
                            >
                                Run
                            </button>
                        </div>
                        
                        {(isTyping && activeCell === 'intro') && (
                            <div className="cell-executing">
                                <div className="typing-indicator">
                                    <pre>{typingText}</pre>
                                </div>
                            </div>
                        )}
                        
                        {cellsExecuted.intro && (
                            <div className="cell-output">
                                <div className="output-prompt">Out[1]:</div>
                                <div className="output-result intro-output">
                                    <div className="intro-container">
                                        <div className="intro-header">
                                            <h1>Austin Fairbanks</h1>
                                            <h2>Machine Learning Engineer & Data Scientist</h2>
                                        </div>
                                        <div className="intro-content">
                                            <div className="intro-text">
                                                <p className="intro-bio">
                                                    I'm a Computer Science student at UMass Amherst specializing in machine learning, 
                                                    hyperparameter optimization, and data analysis. My passion lies in developing 
                                                    efficient ML solutions and exploring cutting-edge AI technologies.
                                                </p>
                                                <div className="intro-highlights">
                                                    <div className="highlight-item">
                                                        <i className="fas fa-graduation-cap"></i>
                                                        <span>BS/MS in Computer Science at UMass Amherst</span>
                                                    </div>
                                                    <div className="highlight-item">
                                                        <i className="fas fa-code"></i>
                                                        <span>ML/AI Engineer with Python expertise</span>
                                                    </div>
                                                    <div className="highlight-item">
                                                        <i className="fas fa-chart-line"></i>
                                                        <span>Machine Learning & Data Science Specialist</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="intro-image">
                                                <img src={profilePic} alt="Austin Fairbanks" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* About Me Cell */}
                    <div className="notebook-cell">
                        <div className="cell-input">
                            <div className="input-prompt">In [2]:</div>
                            <div className="input-area">
                                <pre className="code-area">{getCellCode('about')}</pre>
                            </div>
                            <button 
                                className={`run-button ${cellsExecuted.about ? 'executed' : ''}`} 
                                onClick={() => runCell('about')}
                            >
                                Run
                            </button>
                        </div>
                        
                        {(isTyping && activeCell === 'about') && (
                            <div className="cell-executing">
                                <div className="typing-indicator">
                                    <pre>{typingText}</pre>
                                </div>
                            </div>
                        )}
                        
                        {cellsExecuted.about && (
                            <div className="cell-output">
                                <div className="output-prompt">Out[2]:</div>
                                <div className="output-result about-output">
                                    <div className="about-content">
                                        <div className="about-section">
                                            <h3>Education</h3>
                                            <div className="education-card">
                                                <img src={umassLogo} alt="UMass Logo" className="education-logo" />
                                                <div className="education-details">
                                                    <div className="education-header">
                                                        <h4>University of Massachusetts Amherst</h4>
                                                    </div>
                                                    <div className="education-degrees">
                                                        <div className="degree-item">
                                                            <p className="degree-title">BS in Computer Science</p>
                                                            <p className="degree-period">Sept 2023 – May 2026</p>
                                                        </div>
                                                        <div className="degree-item">
                                                            <p className="degree-title">MS in Computer Science (Focus in Data Science)</p>
                                                            <p className="degree-period">Sept 2026 – May 2027</p>
                                                        </div>
                                                    </div>
                                                    <div className="education-stats">
                                                        <span className="education-gpa">GPA: 4.0/4.0</span>
                                                    </div>
                                                    <div className="education-courses">
                                                        <p><strong>Key Coursework:</strong> Data Management, Machine Learning, Algorithms, Software Engineering</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="about-section">
                                            <h3>Experience & Publications</h3>
                                            <div className="experience-grid">
                                                <div className="experience-item">
                                                    <div className="experience-header">
                                                        <h4>Intern, Corning Incorporated</h4>
                                                        <span className="experience-period">Summer 2024</span>
                                                    </div>
                                                    <p className="experience-brief">Developed hyperparameter optimization guidelines and data preprocessing pipelines for computer vision applications</p>
                                                </div>
                                                
                                                <div className="experience-item">
                                                    <div className="experience-header">
                                                        <h4>Frontend Developer, MyEdMaster</h4>
                                                        <span className="experience-period">Dec 2024 – Jan 2025</span>
                                                    </div>
                                                    <p className="experience-brief">Redesigned React frontend for ML health analytics tool with Django backend and AWS infrastructure</p>
                                                </div>
                                                
                                                <div className="experience-item">
                                                    <div className="experience-header">
                                                        <h4>Hyperparameter Optimization Research</h4>
                                                        <span className="experience-period">Summer 2024</span>
                                                    </div>
                                                    <p className="experience-brief">Published guide on implementation of hyperparameter optimization frameworks (Keras Tuner, Optuna, Scikit-learn)</p>
                                                </div>
                                                
                                                <div className="experience-item">
                                                    <div className="experience-header">
                                                        <h4>Intramural Manager, UMass RecWell</h4>
                                                        <span className="experience-period">Aug 2024 – Present</span>
                                                    </div>
                                                    <p className="experience-brief">Facilitate intramural sports, train referees, and apply conflict resolution skills</p>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="about-section">
                                            <h3>Leadership & Activities</h3>
                                            <div className="activities-list">
                                                <div className="activity-item">
                                                    <span className="activity-name">Hack UMass XI MinuteMunch</span>
                                                    <span className="activity-date">Nov 2023</span>
                                                </div>
                                                <div className="activity-item">
                                                    <span className="activity-name">Midwest Blockchain Conference</span>
                                                    <span className="activity-date">Nov 2024</span>
                                                </div>
                                                <div className="activity-item">
                                                    <span className="activity-name">First Tech Challenge Robotics - Lead Programmer</span>
                                                    <span className="activity-date">2021-2023</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Skills Cell */}
                    <div className="notebook-cell">
                        <div className="cell-input">
                            <div className="input-prompt">In [3]:</div>
                            <div className="input-area">
                                <pre className="code-area">{getCellCode('skills')}</pre>
                            </div>
                            <button 
                                className={`run-button ${cellsExecuted.skills ? 'executed' : ''}`} 
                                onClick={() => runCell('skills')}
                            >
                                Run
                            </button>
                        </div>
                        
                        {(isTyping && activeCell === 'skills') && (
                            <div className="cell-executing">
                                <div className="typing-indicator">
                                    <pre>{typingText}</pre>
                                </div>
                            </div>
                        )}
                        
                        {cellsExecuted.skills && (
                            <div className="cell-output">
                                <div className="output-prompt">Out[3]:</div>
                                <div className="output-result skills-output">
                                    <div className="skills-container">
                                        <h3>Technical Skills</h3>
                                        
                                        <div className="skills-grid">
                                            <div className="skill-category-card">
                                                <div className="skill-category-header">
                                                    <i className="fas fa-code"></i>
                                                    <h4>Languages</h4>
                                                </div>
                                                <div className="skill-tags">
                                                    <span className="skill-tag advanced">Python</span>
                                                    <span className="skill-tag advanced">Java</span>
                                                    <span className="skill-tag intermediate">JavaScript/TypeScript</span>
                                                    <span className="skill-tag intermediate">SQL</span>
                                                    <span className="skill-tag intermediate">C</span>
                                                    <span className="skill-tag basic">HTML/CSS</span>
                                                </div>
                                            </div>
                                            
                                            <div className="skill-category-card">
                                                <div className="skill-category-header">
                                                    <i className="fas fa-cube"></i>
                                                    <h4>Libraries & Frameworks</h4>
                                                </div>
                                                <div className="skill-tags">
                                                    <span className="skill-tag advanced">Keras/TensorFlow</span>
                                                    <span className="skill-tag advanced">Scikit-Learn</span>
                                                    <span className="skill-tag advanced">NumPy/Pandas</span>
                                                    <span className="skill-tag intermediate">PyTorch</span>
                                                    <span className="skill-tag intermediate">React.js</span>
                                                    <span className="skill-tag intermediate">Node.js</span>
                                                    <span className="skill-tag intermediate">Matplotlib</span>
                                                </div>
                                            </div>
                                            
                                            <div className="skill-category-card">
                                                <div className="skill-category-header">
                                                    <i className="fas fa-tools"></i>
                                                    <h4>Tools & Platforms</h4>
                                                </div>
                                                <div className="skill-tags">
                                                    <span className="skill-tag advanced">Jupyter Notebook</span>
                                                    <span className="skill-tag advanced">Git/GitHub</span>
                                                    <span className="skill-tag intermediate">VS Code</span>
                                                    <span className="skill-tag intermediate">Kaggle</span>
                                                    <span className="skill-tag basic">AWS</span>
                                                    
                                                    
                                                    
                                                </div>
                                            </div>
                                            
                                            <div className="skill-category-card">
                                                <div className="skill-category-header">
                                                    <i className="fas fa-brain"></i>
                                                    <h4>Specialized Skills</h4>
                                                </div>
                                                <div className="skill-tags">
                                                    <span className="skill-tag advanced">Hyperparameter Tuning</span>
                                                    <span className="skill-tag advanced">Data Analysis</span>
                                                    <span className="skill-tag advanced">Machine Learning</span>
                                                    <span className="skill-tag intermediate">Scientific Writing</span>
                                                    <span className="skill-tag intermediate">Web Scraping</span>
                                                    <span className="skill-tag intermediate">LaTeX</span>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="skills-legend">
                                            <div className="legend-item">
                                                <span className="legend-marker advanced"></span>
                                                <span className="legend-text">Advanced</span>
                                            </div>
                                            <div className="legend-item">
                                                <span className="legend-marker intermediate"></span>
                                                <span className="legend-text">Intermediate</span>
                                            </div>
                                            <div className="legend-item">
                                                <span className="legend-marker basic"></span>
                                                <span className="legend-text">Basic</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Projects Cell */}
                    <div className="notebook-cell">
                        <div className="cell-input">
                            <div className="input-prompt">In [4]:</div>
                            <div className="input-area">
                                <pre className="code-area">{getCellCode('projects')}</pre>
                            </div>
                            <button 
                                className={`run-button ${cellsExecuted.projects ? 'executed' : ''}`} 
                                onClick={() => runCell('projects')}
                            >
                                Run
                            </button>
                        </div>
                        
                        {(isTyping && activeCell === 'projects') && (
                            <div className="cell-executing">
                                <div className="typing-indicator">
                                    <pre>{typingText}</pre>
                                </div>
                            </div>
                        )}
                        
                        {cellsExecuted.projects && (
                            <div className="cell-output">
                                <div className="output-prompt">Out[4]:</div>
                                <div className="output-result projects-output">
                                    <h3>Featured Projects</h3>
                                    <div className="projects-grid">
                                        {ProjectData.filter(project => project.highlight === true).map((project, index) => (
                                            <div className="project-card" key={index}>
                                                <div className="project-image">
                                                    <img 
                                                        src={
                                                            // Try to use the imported image first
                                                            project.id && images[project.id.replace(/-/g, '_')] 
                                                                ? images[project.id.replace(/-/g, '_')] 
                                                                : project.image 
                                                                    ? require(`../../assets/${project.image}`) 
                                                                    : hpoptimization // Final fallback
                                                        } 
                                                        alt={project.title} 
                                                    />
                                                </div>
                                                <div className="project-info">
                                                    <h4 className="project-title">{project.title}</h4>
                                                    <p className="project-description">
                                                        {project.description}
                                                    </p>
                                                    <div className="project-tech">
                                                        {project.technologies && project.technologies.map((tech, techIndex) => (
                                                            <span className="tech-tag" key={techIndex}>{tech}</span>
                                                        ))}
                                                    </div>
                                                    <div className="project-links">
                                                        <button 
                                                            className="project-btn details-btn"
                                                            onClick={() => nav(`/project/${project.id}`)}
                                                        >
                                                            View Details
                                                        </button>
                                                        {project.github && (
                                                            <button 
                                                                className="project-btn github-btn"
                                                                onClick={() => openInNewTab(project.github)}
                                                            >
                                                                GitHub
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="view-all">
                                        <button className="view-all-btn" onClick={() => nav('/projects')}>
                                            View All Projects
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Contact Cell */}
                    <div className="notebook-cell">
                        <div className="cell-input">
                            <div className="input-prompt">In [5]:</div>
                            <div className="input-area">
                                <pre className="code-area">{getCellCode('contact')}</pre>
                            </div>
                            <button 
                                className={`run-button ${cellsExecuted.contact ? 'executed' : ''}`} 
                                onClick={() => runCell('contact')}
                            >
                                Run
                            </button>
                        </div>
                        
                        {(isTyping && activeCell === 'contact') && (
                            <div className="cell-executing">
                                <div className="typing-indicator">
                                    <pre>{typingText}</pre>
                                </div>
                            </div>
                        )}
                        
                        {cellsExecuted.contact && (
                            <div className="cell-output">
                                <div className="output-prompt">Out[5]:</div>
                                <div className="output-result contact-output">
                                    <div className="contact-content">
                                        <h3>Get In Touch</h3>
                                        <div className="contact-info">
                                            <div className="contact-item">
                                                <i className="fas fa-envelope"></i>
                                                <span>ajfairbanks2005@gmail.com</span>
                                            </div>
                                            <div className="contact-item">
                                                <i className="fab fa-github"></i>
                                                <a href="https://github.com/megemann" target="_blank" rel="noopener noreferrer">
                                                    github.com/megemann
                                                </a>
                                            </div>
                                            <div className="contact-item">
                                                <i className="fab fa-linkedin"></i>
                                                <a href="https://www.linkedin.com/in/ajf2005" target="_blank" rel="noopener noreferrer">
                                                    linkedin.com/in/ajf2005
                                                </a>
                                            </div>
                                            <div className="contact-item">
                                                <i className="fab fa-kaggle"></i>
                                                <a href="https://www.kaggle.com/austinfairbanks" target="_blank" rel="noopener noreferrer">
                                                    kaggle.com/austinfairbanks
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="notebook-footer">
                    <div className="footer-content">
                        <p>© 2024 Austin Fairbanks. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
