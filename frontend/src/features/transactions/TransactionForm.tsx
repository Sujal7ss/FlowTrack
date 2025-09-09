import React from 'react';
import { Form, Input, Select, DatePicker, Button, InputNumber, Modal } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { useCreateTransaction, useUpdateTransaction } from '../../hooks/transaction';
import type { Transaction, TransactionRequest } from '../../types';

const { Option } = Select;

const CATEGORIES = {
  expense: [
    'Food & Dining',
    'Transportation',
    'Shopping',
    'Entertainment',
    'Bills & Utilities',
    'Healthcare',
    'Education',
    'Travel',
    'Other',
  ],
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Other'],
};

interface TransactionFormProps {
  transaction?: Transaction;
  initialData?: TransactionRequest;
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  transaction,
  initialData,
  visible,
  onClose,
  onSuccess,
}) => {
  const createMutation = useCreateTransaction();
  const updateMutation = useUpdateTransaction();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<TransactionRequest>({
    defaultValues: {
      type: transaction?.type || initialData?.type || 'expense',
      amount: transaction?.amount || initialData?.amount || undefined,
      category: transaction?.category || initialData?.category || '',
      description: transaction?.description || initialData?.description || '',
      date: transaction?.date || initialData?.date || dayjs().format('YYYY-MM-DD'),
    },
  });

  const watchedType = watch('type');

  React.useEffect(() => {
    if (transaction) {
      reset({
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        date: transaction.date,
      });
    } else if (initialData) {
      reset({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        description: initialData.description,
        date: initialData.date,
      });
    }
  }, [transaction, initialData, reset]);

  const onSubmit = async (data: TransactionRequest) => {
    try {
      if (transaction) {
        await updateMutation.mutate({ id: transaction.id, data });
      } else {
        await createMutation.mutate(data);
      }
      onSuccess?.();
      handleClose();
    } catch {
      // Errors handled by mutation
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      title={transaction ? 'Edit Transaction' : 'Add New Transaction'}
      open={visible}
      onCancel={handleClose}
      footer={null}
      destroyOnHidden
    >
      <Form onFinish={handleSubmit(onSubmit)} layout="vertical" className="mt-4">
        {/* Type */}
        <Form.Item
          label="Type"
          validateStatus={errors.type ? 'error' : ''}
          help={errors.type?.message}
          required
        >
          <Controller
            name="type"
            control={control}
            rules={{ required: 'Please select transaction type' }}
            render={({ field }) => (
              <Select {...field} placeholder="Select transaction type">
                <Option value="income">Income</Option>
                <Option value="expense">Expense</Option>
              </Select>
            )}
          />
        </Form.Item>

        {/* Amount */}
        <Form.Item
          label="Amount"
          validateStatus={errors.amount ? 'error' : ''}
          help={errors.amount?.message}
          required
        >
          <Controller
            name="amount"
            control={control}
            rules={{
              required: 'Amount is required',
              min: { value: 1, message: 'Amount must be positive' },
            }}
            render={({ field }) => (
              <InputNumber
                {...field}
                className="w-full"
                placeholder="Enter amount"
                prefix="$"
                min={0}
                precision={2}
              />
            )}
          />
        </Form.Item>

        {/* Category */}
        <Form.Item
          label="Category"
          validateStatus={errors.category ? 'error' : ''}
          help={errors.category?.message}
          required
        >
          <Controller
            name="category"
            control={control}
            rules={{ required: 'Please select a category' }}
            render={({ field }) => (
              <Select {...field} placeholder="Select category">
                {CATEGORIES[watchedType].map((category) => (
                  <Option key={category} value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            )}
          />
        </Form.Item>

        {/* Description */}
        <Form.Item
          label="Description"
          validateStatus={errors.description ? 'error' : ''}
          help={errors.description?.message}
          required
        >
          <Controller
            name="description"
            control={control}
            rules={{ required: 'Description is required' }}
            render={({ field }) => (
              <Input {...field} placeholder="Enter description" />
            )}
          />
        </Form.Item>

        {/* Date */}
        <Form.Item
          label="Date"
          validateStatus={errors.date ? 'error' : ''}
          help={errors.date?.message}
          required
        >
          <Controller
            name="date"
            control={control}
            rules={{ required: 'Please select a date' }}
            render={({ field }) => (
              <DatePicker
                {...field}
                value={field.value ? dayjs(field.value) : null}
                onChange={(date) => field.onChange(date?.format('YYYY-MM-DD'))}
                className="w-full"
                format="YYYY-MM-DD"
              />
            )}
          />
        </Form.Item>

        {/* Buttons */}
        <Form.Item className="mb-0">
          <div className="flex justify-end gap-2">
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {transaction ? 'Update' : 'Create'} Transaction
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TransactionForm;
