import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, Dimensions } from 'react-native';
import { FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import Constants from 'expo-constants';
import { GiftedChat } from 'react-native-gifted-chat';
import * as SecureStore from "expo-secure-store";

const { width, height } = Dimensions.get('window');

export default function AIBot() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [username, setUsername] = useState('');
    const [avatarUri, setAvatarUri] = useState('');
    const [error, setError] = useState(null);
    

    useEffect(() => {
        setMessages([
            {
                _id: 1,
                text: t('ui_chatbot_hey'),
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'AI',
                    avatar: 'https://cdn0.iconfinder.com/data/icons/phosphor-regular-vol-4/256/robot-512.png',
                },
            },
        ]);
    }, []);

    const fetchUserData = async () => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            if (!token) {
                console.log("Token doesn't exist");
                return;
            }

            const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;
            const response = await axios.get(`${REACT_APP_API_URL}/user/info`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setUsername(response.data?.username || 'User');
            setAvatarUri(response.data?.avatar || 'https://cdn0.iconfinder.com/data/icons/phosphor-regular-vol-4/256/robot-512.png');
        } catch (error) {
            console.log('Error fetching user data:', error);
        }
    };

    const fetchAIResponse = async (message) => {
        try {
            const token = await SecureStore.getItemAsync('userToken');
            const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL;
    
            if (!token) {
                console.log('No token found');
                const loginErrorMessage = t('ui_chatbot_login_required');
                setError(loginErrorMessage);
                return loginErrorMessage;
            }
    
            const response = await axios.get(`${REACT_APP_API_URL}/askai/${encodeURIComponent(message)}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return response.data.response;
        } catch (error) {
            console.log('Error fetching AI response:', error);
            setError(t('ui_chatbot_error'));
            return t('ui_chatbot_error');
        }
    };

    const openChat = useCallback(() => {
        setIsVisible(true);
        fetchUserData();
    }, []);

    const closeChat = useCallback(() => {
        setIsVisible(false);
    }, []);

    return (
        <View style={styles.container}>
            <FAB
                icon="robot-happy"
                style={{ position: 'absolute', bottom: 16, right: 16 }}
                onPress={openChat}
            />
            <Modal
                visible={isVisible}
                animationType="slide"
                onRequestClose={closeChat}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <GiftedChat
                            messages={messages}
                            onSend={async (newMessages) => {
                                setMessages((prevMessages) => GiftedChat.append(prevMessages, newMessages));
                                setIsTyping(true);
                                const response = await fetchAIResponse(newMessages[0].text);
                                setIsTyping(false);
                                setMessages((prevMessages) => GiftedChat.append(prevMessages, {
                                    _id: Math.random().toString(36).substring(7),
                                    text: response,
                                    createdAt: new Date(),
                                    user: {
                                        _id: 2,
                                        name: 'AI',
                                        avatar: 'https://cdn0.iconfinder.com/data/icons/phosphor-regular-vol-4/256/robot-512.png',
                                    },
                                }));
                            }}
                            user={{
                                _id: 1,
                                name: username,
                                avatar: avatarUri,
                            }}
                            isTyping={isTyping}
                            renderUsernameOnMessage={true}
                            renderAvatarOnTop={true}
                            alwaysShowSend={false}
                            scrollToBottom={true}
                            placeholder={t('ui_chatbot_placeholder')}
                            minInputLength={1}
                            extraData={error}
                            renderChatFooter={() => error ? (
                                <Text style={{ color: 'red', textAlign: 'center', marginVertical: 5 }}>{error}</Text>) : null}
                        />
                        <FAB
                            icon="close"
                            style={{ position: 'absolute', top: 16, right: 16 }}
                            onPress={closeChat}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: 16,
        right: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        height: height * 0.8,
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 10,
        paddingBottom: 50,
    },
});