import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  // Replace with your actual Google Analytics measurement ID
  ReactGA.initialize('G-MYY9F1P8X8');
  
  // Enable debugging in development - remove in production
  if (process.env.NODE_ENV === 'development') {
    ReactGA.set({ debug: true });
  }
};

// Track page views with custom dimensions
export const logPageView = (customDimensions = {}) => {
  const pagePath = window.location.pathname + window.location.search;
  
  // Enrich with custom dimensions
  const enrichedDimensions = {
    page_path: pagePath,
    page_title: document.title,
    page_location: window.location.href,
    dark_mode: document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled',
    is_mobile: window.innerWidth < 920 ? 'true' : 'false',
    ...customDimensions
  };

  // Send the pageview with enhanced data
  ReactGA.send({ 
    hitType: 'pageview', 
    page: pagePath,
    ...enrichedDimensions
  });
};

// Track events with additional parameters
export const logEvent = (category, action, label, customDimensions = {}) => {
  ReactGA.event({
    category,
    action,
    label,
    ...customDimensions
  });
};

// Track user engagement metrics
export const logEngagement = (metric, value, customDimensions = {}) => {
  ReactGA.event({
    category: 'Engagement',
    action: metric,
    value: typeof value === 'number' ? value : undefined,
    label: typeof value !== 'number' ? String(value) : undefined,
    ...customDimensions
  });
};

// Track blog specific analytics
export const logBlogAnalytics = (blogData, action, customDimensions = {}) => {
  ReactGA.event({
    category: 'Blog',
    action: action,
    label: blogData.title || blogData.slug,
    blog_id: blogData.id,
    blog_slug: blogData.slug,
    blog_tags: blogData.tags?.join(','),
    blog_published_date: blogData.date,
    blog_author: blogData.author,
    ...customDimensions
  });
};

// Track search analytics
export const logSearch = (searchTerm, resultsCount, customDimensions = {}) => {
  ReactGA.event({
    category: 'Search',
    action: 'Search',
    label: searchTerm,
    value: resultsCount,
    search_term: searchTerm,
    results_count: resultsCount,
    ...customDimensions
  });
};

// Track scroll depth
export const logScrollDepth = (depth, blogData = null) => {
  const category = blogData ? 'Blog Scroll' : 'Page Scroll';
  const label = blogData ? blogData.title || blogData.slug : window.location.pathname;
  
  ReactGA.event({
    category,
    action: `Scrolled ${depth}%`,
    label,
    value: depth,
    non_interaction: true,
    blog_id: blogData?.id,
    blog_slug: blogData?.slug
  });
};

// Track outbound links
export const logOutboundLink = (url, label = url) => {
  ReactGA.event({
    category: 'Outbound Link',
    action: 'Click',
    label,
    transport: 'beacon',
    outbound_url: url
  });
};

// Track performance metrics using Web Vitals
export const logWebVitals = ({ name, delta, value, id }) => {
  ReactGA.event({
    category: 'Web Vitals',
    action: name,
    label: id,
    value: Math.round(name === 'CLS' ? delta * 1000 : delta),
    metric_value: Math.round(value),
    non_interaction: true
  });
};

// Track user errors
export const logError = (error, errorInfo = {}) => {
  ReactGA.exception({
    description: error.toString(),
    fatal: false,
    ...errorInfo
  });
};

// Track form interactions
export const logFormInteraction = (formName, action, label = null) => {
  ReactGA.event({
    category: 'Form',
    action,
    label: label || formName,
    form_name: formName
  });
}; 