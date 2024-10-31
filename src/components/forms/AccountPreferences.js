import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { saveUserPreferences } from '../services/api';

const PreferencesForm = ({ profile }) => {
  const [preference, setPreference] = useState('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Cargar preferencias existentes al montar el componente
  useEffect(() => {
    if (profile?.preferences) {
      setPreference(profile.preferences.responsePreference || 'none');
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await saveUserPreferences({
        googleAccountId: profile.accountId,
        responsePreference: preference
      });
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Ha ocurrido un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-4">
        <img
          src={profile.profilePicture}
          alt={profile.profileName}
          className="w-10 h-10 rounded-full"
          onError={(e) => {
            e.target.src = 'https://www.gravatar.com/avatar/?d=mp';
          }}
        />
        <div>
          <h3 className="font-medium">{profile.profileName}</h3>
          <p className="text-sm text-gray-500">{profile.profileEmail}</p>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">
          Preferencia de respuesta
        </label>
        <Select value={preference} onValueChange={setPreference}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Selecciona una preferencia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Responder a todas las reseñas</SelectItem>
            <SelectItem value="positive">Responder solo a reseñas positivas</SelectItem>
            <SelectItem value="none">No responder automáticamente</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="text-green-600 text-sm">
          Preferencias guardadas correctamente
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          loading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
      >
        {loading ? (
          <div className="flex items-center">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="ml-2">Guardando...</span>
          </div>
        ) : (
          'Guardar Preferencias'
        )}
      </button>
    </form>
  );
};

const AccountPreferences = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const currentUser = await getCurrentUser();
        const sub = currentUser?.userId;
        
        const response = await fetch(
          `https://j1asmzdgbg.execute-api.eu-west-3.amazonaws.com/google-reviews/cuentas-conectadas?sub=${sub}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProfiles(data.profiles);
      } catch (err) {
        setError('No pudimos cargar tus cuentas de Google');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4">
        {error}
      </div>
    );
  }

  if (!profiles.length) {
    return (
      <div className="text-center p-4">
        <p>No hay cuentas de Google conectadas</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferencias por Cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {profiles.map((profile) => (
            <div key={profile.accountId} className="border-b pb-6 last:border-0">
              <PreferencesForm profile={profile} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountPreferences;