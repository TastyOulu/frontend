import React, { useContext, useEffect,useState, useCallback } from "react";
import {View, Text, StyleSheet,Pressable,Image,Modal} from "react-native";
import {TextInput} from "react-native-paper";
import * as ImagePicker from 'expo-image-picker'
import { Alert } from 'react-native'
import { IconButton } from 'react-native-paper';
import GradientBackground from "../components/GradientBackground";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { AuthContext } from "../contexts/AuthContext";
import Constants from 'expo-constants';
import { ScrollView } from "react-native-gesture-handler";
import PasswordInput  from "../components/PasswordInput";
import { CommonActions } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";

export default function ProfileScreen({ navigation }) {
    const [avatarUri, setAvatarUri] = useState('')
    const [avatarSeed, setAvatarSeed] = useState('');
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [createdAt, setCreatedAt] = useState('')
    const [score, setScore] = useState(0); // Assuming score is part of the user data
    const [showSettings, setShowSettings] = useState(false)
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [isUsernameModalVisible, setUsernameModalVisible] = useState(false);
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = () => setShowPassword(!showPassword);
    const { user, setUser, logout, deleteAccount, newUsername, setNewUsername, handleChangeUsername } = useContext(AuthContext);
    const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;

    const fetchUserAvatar = useCallback(async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                console.log("No token found when fetching avatar.");
                return;
            }

            const response = await axios.get(`${REACT_APP_API_URL}/user/avatar`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob',
            });

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarUri(reader.result);
            };
            reader.readAsDataURL(response.data);
        } catch (error) {
            console.error("Error fetching avatar:", error);
            setAvatarUri('');
        }
    }, [REACT_APP_API_URL]);

    const fetchUserData = useCallback(async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                console.log("Token doesn't exist");
                setUsername('Anonymous');
                setEmail('Not found');
                setCreatedAt('Not found');
                setAvatarUri('');
                setAvatarSeed('Anonymous');
                setIsCheckingAuth(false);
                setScore('');
                return;
            }

            const response = await axios.get(`${REACT_APP_API_URL}/user/info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const name = response.data?.username;
            const email = response.data?.email;
            const rawDate = response.data?.createdAt;
            const createdAt = rawDate ? new Date(rawDate).toLocaleDateString('fi-FI') : 'Not found';
            let avatar = response.data?.avatar;
            const score = response.data?.score || 0; // Assuming score is part of the user data

            if (name && email) {
                setUsername(name);
                setEmail(email);
                setCreatedAt(createdAt);
                setScore(score); // Set the score in the state

                if (avatar === 'ok') {
                    await fetchUserAvatar();
                } else if (avatar) {
                    setAvatarUri(avatar);
                } else {
                    setAvatarUri(`https://api.dicebear.com/7.x/pixel-art/png?seed=${name}`);
                    avatar = `https://api.dicebear.com/7.x/pixel-art/png?seed=${name}`
                }
                setAvatarSeed(name);
                setUser(response.data);
            }
        } catch (error) {
            
            setUsername('Anonymous');
            setEmail('Not found');
            setCreatedAt('Not found');
            setAvatarUri('');
            setAvatarSeed('Anonymous');
            setScore(0); // Reset score if user data fetch fails
        } finally {
            setIsCheckingAuth(false);
        }
    }, [REACT_APP_API_URL, fetchUserAvatar, setUser]);

    useFocusEffect(
        useCallback(() => {
        fetchUserData();
    }, [fetchUserData])
    );

    useEffect(() => {
        generateRandomSeed();
    }, []);

    useEffect(() => {
        if (!isCheckingAuth && !user) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
    }, [user, isCheckingAuth, navigation]);

    const generateRandomSeed = () => {
        const newSeed = Math.random().toString(36).substring(2, 10);
        setAvatarSeed(newSeed);
    };

    const avatarUrl = avatarUri || `https://api.dicebear.com/7.x/pixel-art/png?seed=${avatarSeed}`;

    const pickImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            alert("Need permission to access your camera roll");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const selectedImage = result.assets[0].uri;
            setAvatarUri(selectedImage);

            const token = await SecureStore.getItemAsync('userToken');
            const formData = new FormData();
            formData.append('file', {
                uri: selectedImage,
                name: 'avatar.jpg',
                type: 'image/jpeg',
            });

            try {
                await axios.post(`${REACT_APP_API_URL}/update/avatar`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                Alert.alert("Success", "Avatar updated successfully");
                await fetchUserData();
            } catch (error) {
                Alert.alert("Error", "Failed to update avatar");
                console.error("Failed to update avatar:", error);
            }
        }
    };

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
                        },
                      },
                    ],
                  );
                };

                const handleDeleteAccount = async () => {
                    Alert.alert(
                        "Delete Account",
                        "Are you sure you want to delete your account? All your data will be lost.",
                        [
                            {
                                text: "Cancel",
                                style: "cancel"
                            },
                            {
                                text: "Delete Account",
                                style: "destructive",
                                onPress: async () => {
                                    try {
                                        await deleteAccount(email);
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'DrawerRoot' }],
                                        });
                                    } catch (error) {
                                        console.error("Failed to delete account:", error)
                                    }
                                },
                            },
                        ],
                    );
                };


    return (
        <GradientBackground statusBarStyle="dark">
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
                    <Text style={{fontSize:10,marginTop:-6}}>Settings</Text>
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
                                right: -10,
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
                <Text style ={{fontSize:20,alignItems:'center',marginHorizontal:34}}>Your score: {score}</Text>

                {/* Show buttons if settings is open */}
                {showSettings && (
                    <ScrollView>
                        <View style={{marginTop: 20,alignItems: 'center',marginBottom:20}}>
                            <View style={{marginTop: 20,alignItems: 'center'}}>
                                <Text style={{fontSize: 24,fontWeight: 'bold',marginBottom: 20}}>{email}</Text>
                                <Text style={{fontSize: 16,marginBottom: 20,}}>Member since: {createdAt}</Text>
                                <View style={{alignItems:'center',marginTop: 20,marginBottom: 80}}>
                                    <Pressable
                                        style={{backgroundColor: '#6200EA',alignItems:'center',width:300,borderRadius:30,paddingVertical: 12,
                                            paddingHorizontal: 32,marginTop: 20,shadowColor: 'black',shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 10,}}
                                        onPress={() => setUsernameModalVisible(true)}>
                                        <Text style={{color:'white',fontSize:18}}>Change username</Text>
                                    </Pressable>
                                    <Pressable
                                        style={{backgroundColor: '#6200EA',alignItems:'center',width:300,borderRadius:30,paddingVertical: 12,
                                            paddingHorizontal: 32,marginTop: 20,shadowColor: 'black',shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.25,shadowRadius: 3.84,elevation: 10,}}
                                        onPress={() => setPasswordModalVisible(true)}>
                                        <Text style={{color:'white',fontSize:18}}>Change password</Text>
                                    </Pressable>


                                </View>
                                <Pressable
                                    style={{backgroundColor:'red',borderRadius:30,paddingVertical: 12,alignItems:'center',marginTop: 20,width:300,marginHorizontal:32}}
                                    onPress={async() => {
                                        setShowSettings(false);
                                        await handleLogout();
                                        navigation.reset({
                                            index: 0,
                                            routes: [{ name: 'Login' }],
                                        });
                                    }}
                                >
                                    <Text style={{color:'white',textAlign:'center',fontSize:18}}>Log out</Text>
                                </Pressable>

                                <Pressable
                                    style={{backgroundColor:'red',borderRadius:30,paddingVertical: 12,alignItems:'center',marginTop: 20,width:300,marginHorizontal:32}}
                                    onPress={() => {
                                        setShowSettings(false);
                                        handleDeleteAccount(navigation);
                                    }}
                                >
                                    <Text style={{color:'white',textAlign:'center',fontSize:18}}>Delete account</Text>
                                </Pressable>

                            </View>
                        </View>
                    </ScrollView>
                )}

                    {/* Username Modal */}
                    <Modal
                        visible={isUsernameModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setUsernameModalVisible(false)}
                    >
                        <View style={{flex:1,backgroundColor:'#E6CCFF',justifyContent:'center',alignItems:'center'}}>
                            <View style={{backgroundColor:'white',padding:20,borderRadius:10,width:'80%',alignItems:'center'}}>
                                <Text style={{fontSize:26,fontWeight:'bold',marginBottom:20,textAlign:'center'}}>Change Username</Text>
                                <TextInput
                                    placeholder="Enter your new username"
                                    value={newUsername} 
                                    onChangeText={setNewUsername}
                                    style={{borderWidth: 1,borderColor: '#ccc',borderRadius: 10,padding: 10,marginBottom: 20,width:200}}
                                />

                                <View style={{flexDirection:'column',alignItems:'center',width:'100%'}}>
                                    <Pressable style={{width:'100%',backgroundColor:'#6200EA',borderRadius:30,paddingVertical: 12,
                                            paddingHorizontal: 32,marginTop: 20}} onPress={() => {
                                        handleChangeUsername();
                                        setUsernameModalVisible(false);
                                    }}>
                                        <Text style={{textAlign:'center',color:'white'}}>Confirm new username</Text>
                                    </Pressable>
                                    <Pressable style={{width:'100%',backgroundColor:'red',borderRadius:30,paddingVertical: 12,
                                            paddingHorizontal: 32,marginTop: 20}} onPress={() => setUsernameModalVisible(false)}>
                                        <Text style={{textAlign:'center',color:'white'}}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* Password Modal */}
                    <Modal
                        visible={isPasswordModalVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setPasswordModalVisible(false)}
                    >
                        <View style={{flex:1,backgroundColor:'#E6CCFF',justifyContent:'center',alignItems:'center'}}>
                            <View style={{backgroundColor:'white',padding:20,borderRadius:10,width:'80%',alignItems:'center'}}>
                                <Text style={{fontSize:26,fontWeight:'bold',marginBottom:20,textAlign:'center'}}>Change Password</Text>
                                <TextInput
                                    placeholder="Enter your email"
                                    value={email}
                                    onChangeText={setEmail}
                                    left={<TextInput.Icon icon="email" />}
                                    style={{borderWidth: 1,borderColor: '#ccc',borderRadius: 10,padding: 10,marginBottom: 20,width:'100%'}}
                                />
                                <PasswordInput
                                    value={oldPassword}
                                    onChangeText={setOldPassword}
                                    showPassword={showPassword}
                                    toggleShowPassword={toggleShowPassword}
                                    placeholder="Enter old password"
                                    secureTextEntry
                                    style={{borderWidth: 1,borderColor: '#ccc',borderRadius: 10,padding: 10,marginBottom: 20,width:200}}
                                />
                                 <PasswordInput 
                                    value={newPassword}
                                    placeholder="Enter new password"
                                    showPassword={showPassword}
                                    toggleShowPassword={toggleShowPassword}
                                    onChangeText={setNewPassword}
                                    style={{borderWidth: 1,borderColor: '#ccc',borderRadius: 10,padding: 10,marginBottom: 20,width:200}}
                                />
                                <View style={{flexDirection:'column',alignItems:'center',width:'100%'}}>
                                    <Pressable style={{width:'100%',backgroundColor:'#6200EA',borderRadius:30,paddingVertical: 12,
                                            paddingHorizontal: 32,marginTop: 20}} onPress={async () => {
                                                try {
                                                    const response = await axios.post(`${REACT_APP_API_URL}/auth/change-password`, {
                                                        email,
                                                        oldPassword,
                                                        newPassword,
                                                })

                                                Alert.alert("Success", response.data.message)
                                                setPasswordModalVisible(false);
                                                setOldPassword('')
                                                setNewPassword('')
                                                }catch (error) {
                                                    const message = error.response?.data?.message || "Failed to change password"
                                                    Alert.alert("Error",message)
                                                    console.error("Failed to change password:", error)
                                                }
                                        
                                    }}>
                                        <Text style={{textAlign:'center',color:'white'}}>Confirm new password</Text>
                                    </Pressable>
                                    <Pressable style={{width:'100%',backgroundColor:'red',borderRadius:30,paddingVertical: 12,
                                            paddingHorizontal: 32,marginTop: 20}} onPress={() => setPasswordModalVisible(false)}>
                                        <Text style={{textAlign:'center',color:'white'}}>Cancel</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </View>
                    </Modal>

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
    button: {
        backgroundColor: '#6200EA',
        alignItems: 'center',
        width: 300,
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 20,
    },
    dangerButton: {
        backgroundColor: 'red',
        width: 300,
        borderRadius: 30,
        paddingVertical: 12,
        paddingHorizontal: 32,
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
    },
    footer: {
        position: 'absolute',
        bottom: 10,
        width: '100%',
        alignItems: 'center',
    },
});