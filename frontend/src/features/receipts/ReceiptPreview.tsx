import React from 'react';
import { Card, Image, Typography, Divider, Row, Col } from 'antd';
import type { Receipt } from '../../types';

const { Text, Paragraph } = Typography;

const FALLBACK_IMAGE = "data:image/png;base64,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";

interface ReceiptPreviewProps {
  receipt: Receipt;
}

const ReceiptPreview: React.FC<ReceiptPreviewProps> = ({ receipt }) => {
  return (
    <Card title="Receipt Preview" className="mb-4">
      <Row gutter={[24, 24]}>
        {/* Receipt Image */}
        <Col xs={24} lg={12}>
          <Text strong>Receipt Image:</Text>
          <div className="mt-2">
            {receipt.url.toLowerCase().includes('.pdf') ? (
              <div className="border border-gray-200 rounded-lg p-8 text-center">
                <Text>PDF Receipt: {receipt.filename}</Text>
              </div>
            ) : (
              <Image
                src={receipt.url}
                alt="Receipt"
                className="w-full max-w-md"
                fallback={FALLBACK_IMAGE}
              />
            )}
          </div>
        </Col>

        {/* Extracted Text */}
        <Col xs={24} lg={12}>
          <Text strong>Extracted Text:</Text>
          <Divider className="my-2" />
          <Paragraph className="whitespace-pre-wrap">
            {receipt.extractedText || 'No text extracted from this receipt.'}
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default ReceiptPreview;
