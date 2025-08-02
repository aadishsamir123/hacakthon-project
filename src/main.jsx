/**
 * Application Entry Point
 * 
 * Main entry file that renders the React application to the DOM.
 * Uses React.StrictMode for additional development checks and warnings.
 * This file bootstraps the entire mental health support application.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Create root element and render the application
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
