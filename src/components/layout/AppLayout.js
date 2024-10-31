import React, { useState, useEffect } from 'react';
import { Home, Settings, BarChart3, MessageCircle, LogOut, Loader2, AlertCircle, Check, Star, ChevronRight, RefreshCcw } from 'lucide-react';
import { signOut } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';
import PreferencesForm from '../forms/PreferencesForm';
import GoogleConnect from '../Google/GoogleConnect';
import { useAuthStore } from '../store/auth';
import { getCurrentUser } from 'aws-amplify/auth';
import { Alert, AlertDescription } from '../ui/alert';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';

const ConnectedGoogleAccounts = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { sub } = await getCurrentUser();
      const response = await fetch(
        `https://j1asmzdgbg.execute-api.eu-west-3.amazonaws.com/google-reviews/cuentas-conectadas?sub=${sub}`
      );
      
      if (!response.ok) throw new Error('Error al obtener perfiles');
      
      const responseData = await response.json();
      
      // Parsear el body que viene como string
      const data = JSON.parse(responseData.body);
      console.log('Datos procesados:', data); // Para debugging
      
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error("Error completo:", error);
      setError('No pudimos cargar tus cuentas de Google. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfiles();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No hay cuentas conectadas
            </h3>
            <p className="text-sm text-gray-500">
              Conecta tu cuenta de Google para comenzar a gestionar tus reseñas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          Cuentas de Google Conectadas ({profiles.length})
        </CardTitle>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          aria-label="Refrescar cuentas"
        >
          <RefreshCcw className={`h-5 w-5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-200">
          {profiles.map((profile) => (
            <div
              key={profile.accountId}
              className="p-4 hover:bg-gray-50 transition-colors flex items-center gap-4"
            >
              <div className="relative">
                <img
                  src={profile.profilePicture}
                  alt={`${profile.profileName} avatar`}
                  className="w-12 h-12 rounded-full"
                />
                {profile.isPrimary && (
                  <span className="absolute -top-1 -right-1">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  </span>
                )}
              </div>
              
              <div className="flex-grow">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">
                    {profile.profileName}
                  </h3>
                  {profile.status === 'active' && (
                    <span className="flex items-center text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                      <Check className="h-3 w-3 mr-1" />
                      Activa
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500">{profile.profileEmail}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Última actualización: {new Date(profile.lastUpdated).toLocaleDateString()}
                </p>
              </div>
              
              <ChevronRight className="h-5 w-5 text-gray-400" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AppLayout = () => {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const handleSignOut = async () => {
    try {
      await signOut();
      setAuth(false, null);
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const renderContent = () => {
    switch (currentTab) {
      case 'settings':
        return (
          <div className="space-y-6">
            <PreferencesForm />
            <GoogleConnect />
            <ConnectedGoogleAccounts />
            <button 
              onClick={handleSignOut} 
              className="w-full flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              Cerrar Sesión
            </button>
          </div>
        );
      case 'dashboard':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Panel de Control</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Contenido del dashboard */}
            </CardContent>
          </Card>
        );
      case 'reviews':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Reseñas</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Lista de reseñas */}
            </CardContent>
          </Card>
        );
      case 'analytics':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Análisis y Estadísticas</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Gráficos y estadísticas */}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-900">Review Manager</h1>
            <button 
              onClick={handleSignOut}
              className="text-red-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="mb-6">
          <CardContent className="p-2">
            <nav className="grid grid-cols-4 gap-4">
              {[
                { id: 'dashboard', icon: Home, label: 'Inicio' },
                { id: 'reviews', icon: MessageCircle, label: 'Reseñas' },
                { id: 'analytics', icon: BarChart3, label: 'Análisis' },
                { id: 'settings', icon: Settings, label: 'Configuración' }
              ].map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setCurrentTab(id)}
                  className={`flex items-center justify-center gap-2 p-2 rounded-lg transition-colors ${
                    currentTab === id 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {renderContent()}
      </main>
    </div>
  );
};

export default AppLayout;