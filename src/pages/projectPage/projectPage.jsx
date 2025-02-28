import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ProjectData } from '../../ProjectData';
import Sidebar from '../../component/Sidebar/Sidebar';
import ReactMarkdown from 'react-markdown';
import './projectPage.css';

export default function ProjectPage() {
    const { id } = useParams();
    const [darkMode, setDarkMode] = useState(true);
    const [isExecuted, setIsExecuted] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [readmeContent, setReadmeContent] = useState(null);
    
    const project = ProjectData.find(p => p.key === id);

    const fetchReadmeFromGitHub = async (githubUrl) => {
        try {
            const repoPath = githubUrl.split('github.com/')[1];
            const apiUrl = `https://api.github.com/repos/${repoPath}/contents/README.md`;

            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch README');
            }

            const content = await response.text();
            return content;

        } catch (error) {
            console.error('Error fetching README:', error);
            return 'Failed to load README content';
        }
    };

    const getProjectCode = () => {
        const isGithubLink = project?.link?.includes('github.com');
        
        return `from rich import print
from rich.markdown import Markdown
import requests

def fetch_project_info(project_id):
    """Fetches project information and README from GitHub"""
    print("[bold blue]Project Details:[/bold blue]\\n")
    print(f"[bold cyan]Title:[/bold cyan] ${project?.title}")
    print(f"[bold cyan]Created:[/bold cyan] ${project?.date}")
    print(f"[bold cyan]Last Updated:[/bold cyan] ${project?.lastUpdate || 'N/A'}")
    
    print("\\n[bold cyan]Technologies:[/bold cyan]")
    for tech in ${JSON.stringify(project?.skills || [])}: 
        print(f"  • {tech}")
    
    ${isGithubLink ? `
    # Fetch README from GitHub
    print("\\n[bold cyan]Fetching README from GitHub...[/bold cyan]")
    url = f"https://api.github.com/repos/${project.link.split('github.com/')[1]}/contents/README.md"
    response = requests.get(url, headers={'Accept': 'application/vnd.github.v3.raw'})
    
    if response.status_code == 200:
        print("\\n[bold green]README Content:[/bold green]")
        print(Markdown(response.text))
    else:
        print("[red]Failed to fetch README[/red]")` : ''}

if __name__ == "__main__":
    fetch_project_info("${project?.key}")`;
    };

    const runCode = async () => {
        setIsTyping(true);
        setTypingText('');
        
        // Only fetch README if it's a GitHub link
        if (project?.link?.includes('github.com')) {
            const content = await fetchReadmeFromGitHub(project.link);
            setReadmeContent(content);
        }
        
        let text = '';
        const output = getOutput();
        let i = 0;
        
        const typingInterval = setInterval(() => {
            if (i < output.length) {
                text += output[i];
                setTypingText(text);
                i++;
            } else {
                clearInterval(typingInterval);
                setIsTyping(false);
                setIsExecuted(true);
            }
        }, 10);
    };

    const getOutput = () => {
        const baseOutput = `Fetching project data for ID: ${project?.key}...

Project Details:

Title: ${project?.title}
Description: ${project?.description?.length > 150 ? project?.description?.slice(0, 150) + '...' : project?.description}
Created: ${project?.date}
Last Updated: ${project?.lastUpdate || 'N/A'}

Technologies:
${(project?.skills || []).map(skill => `  • ${skill}`).join('\n')}
${project?.link?.includes('github.com') ? `

Fetching README from GitHub...

README Content:` : ''}`;

        if (project?.link && readmeContent) {
            return (
                <div>
                    <pre>{baseOutput}</pre>
                    <div className="markdown-content">
                        <ReactMarkdown>{readmeContent}</ReactMarkdown>
                    </div>
                    <pre>[Database Query Completed - 0.023s]</pre>
                </div>
            );
        }

        return `${baseOutput}

[Database Query Completed - 0.023s]`;
    };

    return (
        <div className={`notebook-container ${darkMode ? 'dark-mode' : ''}`}>
            <div className="sidebar">
                <Sidebar/>
            </div>

            <div className="main-content">
                <div className="notebook-header">
                    <div className="notebook-title">{project?.title || 'project'}.py</div>
                    <div className="notebook-controls">
                        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>

                <div className="python-content">
                    <div className="code-section">
                        <pre className="code-area python">{getProjectCode()}</pre>
                        <button 
                            className={`run-button ${isExecuted ? 'executed' : ''}`}
                            onClick={runCode}
                        >
                            Run Python File
                        </button>
                    </div>
                    
                    {(isTyping || isExecuted) && (
                        <div className="output-section">
                            <div className="output-header">Output:</div>
                            <pre className="output-content">
                                {isTyping ? typingText : getOutput()}
                            </pre>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}