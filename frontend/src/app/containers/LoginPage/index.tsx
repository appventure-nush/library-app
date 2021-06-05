import { getRefreshToken } from 'app/localStorage';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { isLoggedIn } from '../AuthenticatedPages/selectors';
import { actions, sliceKey, reducer } from '../AuthenticatedPages/slice';
import { loginPageSaga } from './saga';
import MicrosoftLogin from 'react-microsoft-login';

export const LoginPage: React.FC = () => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: loginPageSaga });
  const history = useHistory();
  const dispatch = useDispatch();

  const loggedIn = useSelector(isLoggedIn);

  // redirect to homepage if logged in
  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (loggedIn || refreshToken) {
      history.push('/');
    }
  }, [loggedIn, history]);

  const authHandler = (err, data) => {
    dispatch(
      actions.loginRequest({
        azureAdIdToken: data.idToken.rawIdToken,
      }),
    );
  };

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Description of Login" />
      </Helmet>
      <div className="flex flex-col h-screen items-stretch bg-white dark:bg-gray-800 ">
        <header className="bg-teal-600">
          <nav
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
            aria-label="Top"
          >
            <div className="w-full py-3 flex items-center justify-between border-b border-teal-500 lg:border-none">
              <div className="flex items-center">
                <button>
                  <span className="sr-only">Library App</span>
                  <img className="h-10 w-auto" src="/favicon.ico" alt="" />
                </button>
                <div className="ml-10 space-x-8 block">
                  <button
                    className="text-base font-medium text-white hover:text-indigo-50"
                    key="About"
                  >
                    About
                  </button>
                </div>
              </div>
              <div className="ml-10 space-x-4">
                <MicrosoftLogin
                  withUserData
                  clientId={
                    process.env.CLIENT_ID ??
                    'b2c54a7a-5231-4de6-b3b1-c603abbaed00'
                  }
                  tenantUrl={`https://login.microsoftonline.com/${
                    process.env.TENANT_ID ??
                    'd72a7172-d5f8-4889-9a85-d7424751592a'
                  }`}
                  redirectUri={`${window.location.origin}/login`}
                  authCallback={authHandler}
                >
                  <button className="inline-block bg-white py-2 px-4 border border-transparent rounded-md text-base font-medium text-teal-600 border-teal-500 hover:bg-teal-50">
                    Login
                  </button>
                </MicrosoftLogin>
              </div>
            </div>
          </nav>
        </header>
        <div className="flex flex-grow">
          <div className="m-auto flex-col space-y-3">
            <span className="text-black dark:text-white font-sans font-semibold md:text-6xl text-3xl">
              Welcome to the{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-green-300 to-teal-600">
                Node
              </span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
};
