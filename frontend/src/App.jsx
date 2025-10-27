import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('student') !== null;
  };

  return (
    <Routes>
      <Route 
        path="/" 
        element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* Protected Routes */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } 
      />
      
      {/* Placeholder routes for future pages */}
      <Route path="/sessions" element={<ProtectedRoute><div className="min-h-screen bg-gray-900 text-white p-8"><h1 className="text-3xl font-bold">Study Sessions - Coming Soon</h1></div></ProtectedRoute>} />
      <Route path="/notes" element={<ProtectedRoute><div className="min-h-screen bg-gray-900 text-white p-8"><h1 className="text-3xl font-bold">Notes - Coming Soon</h1></div></ProtectedRoute>} />
      <Route path="/files" element={<ProtectedRoute><div className="min-h-screen bg-gray-900 text-white p-8"><h1 className="text-3xl font-bold">Files - Coming Soon</h1></div></ProtectedRoute>} />
      <Route path="/productivity" element={<ProtectedRoute><div className="min-h-screen bg-gray-900 text-white p-8"><h1 className="text-3xl font-bold">Productivity Tools - Coming Soon</h1></div></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><div className="min-h-screen bg-gray-900 text-white p-8"><h1 className="text-3xl font-bold">Messages - Coming Soon</h1></div></ProtectedRoute>} />
    </Routes>
  );
}

export default App;