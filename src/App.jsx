import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Report from './pages/Report';
import ViewReports from './pages/ViewReports';
import CommunityReports from './pages/CommunityReports';
import Games from './pages/Games';
import AIChatbot from './pages/AIChatbot';
import './App.css';

/**
 * AppRoutes Component
 * 
 * Handles all routing logic for the application with authentication-based redirects.
 * Automatically redirects authenticated users to home and unauthenticated users to welcome page.
 */
function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {/* Root route - redirect based on authentication status */}
      <Route 
        path="/" 
        element={currentUser ? <Navigate to="/home" /> : <Navigate to="/welcome" />} 
      />
      {/* Public routes - redirect to home if already authenticated */}
      <Route 
        path="/welcome" 
        element={currentUser ? <Navigate to="/home" /> : <Welcome />} 
      />
      <Route 
        path="/login" 
        element={currentUser ? <Navigate to="/home" /> : <Login />} 
      />
      <Route 
        path="/signup" 
        element={currentUser ? <Navigate to="/home" /> : <SignUp />} 
      />
      <Route 
        path="/home" 
        element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/user/report" 
        element={
          <PrivateRoute>
            <Report />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/user/reports" 
        element={
          <PrivateRoute>
            <ViewReports />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/community/reports" 
        element={
          <PrivateRoute>
            <CommunityReports />
          </PrivateRoute>
        } 
      />
      {/* Protected routes - require authentication */}
      <Route 
        path="/games" 
        element={
          <PrivateRoute>
            <Games />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/chat" 
        element={
          <PrivateRoute>
            <AIChatbot />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

/**
 * Main App Component
 * 
 * Root component that sets up the application structure with:
 * - Router for client-side navigation
 * - AuthProvider for global authentication context
 * - AppRoutes for handling all application routes
 * 
 * This component serves as the entry point for the mental health support application.
 */
function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
