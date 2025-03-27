import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Image, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { IconButton } from 'react-native-paper';
import GradientBackground from "../components/GradientBackground";
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen({ navigation }) {
  const { t } = useTranslation();
  const [avatarUri, setAvatarUri] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [username, setUsername] = useState('');

  const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;

  const fetchUserData = async () => {
    try {
      const token = await SecureStore.getItemAsync('userToken');
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
        setUsername(name);
      } else {
        setUsername('Anonymous');
      }
    } catch (error) {
      console.error('No users', error);
      setUsername('Anonymous');
    }
  };

  const handleLogout = async () => {
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
      navigation.navigate('Main');
    } catch (error) {
      console.error('Logout failed:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchUserData();
    generateRandomSeed();
  }, []);

  const generateRandomSeed = () => {
    const newSeed = Math.random().toString(36).substring(2, 10);
    setAvatarSeed(newSeed);
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert(t('ui_luvan_vaaditaan_kuvan_valitsemiseksi'));
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
        <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'nowrap', marginHorizontal: 20 }}>
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
                t('ui_change_avatar'),
                t('ui_choose_how_to_update_your_avatar'),
                [
                  { text: t('ui_load_image'), onPress: pickImage },
                  {
                    text: t('ui_generate_random_avatar'),
                    onPress: () => {
                      generateRandomSeed();
                      setAvatarUri('');
                    },
                  },
                  { text: t('ui_cancel'), style: "cancel" },
                ]
              );
            }}
          />

          <Text style={{ flex: 1, fontSize: 24, fontWeight: 'bold', marginLeft: 10, justifyContent: 'center' }}>
            {t('ui_welcomeback!')} {username}!
          </Text>
        </View>

        <Text style={{ fontSize: 20, marginHorizontal: 20 }}>{t('ui_your_score')}</Text>

        <View style={{ alignItems: 'center', marginTop: 20, marginBottom: 40 }}>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>{t('ui_change_username')}</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={() => {}}>
            <Text style={styles.buttonText}>{t('ui_change_password')}</Text>
          </Pressable>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.dangerButton} onPress={handleLogout}>
            <Text style={styles.buttonText}>{t('ui_log_out')}</Text>
          </Pressable>
          <Pressable style={styles.dangerButton} onPress={() => navigation.navigate()}>
            <Text style={styles.buttonText}>{t('ui_delete_account')}</Text>
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