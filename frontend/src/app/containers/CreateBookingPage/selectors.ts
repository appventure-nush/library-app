import { createSelector } from '@reduxjs/toolkit';

import { RootState } from 'types';
import { initialState } from './slice';

const selectDomain = (state: RootState) =>
  state.createBookingPage || initialState;

export const selectBookedSlots = createSelector(
  [selectDomain],
  createBookingPage => createBookingPage.bookedSlots,
);

export const selectDisabledSlots = createSelector(
  [selectDomain],
  createBookingPage => createBookingPage.disabledSlots,
);

export const selectRooms = createSelector(
  [selectDomain],
  createBookingPage => createBookingPage.rooms,
);

export const selectCurrentRoom = createSelector(
  [selectDomain],
  createBookingPage =>
    createBookingPage.currentRoom !== null
      ? createBookingPage.rooms[createBookingPage.currentRoom]
      : null,
);

export const selectCreateBookingPage = createSelector(
  [selectDomain],
  createBookingPage => createBookingPage,
);
