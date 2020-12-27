import { AxiosResponse } from 'axios';
import {
  BookingCreateData,
  BookingListData,
  BookingListViewData,
} from 'types/Booking';
import client from './client';

const URL = '/bookings';

export async function createBooking(
  bookingCreateData: BookingCreateData,
): Promise<AxiosResponse<any>> {
  return client.post(`${URL}`, bookingCreateData);
}

export async function getUpComingBookings(): Promise<
  AxiosResponse<Array<BookingListData>>
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
