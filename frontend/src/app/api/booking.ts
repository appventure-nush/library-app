import { AxiosResponse } from 'axios';
import { BookingCreateData, BookingListViewData } from 'types/Booking';

import client from './client';

const URL = '/bookings';

export async function createBooking(
  bookingCreateData: BookingCreateData,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}`, bookingCreateData);
}

export async function cancelBooking(id: number): Promise<AxiosResponse<any>> {
  return client.patch(`${URL}/${id}/cancel`);
}

export async function checkInBooking(
  bookingId: number,
  checkInPin: string,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/${bookingId}/checkin`, { checkInPin });
}

export async function checkOutBooking(
  bookingId: number,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}/${bookingId}/checkout`);
}

export async function getUpComingBookings(): Promise<
  AxiosResponse<BookingListViewData[]>
> {
  return client.get(`${URL}/upComing`);
}

export async function getBookings(): Promise<
  AxiosResponse<BookingListViewData[]>
> {
  return client.get(`${URL}`);
}

export async function getMyBookings(): Promise<
  AxiosResponse<BookingListViewData[]>
> {
  return client.get(`${URL}/self`);
}

export async function getBooking(
  id: String,
): Promise<AxiosResponse<BookingListViewData[]>> {
  return client.get(`${URL}/${id}`);
}
