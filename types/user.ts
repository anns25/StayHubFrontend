export type UserRole = 'customer' | 'hotel_owner' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  profileImage?: string;
  phone?: string;
  isVerified: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
}

