import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
  useHistory,
} from 'react-router-dom';
import { getRefreshToken, setRefreshToken } from 'app/localStorage';
import { actions, reducer, sliceKey } from 'app/containers/LoginPage/slice';
import { loginPageSaga } from 'app/containers/LoginPage/saga';
import { getCurrentUser } from 'app/containers/LoginPage/selectors';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import StudentRoutes from './StudentRoutes';
import LibrarianRoutes from './LibrarianRoutes';
import TeacherRoutes from './TeacherRoutes';
import AdminRoutes from './AdminRoutes';
import { NotFoundPage } from 'app/containers/NotFoundPage/Loadable';
import api from 'app/api';
import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';
import {
  CardHeader,
  Drawer,
  CssBaseline,
  useScrollTrigger,
  Slide,
  AppBar,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Avatar,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import DashboardIcon from '@material-ui/icons/Dashboard';
import BookIcon from '@material-ui/icons/Book';
import { toast } from 'react-toastify';
import { Role, roleString } from 'types/User';

type Props = RouteComponentProps;

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    purple: {
      color: theme.palette.getContrastText(deepPurple[500]),
      backgroundColor: deepPurple[500],
    },
  }),
);

const AuthenticatedPages: React.FC<Props> = props => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: loginPageSaga });

  const history = useHistory();
  const dispatch = useDispatch();
  const currentUser = useSelector(getCurrentUser);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

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

  const toggleDrawerOpen = () => {
    setOpen(!open);
  };

  const trigger = useScrollTrigger();

  if (!!!currentUser) {
    return <></>;
  }

  const RoleRoutes = () => {
    switch (currentUser.role) {
      case Role.STUDENT:
        return StudentRoutes;
      case Role.TEACHER:
        return TeacherRoutes;
      case Role.LIBRARIAN:
        return LibrarianRoutes;
      case Role.ADMIN:
        return AdminRoutes;
    }
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Slide appear={false} direction="down" in={open || !trigger}>
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawerOpen}
              edge="start"
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              style={{ cursor: 'pointer' }}
              variant="h6"
              onClick={() => history.push('/')}
              noWrap
            >
              NUSH Library App
            </Typography>
          </Toolbar>
        </AppBar>
      </Slide>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <CardHeader
          avatar={
            <Avatar className={classes.purple}>
              {currentUser.name.substring(0, 2)}
            </Avatar>
          }
          title={currentUser.name}
          subheader={roleString[currentUser.role]}
          style={{ height: 64 }}
        />
        <Divider />
        {currentUser.role >= Role.LIBRARIAN && (
          <>
            <List>
              <ListItem button onClick={() => history.push('/')}>
                <ListItemIcon>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary={'Dashboard'} />
              </ListItem>
              <ListItem button onClick={() => history.push('/bookings')}>
                <ListItemIcon>
                  <BookIcon />
                </ListItemIcon>
                <ListItemText primary={'Bookings'} />
              </ListItem>
            </List>
            <Divider />
          </>
        )}
        <List>
          <ListItem button onClick={() => history.push('/')}>
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary={'My Bookings'} />
          </ListItem>
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          {RoleRoutes().map((RoleRoute, index) => (
            <RoleRoute.type {...RoleRoute.props} key={index} />
          ))}
          <Route path={process.env.PUBLIC_URL + '/'} component={NotFoundPage} />
        </Switch>
      </main>
    </div>
  );
};

export default withRouter(AuthenticatedPages);
