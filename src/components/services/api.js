import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const API_ENDPOINT = 'https://j1asmzdgbg.execute-api.eu-west-3.amazonaws.com/google-reviews/Preferecias';

export const saveUserPreferences = async (preferences) => {
  try {
    const user = await getCurrentUser();
    const { idToken } = (await fetchAuthSession()).tokens;
    
    const response = await fetch(`${API_ENDPOINT}/preferences`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${idToken.getJwtToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sub: user.userId,
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
};

export default saveUserPreferences;
