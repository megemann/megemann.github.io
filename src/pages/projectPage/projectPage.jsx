import React, { useState, useContext, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectData } from '../../ProjectData';
import Sidebar from '../../component/Sidebar/Sidebar';
import ReactMarkdown from 'react-markdown';
import './projectPage.css';
import ThemeContext from '../../ThemeContext';

// Custom Python syntax highlighter component
const PythonHighlighter = ({ code }) => {
  // Split the code into lines
  const lines = code.split('\n');
  
  // Process each line to add syntax highlighting
  const processedLines = lines.map((line, index) => {
    // Create a simple text representation for each line
    return (
      <div key={index} className="code-line">
        <span className="line-number">{index + 1}</span>
        <LineContent content={line} />
      </div>
    );
  });
  
  return <div className="python-code">{processedLines}</div>;
};

// Component to handle individual line content with syntax highlighting
const LineContent = ({ content }) => {
  // Split the line into tokens for syntax highlighting
  const tokens = [];
  let currentIndex = 0;
  let tokenId = 0;
  
  // Check for keywords
  const keywords = ['import', 'from', 'def', 'if', 'else', 'for', 'in', 'return', 'class', 'and', 'or', 'not', 'True', 'False', 'None', '__name__', '__main__'];
  
  // Process the line character by character
  while (currentIndex < content.length) {
    // Check for keywords
    let foundKeyword = false;
    for (const keyword of keywords) {
      const regex = new RegExp(`^\\b${keyword}\\b`);
      const match = content.slice(currentIndex).match(regex);
      if (match) {
        // Add any text before the keyword
        if (match.index > 0) {
          tokens.push({
            type: 'text',
            content: content.slice(currentIndex, currentIndex + match.index),
            id: tokenId++
          });
        }
        
        // Add the keyword
        tokens.push({
          type: 'keyword',
          content: keyword,
          id: tokenId++
        });
        
        currentIndex += match.index + keyword.length;
        foundKeyword = true;
        break;
      }
    }
    
    if (foundKeyword) continue;
    
    // Check for strings
    const stringRegex = /^(".*?"|'.*?')/;
    const stringMatch = content.slice(currentIndex).match(stringRegex);
    if (stringMatch) {
      tokens.push({
        type: 'string',
        content: stringMatch[0],
        id: tokenId++
      });
      currentIndex += stringMatch[0].length;
      continue;
    }
    
    // Check for comments
    if (content[currentIndex] === '#') {
      tokens.push({
        type: 'comment',
        content: content.slice(currentIndex),
        id: tokenId++
      });
      break; // Comment goes to the end of the line
    }
    
    // Check for function calls
    const funcRegex = /^([a-zA-Z_][a-zA-Z0-9_]*)\(/;
    const funcMatch = content.slice(currentIndex).match(funcRegex);
    if (funcMatch) {
      tokens.push({
        type: 'function',
        content: funcMatch[1],
        id: tokenId++
      });
      currentIndex += funcMatch[1].length;
      tokens.push({
        type: 'text',
        content: '(',
        id: tokenId++
      });
      currentIndex += 1;
      continue;
    }
    
    // Check for numbers
    const numRegex = /^(\d+(\.\d+)?)/;
    const numMatch = content.slice(currentIndex).match(numRegex);
    if (numMatch) {
      tokens.push({
        type: 'number',
        content: numMatch[0],
        id: tokenId++
      });
      currentIndex += numMatch[0].length;
      continue;
    }
    
    // Default: add as plain text
    tokens.push({
      type: 'text',
      content: content[currentIndex],
      id: tokenId++
    });
    currentIndex++;
  }
  
  // Render the tokens with appropriate styling
  return (
    <span>
      {tokens.map(token => {
        switch (token.type) {
          case 'keyword':
            return <span key={token.id} className="py-keyword">{token.content}</span>;
          case 'string':
            return <span key={token.id} className="py-string">{token.content}</span>;
          case 'comment':
            return <span key={token.id} className="py-comment">{token.content}</span>;
          case 'function':
            return <span key={token.id} className="py-function">{token.content}</span>;
          case 'number':
            return <span key={token.id} className="py-number">{token.content}</span>;
          default:
            return <span key={token.id}>{token.content}</span>;
        }
      })}
    </span>
  );
};

// Rich text formatter component for the output
const RichTextOutput = ({ text, readmeContent }) => {
  const [viewMode, setViewMode] = useState('preview'); // 'preview' or 'raw'
  
  // Process Rich text formatting
  const processRichText = (text) => {
    if (!text) return '';
    
    // Replace newlines with <br> tags
    let formattedText = text.replace(/\\n/g, '<br>');
    
    // Process Rich text color tags
    formattedText = formattedText.replace(/\[bold blue\](.*?)\[\/bold blue\]/g, '<span class="rich-blue bold">$1</span>');
    formattedText = formattedText.replace(/\[bold cyan\](.*?)\[\/bold cyan\]/g, '<span class="rich-cyan bold">$1</span>');
    formattedText = formattedText.replace(/\[bold green\](.*?)\[\/bold green\]/g, '<span class="rich-green bold">$1</span>');
    formattedText = formattedText.replace(/\[red\](.*?)\[\/red\]/g, '<span class="rich-red">$1</span>');
    
    // Remove the README content section entirely if we have actual README content
    if (readmeContent) {
      formattedText = formattedText.replace(/<span class="rich-green bold">README Content:<\/span>.*$/s, '');
    }
    
    return formattedText;
  };
  
  const toggleViewMode = () => {
    setViewMode(viewMode === 'preview' ? 'raw' : 'preview');
  };
  
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: processRichText(text) }} />
      
      {/* Render README with ReactMarkdown if available */}
      {readmeContent && (
        <div className="readme-container">
          <div className="readme-header">
            <div className="readme-title-section">
              <span className="readme-icon">📄</span>
              <span className="readme-title">README.md</span>
            </div>
            <div className="readme-controls">
              <button 
                className={`view-toggle ${viewMode === 'raw' ? 'active' : ''}`} 
                onClick={toggleViewMode}
              >
                {viewMode === 'preview' ? 'Raw' : 'Preview'}
              </button>
            </div>
          </div>
          <div className="readme-content">
            {viewMode === 'preview' ? (
              <div className="markdown-body">
                <ReactMarkdown>{readmeContent}</ReactMarkdown>
              </div>
            ) : (
              <pre className="raw-markdown">{readmeContent}</pre>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default function ProjectPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { darkMode, setDarkMode, isMobile } = useContext(ThemeContext);
    const [isExecuted, setIsExecuted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [readmeContent, setReadmeContent] = useState(null);
    const contentRef = useRef(null);
    
    const project = ProjectData.find(p => p.key === id);

    // Auto-scroll to bottom when typing
    useEffect(() => {
        if (isTyping && contentRef.current) {
            contentRef.current.scrollTop = contentRef.current.scrollHeight;
        }
    }, [isTyping, typingText]);

    // Redirect if project not found
    useEffect(() => {
        if (!project && ProjectData.length > 0) {
            navigate('/projects', { replace: true });
        }
    }, [project, navigate]);
    
    if (!project) {
        return (
            <div className="project-not-found">
                <h2>Project Not Found</h2>
                <p>The project you're looking for doesn't exist.</p>
                <button onClick={() => navigate('/projects')}>
                    View All Projects
                </button>
            </div>
        );
    }

    const fetchReadmeFromGitHub = async (githubUrl) => {
        try {
            // Extract owner and repo from GitHub URL
            const match = githubUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
            if (!match) return null;
            
            const [, owner, repo] = match;
            const apiUrl = `https://api.github.com/repos/${owner}/${repo}/readme`;
            
            const response = await fetch(apiUrl, {
                headers: {
                    'Accept': 'application/vnd.github.v3.raw'
                }
            });
            
            if (!response.ok) return null;
            return await response.text();
        } catch (error) {
            console.error("Error fetching README:", error);
            return null;
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
    print(f"[bold cyan]Title:[/bold cyan] {project?.title}")
    print(f"[bold cyan]Created:[/bold cyan] {project?.date}")
    print(f"[bold cyan]Last Updated:[/bold cyan] {project?.lastUpdate || 'N/A'}")
    print(f"[bold cyan]Status:[/bold cyan] {project?.status || 'Completed'}")
    
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
        setIsLoading(true);
        
        // Only fetch README if it's a GitHub link
        if (project?.link?.includes('github.com')) {
            try {
                const content = await fetchReadmeFromGitHub(project.link);
                setReadmeContent(content);
            } catch (error) {
                console.error("Error fetching README:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setIsLoading(false);
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
        if (!project) return '';
        
        return `[bold blue]Project Details:[/bold blue]\n
[bold cyan]Title:[/bold cyan] ${project.title}
[bold cyan]Created:[/bold cyan] ${project.date}
[bold cyan]Last Updated:[/bold cyan] ${project.lastUpdate || project.date}
[bold cyan]Status:[/bold cyan] ${project.status || 'Completed'}

[bold cyan]Technologies:[/bold cyan]
${project.skills?.map(tech => `  • ${tech}`).join('\n') || ''}

[bold cyan]Fetching README from GitHub...[/bold cyan]

[bold green]README Content:[/bold green]
${readmeContent || '[red]Failed to fetch README[/red]'}`;
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
                    <div className="notebook-title">{project?.title || 'project'}.py</div>
                    <div className="notebook-controls">
                        {project?.link && (
                            <a 
                                href={project.link} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="source-link"
                            >
                                View Source
                            </a>
                        )}
                        {project?.demoLink && (
                            <a 
                                href={project.demoLink} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="demo-link"
                            >
                                Live Demo
                            </a>
                        )}
                        <button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
                            {darkMode ? 'Light Mode' : 'Dark Mode'}
                        </button>
                    </div>
                </div>

                <div className="python-content-wrapper">
                    <div className="python-content" ref={contentRef}>
                        <div className="code-section">
                            <PythonHighlighter code={getProjectCode()} />
                            <button 
                                className={`run-button ${isExecuted ? 'executed' : ''}`}
                                onClick={runCode}
                            >
                                Run
                            </button>
                        </div>
                        
                        {isLoading && (
                            <div className="loading-indicator">
                                <div className="spinner"></div>
                                <p>Fetching project data...</p>
                            </div>
                        )}
                        
                        {(isTyping || isExecuted) && (
                            <div className="output-section">
                                <div className="output-header">Output:</div>
                                <div className="output-content">
                                    {isTyping ? 
                                        <RichTextOutput text={typingText} /> : 
                                        <RichTextOutput text={getOutput()} readmeContent={readmeContent} />
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}