const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      // These metrics measure real user performance data:
      // CLS - Cumulative Layout Shift: measures visual stability
      // FID - First Input Delay: measures interactivity
      // FCP - First Contentful Paint: measures perceived load speed
      // LCP - Largest Contentful Paint: measures loading performance
      // TTFB - Time to First Byte: measures resource and server responsiveness
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
