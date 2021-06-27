/**
 *
 * BannedPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';
import { getCurrentUser } from '../AuthenticatedPages/selectors';
import { DateTime } from 'luxon';
import { ExclamationIcon } from '@heroicons/react/solid';

interface Props {}

export function BannedPage(props: Props) {
  const currentUser = useSelector(getCurrentUser);

  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="You have been banned" />
      </Helmet>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <ExclamationIcon
                className="h-6 w-6 text-red-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                Sorry, you have been banned
              </h3>
              <div className="mt-2 text-sm text-gray-500">
                <p>
                  Your account will unlock at:{' '}
                  {currentUser?.bannedEndTime &&
                    DateTime.fromISO(currentUser?.bannedEndTime).toFormat(
                      "HH':'mm', 'dd MMMM yyyy",
                    )}
                </p>
                {currentUser?.bannedReason && (
                  <p>Banned Reason: {currentUser?.bannedReason}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
