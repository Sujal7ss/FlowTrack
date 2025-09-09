import { useState } from 'react';
import { message } from 'antd';
import { authAPI } from '../api/api';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
} from '../types/index';

// Auth hooks
export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      message.success('Login successful!');
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    isPending: loading,
    error,
  };
};

export const useSignup = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (userData: SignupRequest): Promise<SignupResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await authAPI.register(userData);
      message.success('Signup successful!');
      return response;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Signup failed';
      setError(errorMessage);
      message.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    mutate,
    isPending: loading,
    error,
  };
};
