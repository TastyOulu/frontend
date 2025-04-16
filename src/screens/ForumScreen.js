import React, { useState,useContext,useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Modal,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView
} from "react-native";
import axios from "axios";
import Constants from "expo-constants";
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from "../contexts/AuthContext";
import GradientBackground from '../components/GradientBackground';
import * as SecureStore from 'expo-secure-store';
import { use } from "i18next";

const REACT_APP_API_URL = Constants.expoConfig?.extra?.REACT_APP_API_URL
const windowWidth = Dimensions.get('window').width;
const topicColors = ['#F87171', '#60A5FA', '#34D399', '#FBBF24', '#A78BFA', '#F472B6'];



export default function ForumScreen({ navigation }) {
  const {user, loading} = useContext(AuthContext)
  const [token, setToken] = useState(null);
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [messages, setMessages] = useState({});
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [ userMap, setUserMap ] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await SecureStore.getItemAsync('userToken');
      setToken(storedToken);
    };
    getToken();
  }, []);

  //useEffect(() => {
    const fetchData = async () => {
      const storedToken = await SecureStore.getItemAsync('userToken');
      setToken(storedToken);

      if (!storedToken) {
        navigation.navigate("Login");
        return;
      }

      if (storedToken) {
        try {
          const res = await axios.get(`${REACT_APP_API_URL}/topics`, {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          const topicsData = res.data;
          setTopics(res.data);

          const messagesMap = {}
          const userIds = new Set ()
          for (const topic of res.data) {
            userIds.add(topic.creatorUserId)
            try {
              const commentsRes = await axios.get(`${REACT_APP_API_URL}/topic/${topic._id}/comments`, {
                headers: { Authorization: `Bearer ${storedToken}` },
              });
              messagesMap[topic.title] = commentsRes.data;
              commentsRes.data.forEach(comment => {
                if (comment.commenterUserId) userIds.add(comment.commenterUserId);
              });
            } catch (err) {
              console.warn(`Failed to load comments for topic ${topic.title}`);
              messagesMap[topic.title] = [];
            }
          }

          topicsData.sort((a, b) => {
            const commentsA = messagesMap[a.title] || [];
            const commentsB = messagesMap[b.title] || [];
    
            const lastCommentA = commentsA.length > 0 ? new Date(commentsA[commentsA.length - 1].timestamp) : new Date(a.timestamp);
            const lastCommentB = commentsB.length > 0 ? new Date(commentsB[commentsB.length - 1].timestamp) :  new Date(b.timestamp);
    
            return lastCommentB - lastCommentA;
          });

          const fetchedUserMap = {};
          await Promise.all([...userIds].map(async (id) => {
            try {
              const res = await axios.get(`${REACT_APP_API_URL}/user/user/${id}`, {
                headers: { Authorization: `Bearer ${storedToken}` },
              });
              fetchedUserMap[id] = res.data.username;
            } catch (err) {
              console.warn(`Could not fetch username for ID ${id}`);
            }
          }));
          setUserMap(fetchedUserMap);
          setMessages(messagesMap);
          setTopics(topicsData);

        } catch (err) {
          console.error('Failed to fetch topics:', err);
        }
      }
    }
    
  useEffect(() => {
      fetchData();
  }, []);


  const getUsernameById = (id) => {
    if (!id) return 'Anonymous';
    const username = userMap[id];
    return username ? username : 'Anonymous';
  };  
  
  const handleAddTopic = async () => {
    if (!user || !user._id || !token) {
      console.error("User not found. Please log in.");
      return;
    }
    if (newTopic.trim() !== "") {
      
      try {
        const response = await axios.post(`${REACT_APP_API_URL}/topic`, {
          title: newTopic,
          creatorUserId: user.id,
          }, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          })
      //const createdTopic = response.data;

      //setTopics([...topics, createdTopic]);
      //setMessages({ ...messages, [createdTopic.title]: [] });
      setNewTopic("");
      setModalVisible(false)
      await fetchData();
    } catch (error) {
      console.error("Error creating topic:", error);
    }
  }
  
}

  const handleAddMessage = async () => {

    if (!user || !user._id || !token || !selectedTopic) {
      console.error("User or topic not found. Please log in and select a topic.");
      return;
    }

      if (newMessage.trim() !== "") {
      try {
        const res = await axios.post(`${REACT_APP_API_URL}/topic/${selectedTopic._id}/comment`, {
        text: newMessage,
        commenterUserId: user._id,
        },

        { 
          headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json' ,
        },
       }
        )

       const newComment =  res.data
       const updated = [...(messages[selectedTopic.title] || []), newComment]
      
      setMessages(prev => ({...prev, [selectedTopic.title]: updated }));
      setNewMessage("");
      await fetchData();
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };
}

const handleEditComment = async (commentId) => {
  try {
    await axios.put(
      `${REACT_APP_API_URL}/comment/${commentId}`,
      { text: editedText },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    setEditingCommentId(null);
    setEditedText("");
    await fetchData();
  } catch (error) {
    console.error('Error editing comment:', error.message);
  }
};

const handleLikeMessage = async (commentId) => {
  if (!user || !user._id || !token) {
    console.error("User not found or not logged in.");
    return;
  }

  try {
    await axios.post(`${REACT_APP_API_URL}/comment/${commentId}/like`, {
      userId: user._id
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Päivitetään viestit näkymään uusilla tykkäyksillä
    await fetchData();
  } catch (error) {
    console.error("Error liking comment:", error.response?.data || error.message);
  }
};

  const handleDeleteTopic = async (id) => {
    try {
      await axios.delete(`${REACT_APP_API_URL}/topic/${id}`, {
        data: { creatorUserId: user.id },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //setTopics(topics.filter(topic => topic._id !== id));
      await fetchData();
      setSelectedTopic(null);
    } catch (error) {
      console.error('Error deleting topic:', error.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `${REACT_APP_API_URL}/comment/${commentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      const filteredMessages = messages[selectedTopic.title].filter(msg => msg._id !== commentId);
      setMessages(prev => ({ ...prev, [selectedTopic.title]: filteredMessages }));
      await fetchData();
    } catch (error) {
      console.error('Error deleting comment:', error.message);
    }
  };

  


  return (
    <GradientBackground statusBarStyle="dark">
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        {!selectedTopic ? (
          <ScrollView 
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <Ionicons
                name="fast-food"
                size={28}
                color="white"
                style={styles.foodIcon}
              />
              <Text style={styles.forumTitle}>FORUM</Text>
            </View>

            <TouchableOpacity
              style={styles.newTopicButton}
              onPress={() => setModalVisible(true)}
            >
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.newTopicText}>Start a New Topic</Text>
            </TouchableOpacity>

            <View style={styles.topicList}>
              {topics.map((topic,index) => (
                <View
                  key={topic._id || index}
                  style={[
                    styles.topicButton,
                    { backgroundColor: topicColors[index % topicColors.length] }
                  ]}
                >
                <TouchableOpacity onPress={() => setSelectedTopic(topic)}>
                  
                  <Text style={styles.topicText}>{topic.title}</Text>
                  <Text style={styles.topicMeta}>
                    Created by {getUsernameById(topic.creatorUserId)} at {new Date(topic.timestamp).toLocaleDateString()} | Comments: {(messages[topic.title] || []).length}</Text>
                </TouchableOpacity>

              {user && getUsernameById(topic.creatorUserId) === user.username && (
              <TouchableOpacity
                onPress={() => handleDeleteTopic(topic._id)}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <Ionicons name="trash-outline" size={20} color="white" />
              </TouchableOpacity>
            )}
                </View>
              ))}
            </View>

            <Modal
              animationType="fade"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <TouchableOpacity
                    style={styles.modalBackButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Ionicons name="arrow-back" size={24} color="black" />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>Create New Topic</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your topic..."
                    value={newTopic}
                    onChangeText={setNewTopic}
                  />
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddTopic}
                  >
                    <Text style={styles.submitText}>Add Topic</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </ScrollView>
        ) : (
          <View style={styles.messageContainer}>
            <View style={styles.messageHeader}>
              <TouchableOpacity onPress={() => setSelectedTopic(null)}>
                <Ionicons name="arrow-back" size={28} color="white" />
              </TouchableOpacity>
              <View style={styles.topicTitleContainer}>
                <Text style={styles.selectedTopicTitle}>{selectedTopic.title}</Text>
              </View>

               {/*{user && topics.creatorUserId === user.id && (
                <TouchableOpacity
                  onPress={() => handleDeleteTopic(topic._id)}
                  style={{ position: 'absolute', top: 10, right: 10 }}
                >
                  <Ionicons name="trash-outline" size={20} color="white" />
                </TouchableOpacity>
              )}*/}

            </View>

            <ScrollView style={styles.messageList}>
              {(messages[selectedTopic.title] || []).map((message, index) => (
                <View key={message._id ||index} style={styles.messageBubble}>
                  <View style={styles.userRow}>
                    <Ionicons name="person-circle-outline" size={20} color="#fff" />
                    <Text style={styles.userName}>{getUsernameById(message.commenterUserId)}</Text>
                    <Text style={styles.messageTimestamp}>{new Date (message.timestamp).toLocaleDateString()}</Text>
                  </View>
                  {editingCommentId === message._id ? (
  <View>
    <TextInput
      value={editedText}
      onChangeText={setEditedText}
      style={{
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 5,
        padding: 5,
        marginBottom: 5,
      }}
    />
    <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => handleEditComment(message._id)}
        style={{ marginRight: 10 }}
      >
        <Text style={{ color: 'lightgreen' }}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setEditingCommentId(null);
          setEditedText("");
        }}
      >
        <Text style={{ color: 'tomato' }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  </View>
) : (
  <Text style={styles.messageText}>{message.text}</Text>
)}
                  {user && getUsernameById(message.commenterUserId) === user.username && (
                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <TouchableOpacity onPress={() => {
                    setEditingCommentId(message._id);
                    setEditedText(message.text);
                    }}>
                      <Ionicons name="pencil" size={18} color="black" position='absolute' top='-30' left='240' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDeleteComment(message._id)} style={{ marginLeft: 10 }}>
                      <Ionicons name="trash-outline" size={18} color="tomato" position='absolute' top='5' left='230' />
                    </TouchableOpacity>
                  </View>
                )}
                    <View style={styles.likeRow}>
                        <TouchableOpacity onPress={() => handleLikeMessage(message._id)}>
                          <Ionicons
                            name={Array.isArray(message.likes) && message.likes.map(String).includes(String(user._id)) ? "heart" : "heart-outline"}
                            size={20}
                            color="red"
                          />
                        </TouchableOpacity>
                        <Text style={styles.likesCount}>
                          {Array.isArray(message.likes) ? message.likes.length : 0} likes
                        </Text>
                      </View>


                </View>
              ))}
            </ScrollView>

            <View style={styles.messageInputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Write a message..."
                placeholderTextColor="#999"
                value={newMessage}
                onChangeText={setNewMessage}
              />
              <TouchableOpacity onPress={handleAddMessage} style={styles.sendButton}>
                <Ionicons name="send" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </GradientBackground>
  );
}




const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingBottom: 20,
  },
  forumTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black',
  },
  foodIcon: {
    position: 'absolute',
    left: 0,
  },
  topicList: {
    width: '100%',
    marginTop: 20,
  },
  topicButton: {
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  topicText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  topicMeta: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
  },
  newTopicButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  newTopicText: {
    color: 'white',
    marginLeft: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: windowWidth * 0.9,
    maxWidth: 400,
    position: 'relative'
  },
  modalBackButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: 'center',
    marginTop: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#6200ee',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  submitText: {
    color: 'white',
    fontSize: 16,
  },
  messageContainer: {
    flex: 1,
    paddingTop: 50,
    paddingBottom: 20
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  topicTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  selectedTopicTitle: {
    fontSize: 28,
    color: 'white',
    textAlign: 'center',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  messageBubble: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  userName: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  messageTimestamp: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 10,
  },
  messageText: {
    color: 'black',
    fontSize: 16,
    marginBottom: 8,
  },
  likeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likesCount: {
    color: '#fff',
    marginLeft: 8,
  },
  messageInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    color: '#333',
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ff5da2',
    justifyContent: 'center',
    alignItems: 'center',
  },
});