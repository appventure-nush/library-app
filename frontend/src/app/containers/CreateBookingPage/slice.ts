import { RoomListData } from 'types/Room';
import { RawWeekViewData } from 'types/Week';
import { createSlice } from 'utils/@reduxjs/toolkit';

import { PayloadAction } from '@reduxjs/toolkit';

import { ContainerState } from './types';

// The initial state of the CreateBookingPage container
export const initialState: ContainerState = {
  occupiedSlots: [],
  disabledSlots: [],
  rooms: [],
  currentRoom: null,
};

const createBookingPageSlice = createSlice({
  name: 'createBookingPage',
  initialState,
  reducers: {
    loadCurrentWeekSlots(
      state,
      action: PayloadAction<{ roomId: number; delta: number }>,
    ) {},
    saveCurrentWeekSlots(state, action: PayloadAction<RawWeekViewData>) {
      state.occupiedSlots = action.payload.occupiedSlots;
      state.disabledSlots = action.payload.disabledSlots;
    },
    loadBookableRooms(state, action: PayloadAction) {},
    saveBookableRooms(state, action: PayloadAction<RoomListData[]>) {
      state.rooms = action.payload;
    },
    updateCurrentRoom(state, action: PayloadAction<number>) {
      state.currentRoom = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = createBookingPageSlice;
