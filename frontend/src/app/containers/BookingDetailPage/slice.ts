import { PayloadAction } from '@reduxjs/toolkit';
import { BookingViewData } from 'types/Booking';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the BookingDetailPage container
export const initialState: ContainerState = {
  booking: null,
};

const bookingDetailPageSlice = createSlice({
  name: 'bookingDetailPage',
  initialState,
  reducers: {
    saveBooking(state, action: PayloadAction<BookingViewData>) {
      state.booking = action.payload;
    },
    loadBooking(state, action: PayloadAction<String>) {},
  },
});

export const { actions, reducer, name: sliceKey } = bookingDetailPageSlice;
