import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) => state.roomPinPage || initialState;

export const selectRoomPinPage = createSelector(
  [selectDomain],
  roomPinPageState => roomPinPageState,
);
