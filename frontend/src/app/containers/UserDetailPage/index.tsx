/**
 *
 * UserDetailPage
 *
 */

import { Badge, Button, Descriptions, Dropdown, Menu, Space, Tag } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { Breadcrumbs, Typography, Link } from '@material-ui/core';
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';

import { userDetailPageSaga } from './saga';
import { selectUserDetailPage } from './selectors';
import { actions, reducer, sliceKey } from './slice';
import {
  Role,
  roleColor,
  roleString,
  UserStatus,
  UserStatusBadge,
  UserStatusString,
} from 'types/User';
import { DateTime } from 'luxon';
import { getCurrentUser } from '../AuthenticatedPages/selectors';
import api from 'app/api';
import AddInfringementButton from './AddInfringementButton';
import BanButton from './BanButton';

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

  const handleMenuClick = e => {
    api.users
      .updateUserRole(id, e.key)
      .then(() => dispatch(actions.loadUser(id)));
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {Object.keys(Role)
        .filter(key => isNaN(Number(Role[key])))
        .map(role => (
          <Menu.Item key={role}>{roleString[role]}</Menu.Item>
        ))}
    </Menu>
  );

  return (
    <>
      <Helmet>
        <title>User Info</title>
        <meta name="description" content="Description of UserDetailPage" />
      </Helmet>
      <Breadcrumbs separator="›" style={{ marginBottom: 20 }}>
        <Link
          color="inherit"
          component="button"
          onClick={() => history.push('/users')}
        >
          Users
        </Link>
        {user && <Typography color="textPrimary">{user.id}</Typography>}
      </Breadcrumbs>
      {user && (
        <Descriptions bordered>
          <Descriptions.Item label="Status">
            <Badge
              status={UserStatusBadge[user.status]}
              text={UserStatusString[user.status]}
            />
            {currentUser?.id !== user.id && (
              <BanButton
                userId={id}
                isBanned={user.status === UserStatus.BANNED}
                onBanStatusChanged={() => dispatch(actions.loadUser(id))}
              />
            )}
          </Descriptions.Item>
          <Descriptions.Item label="ID" span={2}>
            {user.id}
          </Descriptions.Item>
          {user.bannedReason !== null && user.bannedEndTime !== null && (
            <>
              <Descriptions.Item label="Banned End Time">
                {`${DateTime.fromISO(
                  user.bannedEndTime,
                ).toISODate()} ${DateTime.fromISO(user.bannedEndTime)
                  .startOf('seconds')
                  .toISOTime({
                    suppressSeconds: true,
                    suppressMilliseconds: true,
                    includeOffset: false,
                  })}`}
              </Descriptions.Item>
              <Descriptions.Item label="Banned Reason" span={2}>
                <Space wrap>{user.bannedReason}</Space>
              </Descriptions.Item>
            </>
          )}
          <Descriptions.Item label="Role">
            {currentUser?.id !== user.id && currentUser?.role === Role.ADMIN ? (
              <Dropdown overlay={menu}>
                <Button>
                  {roleString[user.role]} <DownOutlined />
                </Button>
              </Dropdown>
            ) : (
              <Tag color={roleColor[user.role]}>{roleString[user.role]}</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Name" span={2}>
            {user.name}
          </Descriptions.Item>
          <Descriptions.Item label="Email" span={3}>
            {user.email}
          </Descriptions.Item>
          <Descriptions.Item label="Number of bookings made this week">
            {user.bookedPerWeek}
          </Descriptions.Item>
          <Descriptions.Item label="Number of infringements this term" span={2}>
            {user.infringementThisTerm.length}
            <AddInfringementButton
              userId={user.id}
              onInfringementAdded={() => dispatch(actions.loadUser(id))}
            />
          </Descriptions.Item>
          {user.infringementThisTerm.map((infringement, key) => (
            <React.Fragment key={key}>
              <Descriptions.Item label="Time of offense">
                {`${DateTime.fromISO(
                  infringement.createdAt,
                ).toISODate()} ${DateTime.fromISO(infringement.createdAt)
                  .startOf('seconds')
                  .toISOTime({
                    suppressSeconds: true,
                    suppressMilliseconds: true,
                    includeOffset: false,
                  })}`}
              </Descriptions.Item>
              <Descriptions.Item label="Infringement Details" span={3}>
                <Space wrap>{infringement.details}</Space>
              </Descriptions.Item>
            </React.Fragment>
          ))}
        </Descriptions>
      )}
    </>
  );
}
