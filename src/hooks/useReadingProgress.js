import { useState, useEffect, useRef } from 'react';

/**
 * Hook to track reading progress
 * 
 * @param {Object} options
 * @param {string} options.slug - The page/post slug
 * @param {Function} options.onProgress - Callback for progress updates
 * @param {Function} options.onComplete - Callback when reading is completed
 * @param {number} options.threshold - Percentage threshold to consider article read (default: 80)
 * @returns {Object} - Reading progress data
 */
const useReadingProgress = ({ 
  slug, 
  onProgress, 
  onComplete, 
  threshold = 80 
}) => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef(Date.now());
  const progressRef = useRef(0);
  const completedRef = useRef(false);
  
  // Track scroll position to calculate reading progress
  useEffect(() => {
    if (!slug) return;
    
    const calculateProgress = () => {
      // Get document height
      const totalHeight = Math.max(
        document.body.scrollHeight, 
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
      ) - window.innerHeight;
      
      // Get current scroll position
      const currentScroll = window.scrollY || window.pageYOffset;
      
      // Calculate percentage (0-100)
      const newProgress = Math.min(Math.round((currentScroll / totalHeight) * 100), 100);
      
      // Update state if changed
      if (newProgress !== progressRef.current) {
        progressRef.current = newProgress;
        setProgress(newProgress);
        
        // Call progress callback if provided
        if (onProgress && typeof onProgress === 'function') {
          onProgress(newProgress);
        }
        
        // Mark as complete if threshold is reached
        if (newProgress >= threshold && !completedRef.current) {
          completedRef.current = true;
          setIsComplete(true);
          
          // Calculate reading time
          const timeSpentInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
          
          // Call completion callback if provided
          if (onComplete && typeof onComplete === 'function') {
            onComplete({
              progress: newProgress,
              timeSpentInSeconds,
              slug
            });
          }
        }
      }
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', calculateProgress);
    
    // Initial calculation
    calculateProgress();
    
    // Cleanup
    return () => {
      window.removeEventListener('scroll', calculateProgress);
    };
  }, [slug, onProgress, onComplete, threshold]);
  
  return {
    progress,
    isComplete,
    startTime: startTimeRef.current,
    timeSpent: Math.floor((Date.now() - startTimeRef.current) / 1000)
  };
};

export default useReadingProgress; 