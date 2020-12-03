import { PayloadAction } from '@reduxjs/toolkit';
import { BookingListData } from 'types/Booking';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the DashboardPage container
export const initialState: ContainerState = {
  bookings: [],
};

const dashboardPageSlice = createSlice({
  name: 'dashboardPage',
  initialState,
  reducers: {
    dashboardRequest() {},
    saveBookings(state, action: PayloadAction<Array<BookingListData>>) {
      state.bookings = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = dashboardPageSlice;
