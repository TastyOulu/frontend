import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { TextInput } from 'react-native-paper';
import Component from '../../assets/Component 3.png';
import Constants from 'expo-constants';
import PasswordInput from '../components/PasswordInput';
import axios from 'axios';
import GradientBackground from '../components/GradientBackground';
import { useTranslation } from 'react-i18next';

export default function SignupScreen({ navigation }) {

    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [message, setMessage] = useState({ error: '', success: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;

    const handleSubmit = async () => {
        const { email, username, password } = formData;

        if (!email || !username || !password) {
            setMessage({ error: 'All fields are required', success: '' });
            setTimeout(() => setMessage({ error: '', success: '' }), 2000);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${REACT_APP_API_URL}/auth/register`, {
                username,
                email,
                password,
            });

            if (response.data) {
                setMessage({ success: 'Registration successful! Redirecting to login page...', error: '' });
                console.log('Registration successful', response.data);
    
                setFormData({ email: '', username: '', password: '' });
                setTimeout(() => setMessage({ success: '', error: '' }), 2000);
                setTimeout(() => navigation.navigate('Login'), 3000);
            }
        } catch (error) {
            console.error('Error during registration:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            setMessage({ error: errorMessage, success: '' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
              {loading ? <ActivityIndicator color="white" /> : <Text style={{ color: 'white', fontSize: 18 }}>{t('ui_submit')}</Text>}
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
