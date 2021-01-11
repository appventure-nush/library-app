import { AxiosResponse } from 'axios';
import { RoomListData } from 'types/Room';

import client from './client';

const URL = '/rooms';

export async function getBookableRooms(): Promise<
  AxiosResponse<RoomListData[]>
> {
  return client.get(`${URL}/bookables`);
}

export async function getRoomPin(id: String): Promise<AxiosResponse<String>> {
  return client.get(`${URL}/${id}/pin`);
}
