'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass?: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  register: (email: string, pass: string, username: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  loginWithGoogle: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra session từ Supabase nếu có
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const email = session.user.email || '';
          const role = email === 'admin@zypage.com' ? 'admin' : 'creator';
          setUser({
            id: session.user.id,
            email,
            username: session.user.user_metadata?.username || email.split('@')[0],
            fullName: session.user.user_metadata?.full_name || email.split('@')[0].toUpperCase(),
            avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            role,
          });
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const email = session.user.email || '';
          const role = email === 'admin@zypage.com' ? 'admin' : 'creator';
          setUser({
            id: session.user.id,
            email,
            username: session.user.user_metadata?.username || email.split('@')[0],
            fullName: session.user.user_metadata?.full_name || email.split('@')[0].toUpperCase(),
            avatarUrl: session.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
            role,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // 2. Chế độ Mock Auth
      const savedUser = localStorage.getItem('zy_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass?: string) => {
    // 1. Check Admin Account
    if (email.toLowerCase() === 'admin@zypage.com' || email.toLowerCase() === 'admin') {
      const adminUser: User = {
        id: 'u_admin',
        email: 'admin@zypage.com',
        username: 'admin',
        fullName: 'Hệ Thống Quản Trị Admin',
        avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
        role: 'admin',
      };
      setUser(adminUser);
      localStorage.setItem('zy_auth_user', JSON.stringify(adminUser));
      return { success: true, role: 'admin' };
    }

    // 2. Supabase Auth if configured
    if (isSupabaseConfigured && supabase && pass) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
      if (error) return { success: false, error: error.message };
      return { success: true, role: 'creator' };
    }

    // 3. Mock Creator Login
    const creatorUser: User = {
      id: 'u_' + Date.now(),
      email,
      username: email.split('@')[0],
      fullName: email.split('@')[0].toUpperCase(),
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      role: 'creator',
    };
    setUser(creatorUser);
    localStorage.setItem('zy_auth_user', JSON.stringify(creatorUser));
    return { success: true, role: 'creator' };
  };

  const register = async (email: string, pass: string, username: string, fullName: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: pass,
        options: {
          data: {
            username: username.toLowerCase(),
            full_name: fullName,
          },
        },
      });
      if (error) return { success: false, error: error.message };

      // Tạo luôn bản ghi trong bảng creators
      await supabase.from('creators').insert({
        username: username.toLowerCase(),
        full_name: fullName,
        bio: `Chào mừng bạn đến với kênh của ${fullName}!`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      });

      return { success: true };
    }

    // Mock register
    const newUser: User = {
      id: 'u_' + Date.now(),
      email,
      username: username.toLowerCase(),
      fullName,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
      role: 'creator',
    };
    setUser(newUser);
    localStorage.setItem('zy_auth_user', JSON.stringify(newUser));
    return { success: true };
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } else {
      const googleUser: User = {
        id: 'u_google',
        email: 'creator@gmail.com',
        username: 'creator_pro',
        fullName: 'Creator Pro',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
        role: 'creator',
      };
      setUser(googleUser);
      localStorage.setItem('zy_auth_user', JSON.stringify(googleUser));
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('zy_auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
