/**
 *
 * UserListPage
 *
 */

import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Badge, Space, Table, Tag } from 'antd';

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

interface Props {}

export function UserListPage(props: Props) {
  useInjectReducer({ key: sliceKey, reducer: reducer });
  useInjectSaga({ key: sliceKey, saga: userListPageSaga });

  const userList = useSelector(selectUserList, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.saveUsers([]));
    dispatch(actions.loadUsers());
  }, [dispatch]);

  const columns = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
    },
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
          <Link to={`users/${record.id}`}>View</Link>
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
      <div style={{ height: 400, width: '100%' }}>
        <Table
          columns={columns}
          dataSource={userList.map((user: UserListViewData, index: number) => {
            return {
              key: index,
              id: user.id,
              name: user.name,
              role: user.role,
              email: user.email,
              status: user.status,
            };
          })}
        />
      </div>
    </>
  );
}
