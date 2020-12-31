import { AuthenticationData } from 'types/Auth';
import client, { setAuthenticationTokens } from './client';

const URL = '/auth';

export async function tokenLogin(token: string) {
  try {
    const { data } = await client.post<AuthenticationData>(
      `${URL}/token`,
      null,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setAuthenticationTokens(data);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Attempts to login with an email
 */
export async function emailLogin(azureAdIdToken: String) {
  try {
    const { data } = await client.post<AuthenticationData>(`${URL}/email`, {
      azureAdIdToken,
    });
    setAuthenticationTokens(data);
    return true;
  } catch (error) {
    return false;
  }
}
