import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.userDetailPage || initialState;

export const selectUserDetailPage = createSelector(
  [selectDomain],
  userDetailPageState => userDetailPageState,
);
