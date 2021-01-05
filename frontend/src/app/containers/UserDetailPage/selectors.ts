import { RootState } from 'types';

import { createSelector } from '@reduxjs/toolkit';

import { initialState } from './slice';

const selectDomain = (state: RootState) => state.userDetailPage || initialState;

export const selectUserDetailPage = createSelector(
  [selectDomain],
  userDetailPageState => userDetailPageState,
);
