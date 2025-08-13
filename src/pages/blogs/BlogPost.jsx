import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Sidebar from '../../component/Sidebar/Sidebar';
import ViewCounter from '../../component/ViewCounter/ViewCounter';
import ThemeToggle from '../../component/ThemeToggle/ThemeToggle';
import useReadingProgress from '../../hooks/useReadingProgress';
import ThemeContext from '../../ThemeContext';
import { logPageView, logEvent, logBlogAnalytics, logScrollDepth, logEngagement } from '../../analytics';
import './BlogPost.css';
import 'katex/dist/katex.min.css';

// Map of blog slugs to their file paths
const BLOG_MAP = {
  'oneprompted': '/blogs/OnePrompted.md',
  'torchvskerasv1': '/blogs/TorchvsKerasv1.md',
  'PlvsPd': '/blogs/PlvsPd.md',
  'welcome-to-my-blog': '/blogs/welcome-to-my-blog.md',
  'hyperband': '/blogs/Hyperband.md',
  'machine-learning-beginners': '/blogs/machine-learning-beginners.md',
  'future-web-development': '/blogs/future-web-development.md'
};

export default function BlogPost() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { darkMode, isMobile } = useContext(ThemeContext);
  const [markdown, setMarkdown] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [blogTitle, setBlogTitle] = useState('');
  const [blogData, setBlogData] = useState(null);
  const [canShare, setCanShare] = useState(false);
  const mainContentRef = useRef(null);
  const commentsRef = useRef(null);
  
  // Check if Web Share API is available
  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);
  
  // Find blog data from slug for analytics
  useEffect(() => {
    // This assumes you've imported your blogs array or have access to it
    // Alternatively, you could pass this data via route state or context
    const findBlogBySlug = () => {
      // Find matching blog from available blogs
      const blog = window.blogsList?.find(b => b.slug === slug);
      if (blog) {
        setBlogData(blog);
        // Track blog view with detailed data
        logBlogAnalytics(blog, 'View', { 
          view_type: 'page_load',
          referrer: document.referrer || 'direct'
        });
      }
    };
    
    findBlogBySlug();
  }, [slug]);
  
  // Scroll to top when switching blog posts
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [slug]);
  
  // Fix body scrolling
  useEffect(() => {
    // Disable body scrolling when blog post is mounted
    document.body.style.overflow = 'hidden';
    
    // Re-enable body scrolling when component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    // Log page view for analytics with custom dimensions
    logPageView({
      content_type: 'blog',
      blog_slug: slug,
      blog_title: blogTitle || 'Unknown Blog'
    });
    
    // Basic event for backward compatibility
    logEvent('Blog', 'View', slug);
    
    // Apply dark mode to body
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }

    // Load the blog content from markdown file
    const fetchBlogContent = async () => {
      try {
        if (!BLOG_MAP[slug]) {
          throw new Error('Blog post not found');
        }

        // Use the public URL path instead of direct source path
        const response = await fetch(`/content${BLOG_MAP[slug]}`);
        if (!response.ok) {
          throw new Error(`Failed to load blog content: ${response.status}`);
        }

        const content = await response.text();
        
        // Extract title from the markdown (first h1)
        const titleMatch = content.match(/^# (.*$)/m);
        if (titleMatch && titleMatch[1]) {
          const title = titleMatch[1];
          setBlogTitle(title);
          document.title = `${title} | Austin Fairbanks`;
          
          // Track blog view completion after content loads
          if (blogData) {
            logBlogAnalytics({...blogData, title}, 'Content Loaded', {
              content_length: content.length,
              estimated_read_time: Math.ceil(content.length / 1000)
            });
          }
        }
        
        setMarkdown(content);
        setLoading(false);
        
        // Trigger view counter after content is loaded
        setTimeout(() => {
          if (window[`triggerViewCounter_${slug}`]) {
            window[`triggerViewCounter_${slug}`]();
          }
        }, 500);
        
        // Ensure content is visible
        setTimeout(() => {
          if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0;
          }
        }, 100);
        
        // Setup scroll tracking
        const cleanupScrollTracking = setupScrollTracking();
        
        // Return cleanup function
        return () => {
          if (cleanupScrollTracking) {
            cleanupScrollTracking();
          }
        };
        
      } catch (error) {
        console.error('Error loading blog post:', error);
        setError(error.message);
        setLoading(false);
        
        // Track error for analytics
        logEvent('Blog', 'Error', `${slug}: ${error.message}`);
        
        return undefined;
      }
    };

    // Execute content loading and store cleanup function
    // eslint-disable-next-line no-unused-vars
    const contentLoadingCleanup = fetchBlogContent();
    
    // Clean up on unmount
    return () => {
      document.title = 'Austin Fairbanks | Portfolio';
      // Cleanup from content loading is handled in fetchBlogContent
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, darkMode, blogData]);
  
  // Add scroll depth tracking
  const setupScrollTracking = React.useCallback(() => {
    if (!mainContentRef.current) return undefined;
    
    let lastScrollDepth = 0;
    const scrollThresholds = [25, 50, 75, 90, 100];
    
    const handleScroll = () => {
      if (!mainContentRef.current) return;
      
      const contentHeight = mainContentRef.current.scrollHeight - mainContentRef.current.clientHeight;
      const scrollPosition = mainContentRef.current.scrollTop;
      const scrollPercentage = Math.min(100, Math.floor((scrollPosition / contentHeight) * 100));
      
      // Find the highest threshold passed
      const passedThresholds = scrollThresholds.filter(threshold => 
        scrollPercentage >= threshold && lastScrollDepth < threshold
      );
      
      // Log each passed threshold
      if (passedThresholds.length > 0) {
        const maxPassedThreshold = Math.max(...passedThresholds);
        lastScrollDepth = maxPassedThreshold;
        
        // Log the scroll depth
        const blogInfo = blogData || { slug, title: blogTitle || 'Unknown Blog' };
        logScrollDepth(maxPassedThreshold, blogInfo);
        
        // Track engagement milestone
        if (maxPassedThreshold >= 75) {
          logEngagement('Deep Read', slug, {
            blog_title: blogTitle,
            scroll_depth: maxPassedThreshold
          });
        }
      }
    };
    
    mainContentRef.current.addEventListener('scroll', handleScroll);
    
    // Return cleanup function
    return () => {
      if (mainContentRef.current) {
        mainContentRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, [blogData, blogTitle, slug]);

  const handleBack = () => {
    // Track exit point
    if (blogData) {
      logBlogAnalytics(blogData, 'Exit', {
        exit_type: 'back_button',
        time_spent: Math.round((new Date() - new Date(performance.timeOrigin)) / 1000)
      });
    }
    
    nav('/blogs');
  };

  // Handle image loading with better UX
  const handleImageLoad = (e) => {
    e.target.style.opacity = 1;
  };
  
  // Add reading progress tracking
  const { progress } = useReadingProgress({
    slug,
    onProgress: (progressValue) => {
      // Optionally log progress milestones (25%, 50%, 75%)
      if (progressValue === 25 || progressValue === 50 || progressValue === 75) {
        logEvent('Blog', 'Reading Progress', `${slug}: ${progressValue}%`);
      }
    },
    onComplete: ({ timeSpentInSeconds }) => {
      // Log completion analytics
      logEvent('Blog', 'Reading Complete', slug);
      logEvent('Blog', 'Reading Time', `${slug}: ${timeSpentInSeconds}s`);
      
      // Store completion in localStorage
      const completedPosts = JSON.parse(localStorage.getItem('completedPosts') || '{}');
      completedPosts[slug] = {
        completedAt: new Date().toISOString(),
        timeSpent: timeSpentInSeconds
      };
      localStorage.setItem('completedPosts', JSON.stringify(completedPosts));
    }
  });
  
  // Add progress bar element
  const renderProgressBar = () => (
    <div className="reading-progress-container">
      <div 
        className="reading-progress-bar" 
        style={{ width: `${progress}%` }}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-valuenow={progress}
        role="progressbar"
      />
    </div>
  );
  
  // Layout with proper reference for scrolling
  const renderLayout = (content) => (
    <div className={`blog-post-container ${darkMode ? 'dark-mode' : ''}`}>
      {renderProgressBar()}
      {!isMobile && (
        <div className={`sidebar ${darkMode ? 'dark-mode' : ''}`}>
          <Sidebar />
        </div>
      )}
      <div className={`main-content ${darkMode ? 'dark-mode' : ''}`} style={isMobile ? { marginLeft: 0 } : {}} ref={mainContentRef}>
        <div className="blog-post-header">
          <button onClick={handleBack} className="back-button">
            ← Back to Blogs
          </button>
          <ThemeToggle />
        </div>
        {content}
      </div>
    </div>
  );

  // Enhanced share functionality with Web Share API support and clipboard fallback
  const handleShare = (platform) => {
    // Track share attempt
    logEvent('Blog', 'Share', platform, {
      blog_slug: slug,
      blog_title: blogTitle
    });
    
    const pageUrl = window.location.href;
    const shareTitle = `${blogTitle} | Austin Fairbanks`;
    const shareText = blogData?.description || `Check out this blog post about ${blogTitle}`;
    
    // Try to use Web Share API if available and requesting native sharing
    if (platform === 'native' && canShare) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: pageUrl
      })
      .then(() => {
        logEvent('Blog', 'Share Success', 'Web Share API', {
          blog_slug: slug
        });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        logEvent('Blog', 'Share Error', 'Web Share API', {
          error: error.message
        });
        
        // Fallback to copy link
        handleCopyLink();
      });
      return;
    }
    
    // Handle copy link platform option
    if (platform === 'copy') {
      handleCopyLink();
      return;
    }
    
    // Fallback to platform-specific sharing
    let shareUrl;
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(pageUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareTitle)}`;
        break;
      default:
        return;
    }
    
    // Open share dialog in popup
    const windowFeatures = 'width=600,height=400,resizable=yes,scrollbars=yes,status=yes';
    try {
      const popup = window.open(shareUrl, 'share', windowFeatures);
      if (popup) {
        logEvent('Blog', 'Share Popup Opened', platform);
      } else {
        // If popup blocked, open in new tab
        window.open(shareUrl, '_blank');
        logEvent('Blog', 'Share New Tab', platform);
      }
    } catch (error) {
      console.error('Error opening share window:', error);
      // Fallback to opening in current tab
      window.location.href = shareUrl;
    }
  };
  
  // Helper function to copy link to clipboard
  const handleCopyLink = () => {
    const pageUrl = window.location.href;
    
    try {
      // Try to use the modern clipboard API
      navigator.clipboard.writeText(pageUrl)
        .then(() => {
          alert('Link copied to clipboard!');
          logEvent('Blog', 'Share Success', 'Copy Link', {
            blog_slug: slug
          });
        })
        .catch((err) => {
          console.error('Failed to copy link:', err);
          fallbackCopyTextToClipboard(pageUrl);
        });
    } catch (error) {
      // Fallback for browsers without clipboard API
      fallbackCopyTextToClipboard(pageUrl);
    }
  };
  
  // Fallback method for copying to clipboard
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";  // Avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('Link copied to clipboard!');
        logEvent('Blog', 'Share Success', 'Copy Link Fallback', {
          blog_slug: slug
        });
      } else {
        throw new Error('Copy command was unsuccessful');
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Last resort: show the URL to the user
      alert('Could not copy automatically. The link is: ' + text);
      logEvent('Blog', 'Share Error', 'Copy Link Failed', {
        blog_slug: slug,
        error: err.message
      });
    }
    
    document.body.removeChild(textArea);
  };

  // Add Utterances script after component mount
  useEffect(() => {
    if (commentsRef.current && !loading && !error) {
      // Clear any existing utterances
      while (commentsRef.current.firstChild) {
        commentsRef.current.removeChild(commentsRef.current.firstChild);
      }
      
      // Create script element for utterances
      const script = document.createElement('script');
      script.src = "https://utteranc.es/client.js";
      script.setAttribute('repo', "megemann/megemann.github.io");
      script.setAttribute('issue-term', "pathname");
      script.setAttribute('theme', darkMode ? "github-dark" : "github-light");
      script.setAttribute('crossorigin', "anonymous");
      script.async = true;
      
      // Append script to comments section
      commentsRef.current.appendChild(script);
    }
  }, [commentsRef, loading, error, slug, darkMode]);

  if (loading) {
    return renderLayout(
      <div className="blog-post-loading">
        <div className="loading-spinner"></div>
        <p>Loading blog post...</p>
      </div>
    );
  }

  if (error) {
    return renderLayout(
      <div className="blog-post-error">
        <h2>Error Loading Blog Post</h2>
        <p>{error}</p>
        <button onClick={handleBack} className="back-button">
          ← Back to Blogs
        </button>
      </div>
    );
  }

  return renderLayout(
    <div className={`blog-post-content ${darkMode ? 'dark-mode' : ''}`}>
      <article className={`markdown-content ${darkMode ? 'dark-mode' : ''}`}>
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]} 
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            img: ({node, ...props}) => (
              <img 
                {...props} 
                className="blog-post-image" 
                alt={props.alt || 'Blog image'} 
                style={{ opacity: 0 }}
                onLoad={handleImageLoad}
                loading="lazy"
              />
            ),
            code: ({node, inline, className, children, ...props}) => {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1].toLowerCase() : '';
              
              // If it's inline code, use inline styling
              if (inline) {
                return (
                  <code
                    className="blog-post-code inline-code"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              
              // If no language is specified for block code, treat as inline
              if (!language) {
                return (
                  <code
                    className="blog-post-code inline-code"
                    {...props}
                  >
                    {children}
                  </code>
                );
              }
              
              // Language specified - use syntax highlighter
              return (
                <SyntaxHighlighter
                  style={darkMode ? vscDarkPlus : vs}
                  language={language}
                  PreTag="div"
                  className="blog-post-syntax-highlighter"
                  showLineNumbers={true}
                  lineNumberStyle={{
                    minWidth: '3em',
                    paddingRight: '1em',
                    color: darkMode ? '#6e7681' : '#656d76',
                    backgroundColor: 'transparent',
                    borderRight: `1px solid ${darkMode ? '#30363d' : '#d1d9e0'}`,
                    marginRight: '1em'
                  }}
                  customStyle={{
                    margin: '1.5rem 0',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    backgroundColor: 'transparent'
                  }}
                  codeTagProps={{
                    style: {
                      fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace"
                    }
                  }}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              );
            },
            pre: ({children, ...props}) => {
              // Let SyntaxHighlighter handle the pre wrapper
              return <>{children}</>;
            },
            a: ({node, ...props}) => (
              <a 
                {...props} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="blog-post-link"
              >
                {props.children || props.href}
              </a>
            ),
            // Make tables responsive
            table: ({node, ...props}) => (
              <div className="table-container">
                <table {...props} className="blog-post-table" />
              </div>
            )
          }}
        >
          {markdown}
        </ReactMarkdown>
      </article>
      
      {/* Add Utterances comments section */}
      <div className={`blog-post-comments ${darkMode ? 'dark-mode' : ''}`}>
        <h3>Comments</h3>
        <div className="comments-container" ref={commentsRef}></div>
      </div>
      
      <div className={`blog-post-footer ${darkMode ? 'dark-mode' : ''}`}>
        <button onClick={handleBack} className="back-button">
          ← Back to Blogs
        </button>
        <div className="blog-post-info">
          <div className="blog-post-metadata">
            <span className="blog-post-date">
              <i className="far fa-calendar-alt"></i> {BLOG_MAP[slug] ? "Published" : "Coming soon"}
            </span>
            <span className="blog-post-read-time">
              <i className="far fa-clock"></i> {markdown.length > 0 ? `${Math.ceil(markdown.length / 1000)} min read` : "Reading time unknown"}
            </span>
            <ViewCounter 
              slug={slug} 
              namespace="blog" 
              className="blog-post-views"
              increment={true}
              lazy={true}
            />
          </div>
          <div className="blog-post-share">
            <span>Share:</span>
            <button 
              className="share-button twitter" 
              onClick={() => handleShare('twitter')}
              title="Share on Twitter"
              aria-label="Share on Twitter"
            >
              <i className="fab fa-twitter"></i>
            </button>
            <button 
              className="share-button linkedin" 
              onClick={() => handleShare('linkedin')}
              title="Share on LinkedIn"
              aria-label="Share on LinkedIn"
            >
              <i className="fab fa-linkedin"></i>
            </button>
            <button 
              className="share-button facebook" 
              onClick={() => handleShare('facebook')}
              title="Share on Facebook"
              aria-label="Share on Facebook"
            >
              <i className="fab fa-facebook"></i>
            </button>
            {canShare && (
              <button 
                className="share-button native" 
                onClick={() => handleShare('native')}
                title="Share via device"
                aria-label="Share using your device's share feature"
              >
                <i className="fas fa-share-alt"></i>
              </button>
            )}
            <button 
              className="share-button copy" 
              onClick={() => handleShare('copy')}
              title="Copy link"
              aria-label="Copy link to clipboard"
            >
              <i className="fas fa-link"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 