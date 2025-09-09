import React from 'react';
import { DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import type { TransactionFilters } from '../../types';

const { RangePicker } = DatePicker;
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

interface Props {
  filters: TransactionFilters;
  onChange: (key: keyof TransactionFilters, value: any) => void;
}

const TransactionFiltersBar: React.FC<Props> = ({ filters, onChange }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Select
        placeholder="Filter by type"
        allowClear
        onChange={(value) => onChange('type', value)}
        value={filters.type}
      >
        <Option value="income">Income</Option>
        <Option value="expense">Expense</Option>
      </Select>

      <Select
        placeholder="Filter by category"
        allowClear
        showSearch
        filterOption={(input, option) =>
          (option?.children as string).toLowerCase().includes(input.toLowerCase())
        }
        onChange={(value) => onChange('category', value)}
        value={filters.category}
      >
        {(filters.type ? CATEGORIES[filters.type] : [...CATEGORIES.expense, ...CATEGORIES.income]).map((category) => (
          <Option key={category} value={category}>
            {category}
          </Option>
        ))}
      </Select>

      <RangePicker
        placeholder={['Start Date', 'End Date']}
        onChange={(dates) => {
          if (dates && dates.length === 2) {
            onChange('dateRange', [
              dates[0]?.format('YYYY-MM-DD'),
              dates[1]?.format('YYYY-MM-DD'),
            ]);
          } else {
            onChange('dateRange', undefined);
          }
        }}
        format="YYYY-MM-DD"
        allowClear
        disabledDate={(current) => current && current > dayjs().endOf('day')}
      />
    </div>
  );
};

export default TransactionFiltersBar;
