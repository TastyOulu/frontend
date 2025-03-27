import React from "react";
import {Text,StyleSheet,View,Pressable,Alert} from "react-native";
import GradientBackground from "../components/GradientBackground"
import { TextInput } from "react-native-paper";
import axios from "axios";
import { useState } from "react";

export default function ForgotPassword({ navigation }) {
    const [email, setEmail] = useState("");
    const [showPasswordFields, setShowPasswordFields] = useState(false);
  
    //FUNKTIO EI VIELÄ TOIMI, KOSKA BACKENDIÄ EI OLE
    const handleSubmit = async () => {
      try {
        if (!email) {
          Alert.alert("Missing email", "Please enter your email address.");
          return;
        }
  
        // Lähetetään pyyntö backendille LAITA OIKEA OSOITE KUN TAULU LUOTU
        const response = await axios.post("https://your-api.com/api/forgot-password", {
          email,
        });
  
        // Jos OK, näytetään kentät ja ilmoitus
        Alert.alert("Email sent", "Check your inbox for reset instructions.");
        setShowPasswordFields(true);
      } catch (error) {
        console.error("Forgot password error:", error);
        Alert.alert("Error", "Something went wrong. Please try again.");
      }
    };
    return (
        <GradientBackground>
            <View style={styles.container}>
                <Text style={{fontSize: 24,fontWeight:'bold',marginTop: 20,marginBottom:20}}>Forgot Password?</Text>
                <Text style={{fontSize:16,textAlign:'center', marginBottom:20}}>If you want to reset your password, check your email and write code below</Text>
                <View>
                    <View style={{flexDirection: 'column',marginTop: 20,marginBottom: 10}}>
                        <TextInput style={{width: 300,marginTop: 10}}
                            placeholder="Email"
                            mode= "outlined" 
                            keyboardType="email-address"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="email" />}
                            theme={{ roundness: 15 }}   
                        />
                            <View style={{marginTop: 5,alignItems:'center',justifyContent:'center',marginBottom: 10}}>
                                <Pressable 
                                    style={{backgroundColor: '#6200EA',alignItems:'center',width:200,borderRadius:30,paddingVertical: 12,
                                    paddingHorizontal: 10,marginTop: 20}} 
                                    onPress={handleSubmit}>
                                    <Text style={{color:'white',fontSize:14}}>Submit</Text>
                                </Pressable>
                            </View>
                    

                     </View>
                    
                    {/* Salasananvaihtokentät */}
                    {showPasswordFields && (
                        <>
                        
                        <TextInput style={{width: 300,marginTop: 10}}
                            placeholder="Password"
                            mode= "outlined" 
                            keyboardType="email-address"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="lock" />}
                            theme={{ roundness: 15 }}   
                        />
                        <TextInput style={{width: 300,marginTop: 10}}
                            placeholder="Confirm Password"
                            mode= "outlined" 
                            keyboardType="email-address"
                            autoCapitalize="none"
                            left={<TextInput.Icon icon="lock" />}
                            theme={{ roundness: 15 }}   
                        />
                        </>
                    )}
                    </View>
                </View>
                
                
            
        </GradientBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});