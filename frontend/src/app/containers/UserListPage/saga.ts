import api from 'app/api';
import { toast } from 'react-toastify';
import { call, put, takeLatest } from 'redux-saga/effects';

import { actions } from './slice';

export function* fetchUsers() {
  try {
    const users = yield call(api.users.getUsers);
    yield put(actions.saveUsers(users.data));
  } catch (err) {
    toast.error('Failed to load users');
  }
}

export function* userListPageSaga() {
  yield takeLatest(actions.loadUsers.type, fetchUsers);
}
