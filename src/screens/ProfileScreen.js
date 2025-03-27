import React, {useEffect,useState} from "react";
import {View, Text, StyleSheet,Pressable,Image} from "react-native";
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'
import { IconButton } from 'react-native-paper';
import GradientBackground from "../components/GradientBackground";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Constants from 'expo-constants';

export default function ProfileScreen({ navigation }) {
    const [avatarUri, setAvatarUri] = useState('')
    const [avatarSeed, setAvatarSeed] = useState('');
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')

    const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;

      const fetchUserData = async () => {
        try {
          const token = await SecureStore.getItemAsync('userToken',token);
          if (!token) {
            console.log("Token doesn't exist");
            return;
          }
      
          const response = await axios.get(`${REACT_APP_API_URL}/user/info`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const name = response.data?.username;
      
          if (name) {
            setUsername(name)
          }else {
            setUsername('Anonymous');}
          }
            catch (error) {
              console.error('No users', error);
              setUsername('Anonymous');
            }


      };

        const handleLogout = async (navigation) => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (!token) {
                    console.log("No token found");
                    return;
                }

                await axios.post(`${REACT_APP_API_URL}/auth/logout`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                await SecureStore.deleteItemAsync('userToken');
                console.log("Logout successful");
                navigation.navigate('Main');
            } catch (error) {
                console.error('Logout failed:', error.response?.data || error.message);
            }
        };

    useEffect(() => {
        fetchUserData();
      }, []);

       

    useEffect(() => {
      generateRandomSeed();
    }, []);
  
    const generateRandomSeed = () => {
      const newSeed = Math.random().toString(36).substring(2, 10); 
      setAvatarSeed(newSeed);
    };

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          alert("Luvan vaaditaan kuvan valitsemiseksi");
          return;
        }
    
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1], 
          quality: 1,
        });
    
        if (!result.canceled) {
          setAvatarUri(result.assets[0].uri);
        }
      };
  
    const avatarUrl = avatarUri ? avatarUri : `https://api.dicebear.com/7.x/pixel-art/png?seed=${avatarSeed}`;

    return (
        <GradientBackground>
        <View style={styles.container}>
            <View style={{flexDirection:'row',alignItems:'center',flexWrap:'nowrap',marginHorizontal:20}}>
                <Image 
                    source={{ uri: avatarUrl }}
                    style={{
                    width: 80,
                    height: 80,
                    borderRadius: 75,
                    backgroundColor: 'lightgray',
                    alignSelf: 'center',
                    marginBottom: 20,
                    }} />

                    <IconButton
                        icon="camera" 
                        size={16}
                        mode="contained"
                        containerColor="#9859FC"
                        iconColor="white"
                        style={{
                            position: 'absolute',
                            right: 230,
                            bottom: 0,
                            zIndex: 1,
                        }}
                                    onPress={() => {
                                        Alert.alert(
                                            "Change Avatar",
                                            "Choose how to update your avatar:",
                                            [
                                            { text: "Load image", onPress: pickImage },
                                            {
                                                text: "Generate random avatar",
                                                onPress: () => {
                                                generateRandomSeed();
                                                setAvatarUri('');
                                                },
                                            },
                                            { text: "Cancel", style: "cancel" },
                                            ]
                                        );
                                        }}
                                    />
                
            
            <Text style={{flex:1,fontSize:24,fontWeight:'bold',marginLeft:10,justifyContent:'center'}}>Welcome back {username}!</Text>
            </View>
            <Text style ={{fontSize:20,alignItems:'left',marginHorizontal:20}}>Your score:{/*tähän kerätyt pisteet*/}</Text>
            
            <View style={{alignItems:'center',marginTop: 20,marginBottom: 40}}>
                            <Pressable 
                                 style={{backgroundColor: '#6200EA',alignItems:'center',width:300,borderRadius:30,paddingVertical: 12,
                                 paddingHorizontal: 32,marginTop: 20}} 
                                 onPress={{/*load image*/}}>
                                    <Text style={{color:'white',fontSize:18}}>Change username</Text>
                                </Pressable>
                            <Pressable 
                                style={{backgroundColor: '#6200EA',alignItems:'center',width:300,borderRadius:30,paddingVertical: 12,
                                paddingHorizontal: 32,marginTop: 20}} 
                                onPress={{/*tästä avautuu modal*/}}>
                                        <Text style={{color:'white',fontSize:18}}>Change password</Text>
                                </Pressable>
                                
                            
                </View>

                
                <View style={{position:'absolute',bottom:10,width:'100%',alignItems:'center'}}>
                    <Pressable
                        style={{backgroundColor: 'red',width:300,borderRadius:30,paddingVertical: 12,
                        paddingHorizontal: 32,marginTop: 20}}
                        onPress={() => handleLogout(navigation)}>
                            <Text style={{color:'white',fontSize:18}}>Log out</Text>
                    </Pressable>
                    <Pressable 
                                style={{backgroundColor: 'red',width:300,borderRadius:30,paddingVertical: 12,
                                paddingHorizontal: 32,marginTop: 20}} 
                                onPress={() => navigation.navigate()}>
                                        <Text style={{color:'white',fontSize:18}}>Delete account</Text>
                        </Pressable>
            </View>
        </View>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 10,
       marginTop: 10,
    },
});