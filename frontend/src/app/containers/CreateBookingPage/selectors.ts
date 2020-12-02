import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.createBookingPage || initialState;

export const selectCreateBookingPage = createSelector(
  [selectDomain],
  createBookingPage => createBookingPage,
);
