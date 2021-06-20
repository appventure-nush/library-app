/**
 *
 * UserListPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Badge, Space, Table, Tag } from 'antd';
import { ColumnsType } from 'antd/es/table';

import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { actions, reducer, sliceKey } from './slice';
import { selectUserList } from './selectors';
import { userListPageSaga } from './saga';
import {
  Role,
  roleColor,
  roleString,
  UserListViewData,
  UserStatus,
  UserStatusBadge,
  UserStatusString,
} from 'types/User';
import { Link } from 'react-router-dom';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { ChevronRightIcon } from '@heroicons/react/outline';

interface Props {}

export function UserListPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: userListPageSaga });

  const userList = useSelector(selectUserList, shallowEqual);
  const dispatch = useDispatch();

  const screens = useBreakpoint();

  useEffect(() => {
    dispatch(actions.saveUsers([]));
    dispatch(actions.loadUsers());
  }, [dispatch]);

  const columns: ColumnsType<UserListViewData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Role',
      key: 'role',
      dataIndex: 'role',
      render: (role: Role) => (
        <Tag color={roleColor[role]}>{roleString[role]}</Tag>
      ),
      filters: [
        {
          text: 'Student',
          value: Role.STUDENT,
        },
        {
          text: 'Staff',
          value: Role.STAFF,
        },
        {
          text: 'Librarian',
          value: Role.LIBRARIAN,
        },
        {
          text: 'Admin',
          value: Role.ADMIN,
        },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      responsive: ['md'],
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: UserStatus) => (
        <Badge
          status={UserStatusBadge[status]}
          text={UserStatusString[status]}
        />
      ),
      filters: [
        {
          text: 'Banned',
          value: UserStatus.BANNED,
        },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Link to={`users/${record.id}`}>
            {!!screens['sm'] ? (
              'View'
            ) : (
              <ChevronRightIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            )}
          </Link>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>UserList</title>
        <meta name="description" content="Description of UserListPage" />
      </Helmet>
      <div className="py-8 px-4 sm:px-6 md:px-8">
        <Table<UserListViewData>
          className="w-full"
          columns={columns}
          dataSource={userList}
        />
      </div>
    </>
  );
}
