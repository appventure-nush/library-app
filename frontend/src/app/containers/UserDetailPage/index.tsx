/**
 *
 * UserDetailPage
 *
 */

import { Breadcrumbs, Typography, Link } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/solid';

import { userDetailPageSaga } from './saga';
import { selectUserDetailPage } from './selectors';
import { actions, reducer, sliceKey } from './slice';
import { roleString } from 'types/User';
import { getCurrentUser } from '../AuthenticatedPages/selectors';
import api from 'app/api';

interface Props {}

export function UserDetailPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: userDetailPageSaga });

  const { user } = useSelector(selectUserDetailPage);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const currentUser = useSelector(getCurrentUser);

  useEffect(() => {
    dispatch(actions.loadUser(id));
  }, [dispatch, id]);

  function handleMenuClick(role) {
    if (user != null) {
      if (id === user.id) {
        alert('You cannot change your own role!');
        return;
      }
    }
    api.users
      .updateUserRole(id, role)
      .then(() => dispatch(actions.loadUser(id)));
  }

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  function roleMenuItem(role) {
    return (
      <Menu.Item>
        {({ active }) => (
          <button
            className={classNames(
              active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
              'block w-full text-left px-4 py-2 text-sm',
            )}
            onClick={e => {
              handleMenuClick(role);
            }}
            key={role}
          >
            {roleString[role]}
          </button>
        )}
      </Menu.Item>
    );
  }

  function dropDownMenu() {
    return (
      <Menu as="div" className="relative inline-block text-left">
        {({ open }) => (
          <>
            <div>
              <Menu.Button className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500">
                {user && roleString[user.role]}
                <ChevronDownIcon
                  className="-mr-1 ml-2 h-5 w-5"
                  aria-hidden="true"
                />
              </Menu.Button>
            </div>

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="py-1">
                  {/*TODO: Un-Hardcode this */}
                  {roleMenuItem(1)}
                  {roleMenuItem(11)}
                  {roleMenuItem(12)}
                  {roleMenuItem(100)}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    );
  }

  return (
    <>
      <Helmet>
        <title>User Info</title>
        <meta name="description" content="Description of UserDetailPage" />
      </Helmet>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <Breadcrumbs
            className="text-black dark:text-white"
            separator="›"
            style={{ marginBottom: 20 }}
          >
            <Link
              className="text-black dark:text-white"
              component="button"
              onClick={() => history.push('/users')}
            >
              Users
            </Link>
            {user && (
              <div className="text-black dark:text-white">{user.name}</div>
            )}
          </Breadcrumbs>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user && user.name}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">ID</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user && user.id}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user && user.email}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {dropDownMenu()}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Number of bookings this week
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user && user.bookedPerWeek}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Number of infringements this term
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {user && user.infringementThisTerm.length}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
