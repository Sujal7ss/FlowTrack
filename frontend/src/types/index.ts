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

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  dateRange?: [string, string];
  search?: string;
  page?: number;
  limit?: number;
}

export interface TransactionRequest {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}
export interface TransactionsResponse {
  data: Transaction[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
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

export interface Receipt {
  id: string;
  filename: string;
  url: string;
  extractedText: string;
  confirmed: boolean;
  transactionId?: string;
  createdAt: string;
}

export interface ReceiptUploadResponse {
  receipt: Receipt;
}

export interface ReceiptConfirmRequest {
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}