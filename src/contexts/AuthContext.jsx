import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock authentication for demo purposes
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check for existing session
        const savedUser = localStorage.getItem('qrloop_user');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials) => {
    try {
      // Mock login - in real app, this would call your API
      const mockUser = {
        id: '1',
        name: 'Demo User',
        email: credentials.email,
        avatar: null,
        plan: 'free',
        features: {
          maxQRCodes: 100,
          analytics: true,
          collaboration: false,
          aiEnhancement: true,
          exportFormats: ['png', 'svg'],
        },
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      setIsAuthenticated(true);
      localStorage.setItem('qrloop_user', JSON.stringify(mockUser));
      
      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        avatar: null,
        plan: 'free',
        features: {
          maxQRCodes: 50,
          analytics: true,
          collaboration: false,
          aiEnhancement: false,
          exportFormats: ['png'],
        },
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      setIsAuthenticated(true);
      localStorage.setItem('qrloop_user', JSON.stringify(newUser));
      
      return { success: true, user: newUser };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('qrloop_user');
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('qrloop_user', JSON.stringify(updatedUser));
  };

  const upgradeToProPlan = () => {
    const upgradedUser = {
      ...user,
      plan: 'pro',
      features: {
        maxQRCodes: 1000,
        analytics: true,
        collaboration: true,
        aiEnhancement: true,
        exportFormats: ['png', 'svg', 'pdf'],
      },
    };
    updateUser(upgradedUser);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateUser,
    upgradeToProPlan,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
