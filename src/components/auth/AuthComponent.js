import React, { useEffect, useState } from 'react';
import { getCurrentUser, signUp, signIn, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { useAuthStore } from '../store/auth';

const AuthComponent = () => {
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState('signIn'); // 'signIn', 'signUp', 'confirmSignUp'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: ''
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      switch (formState) {
        case 'signUp':
          if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
          }
          await signUp({
            username: formData.email,
            password: formData.password,
            attributes: {
              email: formData.email,
            },
          });
          setMessage('Se ha enviado un código de verificación a tu correo');
          setFormState('confirmSignUp');
          break;

        case 'confirmSignUp':
          await confirmSignUp({
            username: formData.email,
            confirmationCode: formData.verificationCode,
          });
          setMessage('Cuenta verificada correctamente. Por favor, inicia sesión.');
          setFormState('signIn');
          break;

        case 'signIn':
          await signIn({
            username: formData.email,
            password: formData.password,
          });
          const user = await getCurrentUser();
          setAuth(true, user);
          break;
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Error en la autenticación');
    }
  };

  const handleResendCode = async () => {
    try {
      await resendSignUpCode({
        username: formData.email,
      });
      setMessage('Se ha enviado un nuevo código de verificación');
    } catch (err) {
      setError(err.message || 'Error al reenviar el código');
    }
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
            {formState === 'signIn' && 'Inicia sesión en tu cuenta'}
            {formState === 'signUp' && 'Crea una nueva cuenta'}
            {formState === 'confirmSignUp' && 'Verifica tu cuenta'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            {formState !== 'confirmSignUp' && (
              <>
                <div>
                  <input
                    type="email"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <input
                    type="password"
                    required
                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Contraseña"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>
              </>
            )}
            
            {formState === 'signUp' && (
              <div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Confirmar contraseña"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            )}

            {formState === 'confirmSignUp' && (
              <div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Código de verificación"
                  value={formData.verificationCode}
                  onChange={(e) => setFormData({...formData, verificationCode: e.target.value})}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          {message && (
            <div className="text-green-600 text-sm text-center">
              {message}
            </div>
          )}

          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {formState === 'signIn' && 'Iniciar sesión'}
              {formState === 'signUp' && 'Registrarse'}
              {formState === 'confirmSignUp' && 'Verificar cuenta'}
            </button>

            {formState === 'confirmSignUp' && (
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Reenviar código de verificación
              </button>
            )}
          </div>
        </form>

        {formState !== 'confirmSignUp' && (
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-blue-600 hover:text-blue-500"
              onClick={() => {
                setFormState(formState === 'signIn' ? 'signUp' : 'signIn');
                setError('');
                setMessage('');
              }}
            >
              {formState === 'signIn' 
                ? '¿No tienes cuenta? Regístrate' 
                : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthComponent;
