import React, { useState } from 'react';
import { Card, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useTransactions, useDeleteTransaction } from '../../hooks/transaction';
import TransactionForm from './TransactionForm.tsx';
import TransactionFiltersBar from './TransactionFiltersBar';
import TransactionTable from './TransactionTable';
import Error from '../../components/Error';
import type { Transaction, TransactionFilters } from '../../types';

const TransactionPage: React.FC = () => {
  const [filters, setFilters] = useState<TransactionFilters>({ page: 1, limit: 10 });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();

  const { data, isLoading, error, refetch } = useTransactions(filters);
  const deleteMutation = useDeleteTransaction();

  const transactions = data?.data || [];

  const handleEdit = (transaction: Transaction) => {
    if (!transaction.id) return;
    setEditingTransaction(transaction);
    setIsFormVisible(true);
  };

  const handleDelete = async (id: string) => {
    if (!id) return;
    await deleteMutation.mutate(id);
    refetch();
  };

  const handleCloseForm = () => {
    setIsFormVisible(false);
    setEditingTransaction(undefined);
  };

  const handleTableChange = (pagination: { current?: number; pageSize?: number }) => {
    setFilters(prev => ({
      ...prev,
      page: pagination.current || 1,
      limit: pagination.pageSize || 10,
    }));
  };

  const handleFilterChange = (key: keyof TransactionFilters, value: TransactionFilters[keyof TransactionFilters]) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1,
    }));
  };

  if (error) {
    return <Error error={null} onRetry={refetch} />;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold mb-0">Transactions</h1>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsFormVisible(true)}>
            Add Transaction
          </Button>
        </div>

        <TransactionFiltersBar filters={filters} onChange={handleFilterChange} />

        <TransactionTable
          transactions={transactions}
          loading={isLoading}
          pagination={{
            page: data?.pagination?.page || 1,
            limit: data?.pagination?.limit || 10,
            total: data?.pagination?.total || 0,
          }}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onTableChange={handleTableChange}
          deleting={deleteMutation.isPending}
        />
      </Card>

      <TransactionForm
        transaction={editingTransaction}
        visible={isFormVisible}
        onClose={handleCloseForm}
        onSuccess={refetch}
      />
    </div>
  );
};

export default TransactionPage;
