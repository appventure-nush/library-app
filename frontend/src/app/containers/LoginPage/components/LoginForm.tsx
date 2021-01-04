import React from 'react';
import { useDispatch } from 'react-redux';
import { actions } from 'app/containers/AuthenticatedPages/slice';
import MicrosoftLogin from 'react-microsoft-login';

const LoginForm = () => {
  const dispatch = useDispatch();

  const authHandler = (err, data) => {
    dispatch(
      actions.loginRequest({
        azureAdIdToken: data.idToken.rawIdToken,
      }),
    );
  };

  return (
    <MicrosoftLogin
      withUserData
      clientId={process.env.CLIENT_ID ?? 'b2c54a7a-5231-4de6-b3b1-c603abbaed00'}
      tenantUrl={`https://login.microsoftonline.com/${
        process.env.TENANT_ID ?? 'd72a7172-d5f8-4889-9a85-d7424751592a'
      }`}
      redirectUri={`${window.location.origin}/login`}
      authCallback={authHandler}
    />
  );
};

export default LoginForm;
