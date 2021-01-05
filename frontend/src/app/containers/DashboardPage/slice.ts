import { BookingListData } from 'types/Booking';
import { UserStatsListData } from 'types/User';
import { createSlice } from 'utils/@reduxjs/toolkit';

import { PayloadAction } from '@reduxjs/toolkit';

import { ContainerState } from './types';

// The initial state of the DashboardPage container
export const initialState: ContainerState = {
  bookings: [],
  userStats: null,
};

const dashboardPageSlice = createSlice({
  name: 'dashboardPage',
  initialState,
  reducers: {
    dashboardRequest() {},
    saveBookings(state, action: PayloadAction<Array<BookingListData>>) {
      state.bookings = action.payload;
    },
    loadOwnUserStats() {},
    saveUserStats(state, action: PayloadAction<UserStatsListData>) {
      state.userStats = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = dashboardPageSlice;
