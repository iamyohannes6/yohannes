import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import PinAuth from './PinAuth';

const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated and if the timestamp is still valid
    const authData = JSON.parse(sessionStorage.getItem('adminAuth') || '{}');
    const isValid = authData.timestamp && 
                   (new Date().getTime() - authData.timestamp) < (30 * 60 * 1000); // 30 minutes

    setIsAuthenticated(isValid);
    setIsLoading(false);

    // Clear authentication on page reload
    const handleBeforeUnload = () => {
      sessionStorage.removeItem('adminAuth');
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleAuthSuccess = () => {
    // Store authentication with timestamp
    const authData = {
      authenticated: true,
      timestamp: new Date().getTime()
    };
    sessionStorage.setItem('adminAuth', JSON.stringify(authData));
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#646cff]"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <PinAuth onSuccess={handleAuthSuccess} />;
  }

  return children;
};

export default ProtectedRoute;
