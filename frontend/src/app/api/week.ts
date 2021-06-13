import { AxiosResponse } from 'axios';
import { RawWeekViewData } from 'types/Week';

import client from './client';

const URL = '/weeks';

export async function getCurrentWeekSlots(
  roomId: number,
  delta: number = 0,
): Promise<AxiosResponse<RawWeekViewData>> {
  return client.get(`${URL}/current?roomId=${roomId}&delta=${delta}`);
}
