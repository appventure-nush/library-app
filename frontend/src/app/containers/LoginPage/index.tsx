import { getRefreshToken } from 'app/localStorage';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useInjectSaga } from 'utils/redux-injectors';

import { Grid } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';

import { isLoggedIn } from '../AuthenticatedPages/selectors';
import { sliceKey } from '../AuthenticatedPages/slice';
import LoginForm from './components/LoginForm';
import { loginPageSaga } from './saga';

type Props = {};

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      height: '100vh',
      margin: 0,
    },
  }),
);

export const LoginPage: React.FC<Props> = (props: Props) => {
  useInjectSaga({ key: sliceKey, saga: loginPageSaga });
  const classes = useStyles();
  const history = useHistory();

  const loggedIn = useSelector(isLoggedIn);

  // redirect to homepage if logged in
  useEffect(() => {
    const refreshToken = getRefreshToken();
    if (loggedIn || refreshToken) {
      history.push('/');
    }
  }, [loggedIn, history]);

  return (
    <>
      <Helmet>
        <title>Login</title>
        <meta name="description" content="Description of Login" />
      </Helmet>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="center"
        spacing={0}
        className={classes.container}
      >
        <Grid item xs={3}>
          <LoginForm />
        </Grid>
      </Grid>
    </>
  );
};
