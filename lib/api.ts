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
    role: 'customer' | 'hotel_owner' | 'admin';
    isApproved?: boolean;
    isVerified?: boolean;
    profileImage?: string;
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

// Admin: Get pending approvals
export const getPendingApprovals = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/admin/pending-approvals');
    return response.data;
  } catch (error: any) {
    console.error('Get pending approvals error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });
    throw new Error(
      error.response?.data?.message || 
      error.response?.data?.error ||
      `Failed to fetch pending approvals: ${error.response?.status || 'Network error'}`
    );
  }
};

// Admin: Approve user
export const approveUser = async (userId: string): Promise<any> => {
  try {
    const response = await apiClient.patch(`/admin/users/${userId}/approve`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to approve user'
    );
  }
};

// Admin: Get all users
export const getAllUsers = async (params?: {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<any> => {
  try {
    const response = await apiClient.get('/admin/users', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch users'
    );
  }
};

// Admin: Get user statistics
export const getUserStatistics = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/admin/users/statistics');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch user statistics'
    );
  }
};

// Hotel Owner: Get my hotels
export const getMyHotels = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/hotels/my-hotels');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch hotels'
    );
  }
};

// Hotel Owner: Get single hotel
export const getHotel = async (hotelId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/hotels/${hotelId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch hotel'
    );
  }
};

// Hotel Owner: Create hotel
export const createHotel = async (formData: FormData): Promise<any> => {
  try {
    const response = await apiClient.post('/hotels', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to create hotel'
    );
  }
};

// Hotel Owner: Update hotel
export const updateHotel = async (hotelId: string, formData: FormData): Promise<any> => {
  try {
    const response = await apiClient.patch(`/hotels/${hotelId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to update hotel'
    );
  }
};

// Hotel Owner: Delete hotel
export const deleteHotel = async (hotelId: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`/hotels/${hotelId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to delete hotel'
    );
  }
};

// Hotel Owner: Get rooms by hotel
export const getRoomsByHotel = async (hotelId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/rooms/hotel/${hotelId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch rooms'
    );
  }
};

// Hotel Owner: Get single room
export const getRoom = async (roomId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/rooms/${roomId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch room'
    );
  }
};

// Hotel Owner: Create room
export const createRoom = async (formData: FormData): Promise<any> => {
  try {
    const response = await apiClient.post('/rooms', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to create room'
    );
  }
};

// Hotel Owner: Update room
export const updateRoom = async (roomId: string, formData: FormData): Promise<any> => {
  try {
    const response = await apiClient.patch(`/rooms/${roomId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to update room'
    );
  }
};

// Hotel Owner: Delete room
export const deleteRoom = async (roomId: string): Promise<any> => {
  try {
    const response = await apiClient.delete(`/rooms/${roomId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to delete room'
    );
  }
};

// Admin: Approve hotel
export const approveHotel = async (hotelId: string): Promise<any> => {
  try {
    const response = await apiClient.patch(`/admin/hotels/${hotelId}/approve`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to approve hotel'
    );
  }
};

// Admin: Get pending hotels
export const getPendingHotels = async (): Promise<any> => {
  try {
    const response = await apiClient.get('/admin/pending-approvals');
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch pending hotels'
    );
  }
};

// Admin: Reject hotel (optional - you might want to add this)
export const rejectHotel = async (hotelId: string, reason?: string): Promise<any> => {
  try {
    const response = await apiClient.patch(`/admin/hotels/${hotelId}/reject`, { reason });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to reject hotel'
    );
  }
};

// Update user profile
export const updateProfile = async (formData: FormData): Promise<any> => {
  try {
    const response = await apiClient.patch('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to update profile'
    );
  }
};

// Customer: Get all hotels (public)
export const getHotels = async (params?: {
  search?: string;
  category?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
}): Promise<any> => {
  try {
    const response = await apiClient.get('/hotels', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch hotels'
    );
  }
};

// Customer: Get single hotel (public)
export const getHotelById = async (hotelId: string): Promise<any> => {
  try {
    const response = await apiClient.get(`/hotels/${hotelId}`);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to fetch hotel'
    );
  }
};

// Customer: Search hotels
export const searchHotels = async (params?: {
  category?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
}): Promise<any> => {
  try {
    const response = await apiClient.get('/hotels/search', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 
      'Failed to search hotels'
    );
  }
};