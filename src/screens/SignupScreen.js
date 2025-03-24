import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import { TextInput } from 'react-native-paper';
import Background from '../components/Background';
const Component = require('../../assets/Component 3.png');
import axios from 'axios';

export default function SignupScreen({ navigation }) {
    const [formData, setFormData] = useState({ email: '', username: '', password: '' });
    const [message, setMessage] = useState({ error: '', success: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        const { email, username, password } = formData;

        if (!email || !username || !password) {
            setMessage({ error: 'All fields are required', success: '' });
            return;
        }

        setLoading(true); 

        try {
            const response = await axios.post('http://144.21.42.71:3000/api/auth/register', {
                username: username,
                email: email,
                password: password
            });
            setMessage({ success: 'Registration successful! Redirecting to login page...', error: '' });
            setTimeout(() => navigation.navigate('Login'), 3000);
        } catch (error) {
            console.error('Error during registration:', error);
            console.log(formData);

            const errorMessage = error.response?.data?.message;
                
            setMessage({ error: errorMessage, success: '' });
        } finally {
            setLoading(false); 
        }
    };

    return (
        <Background>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingBottom: 20 }}>
                    <View style={{ marginTop: 40 }}>
                        <Image source={Component} style={{ width: 305, height: 159, resizeMode: 'contain' }} />
                    </View>
                    <Text style={{ fontSize: 36, fontWeight: '600' }}>Create an account</Text>
                    <View style={{ flexDirection: 'column', marginTop: 20, marginBottom: 10 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', marginTop: 10, marginBottom: 10 }}>
                            <TextInput
                                style={{ width: '100%', marginTop: 10 }}
                                placeholder="Email"
                                mode="outlined"
                                left={<TextInput.Icon icon="email" />}
                                theme={{ roundness: 15 }}
                                keyboardType='email-address'
                                autoCapitalize='none'
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', width: '90%', marginBottom: 10 }}>
                            <TextInput
                                style={{ width: '100%', marginTop: 10 }}
                                placeholder="Username"
                                mode="outlined"
                                left={<TextInput.Icon icon="account" />}
                                theme={{ roundness: 15 }}
                                value={formData.username}
                                autoCapitalize='none'
                                onChangeText={(text) => setFormData({ ...formData, username: text })}
                            />
                        </View>

                        <View>
                            <TextInput
                                style={{ width: '100%', marginTop: 10 }}
                                placeholder="Password"
                                mode="outlined"
                                secureTextEntry
                                left={<TextInput.Icon icon="lock" />}
                                theme={{ roundness: 15 }}
                                value={formData.password}
                                autoCapitalize='none'
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                            />
                        </View>
                    </View>

                    {message.error ? <Text style={{ color: 'red' }}>{message.error}</Text> : null}
                    {message.success ? <Text style={{ color: 'green' }}>{message.success}</Text> : null}

                    {/* Sign In Link */}
                    <Pressable onPress={() => navigation.navigate('Login')}>
                        <Text style={{ fontSize: 18 }}>Already have an account?
                            <Text style={{ color: 'purple', textDecorationLine: 'underline' }}> Log in</Text>
                        </Text>
                    </Pressable>

                    {/* Sign up Button */}
                    <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
                        <Pressable
                            style={{ backgroundColor: '#9859FC', alignItems: 'center', width: 200, borderRadius: 30, paddingVertical: 12, paddingHorizontal: 32, marginTop: 20 }}
                            onPress={handleSubmit}
                        >
                            <Text style={{ color: 'white', fontSize: 18 }}>Submit</Text>
                        </Pressable>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});