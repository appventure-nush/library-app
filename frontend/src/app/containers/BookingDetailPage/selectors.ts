import { RootState } from 'types';

import { createSelector } from '@reduxjs/toolkit';

import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.bookingDetailPage || initialState;

export const selectBookingDetailPage = createSelector(
  [selectDomain],
  bookingDetailPageState => bookingDetailPageState,
);
