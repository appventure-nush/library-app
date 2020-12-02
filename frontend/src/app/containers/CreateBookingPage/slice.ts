import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the CreateBookingPage container
export const initialState: ContainerState = {};

const createBookingPageSlice = createSlice({
  name: 'createBookingPage',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = createBookingPageSlice;
