import { RootState } from 'types';

import { createSelector } from '@reduxjs/toolkit';

import { initialState } from './slice';

const selectDomain = (state: RootState) => state.userDetailPage || initialState;

export const selectUserDetails = createSelector(
  [selectDomain],
  userDetailPageState => userDetailPageState.user,
);

export const selectUserBookings = createSelector(
  [selectDomain],
  userDetailPageState => userDetailPageState.userBookings,
);
