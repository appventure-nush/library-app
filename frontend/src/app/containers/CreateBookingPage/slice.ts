import { PayloadAction } from '@reduxjs/toolkit';
import { RoomListData } from 'types/Room';
import { WeekViewData } from 'types/Week';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the CreateBookingPage container
export const initialState: ContainerState = {
  bookedSlots: [],
  disabledSlots: [],
  rooms: [],
  currentRoom: null,
};

const createBookingPageSlice = createSlice({
  name: 'createBookingPage',
  initialState,
  reducers: {
    loadCurrentWeekSlots(state, action: PayloadAction<number>) {},
    saveCurrentWeekSlots(state, action: PayloadAction<WeekViewData>) {
      state.bookedSlots = action.payload.bookedSlots;
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
