import { AxiosResponse } from 'axios';
import { BookingCreateData, BookingListData } from 'types/Booking';
import client from './client';

const URL = '/bookings';

export async function createBooking(
  bookingCreateData: BookingCreateData,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}`, bookingCreateData);
}

export async function getOwnBookings(): Promise<
  AxiosResponse<Array<BookingListData>>
> {
  return client.get(`${URL}/self`);
}
