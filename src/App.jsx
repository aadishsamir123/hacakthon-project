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
import './App.css';

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route 
        path="/" 
        element={currentUser ? <Navigate to="/home" /> : <Navigate to="/welcome" />} 
      />
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
      <Route 
        path="/games" 
        element={
          <PrivateRoute>
            <Games />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

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
