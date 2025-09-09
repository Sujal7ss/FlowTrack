import React from 'react';
import { Table, Tag } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import dayjs from 'dayjs';
import TransactionActions from './TransactionActions';
import type { Transaction } from '../../types';

interface Props {
  transactions: Transaction[];
  loading: boolean;
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  onTableChange: TableProps<Transaction>['onChange'];
  deleting?: boolean;
}

const TransactionTable: React.FC<Props> = ({
  transactions,
  loading,
  pagination,
  onEdit,
  onDelete,
  onTableChange,
  deleting,
}) => {
  const columns: ColumnsType<Transaction> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('MMM DD, YYYY'),
      sorter: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'income' ? 'green' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number, record: Transaction) => (
        <span className={record.type === 'income' ? 'text-green-600' : 'text-red-600'}>
          {record.type === 'income' ? '+' : '-'}${Math.abs(amount).toFixed(2)}
        </span>
      ),
      align: 'right',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record: Transaction) => (
        <TransactionActions
          record={record}
          onEdit={onEdit}
          onDelete={onDelete}
          deleting={deleting}
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={transactions}
      rowKey={(record) => record.id || Math.random().toString(36).substr(2, 9)}
      loading={loading}
      pagination={{
        current: pagination.page,
        pageSize: pagination.limit,
        total: pagination.total,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} of ${total} transactions`,
      }}
      onChange={onTableChange}
      scroll={{ x: 800 }}
    />
  );
};

export default TransactionTable;
