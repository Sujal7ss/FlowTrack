import React from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useSignup } from "../../hooks/auth"
import { useNavigate } from 'react-router-dom';
import type { SignupRequest } from '../../types';

const { Title } = Typography;

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const signupMutation = useSignup();
  const [form] = Form.useForm();

  const onSubmit = async (values: SignupRequest) => {
    try {
      await signupMutation.mutate(values);
      navigate('/login');
    } catch {
      // Error handled by mutation
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <Title level={2} className="text-gray-900">
              Personal Finance Assistant
            </Title>
            <p className="text-gray-600">Create your account</p>
          </div>

          <Form
            form={form}
            onFinish={onSubmit}
            size="large"
            layout="vertical"
            initialValues={{
              name: '',
              email: '',
              password: '',
            }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: 'Please enter your name' },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Enter your name"
              />
            </Form.Item>

            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Enter your email"
                type="email"
              />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
                { min: 6, message: 'Password must be at least 6 characters' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Enter your password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="w-full"
                loading={signupMutation.isPending}
                size="large"
              >
                Sign Up
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Typography.Text>
              Already have an account?{' '}
              <Typography.Link onClick={() => navigate('/login')}>
                Sign In
              </Typography.Link>
            </Typography.Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
