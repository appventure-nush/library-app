import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link as RouterLink } from 'react-router-dom';

import { Link, Typography } from '@material-ui/core';

export function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 Page Not Found</title>
        <meta name="description" content="Page not found" />
      </Helmet>
      <div>
        <div>
          4
          <span role="img" aria-label="Crying Face">
            😢
          </span>
          4
        </div>
        <Typography variant="body1">Page not found.</Typography>
        <Link component={RouterLink} to={process.env.PUBLIC_URL + '/'}>
          Return to Home Page
        </Link>
      </div>
    </>
  );
}
