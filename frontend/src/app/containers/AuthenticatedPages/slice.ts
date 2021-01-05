import { UserData } from 'types/User';
import { createSlice } from 'utils/@reduxjs/toolkit';

import { PayloadAction } from '@reduxjs/toolkit';

import { ContainerState, LoginErrorType } from './types';

// The initial state of the LoginPage container
export const initialState: ContainerState = {
  user: null,
  loading: false,
  error: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    loginRequest(
      state,
      action: PayloadAction<{
        azureAdIdToken: String;
      }>,
    ) {
      state.loading = true;
      state.error = null;
      state.user = null;
    },
    loginError(state, action: PayloadAction<LoginErrorType>) {
      state.error = action.payload;
      state.loading = false;
    },
    loginSuccess(state, action: PayloadAction<UserData>) {
      state.user = action.payload;
    },
  },
});

export const { actions, reducer, name: sliceKey } = loginSlice;
