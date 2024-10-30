const API_ENDPOINT = 'https://j1asmzdgbg.execute-api.eu-west-3.amazonaws.com/google-reviews/Preferecias';

export const saveUserPreferences = async (preferences) => {
  try {
    const response = await fetch(`${API_ENDPOINT}`, {
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

export default saveUserPreferences;
