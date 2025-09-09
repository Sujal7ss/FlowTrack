import React from 'react';
import { DatePicker, Select, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TransactionFilters } from '../../types';

const { RangePicker } = DatePicker;
const { Option } = Select;

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

      <Input
        placeholder="Search category"
        prefix={<SearchOutlined />}
        allowClear
        onChange={(e) => onChange('category', e.target.value || undefined)}
      />

      <RangePicker
        placeholder={['Start Date', 'End Date']}
        onChange={(dates) => {
          if (dates && dates.length === 2) {
            onChange('dateRange', [
              dates[0].format('YYYY-MM-DD'),
              dates[1].format('YYYY-MM-DD'),
            ]);
          } else {
            onChange('dateRange', undefined);
          }
        }}
        format="YYYY-MM-DD"
        allowClear
      />
    </div>
  );
};

export default TransactionFiltersBar;
