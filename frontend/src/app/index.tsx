import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route, BrowserRouter } from 'react-router-dom';

import { LoginPage } from './containers/LoginPage/Loadable';
import AuthenticatedPages from './containers/AuthenticatedPages';

export function App() {
  return (
    <BrowserRouter>
      <Helmet
        titleTemplate="%s - React Boilerplate"
        defaultTitle="React Boilerplate"
      >
        <meta name="description" content="A React Boilerplate application" />
      </Helmet>

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
    </BrowserRouter>
  );
}
