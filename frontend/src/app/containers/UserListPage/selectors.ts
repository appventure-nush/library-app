import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.userListPage || initialState;

export const selectUserList = createSelector(
  [selectDomain],
  userListPageState => userListPageState.users,
);
