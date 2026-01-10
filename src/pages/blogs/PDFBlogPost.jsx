import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../component/Sidebar/Sidebar';
import ViewCounter from '../../component/ViewCounter/ViewCounter';
import ThemeToggle from '../../component/ThemeToggle/ThemeToggle';
import ThemeContext from '../../ThemeContext';
import { logPageView, logEvent, logBlogAnalytics } from '../../analytics';
import './BlogPost.css';
import './PDFBlogPost.css';

// Map of blog slugs to their PDF file paths
const PDF_BLOG_MAP = {
  'edgeml': '/EdgeMLBlog.pdf'
};

export default function PDFBlogPost() {
  const { slug } = useParams();
  const nav = useNavigate();
  const { darkMode, isMobile } = useContext(ThemeContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogData, setBlogData] = useState(null);
  const [canShare, setCanShare] = useState(false);
  const mainContentRef = useRef(null);
  const commentsRef = useRef(null);
  const [pdfUrl, setPdfUrl] = useState('');
  
  // Check if Web Share API is available
  useEffect(() => {
    setCanShare(!!navigator.share);
  }, []);
  
  // Find blog data from slug for analytics
  useEffect(() => {
    const findBlogBySlug = () => {
      const blog = window.blogsList?.find(b => b.slug === slug);
      if (blog) {
        setBlogData(blog);
        setBlogTitle(blog.title);
        document.title = `${blog.title} | Austin Fairbanks`;
        logBlogAnalytics(blog, 'View', { 
          view_type: 'page_load',
          referrer: document.referrer || 'direct',
          content_type: 'pdf'
        });
      }
    };
    
    findBlogBySlug();
  }, [slug]);
  
  // Set PDF URL
  useEffect(() => {
    if (PDF_BLOG_MAP[slug]) {
      // For local development, direct link to PDF
      // For production (GitHub Pages), use raw GitHub URL
      const localPdfUrl = `${process.env.PUBLIC_URL}${PDF_BLOG_MAP[slug]}`;
      const githubPdfUrl = `https://raw.githubusercontent.com/megemann/megemann.github.io/main/public${PDF_BLOG_MAP[slug]}`;
      
      // Use local for development, GitHub for production
      const pdfUrlToUse = process.env.NODE_ENV === 'development' ? localPdfUrl : githubPdfUrl;
      
      setPdfUrl(pdfUrlToUse);
      setLoading(false);
      
      console.log('PDF URL:', pdfUrlToUse);
    } else {
      setError('PDF blog post not found');
      setLoading(false);
    }
  }, [slug]);
  
  // Scroll to top when switching blog posts
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTop = 0;
    }
  }, [slug]);
  
  // Fix body scrolling
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    logPageView({
      content_type: 'blog_pdf',
      blog_slug: slug,
      blog_title: blogTitle || 'Unknown Blog'
    });
    
    logEvent('Blog', 'View PDF', slug);
    
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    
    return () => {
      document.title = 'Austin Fairbanks | Portfolio';
    };
  }, [slug, darkMode, blogTitle]);

  const handleBack = () => {
    if (blogData) {
      logBlogAnalytics(blogData, 'Exit', {
        exit_type: 'back_button',
        time_spent: Math.round((new Date() - new Date(performance.timeOrigin)) / 1000)
      });
    }
    nav('/blogs');
  };

  const downloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${blogTitle || slug}.pdf`;
    link.target = '_blank';
    link.click();
    logEvent('Blog', 'PDF Download', slug);
  };

  // Enhanced share functionality
  const handleShare = (platform) => {
    logEvent('Blog', 'Share', platform, {
      blog_slug: slug,
      blog_title: blogTitle
    });
    
    const pageUrl = window.location.href;
    const shareTitle = `${blogTitle} | Austin Fairbanks`;
    const shareText = blogData?.description || `Check out this blog post about ${blogTitle}`;
    
    if (platform === 'native' && canShare) {
      navigator.share({
        title: shareTitle,
        text: shareText,
        url: pageUrl
      })
      .then(() => {
        logEvent('Blog', 'Share Success', 'Web Share API', { blog_slug: slug });
      })
      .catch((error) => {
        console.error('Error sharing:', error);
        handleCopyLink();
      });
      return;
    }
    
    if (platform === 'copy') {
      handleCopyLink();
      return;
    }
    
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
    
    const windowFeatures = 'width=600,height=400,resizable=yes,scrollbars=yes,status=yes';
    try {
      const popup = window.open(shareUrl, 'share', windowFeatures);
      if (popup) {
        logEvent('Blog', 'Share Popup Opened', platform);
      } else {
        window.open(shareUrl, '_blank');
      }
    } catch (error) {
      console.error('Error opening share window:', error);
      window.location.href = shareUrl;
    }
  };
  
  const handleCopyLink = () => {
    const pageUrl = window.location.href;
    
    try {
      navigator.clipboard.writeText(pageUrl)
        .then(() => {
          alert('Link copied to clipboard!');
          logEvent('Blog', 'Share Success', 'Copy Link', { blog_slug: slug });
        })
        .catch(() => {
          fallbackCopyTextToClipboard(pageUrl);
        });
    } catch (error) {
      fallbackCopyTextToClipboard(pageUrl);
    }
  };
  
  const fallbackCopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        alert('Link copied to clipboard!');
        logEvent('Blog', 'Share Success', 'Copy Link Fallback', { blog_slug: slug });
      }
    } catch (err) {
      console.error('Failed to copy text:', err);
      alert('Could not copy automatically. The link is: ' + text);
    }
    
    document.body.removeChild(textArea);
  };

  // Add Utterances comments
  useEffect(() => {
    if (commentsRef.current && !loading && !error) {
      while (commentsRef.current.firstChild) {
        commentsRef.current.removeChild(commentsRef.current.firstChild);
      }
      
      const script = document.createElement('script');
      script.src = "https://utteranc.es/client.js";
      script.setAttribute('repo', "megemann/megemann.github.io");
      script.setAttribute('issue-term', "pathname");
      script.setAttribute('theme', darkMode ? "github-dark" : "github-light");
      script.setAttribute('crossorigin', "anonymous");
      script.async = true;
      
      commentsRef.current.appendChild(script);
    }
  }, [commentsRef, loading, error, slug, darkMode]);

  const renderLayout = (content) => (
    <div className={`blog-post-container pdf-blog-post ${darkMode ? 'dark-mode' : ''}`}>
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

  if (loading && pdfUrl) {
    return renderLayout(
      <div className="blog-post-loading">
        <div className="loading-spinner"></div>
        <p>Loading PDF...</p>
      </div>
    );
  }

  if (error) {
    return renderLayout(
      <div className="blog-post-error">
        <h2>Error Loading PDF</h2>
        <p>{error}</p>
        <button onClick={handleBack} className="back-button">
          ← Back to Blogs
        </button>
      </div>
    );
  }

  return renderLayout(
    <div className={`blog-post-content pdf-content ${darkMode ? 'dark-mode' : ''}`}>
      <div className="pdf-controls">
        <div className="pdf-title-section">
          <h2>{blogTitle}</h2>
        </div>
        
        <button onClick={downloadPDF} className="pdf-download-button" title="Download PDF">
          <i className="fas fa-download"></i> Download
        </button>
      </div>
      
      <div className={`pdf-viewer-container ${darkMode ? 'dark-mode' : ''}`}>
        <iframe
          src={pdfUrl}
          width="100%"
          height="100%"
          className="pdf-iframe-viewer"
          title="PDF Viewer"
          frameBorder="0"
        />
      </div>
      
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
              <i className="far fa-calendar-alt"></i> Published
            </span>
            <span className="blog-post-read-time">
              <i className="far fa-file-pdf"></i> PDF Document
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
            >
              <i className="fab fa-twitter"></i>
            </button>
            <button 
              className="share-button linkedin" 
              onClick={() => handleShare('linkedin')}
              title="Share on LinkedIn"
            >
              <i className="fab fa-linkedin"></i>
            </button>
            <button 
              className="share-button facebook" 
              onClick={() => handleShare('facebook')}
              title="Share on Facebook"
            >
              <i className="fab fa-facebook"></i>
            </button>
            {canShare && (
              <button 
                className="share-button native" 
                onClick={() => handleShare('native')}
                title="Share via device"
              >
                <i className="fas fa-share-alt"></i>
              </button>
            )}
            <button 
              className="share-button copy" 
              onClick={() => handleShare('copy')}
              title="Copy link"
            >
              <i className="fas fa-link"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
