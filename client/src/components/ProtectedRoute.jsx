import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const checkAuth = () => {
        const token = localStorage.getItem('adminToken');
        const expiry = localStorage.getItem('tokenExpiry');
        
        if (!token || !expiry) {
            return false;
        }

        const expiryTime = parseInt(expiry, 10);
        const currentTime = new Date().getTime();

        if (currentTime > expiryTime) {
            // Token has expired
            localStorage.removeItem('adminToken');
            localStorage.removeItem('tokenExpiry');
            return false;
        }

        return true;
    };

    const isAuthenticated = checkAuth();
    
    if (!isAuthenticated) {
        // Redirect to login page if not authenticated or token expired
        return <Navigate to="/admin-login" replace />;
    }

    // Render the protected component if authenticated and token is valid
    return children;
};

export default ProtectedRoute;