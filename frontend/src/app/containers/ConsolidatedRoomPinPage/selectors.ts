import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.consolidatedRoomPinPage || initialState;

export const selectConsolidatedRoomPinPage = createSelector(
  [selectDomain],
  consolidatedRoomPinPageState => consolidatedRoomPinPageState,
);
