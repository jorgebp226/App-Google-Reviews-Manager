import { Auth } from 'aws-amplify';

const API_ENDPOINT = 'https://j1asmzdgbg.execute-api.eu-west-3.amazonaws.com/google-reviews/Preferecias';

export const saveUserPreferences = async (preferences) => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    const token = (await Auth.currentSession()).getIdToken().getJwtToken();
    
    const response = await fetch(`${API_ENDPOINT}/preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sub: user.attributes.sub,
        ...preferences
      }),
    });

    if (!response.ok) {
      throw new Error('Error saving preferences');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}