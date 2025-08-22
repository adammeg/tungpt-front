import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

// Types
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  subscription: {
    plan: 'free' | 'basic' | 'premium';
    status: 'active' | 'canceled' | 'pending' | 'failed';
    currentPeriodEnd?: Date;
    lastPaymentDate?: Date;
    lastPaymentAmount?: number;
    lastPaymentCurrency?: string;
  };
  usage: {
    messagesThisMonth: number;
    totalMessages: number;
    totalTokens: number;
    lastResetDate: Date;
  };
  isActive: boolean;
  role: 'user' | 'admin';
  createdAt: Date;
}

export interface Conversation {
  _id: string;
  title: string;
  messages: Message[];
  model: string;
  totalTokens: number;
  totalMessages: number;
  isActive: boolean;
  isArchived: boolean;
  metadata?: {
    lastActivity: Date;
    messageCount: number;
    averageResponseTime: number;
    favoriteTopics: string[];
    tags: string[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  _id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  tokens?: number;
  model?: string;
  attachments?: string[];
  metadata?: {
    processingTime?: number;
    error?: string;
    retryCount?: number;
  };
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  messagesPerMonth: number;
  features: string[];
  popular?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface ChatMessage {
  message: string;
  model?: string;
  attachments?: string[];
}

export interface RealTimeStatus {
  isConnected: boolean;
  activeUsers: number;
  userConversations: Array<{
    id: string;
    title: string;
    hasTypingUsers: boolean;
  }>;
  serverInfo: {
    socketConnections: number;
    uptime: number;
    memory: any;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    // Ensure we're connecting to the correct backend URL
    this.baseURL = 'http://localhost:5000';
    
    console.log('🔗 API Client connecting to:', this.baseURL);
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => {
        console.log('📥 API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
          // Clear token and redirect to login
          Cookies.remove('authToken');
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      console.log('🔍 Sending login request with:', { email: credentials.email });
      const response = await this.client.post('/api/auth/login', credentials);
      console.log('🔍 Login response status:', response.status);
      console.log('🔍 Login response headers:', response.headers);
      console.log('🔍 Login response data:', response.data);
      console.log('🔍 Login response data type:', typeof response.data);
      console.log('🔍 Login response data keys:', Object.keys(response.data || {}));
      return response.data;
    } catch (error: any) {
      console.error('❌ Login API error:', error);
      console.error('❌ Login API error response:', error.response?.data);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.client.post('/api/auth/register', data);
    return response.data;
  }

  async logout(): Promise<ApiResponse> {
    const response = await this.client.post('/api/auth/logout');
    Cookies.remove('authToken');
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.client.get('/api/auth/profile');
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.put('/api/auth/profile', data);
    return response.data;
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    const response = await this.client.put('/api/auth/change-password', data);
    return response.data;
  }

  // Chat
  async getConversations(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    filter?: string;
  }): Promise<ApiResponse<{ conversations: Conversation[]; total: number; page: number; pages: number }>> {
    const response = await this.client.get('/api/chat/conversations', { params });
    return response.data;
  }

  async createConversation(data?: { title?: string; model?: string }): Promise<ApiResponse<Conversation>> {
    const response = await this.client.post('/api/chat/conversations', data);
    // The backend returns { success: true, data: { conversation: Conversation } }
    // but our interface expects { success: true, data: Conversation }
    const responseData = response.data;
    if (responseData.success && responseData.data && responseData.data.conversation) {
      return {
        success: true,
        data: responseData.data.conversation
      };
    }
    return responseData;
  }

  async getConversation(id: string): Promise<ApiResponse<Conversation>> {
    const response = await this.client.get(`/api/chat/conversations/${id}`);
    // The backend returns { success: true, data: { conversation: Conversation } }
    // but our interface expects { success: true, data: Conversation }
    const responseData = response.data;
    if (responseData.success && responseData.data && responseData.data.conversation) {
      return {
        success: true,
        data: responseData.data.conversation
      };
    }
    return responseData;
  }

  async sendMessage(conversationId: string, data: ChatMessage): Promise<ApiResponse<{ message: Message; conversation: Conversation }>> {
    const response = await this.client.post(`/api/chat/conversations/${conversationId}/messages`, data);
    return response.data;
  }

  async updateConversationTitle(conversationId: string, title: string): Promise<ApiResponse<Conversation>> {
    const response = await this.client.put(`/api/chat/conversations/${conversationId}/title`, { title });
    // The backend returns { success: true, data: { conversation: Conversation } }
    // but our interface expects { success: true, data: Conversation }
    const responseData = response.data;
    if (responseData.success && responseData.data && responseData.data.conversation) {
      return {
        success: true,
        data: responseData.data.conversation
      };
    }
    return responseData;
  }

  async deleteConversation(conversationId: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/api/chat/conversations/${conversationId}`);
    return response.data;
  }

  async getModels(): Promise<ApiResponse<Array<{ id: string; name: string; description: string; price: number }>>> {
    const response = await this.client.get('/api/chat/models');
    // The backend returns { success: true, data: { models: [...] } }
    // but our interface expects { success: true, data: [...] }
    const responseData = response.data;
    if (responseData.success && responseData.data && responseData.data.models) {
      return {
        success: true,
        data: responseData.data.models
      };
    }
    return responseData;
  }

  // Subscription
  async getSubscriptionPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    const response = await this.client.get('/api/subscription/plans');
    return response.data;
  }

  async createCheckoutSession(plan: string): Promise<ApiResponse<{ checkoutUrl: string; orderId: string }>> {
    const response = await this.client.post('/api/subscription/create-checkout-session', { plan });
    return response.data;
  }

  async getSubscriptionStatus(): Promise<ApiResponse<{ subscription: any; usage: any }>> {
    const response = await this.client.get('/api/subscription/status');
    return response.data;
  }

  async cancelSubscription(): Promise<ApiResponse> {
    const response = await this.client.post('/api/subscription/cancel');
    return response.data;
  }

  async checkPaymentStatus(orderId: string): Promise<ApiResponse<{ status: string; order: any }>> {
    const response = await this.client.get(`/api/subscription/payment-status/${orderId}`);
    return response.data;
  }

  // Real-time
  async getRealTimeStatus(): Promise<ApiResponse<RealTimeStatus>> {
    const response = await this.client.get('/api/realtime/status');
    return response.data;
  }

  async getActiveUsers(conversationId: string): Promise<ApiResponse<{ activeUsers: any[]; count: number }>> {
    const response = await this.client.get(`/api/realtime/conversations/${conversationId}/active-users`);
    return response.data;
  }

  async getTypingUsers(conversationId: string): Promise<ApiResponse<{ typingUsers: string[]; count: number }>> {
    const response = await this.client.get(`/api/realtime/conversations/${conversationId}/typing`);
    return response.data;
  }

  async sendNotification(userId: string, data: { message: string; type?: string; data?: any }): Promise<ApiResponse> {
    const response = await this.client.post(`/api/realtime/notify/${userId}`, data);
    return response.data;
  }

  async broadcastMessage(data: { message: string; type?: string; data?: any }): Promise<ApiResponse> {
    const response = await this.client.post('/api/realtime/broadcast', data);
    return response.data;
  }

  async getRealTimeStats(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/api/realtime/stats');
    return response.data;
  }

  // History
  async getChatHistory(params?: {
    page?: number;
    limit?: number;
    sort?: string;
    filter?: string;
    search?: string;
    tags?: string[];
    dateFrom?: string;
    dateTo?: string;
  }): Promise<ApiResponse<{ conversations: Conversation[]; total: number; page: number; pages: number }>> {
    const response = await this.client.get('/api/history', { params });
    return response.data;
  }

  async searchConversations(query: string): Promise<ApiResponse<{ conversations: Conversation[]; total: number }>> {
    const response = await this.client.get('/api/history/search', { params: { q: query } });
    return response.data;
  }

  async getHistoryStats(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/api/history/stats');
    return response.data;
  }

  async getHistoryTags(): Promise<ApiResponse<string[]>> {
    const response = await this.client.get('/api/history/tags');
    return response.data;
  }

  async addConversationTags(conversationId: string, tags: string[]): Promise<ApiResponse> {
    const response = await this.client.post(`/api/history/conversations/${conversationId}/tags`, { tags });
    return response.data;
  }

  async removeConversationTag(conversationId: string, tag: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/api/history/conversations/${conversationId}/tags/${tag}`);
    return response.data;
  }

  async exportConversations(format: 'json' | 'csv' = 'json'): Promise<ApiResponse<{ downloadUrl: string }>> {
    const response = await this.client.get(`/api/history/export?format=${format}`);
    return response.data;
  }

  async getHistoryInsights(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/api/history/insights');
    return response.data;
  }

  // File Upload
  async uploadFile(file: File): Promise<ApiResponse<{ url: string; filename: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await this.client.post('/api/upload/single', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async uploadMultipleFiles(files: File[]): Promise<ApiResponse<Array<{ url: string; filename: string }>>> {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    
    const response = await this.client.post('/api/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async getUserFiles(): Promise<ApiResponse<Array<{ filename: string; url: string; size: number; uploadedAt: Date }>>> {
    const response = await this.client.get('/api/upload/files');
    return response.data;
  }

  async deleteFile(filename: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/api/upload/files/${filename}`);
    return response.data;
  }

  // Admin (if user is admin)
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/api/admin/dashboard');
    return response.data;
  }

  async getUsers(params?: { page?: number; limit?: number; search?: string }): Promise<ApiResponse<any>> {
    const response = await this.client.get('/api/admin/users', { params });
    return response.data;
  }

  async getUser(userId: string): Promise<ApiResponse<User>> {
    const response = await this.client.get(`/api/admin/users/${userId}`);
    return response.data;
  }

  async updateUser(userId: string, data: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.client.put(`/api/admin/users/${userId}`, data);
    return response.data;
  }

  async deleteUser(userId: string): Promise<ApiResponse> {
    const response = await this.client.delete(`/api/admin/users/${userId}`);
    return response.data;
  }

  async getSystemHealth(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/api/admin/health');
    return response.data;
  }

  async getLogs(params?: { level?: string; limit?: number }): Promise<ApiResponse<any>> {
    const response = await this.client.get('/api/admin/logs', { params });
    return response.data;
  }

  // Utility
  async healthCheck(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/health');
    return response.data;
  }

  async getApiDocs(): Promise<ApiResponse<any>> {
    const response = await this.client.get('/api');
    return response.data;
  }

  // Helper methods
  setToken(token: string) {
    // Store token in regular cookies for frontend access
    Cookies.set('authToken', token, { expires: 7, secure: process.env.NODE_ENV === 'production' });
  }

  getToken(): string | undefined {
    // Try to get token from regular cookies first, then from HTTP-only cookies via API
    return Cookies.get('authToken');
  }

  removeToken() {
    Cookies.remove('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}

// Create singleton instance
const apiClient = new ApiClient();

export default apiClient;
