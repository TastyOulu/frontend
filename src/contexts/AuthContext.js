import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Constants from 'expo-constants';
import { Alert } from 'react-native';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [newUsername, setNewUsername] = useState('');

  const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;

  const checkAuth = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const response = await axios.get(`${REACT_APP_API_URL}/user/info`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setToken(token);
          setUser(response.data);
          setError(null);
        } else {
          setUser(null);
          setError('Failed to fetch user info');
        }
      } else {
        setUser(null);
        setError('No token found');
      }
    } catch (error) {
      setError('Auth check failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, username, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/auth/register`, {
        username,
        email,
        password,
      });

      const { token, user } = response.data;
        await SecureStore.setItemAsync('userToken', token);
        setToken(token);
        setUser(user);
        setError(null);
        console.log('Registration successful:', response.data);
        return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
        console.log('Registration failed:', errorMessage);
        setError(errorMessage);
        return { success: false, error: errorMessage };
    } finally {
        setLoading(false);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/auth/login`, {
        email,
        password
      });

      const { token, user } = response.data;
      await SecureStore.setItemAsync('userToken', token);
      setToken(token);
      setUser(user);
      setError(null);
      console.log('Login successful:', response.data);
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid email or password';
      console.log('Login failed:', errorMessage);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        await axios.post(`${REACT_APP_API_URL}/auth/logout`, {}, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        await SecureStore.deleteItemAsync('userToken');
        console.log('Logout successful');
      }
      setUser(null);
      setError(null);
      setToken(null)
    } catch (error) {
      console.error('Logout failed:', error);
      setError('Failed to log out');
    } finally {
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        await axios.delete(`${REACT_APP_API_URL}/auth/delete`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
          data: {
            email: user.email,
          }
        });
        await SecureStore.deleteItemAsync('userToken');
        setUser(null);
        setError(null);
        Alert.alert('Account deleted successfully');
        console.log('Account deleted successfully');
      }
    } catch (error) {
      Alert.alert('Failed to delete account', 'Please try again later.');
      console.log('Failed to delete account:', error);
      setError('Failed to delete account');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeUsername = async () => {
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (token) {
        const response = await axios.post(`${REACT_APP_API_URL}/update/username`, {
          username: newUsername,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (response.status === 200) {
          setUser(response.data);
          console.log("Updated user:", response.data);
          Alert.alert('Username updated successfully');
          setError(null);
        } else {
          setError('Failed to update username');
          Alert.alert('Failed to update username');
        }
      }
    } catch (error) {
      setError('Failed to update username');
      console.log("Error during username update:", error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    checkAuth();
  }, []);

  return (
      <AuthContext.Provider value={{ user, token, setToken, setUser, loading, error, register, login, logout, checkAuth, deleteAccount, newUsername, setNewUsername, handleChangeUsername }}>
        {children}
      </AuthContext.Provider>
  );
};