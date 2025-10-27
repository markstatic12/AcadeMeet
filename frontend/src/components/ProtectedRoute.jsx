import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const student = localStorage.getItem('student');
  
  if (!student) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
