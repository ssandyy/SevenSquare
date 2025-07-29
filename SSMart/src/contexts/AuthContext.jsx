import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email, password, userData = {}) => {
    try {
      const result = await AuthService.signUp(email, password, userData);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email, password) => {
    try {
      const result = await AuthService.signIn(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AuthService.signOut();
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (userData) => {
    try {
      if (!currentUser) throw new Error('No user logged in');
      await AuthService.updateUserProfile(currentUser.uid, userData);
      // Update local state
      setCurrentUser(prev => ({ ...prev, ...userData }));
    } catch (error) {
      throw error;
    }
  };

  const promoteToAdmin = async (uid) => {
    try {
      if (!isAdmin()) throw new Error('Only admins can promote users');
      await AuthService.promoteToAdmin(uid);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const demoteToUser = async (uid) => {
    try {
      if (!isAdmin()) throw new Error('Only admins can demote users');
      await AuthService.demoteToUser(uid);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const isUser = () => {
    return currentUser?.role === 'user';
  };

  const value = {
    currentUser,
    signUp,
    signIn,
    signOut,
    updateProfile,
    promoteToAdmin,
    demoteToUser,
    isAdmin,
    isUser,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 