import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Auth0Provider } from '@auth0/auth0-react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'
const root = ReactDOM.createRoot(document.getElementById('root'));

// Import your publishable key
const PUBLISHABLE_KEY = 'pk_test_Y29ycmVjdC1sZW9wYXJkLTcwLmNsZXJrLmFjY291bnRzLmRldiQ'

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

root.render(
    <React.StrictMode>

    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <App />
    </ClerkProvider>
      
    </React.StrictMode>
);

