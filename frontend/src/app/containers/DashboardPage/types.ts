import { BookingListData } from 'types/Booking';

/* --- STATE --- */
export interface DashboardPageState {
  bookings: Array<BookingListData>;
}

export type ContainerState = DashboardPageState;
