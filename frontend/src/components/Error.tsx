import React from 'react';
import { Alert, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

interface ErrorProps {
  error?: Error | null;
  onRetry?: () => void;
}

const Error: React.FC<ErrorProps> = ({ error, onRetry }) => {
  return (
    <div className="p-4">
      <Alert
        message="Something went wrong"
        description={error?.message || 'An unexpected error occurred. Please try again.'}
        type="error"
        showIcon
        action={
          onRetry && (
            <Button size="small" icon={<ReloadOutlined />} onClick={onRetry}>
              Retry
            </Button>
          )
        }
      />
    </div>
  );
};

export default Error;