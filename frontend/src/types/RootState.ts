import { CreateBookingPageState } from 'app/containers/CreateBookingPage/types';
import { DashboardPageState } from 'app/containers/DashboardPage/types';
import { LoginState } from 'app/containers/LoginPage/types';
import { ThemeState } from 'styles/theme/types';
import { BookingListPageState } from 'app/containers/BookingListPage/types';
// [IMPORT NEW CONTAINERSTATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
  Properties are optional because they are injected when the components are mounted sometime in your application's life. 
  So, not available always
*/
export interface RootState {
  theme?: ThemeState;
  dashboardPage?: DashboardPageState;
  createBookingPage?: CreateBookingPageState;
  login: LoginState;
  bookingListPage?: BookingListPageState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
