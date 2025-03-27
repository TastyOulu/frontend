import React, { useContext, useEffect,useState } from "react";
import {View, Text, StyleSheet,Pressable,Image} from "react-native";
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'
import { IconButton } from 'react-native-paper';
import GradientBackground from "../components/GradientBackground";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { AuthContext } from "../contexts/AuthContext";
import Constants from 'expo-constants';
import { ScrollView } from "react-native-gesture-handler";

export default function ProfileScreen({ navigation }) {
    const [avatarUri, setAvatarUri] = useState('')
    const [avatarSeed, setAvatarSeed] = useState('');
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [showSettings, setShowSettings] = useState(false)
   

    const { user, logout } = useContext(AuthContext);

    const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;    

      const fetchUserData = async () => {
        try {
          const token = await SecureStore.getItemAsync('userToken',token);
          if (!token) {
            console.log("Token doesn't exist");
            return;
          } else {
            console.log("Token exists");
          }
      
          const response = await axios.get(`${REACT_APP_API_URL}/user/info`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const name = response.data?.username
          const email = response.data?.email
          const rawDate = response.data?.createdAt
          const createdAt = rawDate ? new Date(rawDate).toLocaleDateString('fi-FI') : 'Not found'

      
          if (name, email) {
            setUsername(name)
            setEmail(email)
            setCreatedAt(createdAt)

          }else {
            setUsername('Anonymous')
            setEmail('Not found')
            setCreatedAt('Not found')}
            

          }
            catch (error) {
              console.error('No users', error);
              setUsername('Anonymous');
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

    const handleLogout = async () => {
      Alert.alert(
        "Log Out",
        "Are you sure you want to log out?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Log Out",
            onPress: async () => {
              await logout();
              navigation.navigate('Main');
            },
          },
        ],
      );
    };
    

    return (
        <GradientBackground>
        <View style={styles.container}>
            {/* Title + settings to right corner */}
            <View style={{position: 'absolute', top: 0, right: 0,alignItems:'center'}}>
                <IconButton
                icon="cog"
                size={18}
                mode="contained"
                containerColor={showSettings ? '#6200EA' : 'grey'}
                iconColor={showSettings ? 'white' : 'white'}
                onPress={() => setShowSettings(!showSettings)}
                />
                <Text style={{fontSize:10,marginTop:-8}}>Settings</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',flexWrap:'nowrap',marginHorizontal:20}}>
                <View style={{ position: 'relative' }}>
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
                </View>
                
            
            <Text style={{flex:1,fontSize:24,fontWeight:'bold',marginLeft:10,justifyContent:'center'}}>Welcome back {username}!</Text>
            </View>
            <Text style ={{fontSize:20,alignItems:'left',marginHorizontal:20}}>Your score:{/*tähän kerätyt pisteet*/}</Text>
            
            

                        
            {/* Show buttons if settings is open */}
            {showSettings && (
                <ScrollView>
                <View style={{marginTop: 20,alignItems: 'center',marginBottom:20}}>
                    <View style={{marginTop: 20,alignItems: 'center'}}>
                        <Text style={{fontSize: 24,fontWeight: 'bold',marginBottom: 20}}>{email}</Text>
                        <Text style={{fontSize: 16,marginBottom: 20}}>Member since: {createdAt}</Text>
                        <View style={{alignItems:'center',marginTop: 20,marginBottom: 80}}>
                                <Pressable 
                                    style={{backgroundColor: '#6200EA',alignItems:'center',width:300,borderRadius:30,paddingVertical: 12,
                                    paddingHorizontal: 32,marginTop: 20}} 
                                    onPress={{/*Tästä avautuu modal*/}}>
                                        <Text style={{color:'white',fontSize:18}}>Change username</Text>
                                    </Pressable>
                                <Pressable 
                                    style={{backgroundColor: '#6200EA',alignItems:'center',width:300,borderRadius:30,paddingVertical: 12,
                                    paddingHorizontal: 32,marginTop: 20}} 
                                    onPress={{/*tästä avautuu modal*/}}>
                                            <Text style={{color:'white',fontSize:18}}>Change password</Text>
                                    </Pressable>
                                    
                                
                    </View>
                    <Pressable
                        style={{backgroundColor:'red',borderRadius:30,paddingVertical: 12,alignItems:'center',marginTop: 20,width:300,marginHorizontal:32}}
                        onPress={() => {
                        setShowSettings(false);
                        handleLogout(navigation);
                        }}
                    >
                        <Text style={{color:'white',textAlign:'center',fontSize:18}}>Log out</Text>
                    </Pressable>

                    <Pressable
                        style={{backgroundColor:'red',borderRadius:30,paddingVertical: 12,alignItems:'center',marginTop: 20,width:300,marginHorizontal:32}}
                        onPress={() => {
                        setShowSettings(false);
                        navigation.navigate('DeleteAccount'); 
                        }}
                    >
                        <Text style={{color:'white',textAlign:'center',fontSize:18}}>Delete account</Text>
                    </Pressable>
                    
                    </View>
                </View>
                </ScrollView>
            )}
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