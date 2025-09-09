import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useLogin } from "../../hooks/auth"
import { useNavigate, useLocation } from 'react-router-dom';
import type { LoginRequest } from '../../types';

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loginMutation = useLogin();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onSubmit = async (values: LoginRequest) => {
    setErrorMessage(null);
    try {
      await loginMutation.mutate(values);
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch (error: unknown) {
      const msg = (error as Error)?.message || 'Login failed';
      setErrorMessage(msg);
      message.error(msg);
    }
  };

  // Demo credentials message
  // Removed to avoid Antd static function warning

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card className="shadow-lg">
          <div className="text-center mb-8">
            <Title level={2} className="text-gray-900">
              Personal Finance Assistant
            </Title>
            <p className="text-gray-600">Sign in to manage your finances</p>
          </div>

          <Form
            form={form}
            onFinish={onSubmit}
            size="large"
            layout="vertical"
            initialValues={{
              email: '',
              password: '',
            }}
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Please enter your email' },
                { type: 'email', message: 'Please enter a valid email address' },
              ]}
              validateStatus={errorMessage ? 'error' : ''}
              help={errorMessage}
            >
              <Input
                prefix={<UserOutlined />}
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
              validateStatus={errorMessage ? 'error' : ''}
              help={errorMessage}
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
                loading={loginMutation.isPending}
                size="large"
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Typography.Text>
              Don't have an account?{' '}
              <Typography.Link onClick={() => navigate('/signup')}>
                Sign Up
              </Typography.Link>
            </Typography.Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Login;
