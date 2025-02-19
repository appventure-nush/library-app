import { LoginState } from 'app/containers/AuthenticatedPages/types';
import { BookingDetailPageState } from 'app/containers/BookingDetailPage/types';
import { BookingListPageState } from 'app/containers/BookingListPage/types';
import { CreateBookingPageState } from 'app/containers/CreateBookingPage/types';
import { DashboardPageState } from 'app/containers/DashboardPage/types';
import { UserDetailPageState } from 'app/containers/UserDetailPage/types';

import { RoomPinPageState } from 'app/containers/RoomPinPage/types';
import { UserListPageState } from 'app/containers/UserListPage/types';
import { ConsolidatedRoomPinPageState } from 'app/containers/ConsolidatedRoomPinPage/types';
import { MyBookingListPageState } from 'app/containers/MyBookingListPage/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/*
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life.
  So, not available always
*/
export interface RootState {
  dashboardPage?: DashboardPageState;
  createBookingPage?: CreateBookingPageState;
  login: LoginState;
  bookingListPage?: BookingListPageState;
  myBookingListPage?: MyBookingListPageState;
  userDetailPage?: UserDetailPageState;
  bookingDetailPage?: BookingDetailPageState;
  roomPinPage?: RoomPinPageState;
  userListPage?: UserListPageState;
  consolidatedRoomPinPage?: ConsolidatedRoomPinPageState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
