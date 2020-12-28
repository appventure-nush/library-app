import { AxiosResponse } from 'axios';
import { WeekViewData } from 'types/Week';
import client from './client';

const URL = '/weeks';

export async function getCurrentWeekSlots(): Promise<
  AxiosResponse<WeekViewData>
> {
  return client.get(`${URL}/current`);
}
