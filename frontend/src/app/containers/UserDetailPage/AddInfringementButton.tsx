import { Button, Input, Modal, Tooltip } from 'antd';
import React, { useState } from 'react';
import PlusOutlinedIcon from '@ant-design/icons/PlusOutlined';
import api from 'app/api';

export interface AddInfringementButtonProps {
  userId: string;
  onInfringementAdded: () => void;
}

const AddInfringementButton: React.FC<AddInfringementButtonProps> = props => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmLoading, setConfirmLoading] = React.useState(false);
  const [reason, setReason] = useState('');

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setIsModalVisible(false);
    api.users
      .createInfringement(props.userId, reason)
      .then(() => props.onInfringementAdded())
      .finally(() => setConfirmLoading(false));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Tooltip title="Add">
        <Button
          type="primary"
          onClick={showModal}
          shape="circle"
          icon={<PlusOutlinedIcon style={{ verticalAlign: 'baseline' }} />}
          style={{ marginLeft: '1rem' }}
        />
      </Tooltip>
      <Modal
        title="Add Infringement"
        visible={isModalVisible}
        confirmLoading={confirmLoading}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input placeholder="Reason" onChange={e => setReason(e.target.value)} />
      </Modal>
    </>
  );
};

export default AddInfringementButton;
