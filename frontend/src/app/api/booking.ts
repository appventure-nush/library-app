import { AxiosResponse } from 'axios';
import { BookingCreateData } from 'types/Booking';
import client from './client';

const URL = '/bookings';

export async function createBooking(
  bookingCreateData: BookingCreateData,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}`, bookingCreateData);
}
