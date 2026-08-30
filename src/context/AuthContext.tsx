'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { User } from '@/types';

// Danh sách tài khoản hệ thống mặc định với mật khẩu chuẩn
const SYSTEM_ACCOUNTS: Record<string, { pass: string; user: User }> = {
  'admin@zypage.com': {
    pass: 'admin123',
    user: {
      id: 'u_admin',
      email: 'admin@zypage.com',
      username: 'admin',
      fullName: 'Hệ Thống Quản Trị Admin',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=Admin',
      role: 'admin',
      plan: 'enterprise',
    },
  },
  'mixi@gmail.com': {
    pass: '123456',
    user: {
      id: 'u_mixi',
      email: 'mixi@gmail.com',
      username: 'mixigaming',
      fullName: 'Phùng Thanh Độ',
      avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MixiGaming',
      role: 'creator',
      plan: 'pro',
    },
  },
};

interface StoredUserAccount {
  user: User;
  pass: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string; role?: string }>;
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

const failedAttempts: Record<string, { count: number; lockUntil: number }> = {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const getRegisteredUsers = (): Record<string, StoredUserAccount> => {
    try {
      const data = localStorage.getItem('zy_registered_accounts');
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  };

  const saveRegisteredUser = (email: string, account: StoredUserAccount) => {
    const all = getRegisteredUsers();
    all[email.toLowerCase()] = account;
    localStorage.setItem('zy_registered_accounts', JSON.stringify(all));
  };

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
            plan: 'pro',
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
            plan: 'pro',
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      });

      return () => subscription.unsubscribe();
    } else {
      const savedUser = localStorage.getItem('zy_auth_session');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Vui lòng nhập đầy đủ Email và Mật khẩu' };
    }

    const now = Date.now();
    const attempt = failedAttempts[cleanEmail];
    if (attempt && attempt.lockUntil > now) {
      const remainingSecs = Math.ceil((attempt.lockUntil - now) / 1000);
      return {
        success: false,
        error: `Tài khoản tạm thời bị khóa do nhập sai nhiều lần. Vui lòng thử lại sau ${remainingSecs} giây.`,
      };
    }

    const sysAcc = SYSTEM_ACCOUNTS[cleanEmail];
    if (sysAcc) {
      if (sysAcc.pass !== cleanPass) {
        failedAttempts[cleanEmail] = {
          count: (attempt?.count || 0) + 1,
          lockUntil: (attempt?.count || 0) + 1 >= 5 ? now + 60000 : 0,
        };
        return { success: false, error: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại!' };
      }

      delete failedAttempts[cleanEmail];
      setUser(sysAcc.user);
      localStorage.setItem('zy_auth_session', JSON.stringify(sysAcc.user));
      return { success: true, role: sysAcc.user.role };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (error) {
        return { success: false, error: 'Email hoặc mật khẩu không chính xác trên hệ thống Cloud.' };
      }

      const role = cleanEmail === 'admin@zypage.com' ? 'admin' : 'creator';
      const loggedUser: User = {
        id: data.user.id,
        email: cleanEmail,
        username: data.user.user_metadata?.username || cleanEmail.split('@')[0],
        fullName: data.user.user_metadata?.full_name || cleanEmail.split('@')[0].toUpperCase(),
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanEmail}`,
        role,
        plan: 'free',
      };
      setUser(loggedUser);
      localStorage.setItem('zy_auth_session', JSON.stringify(loggedUser));
      return { success: true, role };
    }

    const registered = getRegisteredUsers();
    const userAcc = registered[cleanEmail];

    if (!userAcc) {
      return {
        success: false,
        error: 'Tài khoản không tồn tại trên hệ thống. Vui lòng chuyển sang tab Đăng Ký Mới!',
      };
    }

    if (userAcc.pass !== cleanPass) {
      failedAttempts[cleanEmail] = {
        count: (attempt?.count || 0) + 1,
        lockUntil: (attempt?.count || 0) + 1 >= 5 ? now + 60000 : 0,
      };
      return { success: false, error: 'Mật khẩu không chính xác!' };
    }

    delete failedAttempts[cleanEmail];
    setUser(userAcc.user);
    localStorage.setItem('zy_auth_session', JSON.stringify(userAcc.user));
    return { success: true, role: userAcc.user.role };
  };

  const register = async (email: string, pass: string, username: string, fullName: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();
    const cleanUser = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    const cleanName = fullName.trim();

    if (!cleanEmail || !cleanPass || !cleanUser || !cleanName) {
      return { success: false, error: 'Vui lòng điền đầy đủ tất cả các trường thông tin.' };
    }

    if (cleanPass.length < 6) {
      return { success: false, error: 'Mật khẩu bảo mật phải có tối thiểu từ 6 ký tự trở lên.' };
    }

    if (SYSTEM_ACCOUNTS[cleanEmail]) {
      return { success: false, error: 'Email này đã được sử dụng. Vui lòng đăng nhập hoặc dùng Email khác.' };
    }

    const registered = getRegisteredUsers();
    if (registered[cleanEmail]) {
      return { success: false, error: 'Email này đã tồn tại trong hệ thống. Vui lòng đăng nhập!' };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password: cleanPass,
        options: {
          data: {
            username: cleanUser,
            full_name: cleanName,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      await supabase.from('creators').insert({
        username: cleanUser,
        full_name: cleanName,
        bio: `Chào mừng bạn đến với kênh của ${cleanName}!`,
        avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUser}`,
      });

      const newUser: User = {
        id: data.user?.id || 'u_' + Date.now(),
        email: cleanEmail,
        username: cleanUser,
        fullName: cleanName,
        avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUser}`,
        role: 'creator',
        plan: 'free',
      };
      setUser(newUser);
      localStorage.setItem('zy_auth_session', JSON.stringify(newUser));
      return { success: true };
    }

    const newUser: User = {
      id: 'u_' + Date.now(),
      email: cleanEmail,
      username: cleanUser,
      fullName: cleanName,
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${cleanUser}`,
      role: 'creator',
      plan: 'free',
    };

    saveRegisteredUser(cleanEmail, { user: newUser, pass: cleanPass });
    setUser(newUser);
    localStorage.setItem('zy_auth_session', JSON.stringify(newUser));
    return { success: true };
  };

  const loginWithGoogle = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signInWithOAuth({ provider: 'google' });
    } else {
      const googleUser: User = {
        id: 'u_google',
        email: 'creator.google@gmail.com',
        username: 'creator_google',
        fullName: 'Google Creator User',
        avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GoogleUser',
        role: 'creator',
        plan: 'pro',
      };
      setUser(googleUser);
      localStorage.setItem('zy_auth_session', JSON.stringify(googleUser));
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem('zy_auth_session');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, loginWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
