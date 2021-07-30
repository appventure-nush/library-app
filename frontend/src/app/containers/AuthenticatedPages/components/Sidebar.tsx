import { Transition, Dialog } from '@headlessui/react';
import {
  XIcon,
  HomeIcon,
  BookmarkIcon,
  QuestionMarkCircleIcon,
  LogoutIcon,
  UsersIcon,
  MenuIcon,
} from '@heroicons/react/outline';
import { actions } from '../slice';
import React, { Fragment, useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Role, roleString, UserData } from 'types/User';
import BookingRulesButton from './BookingRulesButton';

interface SidebarProps {
  currentUser: UserData;
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Sidebar: React.FC<SidebarProps> = props => {
  const { currentUser } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const navOnClick = useCallback(
    (to: string) => () => {
      history.push(to);
      setSidebarOpen(false);
    },
    [history],
  );

  const handleLogout = useCallback(() => {
    dispatch(actions.logout());
  }, [dispatch]);

  if (!!!currentUser) {
    return <></>;
  }

  return (
    <div className="h-full flex overflow-hidden bg-gray-100 dark:bg-gray-900">
      <Transition.Root show={sidebarOpen} as={Fragment}>
        <Dialog
          as="div"
          static
          className="fixed inset-0 flex z-40 md:hidden"
          open={sidebarOpen}
          onClose={setSidebarOpen}
        >
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-teal-600">
              <Transition.Child
                as={Fragment}
                enter="ease-in-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in-out duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                  <button
                    className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sr-only">Close sidebar</span>
                    <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </button>
                </div>
              </Transition.Child>
              <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                <div className="flex-shrink-0 flex items-center px-4">
                  <img
                    className="h-8 w-auto"
                    src="/favicon.ico"
                    alt="AppVenture Logo"
                  />
                  <span className="text-white font-sans font-medium ml-2 text-lg">
                    The Node
                  </span>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  <button
                    className={classNames(
                      location.pathname === '/'
                        ? 'bg-teal-700 text-white'
                        : 'text-white hover:bg-teal-500 hover:bg-opacity-75',
                      'group w-full focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md',
                    )}
                    onClick={navOnClick('/')}
                  >
                    <HomeIcon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                      aria-hidden="true"
                    />
                    Dashboard
                  </button>
                  <button
                    className={classNames(
                      location.pathname.startsWith('/mybookings')
                        ? 'bg-teal-700 text-white'
                        : 'text-white hover:bg-teal-500 hover:bg-opacity-75',
                      'group w-full focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md',
                    )}
                    onClick={navOnClick('/mybookings')}
                  >
                    <BookmarkIcon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                      aria-hidden="true"
                    />
                    My Bookings
                  </button>
                  {currentUser.role >= Role.LIBRARIAN && (
                    <button
                      className={classNames(
                        location.pathname.startsWith('/bookings')
                          ? 'bg-teal-700 text-white'
                          : 'text-white hover:bg-teal-500 hover:bg-opacity-75',
                        'group w-full focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md',
                      )}
                      onClick={navOnClick('/bookings')}
                    >
                      <BookmarkIcon
                        className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                        aria-hidden="true"
                      />
                      All Bookings
                    </button>
                  )}
                  {currentUser.role >= Role.ADMIN && (
                    <button
                      className={classNames(
                        location.pathname.startsWith('/users')
                          ? 'bg-teal-700 text-white'
                          : 'text-white hover:bg-teal-500 hover:bg-opacity-75',
                        'group w-full focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md',
                      )}
                      onClick={navOnClick('/users')}
                    >
                      <BookmarkIcon
                        className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                        aria-hidden="true"
                      />
                      Manage Users
                    </button>
                  )}
                </nav>
              </div>
              <div className="flex-shrink-0 flex justify-between items-center px-2">
                <button
                  className="flex-1 text-white hover:bg-teal-500 hover:bg-opacity-75 group focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md"
                  onClick={() =>
                    window.open(
                      `${process.env.PUBLIC_URL}/user_guide.pdf`,
                      '_blank',
                    )
                  }
                >
                  <QuestionMarkCircleIcon
                    className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                    aria-hidden="true"
                  />
                  User Guide
                </button>
                <BookingRulesButton />
              </div>
              <div className="flex-shrink-0 flex justify-between items-center border-t border-teal-700 p-4">
                <button className="flex-shrink-0 group block focus:outline-none">
                  <span>
                    <div className="flex items-center">
                      <div className="flex flex-col items-start ml-1">
                        <p className="text-base font-medium text-white">
                          {currentUser.name}
                        </p>
                        <p className="text-sm font-medium text-teal-100 group-hover:text-white">
                          {roleString[currentUser.role]}
                        </p>
                      </div>
                    </div>
                  </span>
                </button>
                <LogoutIcon
                  className="mr-4 flex-shrink-0 h-6 w-6 text-teal-200 hover:text-white"
                  aria-hidden="true"
                />
              </div>
            </div>
          </Transition.Child>
          <div className="flex-shrink-0 w-14" aria-hidden="true">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </Dialog>
      </Transition.Root>

      {/* Static sidebar for desktop */}
      <div className="hidden bg-teal-600 md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-col h-0 flex-1">
            <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <img
                  className="h-8 w-auto"
                  src="/favicon.ico"
                  alt="AppVenture Logo"
                />
                <span className="text-white font-sans font-medium ml-2 text-lg">
                  The Node
                </span>
              </div>
              <nav className="mt-5 flex-1 px-2 space-y-1">
                <button
                  className={classNames(
                    location.pathname === '/'
                      ? 'bg-teal-700 text-white'
                      : 'text-white hover:bg-teal-500 hover:bg-opacity-75',
                    'group w-full focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md',
                  )}
                  onClick={navOnClick('/')}
                >
                  <HomeIcon
                    className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                    aria-hidden="true"
                  />
                  Dashboard
                </button>
                <button
                  className={classNames(
                    location.pathname.startsWith('/mybookings')
                      ? 'bg-teal-700 text-white'
                      : 'text-white hover:bg-teal-500 hover:bg-opacity-75',
                    'group w-full focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md',
                  )}
                  onClick={navOnClick('/mybookings')}
                >
                  <BookmarkIcon
                    className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                    aria-hidden="true"
                  />
                  My Bookings
                </button>
                {currentUser.role >= Role.LIBRARIAN && (
                  <button
                    className={classNames(
                      location.pathname.startsWith('/bookings')
                        ? 'bg-teal-700 text-white'
                        : 'text-white hover:bg-teal-500 hover:bg-opacity-75',
                      'group w-full focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md',
                    )}
                    onClick={navOnClick('/bookings')}
                  >
                    <BookmarkIcon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                      aria-hidden="true"
                    />
                    All Bookings
                  </button>
                )}
                {currentUser.role >= Role.ADMIN && (
                  <button
                    className={classNames(
                      location.pathname.startsWith('/users')
                        ? 'bg-teal-700 text-white'
                        : 'text-white hover:bg-teal-500 hover:bg-opacity-75',
                      'group w-full focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md',
                    )}
                    onClick={navOnClick('/users')}
                  >
                    <UsersIcon
                      className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                      aria-hidden="true"
                    />
                    Manage Users
                  </button>
                )}
              </nav>
            </div>
            <div className="flex-shrink-0 flex justify-between items-center px-2">
              <button
                className="flex-1 text-white hover:bg-teal-500 hover:bg-opacity-75 group w-full focus:outline-none flex items-center px-2 py-2 text-base font-medium rounded-md"
                onClick={() =>
                  window.open(
                    `${process.env.PUBLIC_URL}/user_guide.pdf`,
                    '_blank',
                  )
                }
              >
                <QuestionMarkCircleIcon
                  className="mr-3 flex-shrink-0 h-6 w-6 text-teal-200"
                  aria-hidden="true"
                />
                User Guide
              </button>
              <BookingRulesButton />
            </div>
            <div className="flex-shrink-0 flex border-t border-teal-700 p-4">
              <div className="flex-shrink-0 flex justify-between items-center w-full">
                <button className="group block focus:outline-none">
                  <div className="flex items-center">
                    <div className="flex flex-col items-start ml-1">
                      <p className="text-sm font-medium text-white">
                        {currentUser.name}
                      </p>
                      <p className="text-xs font-medium text-teal-100 group-hover:text-white">
                        {roleString[currentUser.role]}
                      </p>
                    </div>
                  </div>
                </button>
                <button className="focus:outline-none" onClick={handleLogout}>
                  <LogoutIcon
                    className="mr-4 flex-shrink-0 h-6 w-6 text-teal-200 hover:text-white"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-0 flex-1 overflow-hidden h-full">
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
          <button
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 focus:outline-none"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <main className="bg-white dark:bg-gray-900 flex-1 relative z-0 overflow-y-auto focus:outline-none">
          {props.children}
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
