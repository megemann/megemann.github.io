import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectData } from '../../ProjectData';
import './projectList.css';
import Sidebar from '../../component/Sidebar/Sidebar';

export default function ProjectList() {
    const nav = useNavigate();
    const [hoveredLine, setHoveredLine] = useState(null);
    const [darkMode, setDarkMode] = useState(true);

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
            default:
                return value;
        }
    };

    // Format the project data into a pretty JSON string with syntax highlighting
    const formatProjectData = (project) => {
        const skills = (project.skills || [])
            .map(tech => formatValue(`"${tech}"`, 'string'))
            .join(', ');

        // Truncate description to 80 characters and add ellipsis if needed
        const description = (project.description || 'No description available')
            .slice(0, 80) + (project.description.length > 80 ? '...' : '');

        return `    ${formatValue("{", "brace")}
          ${formatValue('"title"', 'property')}${formatValue(":", "punctuation")} ${formatValue(project.title || 'Untitled', 'string')}${formatValue(",", "punctuation")}
          ${formatValue('"description"', 'property')}${formatValue(":", "punctuation")} ${formatValue(description, 'string')}${formatValue(",", "punctuation")}
          ${formatValue('"skills"', 'property')}${formatValue(":", "punctuation")} ${formatValue("[", "bracket")}${skills}${formatValue("]", "bracket")}
    ${formatValue("}", "brace")}`;
    };

    const handleProjectClick = (key) => {
        nav(`/project/${key}`);  // Updated from /projectpage/ to /project/
    };

    return (
        <div className={`notebook-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="sidebar">
                <Sidebar/>
            </div>

            <div className="main-content">
                <div className="notebook-header">
                    <div className="notebook-title">projects.json</div>
                    <div className="notebook-controls">
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
                    {ProjectData.map((project, index) => (
                        <div 
                            key={project.id || index}
                            className={`json-project ${hoveredLine === index ? 'hovered' : ''}`}
                            onMouseEnter={() => setHoveredLine(index)}
                            onMouseLeave={() => setHoveredLine(null)}
                            onClick={() => handleProjectClick(project.key)}
                        >
                            <pre 
                                className="json-line project-content"
                                dangerouslySetInnerHTML={{ 
                                    __html: `${formatProjectData(project)}${index < ProjectData.length - 1 ? formatValue(',', 'punctuation') : ''}`
                                }}
                            />
                            {hoveredLine === index && (
                                <button className="view-project-btn">
                                    View Project <i className="fas fa-arrow-right"></i>
                                </button>
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