import React, { useState, useEffect, useContext } from 'react';
import { ProjectData } from '../../ProjectData';
import events from '../../events.json';
import './Timeline.css';
import ThemeContext from '../../ThemeContext';
import { parseDate } from '../../utils/dateUtils';

const Timeline = () => {
    const { darkMode } = useContext(ThemeContext);
    const [timelineItems, setTimelineItems] = useState([]);
    const [filter, setFilter] = useState('all');
    const [currentDate] = useState(new Date());

    useEffect(() => {
        // Process project data for timeline
        const projectEvents = ProjectData.map(project => {
            const projectDate = parseDate(project.date);
            return {
                title: project.title,
                date: project.date,
                description: project.description.split('.')[0] + '.',  // Just take the first sentence
                type: 'project',
                icon: 'code',
                projectKey: project.key,
                link: project.link,
                isFuture: projectDate > currentDate
            };
        });

        // Combine projects and events
        const allEvents = [...projectEvents, ...events];
        
        // Sort by date (newest first)
        const sortedEvents = allEvents.sort((a, b) => {
            const dateA = parseDate(a.date);
            const dateB = parseDate(b.date);
            return dateB - dateA;
        });

        setTimelineItems(sortedEvents);
    }, [currentDate]);

    const filterTimelineItems = (type) => {
        setFilter(type);
    };

    const filteredItems = filter === 'all' 
        ? timelineItems 
        : timelineItems.filter(item => item.type === filter);

    return (
        <div className={`timeline-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="timeline-header">
                <h1>Journey Timeline</h1>
                <p>A timeline of my academic, professional, and project milestones</p>
                
                <div className="timeline-filters">
                    <button 
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => filterTimelineItems('all')}
                    >
                        All
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'project' ? 'active' : ''}`}
                        onClick={() => filterTimelineItems('project')}
                    >
                        Projects
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'work' ? 'active' : ''}`}
                        onClick={() => filterTimelineItems('work')}
                    >
                        Work
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'education' ? 'active' : ''}`}
                        onClick={() => filterTimelineItems('education')}
                    >
                        Education
                    </button>
                    <button 
                        className={`filter-btn ${filter === 'event' ? 'active' : ''}`}
                        onClick={() => filterTimelineItems('event')}
                    >
                        Events
                    </button>
                </div>
            </div>

            <div className="timeline">
                {filteredItems.map((item, index) => (
                    <div 
                        key={index} 
                        className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'} ${item.type} ${item.isFuture ? 'future' : ''}`}
                    >
                        <div className="timeline-content">
                            {item.isFuture && (
                                <div className="future-badge">
                                    <i className="fas fa-hourglass-half"></i> Upcoming
                                </div>
                            )}
                            <div className="timeline-icon">
                                <i className={`fas fa-${item.icon}`}></i>
                            </div>
                            <div className="timeline-date">{item.date}</div>
                            <h3 className="timeline-title">{item.title}</h3>
                            <p className="timeline-description">{item.description}</p>
                            {item.link && (
                                <a 
                                    href={item.link} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="timeline-link"
                                >
                                    View {item.type === 'project' ? 'Project' : item.type === 'event' ? 'Event' : 'Details'} <i className="fas fa-external-link-alt"></i>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
                <div className="timeline-line"></div>
            </div>
        </div>
    );
};

export default Timeline; 