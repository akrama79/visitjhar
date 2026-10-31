import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

export const DEMO_USER: UserProfile = {
  id: 'usr-demo-1',
  email: 'explorer@visitjhar.in',
  full_name: 'Ananya Sharma',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  role: 'user',
  interests: ['Waterfalls', 'Nature', 'Photography'],
  preferred_categories: ['Waterfalls', 'Nature', 'Eco Tourism'],
  travel_style: 'Balanced',
  preferred_duration: '2 Days',
  preferred_budget: 'LOW',
  travel_group: 'Friends',
  home_location: 'Ranchi',
  age: 26
};

export const DEMO_ADMIN: UserProfile = {
  id: 'adm-demo-1',
  email: 'admin@visitjhar.in',
  full_name: 'Jharkhand Tourism Admin',
  avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
  role: 'admin',
  interests: ['Tribal Heritage', 'Culture', 'History'],
  preferred_categories: ['Heritage', 'Tribal & Cultural'],
  travel_style: 'Cultural',
  preferred_duration: '3 Days',
  preferred_budget: 'MODERATE',
  travel_group: 'Group',
  home_location: 'Ranchi',
  age: 38
};

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email?: string, asAdmin?: boolean) => void;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchDemoRole: (role: 'user' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('visitjhar_user');
    return saved ? JSON.parse(saved) : DEMO_USER; // Default logged in as demo user for rapid inspection
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('visitjhar_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('visitjhar_user');
    }
  }, [user]);

  const login = (email?: string, asAdmin = false) => {
    const newUser = asAdmin ? { ...DEMO_ADMIN } : { ...DEMO_USER, email: email || DEMO_USER.email };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
  };

  const switchDemoRole = (role: 'user' | 'admin') => {
    setUser(role === 'admin' ? DEMO_ADMIN : DEMO_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        logout,
        updateProfile,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
