import React, { useEffect } from 'react';
import { Grid } from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectLoginPage, isLoggedIn } from './selectors';
import { loginPageSaga } from './saga';
import LoginForm from './components/LoginForm';
import { getRefreshToken } from 'app/localStorage';

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
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: loginPageSaga });
  const classes = useStyles();
  const history = useHistory();

  const loggedIn = useSelector(isLoggedIn);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const loginPage = useSelector(selectLoginPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

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
