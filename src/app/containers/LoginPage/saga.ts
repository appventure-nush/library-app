import { takeLatest, put } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { setAccessToken, setRefreshToken } from 'app/localStorage';
import { actions } from './slice';
import { User } from 'types/User';

export function* authorize(action: PayloadAction<{ email: String }>) {
  const { email } = action.payload;
  //fake authentication
  let userData: User;
  if (email === 'admin@nush.app') {
    userData = {
      name: 'admin',
      email: 'admin@nush.app',
    };
    const apiToken = 'myfakeapitoken';
    const refreshToken = 'myfakerefreshtoken';
    setAccessToken(apiToken);
    setRefreshToken(refreshToken);
    yield put(actions.loginSuccess(userData));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* loginPageSaga() {
  yield takeLatest(actions.loginRequest.type, authorize);
}
