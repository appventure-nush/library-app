import { BookingListViewData } from 'types/Booking';

/* --- STATE --- */
export interface MyBookingListPageState {
  bookings: Array<BookingListViewData>;
}

export type ContainerState = MyBookingListPageState;
