import React, {useEffect,useState} from "react";
import {View, Text, StyleSheet,Pressable,Image} from "react-native";
import * as ImagePicker from 'expo-image-picker'
import Background from '../components/Background';
import { Alert } from 'react-native'
import { IconButton } from 'react-native-paper';



export default function ProfileScreen({ navigation }) {
    
    const [avatarUri, setAvatarUri] = useState('')
    const [avatarSeed, setAvatarSeed] = useState('');

    useEffect(() => {
      generateRandomSeed();
    }, []);
  
    const generateRandomSeed = () => {
      const newSeed = Math.random().toString(36).substring(2, 10); // satunnainen merkkijono
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
          aspect: [1, 1], // tekee kuvasta neliön
          quality: 1,
        });
    
        if (!result.canceled) {
          setAvatarUri(result.assets[0].uri);
        }
      };
  
    const avatarUrl = avatarUri ? avatarUri : `https://api.dicebear.com/7.x/pixel-art/png?seed=${avatarSeed}`;

    return (
        <Background>
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
                
            
            <Text style={{flex:1,fontSize:32,marginLeft:10,justifyContent:'center'}}>Welcome back {/*username*/}!</Text>
            </View>
            <Text style ={{fontSize:20,alignItems:'left',marginHorizontal:20}}>Your score:{/*tähän kerätyt pisteet*/}</Text>
            
            <View style={{alignItems:'center',marginTop: 20,marginBottom: 40}}>
                            <Pressable 
                                 style={{backgroundColor: '#9859FC',alignItems:'center',width:300,borderRadius:30,paddingVertical: 12,
                                 paddingHorizontal: 32,marginTop: 20}} 
                                 onPress={{/*load image*/}}>
                                    <Text style={{color:'white',fontSize:18}}>Change username</Text>
                                </Pressable>
                            <Pressable 
                                style={{backgroundColor: '#9859FC',alignItems:'center',width:300,borderRadius:30,paddingVertical: 12,
                                paddingHorizontal: 32,marginTop: 20}} 
                                onPress={{/*tästä avautuu modal*/}}>
                                        <Text style={{color:'white',fontSize:18}}>Change password</Text>
                                </Pressable>
                                
                            
                </View>

                
                <View style={{position:'absolute',bottom:80,width:'100%',alignItems:'center'}}>
                    <Pressable 
                                style={{backgroundColor: 'red',width:300,borderRadius:30,paddingVertical: 12,
                                paddingHorizontal: 32,marginTop: 20}} 
                                onPress={() => navigation.navigate()}>
                                        <Text style={{color:'white',fontSize:18}}>Delete account</Text>
                        </Pressable>
            </View>
        </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 20,
       marginTop: 100,
    },
});