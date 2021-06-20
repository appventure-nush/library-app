import { createSlice } from 'utils/@reduxjs/toolkit';

import { PayloadAction } from '@reduxjs/toolkit';

import { ContainerState } from './types';
import { UserViewData } from 'types/User';
import { BookingListViewData } from 'types/Booking';

// The initial state of the UserDetailPage container
export const initialState: ContainerState = {
  user: null,
  userBookings: [],
};

const userDetailPageSlice = createSlice({
  name: 'userDetailPage',
  initialState,
  reducers: {
    saveUser(state, action: PayloadAction<UserViewData>) {
      state.user = action.payload;
    },
    loadUser(state, action: PayloadAction<String>) {},
    saveUserBookings(state, action: PayloadAction<BookingListViewData[]>) {
      state.userBookings = action.payload;
    },
    loadUserBookings(state, action: PayloadAction<String>) {},
  },
});

export const { actions, reducer, name: sliceKey } = userDetailPageSlice;
