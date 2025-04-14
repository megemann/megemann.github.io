import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ViewCounter from '../ViewCounter/ViewCounter';
import { logEvent } from '../../analytics';
import './BlogStats.css';

/**
 * Component to display blog statistics
 * 
 * @param {Object} props
 * @param {Array} props.blogs - Array of blog objects
 * @param {string} props.className - Additional CSS class names
 */
const BlogStats = ({ blogs = [], className = '' }) => {
  const [viewsLoaded, setViewsLoaded] = useState(0);
  const [viewsData, setViewsData] = useState({});
  const [loading, setLoading] = useState(true);
  
  // Track stats impressions for analytics
  useEffect(() => {
    if (!loading && viewsLoaded > 0) {
      const popularPosts = getPopularPosts().map(([slug]) => slug);
      logEvent('Blog Stats', 'Impression', undefined, {
        total_blogs: blogs.length,
        popular_posts: popularPosts.join(','),
        total_stats_shown: viewsLoaded
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, viewsLoaded, blogs.length]);

  // Reset counters when blogs change
  useEffect(() => {
    setViewsLoaded(0);
    setViewsData({});
    setLoading(true);
  }, [blogs]);

  // Handle when a view count is received
  const handleViewCountReceived = (slug, count) => {
    // Update the viewsData object
    setViewsData(prevData => ({
      ...prevData,
      [slug]: count
    }));

    // Increment the loaded counter
    setViewsLoaded(prev => prev + 1);
    
    // Check if all blogs have loaded their view counts
    if (viewsLoaded + 1 >= blogs.length) {
      setLoading(false);
    }
  };

  // Calculate popular posts based on view data
  const getPopularPosts = () => {
    // Create array of [slug, views] pairs
    const viewsArray = Object.entries(viewsData);

    // Sort by views (descending)
    const sortedViews = viewsArray.sort((a, b) => b[1] - a[1]);

    // Get the top 5 (or top 3 for footer)
    const limit = className.includes('blogs-stats-footer') ? 3 : 5;
    return sortedViews.slice(0, limit);
  };

  // Get blog details by slug
  const getBlogBySlug = (slug) => {
    return blogs.find(blog => blog.slug === slug) || { 
      title: slug, 
      slug 
    };
  };
  
  // Track clicks on popular posts
  const handlePopularPostClick = (slug, position, views) => {
    logEvent('Blog Stats', 'Popular Post Click', slug, {
      popular_post_position: position, 
      popular_post_views: views,
      blog_title: getBlogBySlug(slug).title
    });
  };

  return (
    <div className={`blog-stats ${className}`}>
      <div className="blog-stats-header">
        <h3 className="blog-stats-title">
          {className.includes('blogs-stats-footer') ? 'Popular Articles' : 'Blog Statistics'}
        </h3>
      </div>

      {/* Hidden view counters to load the data */}
      <div className="blog-stats-counters" aria-hidden="true">
        {blogs.map(blog => (
          <ViewCounter
            key={blog.slug}
            slug={blog.slug}
            namespace="blog"
            showLabel={false}
            className="blog-stats-hidden-counter"
            onCountReceived={(count) => handleViewCountReceived(blog.slug, count)}
          />
        ))}
      </div>

      {/* Popular posts section */}
      {viewsLoaded > 0 && (
        <div className="blog-stats-popular">
          {!className.includes('blogs-stats-footer') && (
            <h4 className="blog-stats-subtitle">Popular Posts</h4>
          )}
          <ul className="blog-stats-list">
            {getPopularPosts().map(([slug, views], index) => {
              const blog = getBlogBySlug(slug);
              return (
                <li key={slug} className="blog-stats-list-item">
                  <Link 
                    to={`/blog/${slug}`} 
                    className="blog-stats-link"
                    onClick={() => handlePopularPostClick(slug, index + 1, views)}
                  >
                    <span className="blog-stats-post-title">{blog.title}</span>
                    <span className="blog-stats-post-views">{views} views</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BlogStats; 