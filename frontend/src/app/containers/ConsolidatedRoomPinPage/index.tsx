/**
 *
 * ConsolidatedRoomPinPage
 *
 */

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectConsolidatedRoomPinPage } from './selectors';
import { consolidatedRoomPinPageSaga } from './saga';

export function ConsolidatedRoomPinPage() {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: consolidatedRoomPinPageSaga });

  const { pins } = useSelector(selectConsolidatedRoomPinPage);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.loadRoomPins());
    const interval = setInterval(() => {
      dispatch(actions.loadRoomPins());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px h-full">
      {pins
        .slice()
        .sort((a, b) => (b.name > a.name ? -1 : 1))
        .map((pin, pinIdx) => (
          <div
            key={pin.name}
            className={
              'relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-teal-500'
            }
          >
            <div>
              <h3 className="text-3xl font-medium">{pin.name}</h3>
              <p className="mt-2 text-9xl text-gray-500">{pin.checkInPin}</p>
            </div>
            <span
              className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
              aria-hidden="true"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
              </svg>
            </span>
          </div>
        ))}
    </div>
  );
}
