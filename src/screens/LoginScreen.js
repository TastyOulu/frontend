import React, {useState, useEffect } from 'react';
import {View, Text, ScrollView, StyleSheet,Image,KeyboardAvoidingView,Platform} from "react-native";
import { TextInput } from 'react-native-paper'
import Background from '../components/Background';
import { Pressable } from 'react-native';
import GradientBackground from '../components/GradientBackground';
import PasswordInput from '../components/PasswordInput';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
const Component = require('../../assets/Component 3.png');

export default function LoginScreen({ navigation }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState({ error: '', success: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;

    const handleSubmit = async () => {
        const { email, password } = formData;

        if (!email || !password) {
            setMessage({ error: 'All fields are required', success: '' });
            setTimeout(() => setMessage({ error: '', success: '' }), 2000);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${REACT_APP_API_URL}/auth/login`, {
                email,
                password,
            });
    
            if (response.data?.token) {
                const token = response.data.token;
                await SecureStore.setItemAsync('userToken', token).catch(console.error);
    
                setMessage({ error: '', success: 'Login successful' });
                console.log('Login successful', response.data);
                setFormData({ email: '', password: '' });
                navigation.navigate('Main');
            } else {
                setMessage({ error: 'Login failed. Please try again.', success: '' });
            }
        } catch (error) {
            console.error('Error during login:', error.response?.data || error.message);
            const errorMessage = error.response?.data?.message || 'Network error, please try again later.';
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

                <ScrollView contentContainerStyle={{flexGrow: 1,justifyContent: 'center',
                            alignItems: 'center',
                            paddingTop: 10,
                            paddingBottom: 20,}}>
                    <View style={{marginTop: 40}}>
                        <Image source={Component} style={{width: 305, height: 159,resizeMode: 'contain'}} />
                    </View>
                    <Text style={{fontSize: 50,fontWeight:'bold',}}>Hello!</Text>
                    <Text>Sign in your account</Text>
                    <View style={{flexDirection: 'colum',marginTop: 20,marginBottom: 10}}>
                        <View style={{flexDirection: 'row',alignItems: 'center',width:'90%', marginTop: 10,
                                    marginBottom: 10,}} >

                            {/* Email Input */}
                            <TextInput 
                                style={{width: '100%',
                                marginTop: 10}}
                                placeholder="Email"
                                mode= "outlined" 
                                keyboardType="email-address"
                                autoCapitalize="none"
                                left={<TextInput.Icon icon="email" />}
                                theme={{ roundness: 15 }}
                                value={formData.email}
                                onChangeText={(text) => setFormData({ ...formData, email: text })}
                                />
                        </View>

                        {/* Password Input */}
                        <View style={{flexDirection: 'row',alignItems: 'center',width:'90%', marginTop: 10,
                                    marginBottom: 10,}}>
                            <PasswordInput
                                value={formData.password}
                                onChangeText={(text) => setFormData({ ...formData, password: text })}
                                showPassword={showPassword}
                                toggleShowPassword={toggleShowPassword}
                                placeholder="Password"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    {message.error ? <Text style={{ color: 'red' }}>{message.error}</Text> : null}
                    {message.success ? <Text style={{ color: 'green' }}>{message.success}</Text> : null}

                    {/* Sign Up Link */}
                    <Pressable onPress={() => navigation.navigate('Signup')}>
                            <Text style={{fontSize:18, paddingBottom:'10'}}>Don't have an account?
                                <Text style={{color:'purple',textDecorationLine:'underline'}}> Sign up</Text>
                            </Text>
                    </Pressable>
                    <Pressable onPress={() => navigation.navigate('ForgotPassword')}>
                        <Text style={{fontSize:18}}>Forgot password?
                            <Text style={{color:'purple',textDecorationLine:'underline'}}> Reset</Text>
                        </Text>
                    </Pressable>

                    {/* Login Button */}
                    <View style={{alignItems:'center',marginTop: 20,marginBottom: 40}}>
                        <Pressable 
                            style={{backgroundColor: '#9859FC',alignItems:'center',width:200,borderRadius:30,paddingVertical: 12,
                            paddingHorizontal: 32,marginTop: 20}} 
                            onPress={handleSubmit} disabled={loading}>
                                <Text style={{color:'white',fontSize:18}}>Submit</Text>
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