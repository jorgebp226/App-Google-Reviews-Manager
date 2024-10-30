import React, { useEffect, useState } from 'react';
import { getCurrentUser, federatedSignIn } from 'aws-amplify/auth';
import { useAuthStore } from '../../store/auth';

const AuthComponent = () => {
  const [loading, setLoading] = useState(true);
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await getCurrentUser();
      setAuth(true, user);
    } catch {
      setAuth(false, null);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    federatedSignIn({ provider: 'Google' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Review Manager
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Gestiona tus reseñas de Google My Business
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Continuar con Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthComponent;
