import React from 'react';
import {View, Text, Button, StyleSheet,Image} from "react-native";
import { TextInput } from 'react-native-paper'
import Background from '../components/Background';
import { Pressable } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Component = require('../../assets/Component 3.png');


export default function LoginScreen({ navigation }) {
    return (
        
        <Background>
        <View style={styles.container}>
            <Image source={Component} style={{width: 305, height: 159,resizeMode: 'contain'}} />
            <Text style={{fontSize: 48,fontWeight:'bold'}}>Hello!</Text>
            <Text>Sign in your account</Text>
            <View style={{flexDirection: 'colum',marginTop: 20,marginBottom: 10}}>
                <View style={{flexDirection: 'row',alignItems: 'center',width:'90%', marginTop: 10,
                            marginBottom: 10,}} >
                   
                    <TextInput 
                        style={{width: '100%',
                        marginTop: 10}}
                        label="Username"
                        mode= "outlined" 
                        left={<TextInput.Icon icon="account" />}
                        theme={{ roundness: 15 }} 
                        />
                </View>
                <View>
                    <TextInput style={{width: '100%',marginTop: 20}} 
                    label="Password"
                    mode="outlined"
                    secureTextEntry
                    left={<TextInput.Icon icon="lock"/>} 
                    theme={{roundness: 15}}/>
                </View>
            </View>

            {/* Sign Up Link */}
            <Pressable onPress={() => navigation.navigate('Signup')}>
                    <Text>Don't have an account?
                        <Text style={{color:'purple',textDecorationLine:'underline'}}> Sign up</Text>
                    </Text>
            </Pressable>

           
        </View>

         {/* Login Button */}
         <View style={{alignItems:'center',marginTop: 20,marginBottom: 40}}>
            <Pressable 
                style={{backgroundColor: '#9859FC',alignItems:'center',width:200,borderRadius:30,paddingVertical: 12,
                paddingHorizontal: 32,}} 
                onPress={() => navigation.navigate('Home')}>
                    <Text style={{color:'white',fontSize:18}}>Submit</Text>
            </Pressable>
        </View>
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