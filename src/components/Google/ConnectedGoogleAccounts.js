import React, { useState, useEffect } from 'react';
import { Loader2, AlertCircle, Check, Star, StarOff, ChevronRight, RefreshCcw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
      const response = await fetch(`${process.env.REACT_APP_API_URL}/profiles?sub=${sub}`);
      
      if (!response.ok) throw new Error('Error al obtener perfiles');
      
      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      setError('No pudimos cargar tus cuentas de Google. Por favor, intenta de nuevo más tarde.');
      console.error("Error al obtener perfiles:", error);
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

  if (profiles.length === 0) {
    return (
      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <p className="text-gray-600">No hay cuentas de Google conectadas</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-900">
          Cuentas de Google Conectadas
        </h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <RefreshCcw className={`h-5 w-5 text-gray-500 ${refreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>
      
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
    </div>
  );
};

export default ConnectedGoogleAccounts;