import { Navigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useUser();
  
  if (loading) {
    return <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
