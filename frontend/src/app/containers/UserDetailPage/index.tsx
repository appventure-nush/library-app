/**
 *
 * UserDetailPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { userDetailPageSaga } from './saga';
import { selectUserDetails } from './selectors';
import { actions, reducer, sliceKey } from './slice';
import { roleString, UserStatusBadge, UserStatusString } from 'types/User';
import { getCurrentUser } from '../AuthenticatedPages/selectors';
import { Badge } from 'antd';
import UpdateRoleButton from './components/UpdateRoleButton';
import UserBookingsTable from './components/UserBookingsTable';
import BanButton from './components/BanButton';
import { toast } from 'react-toastify';
import AddInfringementButton from './components/AddInfringementButton';
import { InfringmentData } from 'types/Infringement';
interface Props {}

export function UserDetailPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: userDetailPageSaga });

  const user = useSelector(selectUserDetails);
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();

  const currentUser = useSelector(getCurrentUser);

  useEffect(() => {
    dispatch(actions.loadUser(id));
  }, [dispatch, id]);

  if (user === null) return <></>;

  const banSelfCheck = () => {
    if (user === null) return false;
    if (currentUser === null) return false;
    if (user.id === currentUser.id) {
      return false;
    }
    return true;
  };

  const handleRemoveInfringement = index => {};

  const infringementListItems = (infringementList: InfringmentData[]) => {
    const arr: Array<any> = [];
    for (let i = 0; i < infringementList.length; i++) {
      arr.push(infringementListItem(infringementList[i].details, i.toString()));
    }
    return arr;
  };

  const infringementListItem = (title: string, key: string) => {
    return (
      <li className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
        <div className="w-0 flex-1 flex items-center">
          <span className="ml-2 flex-1 w-0 truncate">{title}</span>
        </div>
        <div className="ml-4 flex-shrink-0 flex space-x-4">
          <button
            type="button"
            className="bg-transparent rounded-md font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            onClick={e => {
              handleRemoveInfringement(parseInt(key));
            }}
          >
            Remove
          </button>
        </div>
      </li>
    );
  };

  return (
    <>
      <Helmet>
        <title>User Info</title>
        <meta name="description" content="Description of UserDetailPage" />
      </Helmet>
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
              User Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              User details and bookings.
            </p>
          </div>
          <div className="mt-5 border-t border-gray-200">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 flex text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  <span className="flex-grow">{user.name}</span>
                  <span className="ml-4 flex-shrink-0">
                    <button
                      type="button"
                      className="bg-transparent rounded-md font-medium text-teal-600 hover:text-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      Update
                    </button>
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  {user.email}
                </dd>
              </div>
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 flex text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  <span className="flex-grow">
                    <Badge
                      status={UserStatusBadge[user.status]}
                      text={
                        <span className="text-sm text-gray-900 dark:text-gray-100">
                          {UserStatusString[user.status]}
                        </span>
                      }
                    />
                  </span>
                  <span className="ml-4 flex-shrink-0">
                    {banSelfCheck() && (
                      <BanButton
                        userId={user.id}
                        isBanned={user.status === 100}
                        onBanStatusChanged={function () {
                          toast.success('User status changed successfully');
                          history.push('.');
                        }}
                      ></BanButton>
                    )}
                    <span className="flex-grow">{user.bannedEndTime}</span>
                    <span className="ml-4 flex-shrink-0">
                      {user.bannedEndTime && (
                        <button
                          type="button"
                          className="bg-white dark:bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Update
                        </button>
                      )}
                    </span>
                  </span>
                </dd>
              </div>
              {!!user.bannedReason && (
                <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                  <dt className="text-sm font-medium text-gray-500">
                    Banned Reason
                  </dt>
                  <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <span className="flex-grow">{user.bannedReason}</span>
                    <span className="ml-4 flex-shrink-0">
                      <button
                        type="button"
                        className="bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Update
                      </button>
                    </span>
                  </dd>
                </div>
              )}
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Role</dt>
                <dd className="mt-1 flex text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  <span className="flex-grow">{roleString[user.role]}</span>
                  <span className="ml-4 flex-shrink-0">
                    <UpdateRoleButton
                      userId={user.id}
                      currentRole={user.role}
                      isSelf={!!currentUser && currentUser.id === user.id}
                    />
                  </span>
                </dd>
              </div>
              <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">
                  Infringements
                </dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {infringementListItems(user.infringementThisTerm)}
                  </ul>
                </dd>
                <AddInfringementButton
                  userId={user.id}
                  onInfringementAdded={() => {}}
                />
                <span>{user.infringementThisTerm.toString()}</span>
              </div>
              <div className="py-4 sm:grid sm:py-5 sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Bookings</dt>
                <dd className="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:mt-0 sm:col-span-2">
                  <UserBookingsTable userId={id} />
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
