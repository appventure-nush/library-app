import { PayloadAction } from '@reduxjs/toolkit';
import { UserListViewData } from 'types/User';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { ContainerState } from './types';

// The initial state of the UserListPage container
export const initialState: ContainerState = {
  users: [],
};

const userListPageSlice = createSlice({
  name: 'userListPage',
  initialState,
  reducers: {
    saveUsers(state, action: PayloadAction<UserListViewData[]>) {
      state.users = action.payload;
    },
    loadUsers(state, action: PayloadAction) {},
  },
});

export const { actions, reducer, name: sliceKey } = userListPageSlice;
