import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { logPageView } from './analytics';

const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    logPageView();
  }, [location]);

  return null;
};

export default RouteChangeTracker; 