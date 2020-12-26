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

import { CreateBookingPage } from 'app/containers/CreateBookingPage/Loadable';
import { DashboardPage } from 'app/containers/DashboardPage/Loadable';
import { NotFoundPage } from 'app/containers/NotFoundPage/Loadable';
import api from 'app/api';
import clsx from 'clsx';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
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
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import BookIcon from '@material-ui/icons/Book';
import { toast } from 'react-toastify';
import { Role } from 'types/User';
import { BookingListPage } from '../BookingListPage';

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
        <List>
          <ListItem button onClick={() => history.push('/bookings')}>
            <ListItemIcon>
              <BookIcon />
            </ListItemIcon>
            <ListItemText primary={'All Bookings'} />
          </ListItem>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: open,
        })}
      >
        <div className={classes.drawerHeader} />
        <Switch>
          <Route
            exact
            path={process.env.PUBLIC_URL + '/'}
            component={DashboardPage}
          />
          <Route
            exact
            path={process.env.PUBLIC_URL + '/newbooking'}
            component={CreateBookingPage}
          />
          {currentUser.role >= Role.LIBRARIAN && (
            <Route
              exact
              path={process.env.PUBLIC_URL + '/bookings'}
              component={BookingListPage}
            />
          )}
          <Route path={process.env.PUBLIC_URL + '/'} component={NotFoundPage} />
        </Switch>
      </main>
    </div>
  );
};

export default withRouter(AuthenticatedPages);
