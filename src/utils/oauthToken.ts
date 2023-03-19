import axios from 'axios';

export const isAccessTokenValid = async (accessToken: string): Promise<boolean> => {
  try {
    const response = await axios.get(`https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${accessToken}`);
    if (response.status === 200 && response.data.expires_in > 0) {
      return true;
    }
  } catch (error) {
    return false;
  }

  return false;
}
