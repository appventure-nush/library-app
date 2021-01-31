import { createSlice } from 'utils/@reduxjs/toolkit';

import { PayloadAction } from '@reduxjs/toolkit';

import { ContainerState } from './types';
import { UserViewData } from 'types/User';

// The initial state of the UserDetailPage container
export const initialState: ContainerState = {
  user: null,
};

const userDetailPageSlice = createSlice({
  name: 'userDetailPage',
  initialState,
  reducers: {
    saveUser(state, action: PayloadAction<UserViewData>) {
      state.user = action.payload;
    },
    loadUser(state, action: PayloadAction<String>) {},
  },
});

export const { actions, reducer, name: sliceKey } = userDetailPageSlice;
