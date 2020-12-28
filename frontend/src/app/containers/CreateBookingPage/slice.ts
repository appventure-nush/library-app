import { PayloadAction } from '@reduxjs/toolkit';
import { WeekViewData } from 'types/Week';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the CreateBookingPage container
export const initialState: ContainerState = {
  bookedSlots: [],
  disabledSlots: [],
};

const createBookingPageSlice = createSlice({
  name: 'createBookingPage',
  initialState,
  reducers: {
    loadCurrentWeekSlots(state, action: PayloadAction) {},
    saveCurrentWeekSlots(state, action: PayloadAction<WeekViewData>) {
      state.bookedSlots = action.payload.bookedSlots;
      state.disabledSlots = action.payload.disabledSlots;
    },
  },
});

export const { actions, reducer, name: sliceKey } = createBookingPageSlice;
