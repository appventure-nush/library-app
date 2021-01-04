import { AxiosResponse } from 'axios';
import { WeekViewData } from 'types/Week';
import client from './client';

const URL = '/weeks';

export async function getCurrentWeekSlots(
  roomId: number,
): Promise<AxiosResponse<WeekViewData>> {
  return client.get(`${URL}/current?roomId=${roomId}`);
}
