// eduflexlms/context/auth-context.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api'; // Import our new API client

// Define the shape of our user object
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
}

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (emailOrUsername: string, password: string) => Promise<void>;
  logout: () => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Check auth on load
  const router = useRouter();

  // On initial app load, check local storage for existing user
  useEffect(() => {
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const { user, token } = JSON.parse(userInfo);
        setUser(user);
        setToken(token);
      }
    } catch (error) {
      console.error("Failed to load user from storage", error);
      localStorage.removeItem('userInfo');
    }
    setIsLoading(false);
  }, []);

  // --- LOGIN FUNCTION ---
  const login = async (emailOrUsername: string, password: string) => {
    // 1. Call your backend's login endpoint
    const { data } = await api.post('/auth/login', {
      email: emailOrUsername,
      password,
    });
    console.log("Login response data:", data);


    // 2. We get back user data and a token
    const { user, token } = data;

    // 3. Store user and token in state
    setUser(user);
    setToken(token);

    // 4. Store in local storage to stay logged in
    localStorage.setItem('userInfo', JSON.stringify({ user, token }));

    // 5. Redirect based on role
    if (user.role === 'admin') {
      router.push('/admin/dashboard'); // You'll create this page next
    } else if (user.role === 'teacher') {
      router.push('/dashboard'); // Main dashboard for teachers
    } else {
      router.push('/courses'); // Main courses page for students
    }
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('userInfo');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

// Create a custom hook to easily use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};