import React, { memo, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { BookmarkIcon, PlusIcon } from '@heroicons/react/outline';
import { getCurrentUser } from '../AuthenticatedPages/selectors';
import DashboardCard from './components/DashboardCard';
import { dashboardPageSaga } from './saga';
import { selectDashboardPage } from './selectors';
import { actions, reducer, sliceKey } from './slice';
import { Role } from 'types/User';
import { titleCase } from 'utils/helpers';

interface Props {}

export const DashboardPage = memo((props: Props) => {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: dashboardPageSaga });

  const dashboardPage = useSelector(selectDashboardPage);
  const currentUser = useSelector(getCurrentUser);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    dispatch(actions.dashboardRequest());
    if (currentUser !== null && currentUser.role === Role.STUDENT)
      dispatch(actions.loadOwnUserStats());
  }, [dispatch, currentUser]);

  if (!!!currentUser) return <></>;
  return (
    <>
      <Helmet>
        <title>Dashboard</title>
        <meta name="description" content="NUSH Library App Dashboard" />
      </Helmet>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-5 sm:col-span-3">
              <span className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                Welcome, {titleCase(currentUser.name)}!
              </span>
              {dashboardPage.userStats !== null && (
                <div className="flex items-center justify-between w-full mt-3">
                  <div className="flex items-center">
                    <BookmarkIcon
                      className="mb-2 mr-1 flex-shrink-0 h-8 w-8 text-black dark:text-white"
                      aria-hidden="true"
                    />
                    <div>
                      <div className="flex items-end">
                        <span className="text-2xl sm:text-3xl font-bold text-black dark:text-white">
                          {dashboardPage.userStats.bookedPerWeek}
                        </span>
                        <span className="ml-1 pt-3 text-lg sm:text-xl text-gray-500">
                          / 2
                        </span>
                      </div>
                      <span className="tracking-wide text-sm sm:text-base text-gray-500">
                        This week's bookings
                      </span>
                    </div>
                  </div>
                  {(dashboardPage.userStats === null ||
                    dashboardPage.userStats.bookedPerWeek < 2) && (
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-sm sm:rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                      onClick={() => {
                        history.push('/newbooking');
                      }}
                    >
                      <PlusIcon
                        className="-ml-1 mr-2 h-5 w-5"
                        aria-hidden="true"
                      />
                      New booking
                    </button>
                  )}
                </div>
              )}
              <div className="mt-3 mb-2 text-xl sm:text-2xl text-black dark:text-white font-bold">
                My Bookings
              </div>
              <div className="bg-white shadow dark:bg-black overflow-visible rounded-sm sm:rounded-md">
                <ul className="divide-y divide-gray-200 dark:divide-gray-800">
                  {dashboardPage.bookings.length === 0 && (
                    <li>
                      <div className="block">
                        <p className="text-lg text-gray-400 px-4 py-4 flex items-center sm:px-6">
                          You don't have any upcoming bookings!
                        </p>
                      </div>
                    </li>
                  )}

                  {dashboardPage.bookings.map(booking => (
                    <DashboardCard key={booking.id} booking={booking} />
                  ))}
                </ul>
              </div>
            </div>
            <div className="hidden md:block"></div>
          </div>
        </div>
      </div>
    </>
  );
});
