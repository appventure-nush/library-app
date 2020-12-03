import { takeLatest, put, call } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { actions } from './slice';
import { toast } from 'react-toastify';
import api from 'app/api';

export function* authorize(action: PayloadAction<{ email: string }>) {
  try {
    const { email } = action.payload;
    const loggedIn = yield call(api.auth.emailLogin, email);

    if (!loggedIn) {
      throw new Error('Incorrect email');
    }

    const userData = yield call(api.users.getOwnUser);
    if (userData !== null) {
      yield put(actions.loginSuccess(userData));
    }
  } catch (error) {
    toast.error('Incorrect email');
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* loginPageSaga() {
  yield takeLatest(actions.loginRequest.type, authorize);
}
