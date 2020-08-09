import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.login || initialState;

export const selectLoginPage = createSelector(
  [selectDomain],
  loginPageState => loginPageState,
);

export const getCurrentUser = createSelector(
  [selectDomain],
  loginState => loginState.user,
);

export const isLoggedIn = createSelector(
  [selectDomain],
  loginState => !!loginState.user,
);
