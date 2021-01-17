/**
 *
 * BannedPage
 *
 */

import { Typography } from '@material-ui/core';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../AuthenticatedPages/selectors';
import { DateTime } from 'luxon';

interface Props {}

export function BannedPage(props: Props) {
  const currentUser = useSelector(getCurrentUser);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="You have been banned" />
      </Helmet>
      <Typography variant="h6" gutterBottom>
        Sorry you have been banned
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Your account will unlock at:{' '}
        {currentUser?.bannedEndTime &&
          DateTime.fromISO(currentUser?.bannedEndTime).toString()}
      </Typography>
      {currentUser?.bannedReason && (
        <Typography variant="body1">
          Banned Reason: {currentUser?.bannedReason}
        </Typography>
      )}
    </>
  );
}
