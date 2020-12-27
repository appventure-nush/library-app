import { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the UserDetailPage container
export const initialState: ContainerState = {};

const userDetailPageSlice = createSlice({
  name: 'userDetailPage',
  initialState,
  reducers: {
    someAction(state, action: PayloadAction<any>) {},
  },
});

export const { actions, reducer, name: sliceKey } = userDetailPageSlice;
