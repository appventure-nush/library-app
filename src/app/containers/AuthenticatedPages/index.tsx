import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
  useHistory,
} from 'react-router-dom';
import { getRefreshToken } from 'app/localStorage';
import { actions } from 'app/containers/LoginPage/slice';
import { isLoggedIn } from 'app/containers/LoginPage/selectors';

import { HomePage } from 'app/containers/HomePage/Loadable';
import { NotFoundPage } from 'app/containers/NotFoundPage/Loadable';
import { User } from 'types/User';

type Props = RouteComponentProps;

const AuthenticatedPages: React.FC<Props> = props => {
  const history = useHistory();
  const dispatch = useDispatch();
  const loggedIn = useSelector(isLoggedIn);

  const tokenLogin = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      history.push('/login');
      return;
    }
    // const loggedIn = await api.auth.tokenLogin(refreshToken);
    const isAuth = true;
    if (!isAuth) {
      history.push('/login');
      return;
    }
    // const user = await api.users.getOwnUser();
    const user: User = {
      name: 'admin',
      email: 'admin@nush.app',
    };
    if (!user) {
      console.log(
        'An unexpected error occured when logging in. Please try refreshing the page.',
      );
      return;
    }
    dispatch(actions.loginSuccess(user));
  }, [dispatch, history]);

  useEffect(() => {
    if (loggedIn) {
      return;
    }
    tokenLogin();
  }, [loggedIn, tokenLogin]);

  return (
    <Switch>
      <Route exact path={process.env.PUBLIC_URL + '/'} component={HomePage} />
      <Route path={process.env.PUBLIC_URL + '/'} component={NotFoundPage} />
    </Switch>
  );
};

export default withRouter(AuthenticatedPages);
