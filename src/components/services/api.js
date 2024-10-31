import { getCurrentUser } from 'aws-amplify/auth';

const API_ENDPOINT = 'https://j1asmzdgbg.execute-api.eu-west-3.amazonaws.com/google-reviews/Preferecias';

export const saveUserPreferences = async ({ googleAccountId, responsePreference }) => {
  try {
    const { userId } = await getCurrentUser();
    const preferencesWithUser = {
      googleAccountId,
      responsePreference,
      sub: userId
    };

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferencesWithUser),
    });

    if (!response.ok) {
      throw new Error('Error al guardar las preferencias');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};