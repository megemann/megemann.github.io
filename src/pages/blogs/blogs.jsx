import React, { useContext, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../component/Sidebar/Sidebar';
import ViewCounter from '../../component/ViewCounter/ViewCounter';
// BlogStats is used in the JSX but ESLint doesn't detect it correctly
// eslint-disable-next-line no-unused-vars
import BlogStats from '../../component/BlogStats/BlogStats';
import ThemeToggle from '../../component/ThemeToggle/ThemeToggle';
import ThemeContext from '../../ThemeContext';
import './blogs.css';
import { logPageView, logEvent, logBlogAnalytics, logEngagement } from '../../analytics';

// Placeholder image for blogs without custom images
const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';

// Blog data
const blogs = [
    {
        id: 1,
        slug: 'oneprompted',
        title: "OnePrompted: Can AI Learn to Improve Your Prompts? We Built a Model to Try.",
        description: "We trained a custom Gen AI model to take vague, lazy prompts and turn them into highly effective ones using prompt engineering techniques.",
        image: 'https://i.postimg.cc/Nj7gYPKx/image.png',
        date: "April 20, 2025",
        author: "Austin Fairbanks",
        tags: ["AI", "Machine Learning", "Prompt Engineering"],
        readTime: "8 min read",
        pinned: true
    },
    {
        id: 2,
        slug: 'welcome-to-my-blog',
        title: "Welcome to My Tech Blog",
        description: "An introduction to my blog, what to expect, and a bit about myself.",
        image: DEFAULT_IMAGE,
        date: "April 14, 2025",
        author: "Austin Fairbanks",
        tags: ["Introduction", "Personal", "Tech"],
        readTime: "5 min read",
        pinned: false
    },
];

// Expose blogs data globally for analytics to access across components
window.blogsList = blogs;

export default function Blogs() {
    const nav = useNavigate();
    const { darkMode, isMobile } = useContext(ThemeContext);
    const [sortedBlogs, setSortedBlogs] = useState([]);
    const [blogViews, setBlogViews] = useState({});
    const [userInteractions, setUserInteractions] = useState({});

    // Handle receiving view counts for each blog
    const handleBlogViewsReceived = (slug, count) => {
        setBlogViews(prev => {
            const newState = {
                ...prev,
                [slug]: count
            };
            
            // Track blog impressions with view counts in analytics
            const blogData = blogs.find(b => b.slug === slug);
            if (blogData && (!prev[slug] || prev[slug] !== count)) {
                logBlogAnalytics(blogData, 'Impression', { 
                    view_count: count,
                    listing_position: sortedBlogs.findIndex(b => b.slug === slug) + 1
                });
            }
            
            return newState;
        });
    };

    // Calculate the blog's score based on views and recency
    const calculateBlogScore = useCallback((blog) => {
        // Get the blog's view count (default to 0 if not available)
        const views = blogViews[blog.slug] || 0;
        
        // Calculate days since publication
        const publishDate = new Date(blog.date);
        const today = new Date();
        const daysSincePublished = Math.floor((today - publishDate) / (1000 * 60 * 60 * 24));
        
        // Base score calculation
        // For recent blogs (< 30 days old), boost their score to ensure visibility
        // After 30 days, the score is more determined by views
        let recencyBoost = 0;
        if (daysSincePublished < 30) {
            // The newer the post, the higher the boost (max 2000 for brand new posts)
            recencyBoost = 2000 * (1 - (daysSincePublished / 30));
        }
        
        // Final score combines views with recency boost
        // Views have more impact over time as recency boost fades
        return views + recencyBoost;
    }, [blogViews]);

    // Sort blogs when view data changes
    useEffect(() => {
        // Only sort if we have view data for at least one blog
        if (Object.keys(blogViews).length === 0) return;
        
        // Create a sorted copy of blogs
        const sorted = [...blogs].sort((a, b) => {
            // Pinned posts always go first
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            
            // For non-pinned posts, use the calculated score
            const scoreA = calculateBlogScore(a);
            const scoreB = calculateBlogScore(b);
            
            return scoreB - scoreA; // Higher score first
        });
        
        // Check if we need to update the sort (avoid infinite loop by not checking sorted vs sortedBlogs)
        const newSortedString = JSON.stringify(sorted.map(b => b.slug));
        const currentSortedString = JSON.stringify(sortedBlogs.map(b => b.slug));
        const orderChanged = newSortedString !== currentSortedString && sortedBlogs.length > 0;
        
        if (orderChanged) {
            // Track the new sort order in analytics
            logEvent('Blog Listing', 'Sorting Applied', 'Views+Recency', {
                top_blogs: sorted.slice(0, 3).map(b => b.slug).join(','),
                blog_count: sorted.length
            });
            
            // Update the sorted blogs
            setSortedBlogs(sorted);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blogViews, blogs, calculateBlogScore]);

    // Initial loading of blogs
    useEffect(() => {
        // Set initial sorted order (before we have view data)
        // Temporary ordering: pinned first, then by date
        const initialSorted = [...blogs].sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            
            // Sort by date (newest first)
            return new Date(b.date) - new Date(a.date);
        });
        
        setSortedBlogs(initialSorted);
        
        // Track page load with initial blog list
        logEvent('Blog Listing', 'Initial Load', undefined, {
            blog_count: blogs.length,
            has_pinned: blogs.some(b => b.pinned)
        });
    }, []);

    useEffect(() => {
        // Log page view for analytics with blog listing data
        logPageView({
            content_type: 'blog_listing',
            blog_count: blogs.length,
            tags_available: [...new Set(blogs.flatMap(blog => blog.tags))].join(',')
        });
        
        // Apply dark mode to body
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        // Track time spent on blog listing page
        const startTime = new Date();
        return () => {
            const timeSpent = Math.round((new Date() - startTime) / 1000);
            if (timeSpent > 5) { // Only log if meaningful time was spent
                logEngagement('Time on Blog Listing', timeSpent, {
                    blogs_viewed: Object.keys(userInteractions).length
                });
            }
        };
    }, [darkMode, userInteractions]);

    const handleBlogClick = (blog) => {
        // Update user interactions
        setUserInteractions(prev => ({
            ...prev,
            [blog.slug]: (prev[blog.slug] || 0) + 1
        }));
        
        // Log click event with enhanced data
        logBlogAnalytics(blog, 'Card Click', {
            position: sortedBlogs.findIndex(b => b.slug === blog.slug) + 1,
            view_count: blogViews[blog.slug] || 0,
            is_pinned: !!blog.pinned
        });
        
        // Navigate to the blog post
        nav(`/blog/${blog.slug}`);
    };

    // Track hover interactions for analytics
    const handleBlogHover = (blog) => {
        // Only track hover once per blog per session
        if (!userInteractions[`hover_${blog.slug}`]) {
            setUserInteractions(prev => ({
                ...prev,
                [`hover_${blog.slug}`]: true
            }));
            
            logEvent('Blog', 'Hover', blog.title, {
                blog_slug: blog.slug,
                position: sortedBlogs.findIndex(b => b.slug === blog.slug) + 1
            });
        }
    };

    return (
        <div className={`blogs-page-wrapper ${darkMode ? 'dark-mode' : ''}`}>
            {/* Sidebar - only render if not on mobile */}
            {!isMobile && (
                <div className="sidebar">
                    <Sidebar />
                </div>
            )}
            
            {/* Main Content */}
            <div className="main-content" style={isMobile ? { marginLeft: 0 } : {}}>
                <div className="blogs-header">
                    <div className="blogs-title">blogs.zip</div>
                    <div className="blogs-header-controls">
                        {isMobile && (
                            <button 
                                className="home-nav-button" 
                                onClick={() => nav('/')}
                                title="Go to Home"
                            >
                                <i className="fas fa-home"></i> Home
                            </button>
                        )}
                        <ThemeToggle />
                    </div>
                </div>
                <div className="blogs-container">
                    {/* Hidden view counters for loading view data */}
                    <div className="hidden-view-counters" aria-hidden="true">
                        {blogs.map(blog => (
                            <ViewCounter 
                                key={`counter-${blog.slug}`}
                                slug={blog.slug}
                                namespace="blog"
                                showLabel={false}
                                increment={false}
                                className="hidden-counter"
                                onCountReceived={(count) => handleBlogViewsReceived(blog.slug, count)}
                            />
                        ))}
                    </div>
                    
                    {sortedBlogs.length > 0 ? (
                        <>
                            <div className="blogs-folder">
                                {sortedBlogs.map((blog) => (
                                    <div 
                                        key={blog.id}
                                        className={`blog-card ${blog.pinned ? 'blog-card-pinned' : ''}`}
                                        onClick={() => handleBlogClick(blog)}
                                        onMouseEnter={() => handleBlogHover(blog)}
                                    >
                                        <div className="blog-img-container">
                                            <img src={blog.image} alt={blog.title} className="blog-img" />
                                            <div className="blog-date">{blog.date}</div>
                                            {blog.pinned && <div className="blog-pinned"><i className="fas fa-thumbtack"></i></div>}
                                            <div className="blog-view-counter">
                                                <i className="fas fa-eye"></i>
                                                <ViewCounter 
                                                    slug={blog.slug} 
                                                    namespace="blog" 
                                                    showLabel={false}
                                                    increment={false}
                                                    className="blog-image-views"
                                                />
                                            </div>
                                        </div>
                                        <div className="blog-content">
                                            <h3 className="blog-title">{blog.title}</h3>
                                            <p className="blog-description">{blog.description}</p>
                                            <div className="blog-meta">
                                                <div className="blog-tags">
                                                    {blog.tags.map((tag, index) => (
                                                        <span 
                                                            key={index} 
                                                            className="blog-tag"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                logEvent('Blog', 'Tag Click', tag, {
                                                                    blog_slug: blog.slug,
                                                                    blog_title: blog.title
                                                                });
                                                                // You could implement tag filtering here
                                                            }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                                <span className="blog-read-more">
                                                    {blog.readTime}
                                                    <i className="fas fa-arrow-right"></i>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Move BlogStats to the footer */}
                            <div className="blogs-footer">
                                <BlogStats blogs={sortedBlogs} className="blogs-stats-footer" />
                            </div>
                        </>
                    ) : (
                        <div className="no-blogs">
                            <p>No blog posts available yet. Check back soon!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 