// src/App.js
import React from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import { useAuthStore } from './components/store/auth';
import AppLayout from './components/layout/AppLayout';
import AuthComponent from './components/auth/AuthComponent';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GoogleCallback from './components/Google/GoogleCallback';

Amplify.configure(awsconfig);

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/auth/callback" element={<GoogleCallback />} />
        <Route 
          path="/*" 
          element={isAuthenticated ? <AppLayout /> : <AuthComponent />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
