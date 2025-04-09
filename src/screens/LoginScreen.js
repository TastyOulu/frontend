import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, StyleSheet, Image, KeyboardAvoidingView, Platform, Pressable,TouchableOpacity } from 'react-native';
import { TextInput} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons'
import { CommonActions } from '@react-navigation/native';
import GradientBackground from '../components/GradientBackground';
import PasswordInput from '../components/PasswordInput';
import { AuthContext } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Component = require('../../assets/Component 3.png');

export default function LoginScreen({ navigation }) {
    const { t } = useTranslation();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState({ error: '', success: '' });
    const [showPassword, setShowPassword] = useState(false);
    const { login, error, loading } = useContext(AuthContext);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // email must be in valid format

    const handleSubmit = async () => {
        const { email, password } = formData;

        if (!email || !password) {
            alert(t('login_required_fields'));
            return;
        }

        if (!emailRegex.test(email)) {
            setMessage({ ...message, error: t('ui_invalid_email') });
            setTimeout(() => {
                setMessage({ error: '', success: '' });
            }, 2000);
            return;
        }

        const result = await login(email, password);

        if (result.success) {
            setMessage({ ...message, success: t('login_success') });

            setTimeout(() => {
                setMessage({ error: '', success: '' });
                navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [
                        {
                          name: 'DrawerRoot',
                          state: {
                            index: 0,
                            routes: [
                              {
                                name: 'Main',
                                state: {
                                  index: 0,
                                  routes: [{ name: 'HomeTab' }],
                                },
                              },
                            ],
                          },
                        },
                      ],
                    })
                  );
            }, 2000);

            setFormData({ email: '', password: '' });
        } else {
            setMessage({ ...message, error: result.error });

            setTimeout(() => {
                setMessage({ error: '', success: '' });
            }, 2000);
        }
    };

    return (
        <GradientBackground statusBarStyle="dark">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingTop: 10,
                        paddingBottom: 20,
                    }}
                >
                    <View style={{ position: 'absolute', top: 40, left: 10 }}>
                        {/* Custom back arrow */}
                        <TouchableOpacity
                            onPress={() =>{
                                navigation.dispatch(
                                  CommonActions.reset({
                                    index: 0,
                                    routes: [
                                      {
                                        name: 'DrawerRoot',
                                        state: {
                                          index: 0,
                                          routes: [
                                            {
                                              name: 'Main',
                                              state: {
                                                index: 0,
                                                routes: [{ name: 'HomeTab' }],
                                              },
                                            },
                                          ],
                                        },
                                      },
                                    ],
                                  })
                                );
                              }}
                              //style={{ position: 'absolute', top: 40, left: 20 }}
                            >
                              <Ionicons name="arrow-back" size={28} color="black" />
                            </TouchableOpacity>
                    </View>
                    <View style={{ marginTop: '20%' }}>
                        <Image source={Component} style={{ width: 305, height: 159, resizeMode: 'contain' }} />
                    </View>

                    <Text style={{ fontSize: 50, fontWeight: 'bold' }}>{t('login_greeting')}</Text>
                    <Text>{t('login_subtitle')}</Text>

                    <View style={{ flexDirection: 'column', marginTop: 20, marginBottom: 10 }}>
                        {/* Email Input */}
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={styles.input}
                                placeholder={t('login_email_placeholder')}
                                mode="outlined"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                left={<TextInput.Icon icon="email" />}
                                theme={{ roundness: 15 }}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                            />
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputWrapper}>
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

                    {/* Sign Up Link */}
                    <Pressable onPress={() => navigation.push('Signup')}>
                        <Text style={{ fontSize: 18, paddingBottom: 10 }}>
                            {t('login_no_account')}
                            <Text style={{ color: 'purple', textDecorationLine: 'underline' }}> {t('login_signup_link')}</Text>
                        </Text>
                    </Pressable>

                    <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={{ fontSize: 18, textDecorationLine: 'underline', color: 'purple' }}>
                            {t('login_forgot_password')}
                        </Text>
                    </Pressable>

                    {/* Login Button */}
                    <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
                        <Pressable
                            style={styles.button}
                            onPress={handleSubmit}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>
                                {loading ? t('login_loading') : t('login_button')}
                            </Text>
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
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginTop: 10,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        marginTop: 10,
    },
    button: {
        backgroundColor: '#9859FC',
        alignItems: 'center',
        width: 200,
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
});
