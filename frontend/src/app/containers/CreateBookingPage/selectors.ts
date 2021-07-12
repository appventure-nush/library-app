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

export const selectRooms = createSelector([selectDomain], createBookingPage =>
  createBookingPage.rooms.slice().sort((a, b) => (b.name > a.name ? -1 : 1)),
);

export const selectCurrentRoom = createSelector(
  [selectDomain],
  createBookingPage =>
    createBookingPage.currentRoom !== null
      ? createBookingPage.rooms
          .slice()
          .sort((a, b) => (b.name > a.name ? -1 : 1))[
          createBookingPage.currentRoom
        ]
      : null,
);

export const selectCreateBookingPage = createSelector(
  [selectDomain],
  createBookingPage => createBookingPage,
);
