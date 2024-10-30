import React from 'react';
import { Amplify } from 'aws-amplify';
import awsconfig from './aws-exports';
import useAuthStore from './components/store/auth';
import AppLayout from './components/layout/AppLayout';
import AuthComponent from './components/auth/AuthComponent';

Amplify.configure(awsconfig);

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      {!isAuthenticated ? <AuthComponent /> : <AppLayout />}
    </>
  );
}

export default App;
