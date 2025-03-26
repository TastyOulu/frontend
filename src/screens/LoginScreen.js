import React from 'react';
import {View, Text, ScrollView, StyleSheet,Image,KeyboardAvoidingView,Platform} from "react-native";
import { TextInput } from 'react-native-paper'
import Background from '../components/Background';
import { Pressable } from 'react-native';
import GradientBackground from '../components/GradientBackground';
const Component = require('../../assets/Component 3.png');


export default function LoginScreen({ navigation }) {
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
                        
                            <TextInput 
                                style={{width: '100%',
                                marginTop: 10}}
                                placeholder="Username"
                                mode= "outlined" 
                                left={<TextInput.Icon icon="account" />}
                                theme={{ roundness: 15 }} 
                                />
                        </View>
                        <View style={{flexDirection: 'row',alignItems: 'center',width:'90%', marginTop: 10,
                                    marginBottom: 10,}}>
                            <TextInput style={{width: '100%'}} 
                            placeholder="Password"
                            mode="outlined"
                            secureTextEntry
                            left={<TextInput.Icon icon="lock"/>} 
                            theme={{roundness: 15}}/>
                        </View>
                    </View>

                    {/* Sign Up Link */}
                    <Pressable onPress={() => navigation.navigate('Signup')}>
                            <Text style={{fontSize:18}}>Don't have an account?
                                <Text style={{color:'purple',textDecorationLine:'underline'}}> Sign up</Text>
                            </Text>
                    </Pressable>

                    {/* Login Button */}
                    <View style={{alignItems:'center',marginTop: 20,marginBottom: 40}}>
                        <Pressable 
                            style={{backgroundColor: '#9859FC',alignItems:'center',width:200,borderRadius:30,paddingVertical: 12,
                            paddingHorizontal: 32,marginTop: 20}} 
                            onPress={() => navigation.navigate('Main')}>
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