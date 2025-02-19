import { RootState } from 'types';

import { createSelector } from '@reduxjs/toolkit';

import { initialState } from './slice';
import { DisabledSlot, OccupiedSlot } from 'types/Week';
import { DateTime } from 'luxon';

const selectDomain = (state: RootState) =>
  state.createBookingPage || initialState;

export const selectOccupiedSlots = createSelector(
  [selectDomain],
  createBookingPage =>
    createBookingPage.occupiedSlots.map(slot => {
      const adaptedSlot: OccupiedSlot = {
        start: DateTime.fromISO(slot.start),
        end: DateTime.fromISO(slot.end),
      };
      return adaptedSlot;
    }),
);

export const selectDisabledSlots = createSelector(
  [selectDomain],
  createBookingPage =>
    createBookingPage.disabledSlots.map(slot => {
      const adaptedSlot: DisabledSlot = {
        start: DateTime.fromISO(slot.start),
        end: DateTime.fromISO(slot.end),
        reason: slot.reason,
      };
      return adaptedSlot;
    }),
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
