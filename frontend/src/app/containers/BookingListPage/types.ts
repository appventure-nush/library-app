import { BookingListViewData } from 'types/Booking';

/* --- STATE --- */
export interface BookingListPageState {
  bookings: Array<BookingListViewData>;
}

export type ContainerState = BookingListPageState;
