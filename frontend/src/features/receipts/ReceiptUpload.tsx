import React, { useState } from 'react';
import { Card, Upload, Button, message, Typography, Spin, Row, Col, Space } from 'antd';
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
  const [uploading, setUploading] = useState(false);

  const uploadMutation = useUploadReceipt();
  const confirmMutation = useConfirmReceipt();

  const uploadProps: UploadProps = {
    name: 'receipt',
    accept: 'image/*,.pdf',
    multiple: false,
    showUploadList: false,
    customRequest: async ({ file, onSuccess, onError }) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('receipt', file as File);

        const result = await uploadMutation.mutateAsync(formData);
        setUploadedReceipt(result.transactionData as TransactionRequest);
        onSuccess?.(result, {} as XMLHttpRequest);
      } catch (error) {
        onError?.(error as Error);
      } finally {
        setUploading(false);
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
    <div className="flex justify-center items-center min-h-screen p-6">
      <div>
        <Title level={2}>Receipt Upload</Title>
        <Text type="secondary" className="block mb-6">
          Upload your receipts and convert them to transactions automatically.
        </Text>

        {!uploadedReceipt ? (
          <Card className="max-w-2xl mx-auto">
            <Spin spinning={uploading} tip="Uploading...">
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
            </Spin>
            <div className="text-center mt-4">
              <Text type="secondary">
                Supported formats: JPG, PNG, GIF, PDF
              </Text>
            </div>
          </Card>
        ) : (
          <Space direction="vertical" size="large" className="w-full max-w-2xl mx-auto">
            <Card title="Extracted Transaction Data">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12}>
                  <p><strong>Type:</strong> {uploadedReceipt.type}</p>
                </Col>
                <Col xs={24} sm={12}>
                  <p><strong>Amount:</strong> ${uploadedReceipt.amount}</p>
                </Col>
                <Col xs={24} sm={12}>
                  <p><strong>Category:</strong> {uploadedReceipt.category}</p>
                </Col>
                <Col xs={24} sm={12}>
                  <p><strong>Description:</strong> {uploadedReceipt.description}</p>
                </Col>
                <Col xs={24} sm={12}>
                  <p><strong>Date:</strong> {uploadedReceipt.date}</p>
                </Col>
              </Row>
            </Card>

            <Card>
              <Row justify="center" gutter={[16, 16]}>
                <Col>
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleConfirmAsTransaction}
                    loading={confirmMutation.isPending}
                  >
                    Convert to Transaction
                  </Button>
                </Col>
                <Col>
                  <Button
                    size="large"
                    onClick={handleNewUpload}
                  >
                    Upload Another Receipt
                  </Button>
                </Col>
              </Row>
            </Card>
          </Space>
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
    </div>
  );
};

export default ReceiptUpload;
