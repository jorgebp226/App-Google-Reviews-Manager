import { getCurrentUser } from 'aws-amplify/auth';
import React, { useState } from 'react';

const API_ENDPOINT = 'https://j1asmzdgbg.execute-api.eu-west-3.amazonaws.com/google-reviews/Preferecias';

const saveUserPreferences = async (preferences) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (!response.ok) {
      throw new Error('Error saving preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const PreferencesForm = () => {
  const [preference, setPreference] = useState('all');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const { userId } = await getCurrentUser();
      const preferences = {
        sub: userId,
        responsePreference: preference
      };
      
      const result = await saveUserPreferences(preferences);
      setSuccess('Preferencias guardadas exitosamente');
    } catch (error) {
      setError('Error al guardar las preferencias');
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Preferencia de respuestas
        </label>
        <select
          value={preference}
          onChange={(e) => setPreference(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        >
          <option value="all">Todas las reseñas</option>
          <option value="positive">Solo positivas</option>
          <option value="none">Ninguna</option>
        </select>
      </div>

      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
      >
        Guardar preferencias
      </button>
    </form>
  );
};

export default PreferencesForm;