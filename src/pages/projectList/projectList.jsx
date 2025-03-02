import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectData } from '../../ProjectData';
import './projectList.css';
import Sidebar from '../../component/Sidebar/Sidebar';
import ThemeContext from '../../ThemeContext';

export default function ProjectList() {
    const nav = useNavigate();
    const [hoveredLine, setHoveredLine] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { darkMode, setDarkMode, isMobile } = useContext(ThemeContext);

    // Helper function for formatting JSON values with syntax highlighting
    const formatValue = (value, type) => {
        switch (type) {
            case 'property':
                return `<span class="property">${value}</span>`;
            case 'string':
                return `<span class="string">"${value.replace(/"/g, '')}"</span>`;
            case 'punctuation':
                return `<span class="punctuation">${value}</span>`;
            case 'bracket':
                return `<span class="bracket">${value}</span>`;
            case 'brace':
                return `<span class="brace">${value}</span>`;
            case 'boolean':
                return `<span class="boolean">${value}</span>`;
            case 'number':
                return `<span class="number">${value}</span>`;
            default:
                return value;
        }
    };

    // Get unique categories
    const categories = ['All', ...new Set(ProjectData.filter(p => p.category).map(p => p.category))];

    // Filter projects by category
    const filteredProjects = selectedCategory && selectedCategory !== 'All'
        ? ProjectData.filter(project => project.category === selectedCategory)
        : ProjectData;

    // Format the project data into a pretty JSON string with syntax highlighting
    const formatProjectData = (project) => {
        const skills = (project.skills || [])
            .map(tech => formatValue(`"${tech}"`, 'string'))
            .join(', ');

        // Truncate description to 80 characters and add ellipsis if needed
        const description = (project.description || 'No description available')
            .slice(0, 80) + (project.description?.length > 80 ? '...' : '');

        return `    ${formatValue("{", "brace")}
      ${formatValue('"title"', 'property')}${formatValue(":", "punctuation")} ${formatValue(project.title || 'Untitled', 'string')}${formatValue(",", "punctuation")}
      ${formatValue('"description"', 'property')}${formatValue(":", "punctuation")} ${formatValue(description, 'string')}${formatValue(",", "punctuation")}
      ${formatValue('"date"', 'property')}${formatValue(":", "punctuation")} ${formatValue(project.date || 'Unknown', 'string')}${formatValue(",", "punctuation")}
      ${formatValue('"category"', 'property')}${formatValue(":", "punctuation")} ${formatValue(project.category || 'Uncategorized', 'string')}${formatValue(",", "punctuation")}
      ${formatValue('"skills"', 'property')}${formatValue(":", "punctuation")} ${formatValue("[", "bracket")}${skills}${formatValue("]", "bracket")}
    ${formatValue("}", "brace")}`;
    };

    const handleProjectClick = (key) => {
        nav(`/project/${key}`);
    };

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
                    <div className="notebook-title">projects.json</div>
                    <div className="notebook-controls">
                        <div className="filter-controls">
                            <div className="filter-label">Filter by category:</div>
                            <div className="category-filters">
                                <button 
                                    className={`category-button ${selectedCategory === null ? 'active' : ''}`}
                                    onClick={() => setSelectedCategory(null)}
                                >
                                    All
                                </button>
                                {categories.map(category => (
                                    <button 
                                        key={category}
                                        className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                                        onClick={() => setSelectedCategory(category === selectedCategory ? null : category)}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>

                <div className="json-content">
                    <pre className="json-line" dangerouslySetInnerHTML={{ 
                        __html: `${formatValue("{", "brace")}`
                    }} />
                    <pre className="json-line" dangerouslySetInnerHTML={{ 
                        __html: `  ${formatValue('"projects"', 'property')}${formatValue(":", "punctuation")} ${formatValue("[", "bracket")}`
                    }} />
                    {filteredProjects.map((project, index) => (
                        <div 
                            key={project.key || index}
                            className={`json-project ${hoveredLine === index ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredLine(index)}
                            onMouseLeave={() => setHoveredLine(null)}
                            onClick={() => handleProjectClick(project.key)}
                        >
                            <pre 
                                className="json-line project-content"
                                dangerouslySetInnerHTML={{ 
                                    __html: `${formatProjectData(project)}${index < filteredProjects.length - 1 ? formatValue(',', 'punctuation') : ''}`
                                }}
                            />
                            {hoveredLine === index && (
                                <div className="project-actions">
                                    <button className="view-project-btn">
                                        View Project <i className="fas fa-arrow-right"></i>
                                    </button>
                                    {project.link && (
                                        <a 
                                            href={project.link}
                                            className="source-link"
                                            onClick={(e) => e.stopPropagation()}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            Source <i className="fas fa-external-link-alt"></i>
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                    <pre className="json-line" dangerouslySetInnerHTML={{ 
                        __html: `  ${formatValue("]", "bracket")}`
                    }} />
                    <pre className="json-line" dangerouslySetInnerHTML={{ 
                        __html: formatValue("}", "brace")
                    }} />
                </div>
            </div>
        </div>
    );
}