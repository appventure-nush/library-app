import { AxiosResponse } from 'axios';
import { BookingListViewData } from 'types/Booking';
import {
  UserData,
  UserViewData,
  UserListViewData,
  UserStatsListData,
  Role,
} from 'types/User';

import client from './client';

const URL = '/users';

export async function getOwnUser(): Promise<UserData | null> {
  try {
    const { data } = await client.get<UserData>(`${URL}/self`);
    return data;
  } catch (error) {
    return null;
  }
}

export async function getOwnUserStats(): Promise<UserStatsListData> {
  return client.get(`${URL}/stats/self`);
}

export async function getUsers(): Promise<AxiosResponse<UserListViewData[]>> {
  return client.get(`${URL}`);
}

export async function getUser(
  id: String,
): Promise<AxiosResponse<UserViewData>> {
  return client.get(`${URL}/${id}`);
}

export async function getUserBookings(
  id: String,
): Promise<AxiosResponse<BookingListViewData[]>> {
  return client.get(`${URL}/${id}/bookings`);
}

export async function updateUserRole(
  id: String,
  role: Role,
): Promise<AxiosResponse> {
  return client.patch(`${URL}/${id}/role`, { role });
}

export async function createInfringement(
  id: String,
  details: String,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/${id}/infringements`, { details });
}

export async function banUser(
  id: String,
  details: String,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/${id}/ban`, { details });
}

export async function unbanUser(id: String): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/${id}/unban`);
}
