import React from 'react';
import {View, Text, Button, StyleSheet,Image,Pressable,KeyboardAvoidingView,Platform,ScrollView} from "react-native";
import { TextInput } from 'react-native-paper'
import Background from '../components/Background';
const Component = require('../../assets/Component 3.png');


export default function SignupScreen({ navigation }) {
    return (
        <Background>
            <KeyboardAvoidingView
                            behavior={Platform.OS === "ios" ? "padding" : "height"}
                            style={styles.container}
                        >
                
                    <ScrollView contentContainerStyle={{flexGrow: 1,justifyContent: 'center',
                                                alignItems: 'center',
                                                paddingTop: 20,
                                                paddingBottom: 20,}}>
                        <View style={{marginTop: 40}}>
                            <Image source={Component} style={{width: 305, height: 159,resizeMode: 'contain'}} />
                        </View>
                        <Text style={{fontSize: 36,fontWeight:'600',}}>Create an account</Text>
                        <View style={{flexDirection: 'colum',marginTop: 20,marginBottom: 10}}>
                            <View style={{flexDirection: 'row',alignItems: 'center',width:'90%', marginTop: 10,
                                        marginBottom: 10,}}>
                                <TextInput style={{width: '100%',marginTop: 10}} 
                                    placeholder="Email"
                                    mode="outlined"
                                    left={<TextInput.Icon icon="email"/>} 
                                    theme={{roundness: 15}}/>
                            </View>
                            <View style={{flexDirection: 'row',alignItems: 'center',width:'90%',
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
                            <View>
                                <TextInput style={{width: '100%',marginTop: 10}} 
                                placeholder="Password"
                                mode="outlined"
                                secureTextEntry
                                left={<TextInput.Icon icon="lock"/>} 
                                theme={{roundness: 15}}/>
                            </View>
                            
                        </View>

                        {/* Sign In Link */}
                                    <Pressable onPress={() => navigation.navigate('Login')}>
                                            <Text style={{fontSize:18}}>Already have an account?
                                                <Text style={{color:'purple',textDecorationLine:'underline'}}> Log in</Text>
                                            </Text>
                                    </Pressable>

                        {/* Sign up Button */}
                                <View style={{alignItems:'center',marginTop: 20,marginBottom: 40}}>
                                    <Pressable 
                                        style={{backgroundColor: '#9859FC',alignItems:'center',width:200,borderRadius:30,paddingVertical: 12,
                                        paddingHorizontal: 32,marginTop: 20}} 
                                        onPress={() => navigation.navigate('Login')}>
                                            <Text style={{color:'white',fontSize:18}}>Submit</Text>
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