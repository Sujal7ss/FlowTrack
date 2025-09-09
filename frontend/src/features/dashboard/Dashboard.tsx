import React, { useState } from 'react';
import { Row, Col, Card, Statistic, DatePicker, Space, Typography, Button } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, DollarOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useAggregations } from '../../hooks/transaction';
import { CategoryPie, TrendLine } from './Charts';
import Loading from '../../components/Loading.tsx';
import Error from '../../components/Error';

const { RangePicker } = DatePicker;
const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<[string, string] | undefined>();
  const [activeFilter, setActiveFilter] = useState<'today' | 'month' | 'year' | 'custom'>('custom');

  const { data, isLoading, error, refetch } = useAggregations(dateRange);
  console.log(data)

  const handleDateRangeChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setDateRange([
        dates[0].format('YYYY-MM-DD'),
        dates[1].format('YYYY-MM-DD'),
      ]);
      setActiveFilter('custom');
    } else {
      setDateRange(undefined);
      setActiveFilter('custom');
    }
  };

  const handleTodayClick = () => {
    const today = dayjs().format('YYYY-MM-DD');
    setDateRange([today, today]);
    setActiveFilter('today');
  };

  const handleMonthClick = () => {
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD');
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');
    setDateRange([startOfMonth, endOfMonth]);
    setActiveFilter('month');
  };

  const handleYearClick = () => {
    const startOfYear = dayjs().startOf('year').format('YYYY-MM-DD');
    const endOfYear = dayjs().endOf('year').format('YYYY-MM-DD');
    setDateRange([startOfYear, endOfYear]);
    setActiveFilter('year');
  };

  if (error) {
    return <Error error={error as Error} onRetry={() => refetch()} />;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Title level={2} className="mb-0">Dashboard</Title>
          <Space>
            <Button
              type={activeFilter === 'today' ? 'primary' : 'default'}
              onClick={handleTodayClick}
            >
              Today
            </Button>
            <Button
              type={activeFilter === 'month' ? 'primary' : 'default'}
              onClick={handleMonthClick}
            >
              Month
            </Button>
            <Button
              type={activeFilter === 'year' ? 'primary' : 'default'}
              onClick={handleYearClick}
            >
              Year
            </Button>
            <RangePicker
              onChange={handleDateRangeChange}
              placeholder={['Start Date', 'End Date']}
              allowClear
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > dayjs().endOf('day')}
            />
          </Space>
        </div>
        
        {/* Summary Cards */}
        <Row gutter={[16, 16]} className="mb-6">
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Income"
                value={data?.summary.totalIncome || 0}
                precision={2}
                valueStyle={{ color: '#52c41a' }}
                prefix={<ArrowUpOutlined />}
                suffix="$"
                loading={isLoading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Total Expenses"
                value={Math.abs(data?.summary.totalExpense || 0)}
                precision={2}
                valueStyle={{ color: '#f5222d' }}
                prefix={<ArrowDownOutlined />}
                suffix="$"
                loading={isLoading}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Net Amount"
                value={data?.summary.netAmount || 0}
                precision={2}
                valueStyle={{ 
                  color: (data?.summary.netAmount || 0) >= 0 ? '#52c41a' : '#f5222d' 
                }}
                prefix={<DollarOutlined />}
                suffix="$"
                loading={isLoading}
              />
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={12}>
            <CategoryPie 
              data={data?.categoryBreakdown || []} 
              loading={isLoading}
            />
          </Col>
          <Col xs={24} lg={12}>
            <TrendLine 
              data={data?.trendData || []} 
              loading={isLoading}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Dashboard;