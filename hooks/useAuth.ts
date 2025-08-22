'use client';
import { useState, useEffect, createContext, useContext } from 'react';
import { useRouter } from 'next/navigation';
import apiClient, { User, LoginCredentials, RegisterData } from '@/lib/api';
import { toast } from 'sonner';
import React from 'react';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check authentication status on mount
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      
      // Check if we have a token in cookies
      const token = apiClient.getToken();
      
      if (token) {
        console.log('🔍 Found existing token, checking validity...');
        
        // Verify token by fetching profile
        const response = await apiClient.getProfile();
        if (response.success && response.data) {
          console.log('✅ Token is valid, user authenticated');
          setUser(response.data);
        } else {
          console.log('❌ Token is invalid, removing...');
          apiClient.removeToken();
          setUser(null);
        }
      } else {
        console.log('🔍 No token found, user not authenticated');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      apiClient.removeToken();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiClient.login(credentials);
      
      console.log('🔍 useAuth login response:', response);
      
      // Accept either {success, data:{user, token}} or {success, user, token}
      let token: string | undefined;
      let userData: User | undefined;

      if (response && typeof response === 'object') {
        // Normalized reads
        const container: any = response.data ?? response;
        token = container?.token;
        userData = container?.user;
      }

      // If token returned, persist it in regular cookies for frontend access
      if (token) {
        console.log('🔑 Setting token in cookies:', token ? 'SUCCESS' : 'FAILED');
        apiClient.setToken(token);
      } else {
        console.log('⚠️ No token received from login response');
      }

      // Always try to fetch profile after a 200 login
      try {
        const profile = await apiClient.getProfile();
        if (profile.success && profile.data) {
          setUser(profile.data as User);
          toast.success('Successfully logged in!');
          router.push('/chat');
          return true;
        }
      } catch (e) {
        console.warn('Profile fetch after login failed:', e);
      }

      // Fallback: if backend included user, accept it
      if (userData) {
        setUser(userData);
        toast.success('Successfully logged in!');
        router.push('/chat');
        return true;
      }

      console.error('❌ Invalid response structure:', response);
      toast.error((response as any)?.error || 'Login failed - invalid response');
      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error?.response?.data?.error || 'Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiClient.register(data);
      
      if (response.success && response.data) {
        apiClient.setToken(response.data.token);
        setUser(response.data.user);
        toast.success('Account created successfully!');
        router.push('/chat');
        return true;
      } else {
        toast.error(response.error || 'Registration failed');
        return false;
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.error || 'Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      apiClient.removeToken();
      setUser(null);
      router.push('/login');
      toast.success('Logged out successfully');
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiClient.updateProfile(data);
      
      if (response.success && response.data) {
        setUser(response.data);
        toast.success('Profile updated successfully!');
        return true;
      } else {
        toast.error(response.error || 'Profile update failed');
        return false;
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.error || 'Profile update failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await apiClient.changePassword({ currentPassword, newPassword });
      
      if (response.success) {
        toast.success('Password changed successfully!');
        return true;
      } else {
        toast.error(response.error || 'Password change failed');
        return false;
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.error || 'Password change failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await apiClient.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
  };

  return React.createElement(
    AuthContext.Provider,
    { value },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
