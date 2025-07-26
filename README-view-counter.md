# Blog View Counter Integration

This document explains how the Cloudflare Workers view counter has been integrated into this React-based GitHub Pages blog.

## Overview

The view counter system consists of two main parts:
1. A Cloudflare Worker that tracks views and stores them in KV namespaces
2. A React component that fetches and displays view counts from the worker

## Key Features

- Views are only incremented when a visitor actually views a blog post page, not when they see the blog in listings
- Each unique IP address is counted only once per day per blog post
- View counts persist across browsers and devices
- Time-based fetch cooldown to minimize API calls (1000 seconds / ~16.7 minutes between fetches)

## Optimizations

### API Call Reduction

To minimize API calls and prevent excessive requests:

1. **Time-based fetch cooldown**: 
   - Each view count is fetched only once every 1000 seconds (about 16.7 minutes)
   - Subsequent visits within this window use locally cached counts from localStorage
   - This drastically reduces API usage while maintaining a good user experience

2. **Separation of read/write operations**:
   - Blog listings make read-only API calls
   - Only actual blog post views trigger write operations

3. **Local caching**:
   - View counts are stored in localStorage with timestamps
   - Errors fallback to cached counts when possible

## Setup

### Cloudflare Worker Setup

The Cloudflare Worker is deployed at `https://3c2fa4bd-blog-counter.ajfairbanksblog.workers.dev` and uses two KV namespaces:
- `COUNTS`: Stores the number of views for each blog post
- `LOGS`: Tracks IP addresses with a 24-hour TTL to prevent duplicate counting

### React Component Integration

The view counter is implemented as a React component that fetches the view count from the Cloudflare Worker.

#### ViewCounter Component

The main component is located at `src/component/ViewCounter/ViewCounter.jsx`. It:
1. Takes a `slug` prop that identifies the blog post
2. Has an `increment` prop that determines whether to increment the counter or just read it
3. Fetches the view count from the Cloudflare Worker (with time-based cooldown)
4. Displays the count with an optional eye icon
5. Provides callbacks for when counts are received

#### Implementation Details

- **Blog Post Page**: Sets `increment={true}` to count actual views
- **Blog Listing**: Sets `increment={false}` to show counts without incrementing them
- **BlogStats Component**: Uses `increment={false}` to display statistics without affecting counts
- **All instances**: Respect the fetch cooldown period to prevent excessive API calls

#### Configuration

The Cloudflare Worker endpoint is stored in `src/config/api.js` for easy updates.

## Usage

```jsx
// On a blog post page (increments the view count)
<ViewCounter 
  slug={post.slug} 
  namespace="blog" 
  increment={true}
  lazy={true}
  showLabel={true}
/>

// On a listing page (only displays the count, doesn't increment)
<ViewCounter 
  slug={post.slug} 
  namespace="blog" 
  increment={false}
  showLabel={false}
/>
```

## Fallback Behavior

If the Cloudflare Worker fails to respond, the component will:
1. Try to use the cached count from localStorage
2. If no cached count exists, display a fallback count based on a hash of the slug
3. Show an error state when appropriate

## Styling

The view counter styling is defined in `src/component/ViewCounter/ViewCounter.css` and includes:
- Basic layout for the counter
- Loading state with animation
- Error state formatting
- Dark mode support

## Troubleshooting

If view counts aren't appearing:
1. Check the browser console for errors
2. Verify the Cloudflare Worker is running (`https://3c2fa4bd-blog-counter.ajfairbanksblog.workers.dev/test`)
3. Check that the correct slug is being passed to the ViewCounter component
4. Clear localStorage if you suspect the cached counts are incorrect

If the counts seem incorrect:
1. Remember that views are unique per IP address with a 24-hour cooldown
2. The KV namespace might need to be purged if testing with the same IP address
3. The local cache uses a 1000-second cooldown, so you may need to wait or clear localStorage

## Future Improvements

Potential improvements to consider:
1. Add analytics to track which posts are most popular
2. Create an admin panel to view and manage view counts
3. Implement more sophisticated bot detection to filter out non-human traffic
4. Adjust the fetch cooldown period based on site traffic patterns 