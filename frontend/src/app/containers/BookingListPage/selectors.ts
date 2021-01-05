import { RootState } from 'types';

import { createSelector } from '@reduxjs/toolkit';

import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.bookingListPage || initialState;

export const selectBookingListPage = createSelector(
  [selectDomain],
  bookingListPageState => bookingListPageState,
);
