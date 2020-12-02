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
  const history = useHistory();
  const dispatch = useDispatch();
  const loggedIn = useSelector(isLoggedIn);
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
      history.push('/login');
      return;
    }
    const user = await api.users.getOwnUser();
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

  const toggleDrawerOpen = () => {
    setOpen(!open);
  };

  const trigger = useScrollTrigger();

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
            <Typography variant="h6" noWrap>
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
          <Route path={process.env.PUBLIC_URL + '/'} component={NotFoundPage} />
        </Switch>
      </main>
    </div>
  );
};

export default withRouter(AuthenticatedPages);
