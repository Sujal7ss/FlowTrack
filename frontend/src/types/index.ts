export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface SignupRequest {
  email: string;
  password: string;
  name: string;
}

export interface SignupResponse {
  accessToken: string;
  user: User;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryAggregation {
  category: string;
  amount: number;
  count: number;
}

export interface TrendData {
  date: string;
  income: number;
  expense: number;
  net: number;
}

export interface AggregationsResponse {
  categoryBreakdown: CategoryAggregation[];
  trendData: TrendData[];
  summary: {
    totalIncome: number;
    totalExpense: number;
    netAmount: number;
  };
}