import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Settings } from 'luxon';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { LoginPage } from './containers/LoginPage/Loadable';
import AuthenticatedPages from './containers/AuthenticatedPages';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';

Settings.defaultZoneName = 'Asia/Singapore';

toast.configure();
const baseTheme = createMuiTheme();

export function App() {
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - NUSH Library App"
        defaultTitle="NUSH Library App"
      >
        <meta name="description" content="A NUSH Library App application" />
      </Helmet>
      <ThemeProvider theme={baseTheme}>
        <Switch>
          <Route
            exact
            path={process.env.PUBLIC_URL + '/login'}
            component={LoginPage}
          />
          <Route
            path={process.env.PUBLIC_URL + '/'}
            component={AuthenticatedPages}
          />
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
}
