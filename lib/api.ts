import apiClient from './api/client';
import authClient from './api/authClient';
import { cookieUtils } from './utils/cookies';

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'hotel_owner';
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    isApproved?: boolean;
    isVerified?: boolean;
  };
  message?: string;
}

// Register user
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await authClient.post<AuthResponse>('/register', data);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      'Registration failed'
    );
  }
};

// Login user
export const login = async (data: LoginData): Promise<AuthResponse> => {
  try {
    const response = await authClient.post<AuthResponse>('/login', data);
    return response.data;
  } catch (error: any) {
    console.error('Login error details:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
    });
    
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      error.message ||
      'Login failed'
    );
  }
};

// Get current user
export const getCurrentUser = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/auth/me');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error || 
      'Failed to get user'
    );
  }
};

// Logout user
export const logout = async () => {
  try {
    await apiClient.post('/auth/logout');
  } catch (error) {
    // Even if backend call fails, clear cookies
    console.error('Logout error:', error);
  } finally {
    // Clear cookies
    cookieUtils.clearAuth();
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};

// Forgot password
export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const response = await authClient.post('/auth/forgotpassword', { email });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to send reset email'
    );
  }
};