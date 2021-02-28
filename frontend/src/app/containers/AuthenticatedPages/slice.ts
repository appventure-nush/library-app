import { UserData } from 'types/User';
import { createSlice } from 'utils/@reduxjs/toolkit';

import { PayloadAction } from '@reduxjs/toolkit';

import { ContainerState, LoginErrorType } from './types';
import { setAccessToken, setRefreshToken } from 'app/localStorage';

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
    logout(state, action: PayloadAction) {
      state.user = null;
      setAccessToken(null);
      setRefreshToken(null);
    },
  },
});

export const { actions, reducer, name: sliceKey } = loginSlice;
