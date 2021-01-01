import { takeLatest, put, call } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { actions } from '../AuthenticatedPages/slice';
import { toast } from 'react-toastify';
import api from 'app/api';

export function* authorize(
  action: PayloadAction<{
    azureAdIdToken: String;
  }>,
) {
  try {
    const { azureAdIdToken } = action.payload;
    const loggedIn = yield call(api.auth.emailLogin, azureAdIdToken);

    if (!loggedIn) {
      throw new Error('Incorrect email');
    }

    const userData = yield call(api.users.getOwnUser);
    if (userData !== null) {
      yield put(actions.loginSuccess(userData));
    }
  } catch (error) {
    toast.error('Login failed');
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* loginPageSaga() {
  yield takeLatest(actions.loginRequest.type, authorize);
}
