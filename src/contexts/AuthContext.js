import React, { createContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Constants from 'expo-constants';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;
    
    const checkAuth = async () => {
        try {
          const token = await SecureStore.getItemAsync('userToken');
          if (token) {
            const response = await axios.get(`${REACT_APP_API_URL}/user/info`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
      
            if (response.status === 200) {
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
          console.error('Auth check failed:', error);
          setUser(null);
          setError('Auth check failed');
        } finally {
          setLoading(false);
        }
      };

      const login = async ( email, password ) => {
        try {
          const response = await axios.post(`${REACT_APP_API_URL}/auth/login`, {
            email,
            password,
          });

          const { token, user } = response.data;
          await SecureStore.setItemAsync('userToken', token);
          setUser(user);
          setError(null);
          console.log('Login successful:', response.data);
        } catch (error) {
          console.error('Login failed:', error);
          setError('Invalid email or password');
          console.log('Login failed:', error);
        }
      };

      const logout = async () => {
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
        } catch (error) {
          console.error('Logout failed:', error);
          setError('Failed to log out');
        }
      };
      
      useEffect(() => {
        checkAuth();
      }, []);

      return (
        <AuthContext.Provider value={{ user, setUser, loading, error, login, logout, checkAuth }}>
          {children}
        </AuthContext.Provider>
      );
    };