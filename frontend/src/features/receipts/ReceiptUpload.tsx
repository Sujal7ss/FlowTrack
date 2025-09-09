import React, { useState } from 'react';
import { Card, Upload, Button, message, Typography } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import { useUploadReceipt, useConfirmReceipt } from '../../hooks/receipt';
import type { TransactionRequest } from '../../types';
import TransactionForm from '../transactions/TransactionForm.tsx';

const { Dragger } = Upload;
const { Title, Text } = Typography;

const ReceiptUpload: React.FC = () => {
  const [uploadedReceipt, setUploadedReceipt] = useState<TransactionRequest | null>(null);
  const [isConfirmFormVisible, setIsConfirmFormVisible] = useState(false);

  const uploadMutation = useUploadReceipt();
  const confirmMutation = useConfirmReceipt();

  const uploadProps: UploadProps = {
    name: 'receipt',
    accept: 'image/*,.pdf',
    multiple: false,
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      try {
        const formData = new FormData();
        formData.append('receipt', file as File);

        const result = await uploadMutation.mutateAsync(formData);
        setUploadedReceipt(result.transactionData as TransactionRequest);
        onSuccess?.(result, {} as XMLHttpRequest);
      } catch (error) {
        onError?.(error as Error);
      }
    },
    beforeUpload: (file) => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      if (!isValidType) {
        message.error('You can only upload image or PDF files!');
        return false;
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('File must be smaller than 10MB!');
        return false;
      }
      return true;
    },
  };

  const handleConfirmAsTransaction = () => {
    if (uploadedReceipt) {
      setIsConfirmFormVisible(true);
    }
  };

  const handleNewUpload = () => {
    setUploadedReceipt(null);
  };

  return (
    <div className="p-6">
      <Title level={2}>Receipt Upload</Title>
      <Text type="secondary" className="block mb-6">
        Upload your receipts and convert them to transactions automatically.
      </Text>

      {!uploadedReceipt ? (
        <Card className="max-w-2xl mx-auto">
          <Dragger {...uploadProps} className="p-8">
            <p className="ant-upload-drag-icon">
              <InboxOutlined className="text-4xl text-blue-500" />
            </p>
            <p className="ant-upload-text">
              Click or drag receipt to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for single image or PDF file upload. File size limit: 10MB
            </p>
          </Dragger>
          
          <div className="text-center mt-4">
            <Text type="secondary">
              Supported formats: JPG, PNG, GIF, PDF
            </Text>
          </div>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card title="Extracted Transaction Data">
            <div className="space-y-2">
              <p><strong>Type:</strong> {uploadedReceipt.type}</p>
              <p><strong>Amount:</strong> ${uploadedReceipt.amount}</p>
              <p><strong>Category:</strong> {uploadedReceipt.category}</p>
              <p><strong>Description:</strong> {uploadedReceipt.description}</p>
              <p><strong>Date:</strong> {uploadedReceipt.date}</p>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                type="primary"
                size="large"
                onClick={handleConfirmAsTransaction}
                loading={confirmMutation.isPending}
              >
                Convert to Transaction
              </Button>
              <Button
                size="large"
                onClick={handleNewUpload}
              >
                Upload Another Receipt
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Transaction Form Modal for confirming receipt */}
      {isConfirmFormVisible && (
      <TransactionForm
        visible={isConfirmFormVisible}
        initialData={uploadedReceipt || undefined}
        onClose={() => {
          setIsConfirmFormVisible(false);
          setUploadedReceipt(null);
        }}
        onSuccess={() => {
          setIsConfirmFormVisible(false);
          setUploadedReceipt(null);
        }}
      />
      )}
    </div>
  );
};

export default ReceiptUpload;