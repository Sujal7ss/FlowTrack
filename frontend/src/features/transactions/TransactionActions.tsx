import React from 'react';
import { Button, Popconfirm, Space } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { Transaction } from '../../types';

interface Props {
  record: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  deleting?: boolean;
}

const TransactionActions: React.FC<Props> = ({ record, onEdit, onDelete, deleting }) => {
  return (
    <Space size="small">
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={() => onEdit(record)}
        size="small"
      />
      <Popconfirm
        title="Are you sure you want to delete this transaction?"
        onConfirm={() => record.id && onDelete(record.id)}
        okText="Yes"
        cancelText="No"
      >
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          size="small"
          loading={deleting}
        />
      </Popconfirm>
    </Space>
  );
};

export default TransactionActions;
