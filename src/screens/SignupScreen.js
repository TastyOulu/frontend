import React, {useContext, useState} from 'react';
import { View, Text, StyleSheet, Image, Pressable, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from "react-native";
import { TextInput } from 'react-native-paper';
import Component from '../../assets/Component 3.png';
import PasswordInput from '../components/PasswordInput';
import GradientBackground from '../components/GradientBackground';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts/AuthContext';

export default function SignupScreen({ navigation }) {
    const { t } = useTranslation();
    const { register } = useContext(AuthContext);

    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [message, setMessage] = useState({ error: '', success: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);

    const handleSubmit = async () => {
        const { email, username, password } = formData;

        if (!email || !username || !password) {
            setMessage({ error: t('ui_all_fields_required'), success: '' });
            setTimeout(() => setMessage({ error: '', success: '' }), 2000);
            return;
        }

        setLoading(true);

        const result = await register(email, username, password);

        if (result.success) {
            setMessage({ success: t('ui_registration_success'), error: '' });
            setFormData({ email: '', username: '', password: '' });
            setTimeout(() => setMessage({ success: '', error: '' }), 2000);
            setTimeout(() => navigation.navigate('Login'), 2000);
        } else {
            setMessage({ error: result.error, success: '' });
            setTimeout(() => setMessage({ error: '', success: '' }), 2000);
        }
        setLoading(false);
    };

    return (
        <GradientBackground>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ marginTop: 40 }}>
                        <Image source={Component} style={{ width: 305, height: 159, resizeMode: 'contain' }} />
                    </View>

                    <Text style={{ fontSize: 50, fontWeight: 'bold' }}>{t('ui_hello!')}</Text>
                    <Text>{t('ui_create_account')}</Text>

                    <View style={{ width: '90%', marginTop: 20, marginBottom: 10 }}>
                        <TextInput
                            style={{ marginBottom: 10 }}
                            placeholder={t('ui_email')}
                            mode="outlined"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="email" />}
                            theme={{ roundness: 15 }}
                            value={formData.email}
                            onChangeText={(text) => setFormData({ ...formData, email: text })}
                        />

                        <TextInput
                            style={{ marginBottom: 10 }}
                            placeholder={t('ui_username')}
                            mode="outlined"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="account" />}
                            theme={{ roundness: 15 }}
                            value={formData.username}
                            onChangeText={(text) => setFormData({ ...formData, username: text })}
                        />

                        <PasswordInput
                            value={formData.password}
                            onChangeText={(text) => setFormData({ ...formData, password: text })}
                            showPassword={showPassword}
                            toggleShowPassword={toggleShowPassword}
                            placeholder={t('ui_password')}
                            autoCapitalize="none"
                        />
                    </View>

                    {message.error ? <Text style={{ color: 'red' }}>{message.error}</Text> : null}
                    {message.success ? <Text style={{ color: 'green' }}>{message.success}</Text> : null}

                    {/* Login Link */}
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text style={{ fontSize: 18 }}>
                            {t('ui_have_account')}
                            <Text style={{ color: 'purple', textDecorationLine: 'underline' }}> {t('ui_signin')}</Text>
                        </Text>
                    </Pressable>

                    {/* Submit Button */}
                    <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
                        <Pressable
                            style={{
                                backgroundColor: '#9859FC',
                                alignItems: 'center',
                                width: 200,
                                borderRadius: 30,
                                paddingVertical: 12,
                                paddingHorizontal: 32,
                                marginTop: 20,
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
