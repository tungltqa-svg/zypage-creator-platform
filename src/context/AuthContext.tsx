'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { INITIAL_CREATORS } from '@/lib/mock-data';

interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  loginWithGoogle: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Kiểm tra session từ Supabase nếu có cấu hình
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username || 'mixigaming',
            fullName: session.user.user_metadata?.full_name || 'Phùng Thanh Độ',
            avatarUrl: session.user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mixi',
          });
        }
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            username: session.user.user_metadata?.username || 'mixigaming',
            fullName: session.user.user_metadata?.full_name || 'Phùng Thanh Độ',
            avatarUrl: session.user.user_metadata?.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mixi',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      // 2. Chế độ Mock Auth (Tự động đăng nhập sẵn tài khoản demo để trải nghiệm)
      const savedUser = localStorage.getItem('zy_auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        const defaultUser = {
          id: 'u_mixi',
          email: 'mixi@gmail.com',
          username: 'mixigaming',
          fullName: 'Phùng Thanh Độ',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MixiGaming',
        };
        setUser(defaultUser);
        localStorage.setItem('zy_auth_user', JSON.stringify(defaultUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string) => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOtp({ email });
    } else {
      const mockUser = {
        id: 'u_' + Date.now(),
        email,
        username: email.split('@')[0],
        fullName: email.split('@')[0].toUpperCase(),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      };
      setUser(mockUser);
      localStorage.setItem('zy_auth_user', JSON.stringify(mockUser));
    }
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } else {
      const googleUser = {
        id: 'u_google',
        email: 'creator@gmail.com',
        username: 'creator_pro',
        fullName: 'Creator Pro',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
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
    <AuthContext.Provider value={{ user, loading, login, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
