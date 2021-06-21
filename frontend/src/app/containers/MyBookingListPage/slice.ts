import { BookingListViewData } from 'types/Booking';
import { createSlice } from 'utils/@reduxjs/toolkit';

import { PayloadAction } from '@reduxjs/toolkit';

import { ContainerState } from './types';

// The initial state of the BookingListPage container
export const initialState: ContainerState = {
  bookings: [],
};

const myBookingListPageSlice = createSlice({
  name: 'myBookingListPage',
  initialState,
  reducers: {
    saveBookings(state, action: PayloadAction<Array<BookingListViewData>>) {
      state.bookings = action.payload;
    },
    loadBookings(state, action: PayloadAction) {},
  },
});

export const { actions, reducer, name: sliceKey } = myBookingListPageSlice;
