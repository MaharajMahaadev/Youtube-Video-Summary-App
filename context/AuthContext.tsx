import React, { createContext, useState, useContext, useEffect } from 'react';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

// Define the shape of our auth context
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  signup: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>;
};

// User type
type User = {
  id: string;
  email: string;
};

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => ({ success: false }),
  signup: async () => ({ success: false }),
  logout: () => {},
  forgotPassword: async () => ({ success: false }),
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

// Mock storage for web since SecureStore is not available on web
const mockStorage = new Map<string, string>();

// Helper function to handle storage across platforms
const storeData = async (key: string, value: string) => {
  if (Platform.OS === 'web') {
    mockStorage.set(key, value);
  } else {
    await SecureStore.setItemAsync(key, value);
  }
};

const getData = async (key: string) => {
  if (Platform.OS === 'web') {
    return mockStorage.get(key) || null;
  } else {
    return await SecureStore.getItemAsync(key);
  }
};

const removeData = async (key: string) => {
  if (Platform.OS === 'web') {
    mockStorage.delete(key);
  } else {
    await SecureStore.deleteItemAsync(key);
  }
};

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userJson = await getData('user');
        if (userJson) {
          const userData = JSON.parse(userJson);
          setUser(userData);
          router.replace('/(tabs)');
        } else {
          router.replace('/(auth)');
        }
      } catch (error) {
        console.error('Error checking login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      // Simulate API call
      // In a real app, you would make an API request to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }
      
      // Mock successful login
      const mockUser = { id: '123', email };
      await storeData('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Navigate to the main app
      router.replace('/(tabs)');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'An error occurred during login' };
    }
  };

  // Mock signup function
  const signup = async (email: string, password: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email || !password) {
        return { success: false, message: 'Email and password are required' };
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' };
      }
      
      if (!email.includes('@')) {
        return { success: false, message: 'Please enter a valid email' };
      }
      
      // Mock successful signup
      const mockUser = { id: '123', email };
      await storeData('user', JSON.stringify(mockUser));
      setUser(mockUser);
      
      // Navigate to the main app
      router.replace('/(tabs)');
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, message: 'An error occurred during signup' };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await removeData('user');
      setUser(null);
      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Mock forgot password function
  const forgotPassword = async (email: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (!email) {
        return { success: false, message: 'Email is required' };
      }
      
      if (!email.includes('@')) {
        return { success: false, message: 'Please enter a valid email' };
      }
      
      // Mock successful password reset request
      return { 
        success: true, 
        message: 'Password reset instructions have been sent to your email' 
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, message: 'An error occurred' };
    }
  };

  const value = {
    user,
    isLoading,
    login,
    signup,
    logout,
    forgotPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};