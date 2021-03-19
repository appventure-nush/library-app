import { PayloadAction } from '@reduxjs/toolkit';
import { RoomPinData } from 'types/Room';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the ConsolidatedRoomPinPage container
export const initialState: ContainerState = {
  pins: [],
};

const consolidatedRoomPinPageSlice = createSlice({
  name: 'consolidatedRoomPinPage',
  initialState,
  reducers: {
    loadRoomPins(state, action: PayloadAction) {},
    saveRoomPins(state, action: PayloadAction<RoomPinData[]>) {
      state.pins = action.payload;
    },
  },
});

export const {
  actions,
  reducer,
  name: sliceKey,
} = consolidatedRoomPinPageSlice;
