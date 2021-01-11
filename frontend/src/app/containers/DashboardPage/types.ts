import { BookingListViewData } from 'types/Booking';
import { UserStatsListData } from 'types/User';

/* --- STATE --- */
export interface DashboardPageState {
  bookings: Array<BookingListViewData>;
  userStats: UserStatsListData | null;
}

export type ContainerState = DashboardPageState;
