import React, { useState } from 'react';
import { saveUserPreferences } from '../services/api';

const PreferencesForm = () => {
  const [preference, setPreference] = useState('none');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await saveUserPreferences({
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
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <h2 className="text-lg font-medium mb-4">Configuración de Respuestas</h2>
      <p className="text-gray-500 mb-6">
        Elige cómo quieres que respondamos a las reseñas de tu negocio
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          {[
            { value: 'all', label: 'Responder a todas las reseñas' },
            { value: 'positive', label: 'Responder solo a reseñas positivas' },
            { value: 'none', label: 'No responder automáticamente' }
          ].map(({ value, label }) => (
            <div key={value} className="flex items-center">
              <input
                type="radio"
                id={value}
                name="responsePreference"
                value={value}
                checked={preference === value}
                onChange={(e) => setPreference(e.target.value)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={value} className="ml-3 block text-sm font-medium text-gray-700">
                {label}
              </label>
            </div>
          ))}
        </div>

        {error && (
          <div className="text-red-600 text-sm mt-2">
            {error}
          </div>
        )}

        {success && (
          <div className="text-green-600 text-sm mt-2">
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span className="ml-2">Guardando...</span>
            </div>
          ) : (
            'Guardar Preferencias'
          )}
        </button>
      </form>
    </div>
  );
};

export default PreferencesForm;