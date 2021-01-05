import { BookingListData } from 'types/Booking';
import { UserStatsListData } from 'types/User';

/* --- STATE --- */
export interface DashboardPageState {
  bookings: Array<BookingListData>;
  userStats: UserStatsListData | null;
}

export type ContainerState = DashboardPageState;
