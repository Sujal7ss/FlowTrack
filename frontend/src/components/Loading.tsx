import React from 'react';
import { Spin } from 'antd';

interface LoadingProps {
  size?: 'small' | 'default' | 'large';
  tip?: string;
}

const Loading: React.FC<LoadingProps> = ({ size = 'default', tip = 'Loading...' }) => {
  return (
    <div className="flex justify-center items-center min-h-32">
      <Spin size={size} tip={tip} />
    </div>
  );
};

export default Loading;