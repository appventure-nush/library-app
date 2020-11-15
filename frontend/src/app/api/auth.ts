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
 * TEMPORARY METHOD BEFORE OFFICE 365 OAUTH
 * Attempts to login with only an email.
 */
export async function emailLogin(email: string) {
  try {
    const { data } = await client.post<AuthenticationData>(`${URL}/email`, {
      email,
    });
    setAuthenticationTokens(data);
    return true;
  } catch (error) {
    return false;
  }
}
