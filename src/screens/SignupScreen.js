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
  const { t } = useTranslation();

  const [formData, setFormData] = useState({ email: '', username: '', password: '' });
  const [message, setMessage] = useState({ error: '', success: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);
  const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;

  const handleSubmit = async () => {
    const { email, username, password } = formData;

    if (!email || !username || !password) {
      setMessage({ error: t('ui_all_fields_required'), success: '' });
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

      setMessage({ success: t('ui_signup_success'), error: '' });
      console.log('Registration successful', response.data);
      setTimeout(() => navigation.navigate('Login'), 3000);
      setFormData({ email: '', username: '', password: '' });
    } catch (error) {
      console.error('Error during registration:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || t('ui_signup_failed');
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
        <ScrollView contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop: 10,
          paddingBottom: 20
        }}>
          <View style={{ marginTop: 10 }}>
            <Image source={Component} style={{ width: 305, height: 159, resizeMode: 'contain' }} />
          </View>

          <Text style={{ fontSize: 36, fontWeight: '600' }}>{t('ui_signup_title')}</Text>

          <View style={{ flexDirection: 'column', marginTop: 20, marginBottom: 10 }}>
            {/* Email Input */}
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', marginTop: 10, marginBottom: 10 }}>
              <TextInput
                style={{ width: '100%', marginTop: 10 }}
                placeholder={t('ui_email')}
                mode="outlined"
                left={<TextInput.Icon icon="email" />}
                theme={{ roundness: 15 }}
                keyboardType='email-address'
                autoCapitalize='none'
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
            </View>

            {/* Username Input */}
            <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', marginBottom: 10 }}>
              <TextInput
                style={{ width: '100%', marginTop: 10 }}
                placeholder={t('ui_username')}
                mode="outlined"
                left={<TextInput.Icon icon="account" />}
                theme={{ roundness: 15 }}
                autoCapitalize='none'
                value={formData.username}
                onChangeText={(text) => setFormData({ ...formData, username: text })}
              />
            </View>

            {/* Password Input */}
            <View>
              <PasswordInput
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                showPassword={showPassword}
                toggleShowPassword={toggleShowPassword}
                placeholder={t('ui_password')}
                autoCapitalize="none"
              />
            </View>
          </View>

          {message.error ? <Text style={{ color: 'red' }}>{message.error}</Text> : null}
          {message.success ? <Text style={{ color: 'green' }}>{message.success}</Text> : null}

          {/* Sign In Link */}
          <Pressable onPress={() => navigation.navigate('Login')}>
            <Text style={{ fontSize: 18 }}>
              {t('ui_already_account')}
              <Text style={{ color: 'purple', textDecorationLine: 'underline' }}> {t('ui_login_button')}</Text>
            </Text>
          </Pressable>

          {/* Sign up Button */}
          <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
            <Pressable
              style={{
                backgroundColor: '#9859FC',
                alignItems: 'center',
                width: 200,
                borderRadius: 30,
                paddingVertical: 12,
                paddingHorizontal: 32,
                marginTop: 20
              }}
              onPress={handleSubmit}
              disabled={loading}
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
