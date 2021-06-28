import { Button, Input, Modal, Popconfirm } from 'antd';
import React, { useState } from 'react';
import api from 'app/api';

export interface BanButtonProps {
  userId: string;
  isBanned: boolean;
  onBanStatusChanged: () => void;
}

const BanButton: React.FC<BanButtonProps> = props => {
  const { userId, isBanned, onBanStatusChanged } = props;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [reason, setReason] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleBan = () => {
    setConfirmLoading(true);
    setIsModalVisible(false);
    api.users
      .banUser(userId, reason)
      .then(function () {
        onBanStatusChanged();
      })
      .finally(() => setConfirmLoading(false));
  };

  const handleUnban = () => {
    setConfirmLoading(true);
    setIsModalVisible(false);
    api.users
      .unbanUser(userId)
      .then(function () {
        onBanStatusChanged();
      })
      .finally(() => setConfirmLoading(false));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  if (isBanned)
    return (
      <Popconfirm
        title="Are you sure to unban this user?"
        onConfirm={handleUnban}
        okText="Yes"
        cancelText="No"
        placement="bottom"
      >
        <Button type="primary" style={{ marginLeft: '1rem' }}>
          Unban
        </Button>
      </Popconfirm>
    );
  else
    return (
      <>
        <Button
          type="primary"
          onClick={showModal}
          style={{ marginLeft: '1rem' }}
          danger
        >
          Ban
        </Button>
        <Modal
          title="Banning user"
          visible={isModalVisible}
          confirmLoading={confirmLoading}
          onOk={handleBan}
          onCancel={handleCancel}
        >
          <Input
            placeholder="Reason"
            onChange={e => setReason(e.target.value)}
          />
        </Modal>
      </>
    );
};

export default BanButton;
