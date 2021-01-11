import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the RoomPinPage container
export const initialState: ContainerState = {
  pin: '',
};

const roomPinPageSlice = createSlice({
  name: 'roomPinPage',
  initialState,
  reducers: {
    loadRoomPin(state, action: PayloadAction<String>) {},
    saveRoomPin(state, action: PayloadAction<String>) {
      state.pin = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = roomPinPageSlice;
