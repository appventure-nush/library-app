import { BookingListViewData } from 'types/Booking';
import { UserViewData } from 'types/User';

/* --- STATE --- */
export interface UserDetailPageState {
  user: UserViewData | null;
  userBookings: BookingListViewData[];
}

export type ContainerState = UserDetailPageState;
