/**
 *
 * UserDetailPage
 *
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch } from 'react-redux';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { reducer, sliceKey } from './slice';
import { selectUserDetailPage } from './selectors';
import { userDetailPageSaga } from './saga';

interface Props {}

export function UserDetailPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: userDetailPageSaga });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const userDetailPage = useSelector(selectUserDetailPage);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const dispatch = useDispatch();

  return (
    <>
      <Helmet>
        <title>UserDetailPage</title>
        <meta name="description" content="Description of UserDetailPage" />
      </Helmet>
      <div></div>
    </>
  );
}
