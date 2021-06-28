/* This example requires Tailwind CSS v2.0+ */
import React, { useCallback, useEffect } from 'react';
import { withRouter } from 'react-router';
import api from 'app/api';
import { getRefreshToken, setRefreshToken } from 'app/localStorage';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Switch, useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useInjectReducer } from 'utils/redux-injectors';
import { sliceKey, reducer, actions } from './slice';
import { getCurrentUser } from './selectors';
import { Role } from 'types/User';
import { NotFoundPage } from '../NotFoundPage';
import AdminRoutes from './routes/AdminRoutes';
import BannedRoutes from './routes/BannedRoutes';
import LibrarianRoutes from './routes/LibrarianRoutes';
import StaffRoutes from './routes/StaffRoutes';
import StudentRoutes from './routes/StudentRoutes';
import { ConsolidatedRoomPinPage } from '../ConsolidatedRoomPinPage';
import { RoomPinPage } from '../RoomPinPage';
import Sidebar from './components/Sidebar';

const AuthenticatedPages: React.FC = () => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  const currentUser = useSelector(getCurrentUser);

  const history = useHistory();
  const dispatch = useDispatch();
  const tokenLogin = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      history.push('/login');
      return;
    }
    const loggedIn = await api.auth.tokenLogin(refreshToken);
    if (!loggedIn) {
      setRefreshToken(null);
      history.push('/login');
      return;
    }
    const user = await api.users.getOwnUser();
    if (!user) {
      setRefreshToken(null);
      toast.error(
        'An unexpected error occured when logging in. Please try refreshing the page.',
      );
      return;
    }
    dispatch(actions.loginSuccess(user));
  }, [dispatch, history]);

  useEffect(() => {
    if (currentUser) {
      return;
    }
    tokenLogin();
  }, [currentUser, tokenLogin]);

  if (!!!currentUser) {
    return <></>;
  }

  const RoleRoutes = () => {
    if (currentUser.bannedEndTime) {
      return BannedRoutes;
    }
    switch (currentUser.role) {
      case Role.STUDENT:
        return StudentRoutes;
      case Role.STAFF:
        return StaffRoutes;
      case Role.LIBRARIAN:
        return LibrarianRoutes;
      case Role.ADMIN:
        return AdminRoutes;
    }
  };

  if (currentUser.role >= Role.LIBRARIAN)
    return (
      <Switch>
        <Route
          path={process.env.PUBLIC_URL + '/rooms/:id/pin'}
          component={RoomPinPage}
        />
        <Route
          exact
          path={process.env.PUBLIC_URL + '/rooms/pin'}
          component={ConsolidatedRoomPinPage}
        />
        <Route path={process.env.PUBLIC_URL + '/'}>
          <Sidebar currentUser={currentUser}>
            <Switch>
              {RoleRoutes().map((RoleRoute, index) => (
                // eslint-disable-next-line
            <RoleRoute.type {...RoleRoute.props} key={index} />
              ))}
              <Route
                path={process.env.PUBLIC_URL + '/'}
                component={NotFoundPage}
              />
            </Switch>
          </Sidebar>
        </Route>
      </Switch>
    );

  return (
    <Sidebar currentUser={currentUser}>
      <Switch>
        {RoleRoutes().map((RoleRoute, index) => (
          // eslint-disable-next-line
          <RoleRoute.type {...RoleRoute.props} key={index} />
        ))}
        <Route path={process.env.PUBLIC_URL + '/'} component={NotFoundPage} />
      </Switch>
    </Sidebar>
  );
};

export default withRouter(AuthenticatedPages);
