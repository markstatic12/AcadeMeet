import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import ProfilePage from './pages/ProfilePage';
import CreateSessionPage from './pages/CreateSessionPage';
import CreateNotePage from './pages/CreateNotePage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/layout/ProtectedRoute';
import SessionsPage from './pages/SessionsPage';
import SessionViewPage from './pages/SessionViewPage';
import EditSessionPage from './pages/EditSessionPage';
import { UserProvider } from './context/UserContext';

function App() {
  return (
    <UserProvider>
    <Routes>
      <Route 
        path="/" 
        element={<Navigate to="/login" replace />} 
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
      
      <Route 
        path="/notes" 
        element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/create-session" 
        element={
          <ProtectedRoute>
            <CreateSessionPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/create-note" 
        element={
          <ProtectedRoute>
            <CreateNotePage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/sessions" 
        element={
          <ProtectedRoute>
            <SessionsPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/session/:sessionId" 
        element={
          <ProtectedRoute>
            <SessionViewPage />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/edit-session/:sessionId" 
        element={
          <ProtectedRoute>
            <EditSessionPage />
          </ProtectedRoute>
        } 
      />

      {/* Placeholder routes for future pages */}
      <Route path="/files" element={<ProtectedRoute><div className="min-h-screen bg-gray-900 text-white p-8"><h1 className="text-3xl font-bold">Files - Coming Soon</h1></div></ProtectedRoute>} />
      <Route path="/productivity" element={<ProtectedRoute><div className="min-h-screen bg-gray-900 text-white p-8"><h1 className="text-3xl font-bold">Productivity Tools - Coming Soon</h1></div></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><div className="min-h-screen bg-gray-900 text-white p-8"><h1 className="text-3xl font-bold">Messages - Coming Soon</h1></div></ProtectedRoute>} />
    </Routes>
    </UserProvider>
  );
}

export default App;