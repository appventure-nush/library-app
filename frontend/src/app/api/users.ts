import { AxiosResponse } from 'axios';
import { UserData } from 'types/User';
import client from './client';

const URL = '/users';

export async function getUser(id: number): Promise<AxiosResponse<UserData>> {
  return client.get(`${URL}/${id}`);
}

export async function getOwnUser(): Promise<UserData | null> {
  try {
    const { data } = await client.get<UserData>(`${URL}/self`);
    return data;
  } catch (error) {
    return null;
  }
}
